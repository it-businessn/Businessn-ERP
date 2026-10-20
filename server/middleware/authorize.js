const fs = require("fs");
const mongoose = require("mongoose");
const Company = require("../models/Company");

/**
 * Server-side tenant scoping (AUD-003).
 *
 * The application identifies a tenant by the company *name* carried in the URL,
 * body or query string (e.g. /api/user/all/:companyName). Before this middleware
 * existed no controller ever consulted req.user, so any authenticated user could
 * read or mutate any company's data simply by changing that string.
 *
 * Membership rule — identical to the one used by login (appController.login) and
 * by the company switcher (companyController.getCompanyEmployees):
 *   a user may act on company X  <=>  X.employees contains req.user.id
 *
 * The lookup is cached per user for a short TTL to avoid one extra query per
 * request. Worst case a revoked membership stays usable for MEMBERSHIP_TTL_MS.
 */

const MEMBERSHIP_TTL_MS = 60 * 1000;
const MEMBERSHIP_CACHE_MAX = 5000; // bound memory for long-running processes
const membershipCache = new Map(); // userId -> { names: Set<string>, ids: Set<string>, expires: number }

const PLACEHOLDER_VALUES = new Set(["", "null", "undefined"]);

// F-14: ":name" is NOT a tenant key app-wide — schedule routes use it for the
// crew name (/work-emp-shift/:date/:companyName/:name) and were answering 403 to
// every crew whose name differed from the company. The only route where :name is
// a company is GET /api/company/:name, which guards it explicitly with
// requireCompanyNameParam("name") in routes/companyRoutes.js.
const COMPANY_PARAM_KEYS = ["companyName", "company"];

const extractCompanyNames = (req) => {
	const names = new Set();
	const push = (v) => {
		if (typeof v === "string" && !PLACEHOLDER_VALUES.has(v.trim())) names.add(v.trim());
	};
	for (const key of COMPANY_PARAM_KEYS) push(req.params?.[key]);
	push(req.body?.companyName);
	push(req.body?.company); // e.g. resource upload uses `company`
	push(req.query?.companyName);
	return [...names];
};

const getUserCompanyNames = async (userId) => {
	const cached = membershipCache.get(userId);
	if (cached && cached.expires > Date.now()) return cached.names;

	const companies = await Company.find({ employees: userId }).select("name").lean();
	const names = new Set((companies || []).map((c) => c.name));
	const ids = new Set((companies || []).map((c) => String(c._id)));
	if (membershipCache.size >= MEMBERSHIP_CACHE_MAX) {
		membershipCache.delete(membershipCache.keys().next().value); // evict oldest insert
	}
	membershipCache.set(userId, { names, ids, expires: Date.now() + MEMBERSHIP_TTL_MS });
	return names;
};

const getUserCompanyIds = async (userId) => {
	await getUserCompanyNames(userId);
	return membershipCache.get(userId)?.ids || new Set();
};

const clearMembershipCache = (userId) => {
	if (userId) membershipCache.delete(String(userId));
	else membershipCache.clear();
};

const denyCompany = (req, res, denied) => {
	console.warn("Company access denied", {
		userId: req.user?.id,
		path: req.originalUrl,
		method: req.method,
		denied,
	});
	return res.status(403).json({
		message: "You do not have access to this company",
		code: "COMPANY_ACCESS_DENIED",
	});
};

const checkCompanies = async (req, res, next, requested) => {
	try {
		const userId = req.user?.id;
		if (!userId || !mongoose.isValidObjectId(userId)) {
			return res.status(401).json({ message: "Access token is required", code: "TOKEN_MISSING" });
		}
		if (requested.length === 0) return next();

		const allowed = await getUserCompanyNames(String(userId));
		const denied = requested.filter((name) => !allowed.has(name));
		if (denied.length > 0) return denyCompany(req, res, denied);
		req.userCompanies = allowed;
		return next();
	} catch (error) {
		return next(error);
	}
};

/**
 * App-level middleware: checks company names carried in the body / query string.
 * Route params are NOT visible at this level (Express only populates req.params
 * inside the matched router), so params are handled by applyCompanyParamGuards.
 */
const authorizeCompanyAccess = (req, res, next) =>
	checkCompanies(req, res, next, extractCompanyNames({ body: req.body, query: req.query }));

/**
 * For multipart routes the body is only available after multer ran, so the
 * app-level check sees nothing. Run the same check after multer and remove the
 * already-written file on denial so nothing is left on disk (REV-004).
 */
const authorizeMultipartCompany = (req, res, next) => {
	const requested = extractCompanyNames({ body: req.body });
	if (requested.length === 0) return next();
	const cleanupOnDeny = () => {
		if (req.file?.path) fs.unlink(req.file.path, () => {});
	};
	const originalStatus = res.status.bind(res);
	res.status = (code) => {
		if (code === 403) cleanupOnDeny();
		return originalStatus(code);
	};
	return checkCompanies(req, res, next, requested);
};

/**
 * Object-level guard for routes addressing a company by ObjectId (REV-005):
 * PUT /api/company/:id may only touch a company the caller belongs to.
 */
const requireCompanyIdMembership =
	(paramName = "id") =>
	async (req, res, next) => {
		try {
			const id = req.params?.[paramName];
			if (!mongoose.isValidObjectId(id)) {
				return res.status(400).json({ message: "Invalid company id" });
			}
			const ids = await getUserCompanyIds(String(req.user?.id));
			if (!ids.has(String(id))) return denyCompany(req, res, [id]);
			return next();
		} catch (error) {
			return next(error);
		}
	};

/**
 * Router-level guard: fires whenever a route with :companyName / :company / :name
 * matches on the given router. Must be applied to every protected router.
 */
const applyCompanyParamGuards = (router) => {
	for (const key of COMPANY_PARAM_KEYS) {
		router.param(key, (req, res, next, value) =>
			checkCompanies(req, res, next, extractCompanyNames({ params: { [key]: value } })),
		);
	}
	return router;
};

/**
 * Route-level guard for a single route whose param (any name) carries a company
 * name, e.g. GET /api/company/:name.
 */
const requireCompanyNameParam =
	(paramName) =>
	(req, res, next) =>
		checkCompanies(req, res, next, extractCompanyNames({ params: { companyName: req.params?.[paramName] } }));

/**
 * Only the authenticated user themselves may act on the resource identified by
 * req.params[paramName] (AUD-002: change-password).
 */
const requireSelf =
	(paramName = "id") =>
	(req, res, next) => {
		const target = req.params?.[paramName];
		if (!req.user?.id || !target || String(req.user.id) !== String(target)) {
			return res.status(403).json({
				message: "You can only perform this action on your own account",
				code: "FORBIDDEN",
			});
		}
		return next();
	};

module.exports = {
	authorizeCompanyAccess,
	authorizeMultipartCompany,
	requireCompanyIdMembership,
	requireCompanyNameParam,
	applyCompanyParamGuards,
	requireSelf,
	extractCompanyNames,
	clearMembershipCache,
	MEMBERSHIP_TTL_MS,
};
