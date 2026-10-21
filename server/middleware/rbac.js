const mongoose = require("mongoose");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const { ROLES } = require("../constants/roles.constants");
const { COMPANIES } = require("../constants/constant");
const {
	extractCompanyNames,
	getUserCompanyNames,
	getUserCompanyNameById,
	roleCache,
	MEMBERSHIP_TTL_MS,
	MEMBERSHIP_CACHE_MAX,
} = require("./authorize");

/**
 * Server-side role checks (AUD-028).
 *
 * Before this module every authenticated member of a company could call every
 * endpoint of that company; roles were only applied by the React client. The
 * rules below are the client's own rules, so nobody gets less access than the
 * UI already gives them:
 *   PAYROLL_SUBMIT  = client utils hasPayrollSubmitAccess (+ Super Admin)
 *   ADMIN_LEVEL     = client utils isAdminLevelRole (Admin Console)
 *   MANAGER_LEVEL   = client utils isNotEnrollerOrEmployee
 *   ROLE_ACCESS     = client constant.js ROLE_ACCESS (role dropdown filter)
 *
 * A caller's role in a company is EmployeeEmploymentInfo.employmentRole for
 * (companyName, empId = req.user.id) — the same lookup login uses to build
 * `user.role`. A Shadow Admin of BusinessN Corporate is treated as Shadow Admin
 * in every company they are a member of: that is how they are given access to
 * new companies (companyController.addCompany -> getShadowUserIds), usually
 * without an employment record there.
 *
 * RBAC_MODE=report logs would-be denials and lets the request through, so the
 * matrix can be checked against real traffic before it is enforced.
 */

const { SUPER_ADMIN, SHADOW_ADMIN, AUTH_ADMINISTRATOR, ADMINISTRATOR, MANAGER, EMPLOYEE, ENROLLER } =
	ROLES;

const ROLE_GROUPS = {
	PAYROLL_SUBMIT: [AUTH_ADMINISTRATOR, SHADOW_ADMIN, SUPER_ADMIN],
	ADMIN_LEVEL: [ADMINISTRATOR, AUTH_ADMINISTRATOR, SHADOW_ADMIN, SUPER_ADMIN],
	MANAGER_LEVEL: [MANAGER, ADMINISTRATOR, AUTH_ADMINISTRATOR, SHADOW_ADMIN, SUPER_ADMIN],
};

// Copy of client/src/constant.js ROLE_ACCESS. Super Admin is not a client role;
// it is given every role so the server is never stricter than the client.
const ROLE_ACCESS = {
	[ENROLLER]: [ENROLLER],
	[EMPLOYEE]: [EMPLOYEE, ENROLLER],
	[MANAGER]: [MANAGER, EMPLOYEE, ENROLLER],
	[ADMINISTRATOR]: [ADMINISTRATOR, MANAGER, EMPLOYEE, ENROLLER],
	[AUTH_ADMINISTRATOR]: [AUTH_ADMINISTRATOR, ADMINISTRATOR, MANAGER, EMPLOYEE, ENROLLER],
	[SHADOW_ADMIN]: [SHADOW_ADMIN, AUTH_ADMINISTRATOR, ADMINISTRATOR, MANAGER, EMPLOYEE, ENROLLER],
	[SUPER_ADMIN]: [
		SUPER_ADMIN,
		SHADOW_ADMIN,
		AUTH_ADMINISTRATOR,
		ADMINISTRATOR,
		MANAGER,
		EMPLOYEE,
		ENROLLER,
	],
};

const getRbacMode = () =>
	String(process.env.RBAC_MODE || "").trim().toLowerCase() === "report" ? "report" : "enforce";

const fetchRole = async (userId, companyName) => {
	const doc = await EmployeeEmploymentInfo.findOne({ companyName, empId: userId }, "employmentRole");
	return typeof doc?.employmentRole === "string" ? doc.employmentRole : null;
};

/** Caller's own employmentRole in a company, cached like membership. */
const getCachedRole = async (userId, companyName) => {
	const key = `${userId}|${companyName}`;
	const cached = roleCache.get(key);
	if (cached && cached.expires > Date.now()) return cached.role;
	const role = await fetchRole(userId, companyName);
	if (roleCache.size >= MEMBERSHIP_CACHE_MAX) roleCache.delete(roleCache.keys().next().value);
	roleCache.set(key, { role, expires: Date.now() + MEMBERSHIP_TTL_MS });
	return role;
};

/** Role used for the checks: own role, or Shadow Admin for BusinessN shadow admins. */
const getEffectiveRole = async (userId, companyName) => {
	const role = await getCachedRole(userId, companyName);
	if (role === SUPER_ADMIN || role === SHADOW_ADMIN) return role;
	if (companyName !== COMPANIES.BUSINESSN_ORG) {
		const businessNRole = await getCachedRole(userId, COMPANIES.BUSINESSN_ORG);
		if (businessNRole === SHADOW_ADMIN) {
			const memberOf = await getUserCompanyNames(userId);
			if (memberOf.has(companyName)) return SHADOW_ADMIN;
		}
	}
	return role;
};

const logDecision = (req, mode, details) =>
	console.warn(mode === "report" ? "RBAC report-only: would deny" : "RBAC denied", {
		userId: String(req.user?.id),
		method: req.method,
		path: req.originalUrl,
		...details,
	});

/**
 * Sends the denial (enforce) or logs it (report). Returns true when a response
 * was sent and the caller must stop.
 */
const deny = (req, res, status, code, message, details) => {
	const mode = getRbacMode();
	logDecision(req, mode, { code, ...details });
	if (mode === "report") return false;
	res.status(status).json({ message, code });
	return true;
};

const denyMissingCompany = (req, res) =>
	deny(req, res, 400, "COMPANY_REQUIRED", "Company is required for this action", {
		company: null,
		role: null,
	});

const denyRole = (req, res, { company, role, ...rest }) =>
	deny(req, res, 403, "ROLE_FORBIDDEN", "Your role does not allow this action", {
		company,
		role,
		...rest,
	});

/**
 * requireRole(allowedRoles, { companyFrom })
 * The caller's role must be in allowedRoles in every company the request
 * touches. Companies come from params / body / query (same extraction as
 * authorize.js) or, for routes addressed by :id, from `companyFrom(req)`.
 */
const requireRole =
	(allowedRoles, { companyFrom } = {}) =>
	async (req, res, next) => {
		try {
			const userId = String(req.user?.id);
			const companies = companyFrom ? await companyFrom(req) : extractCompanyNames(req);
			if (!companies.length) return denyMissingCompany(req, res) ? undefined : next();

			const memberOf = await getUserCompanyNames(userId);
			for (const company of companies) {
				// RBAC-REPORT-01: a company derived from the target document that the
				// caller does not belong to is a TENANCY violation, not a role question:
				// always 403, even in RBAC_MODE=report (report mode only relaxes roles).
				if (!memberOf.has(company)) {
					return res.status(403).json({
						message: "You do not have access to this company",
						code: "COMPANY_ACCESS_DENIED",
					});
				}
				const role = await getEffectiveRole(userId, company);
				if (!allowedRoles.includes(role) && denyRole(req, res, { company, role })) return;
			}
			return next();
		} catch (error) {
			return next(error);
		}
	};

/** Company names from the target document plus any named in the request. */
const companyFromDocument =
	(Model, paramName = "id", field = "companyName") =>
	async (req) => {
		const names = new Set(extractCompanyNames(req));
		const id = req.params?.[paramName];
		// A missing / malformed target with no company named in the request is
		// "not found" (404), not "company required" (errorHandler keeps 4xx).
		const doc = mongoose.isValidObjectId(id) ? await Model.findById(id, field) : null;
		if (!doc && names.size === 0) {
			const err = new Error(`${Model.modelName || "Record"} not found`);
			err.status = 404;
			throw err;
		}
		const name = doc?.[field];
		if (typeof name === "string" && name.trim()) names.add(name.trim());
		return [...names];
	};

/** PUT /api/company/:id — the company is the document itself. */
const companyFromCompanyId =
	(paramName = "id") =>
	async (req) => {
		const name = await getUserCompanyNameById(String(req.user?.id), req.params?.[paramName]);
		const names = new Set(extractCompanyNames(req));
		if (name) names.add(name);
		return [...names];
	};

/**
 * ROLE_ACCESS check for a role being assigned to `targetUserId` in each of
 * `companyNames` (client EmploymentInfo.jsx: the role dropdown only offers
 * ROLE_ACCESS[callerRole]). Re-sending the role the target already has is not
 * an assignment (the client sends it on every save). Returns the denials.
 */
const findRoleAssignmentDenials = async ({ callerId, targetUserId, role, companyNames }) => {
	const denials = [];
	if (role === undefined || role === null) return denials;
	for (const company of companyNames) {
		if (typeof company !== "string") continue;
		const current = mongoose.isValidObjectId(targetUserId)
			? await fetchRole(String(targetUserId), company)
			: null;
		if (current !== null && current === role) continue;
		const callerRole = await getEffectiveRole(String(callerId), company);
		if (!(ROLE_ACCESS[callerRole] || []).includes(role)) {
			denials.push({ company, role: callerRole, assignedRole: role });
		}
	}
	return denials;
};

/** Sends (or, in report mode, logs) a ROLE_FORBIDDEN for role-assignment denials. */
const denyRoleAssignment = (req, res, denials) => {
	for (const d of denials) if (denyRole(req, res, d)) return true; // report mode logs each
	return false;
};

/**
 * Employment-info writes (POST /api/payroll/employmentInfo, PUT /:id) set
 * employmentRole for body.empId in body.companyName.
 */
const requireAssignableEmploymentRole = async (req, res, next) => {
	try {
		const { empId, companyName, employmentRole } = req.body || {};
		if (employmentRole === undefined || employmentRole === null) return next();
		if (typeof companyName !== "string" || !companyName.trim()) {
			return denyMissingCompany(req, res) ? undefined : next();
		}
		const denials = await findRoleAssignmentDenials({
			callerId: req.user?.id,
			targetUserId: empId,
			role: employmentRole,
			companyNames: [companyName.trim()],
		});
		if (denials.length && denyRoleAssignment(req, res, denials)) return;
		return next();
	} catch (error) {
		return next(error);
	}
};

module.exports = {
	ROLE_GROUPS,
	ROLE_ACCESS,
	requireRole,
	companyFromDocument,
	companyFromCompanyId,
	findRoleAssignmentDenials,
	denyRoleAssignment,
	requireAssignableEmploymentRole,
	getEffectiveRole,
	getRbacMode,
};
