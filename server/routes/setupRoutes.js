const express = require("express");
const router = express.Router();

const setUpController = require("../controllers/setUpController");
const Crew = require("../models/Crew");
const EmployeeRole = require("../models/EmployeeRole");
const CostCenter = require("../models/CostCenter");
const Module = require("../models/Module");
const Group = require("../models/Group");
const { requireRole, companyFromDocument, ROLE_GROUPS } = require("../middleware/rbac");

// AUD-028: configuration writes. Admin level (client isAdminLevelRole) for the pages
// only the Admin Console / module Set-up page shows; Manager and above
// (isNotEnrollerOrEmployee) where a page Managers reach calls the endpoint:
// Payroll Workview (PUT groups/:id), Payroll Employees / onboarding
// (POST position-roles) and the Scheduling pages (crews, location). For :id
// routes the company is taken from the target document.
const adminOnly = requireRole(ROLE_GROUPS.ADMIN_LEVEL);
const managerUp = requireRole(ROLE_GROUPS.MANAGER_LEVEL);
const adminOnlyFor = (Model) =>
	requireRole(ROLE_GROUPS.ADMIN_LEVEL, { companyFrom: companyFromDocument(Model) });
const managerUpFor = (Model) =>
	requireRole(ROLE_GROUPS.MANAGER_LEVEL, { companyFrom: companyFromDocument(Model) });

router.get("/", setUpController.getAllSetup);

// AUD-028: the idle-lead rule (Setup model) is global and has no company, so it
// cannot be checked per company; unchanged (open item).
router.post("/", setUpController.addSetUpRule);

router.put("/:id", setUpController.updateSetUp);

router.get("/location/:companyName", setUpController.getLocations);

router.post("/location", managerUp, setUpController.addLocation);

router.get("/crews/:companyName", setUpController.getCrews);

router.post("/crews", managerUp, setUpController.addCrew);

router.put("/crews/:id", managerUpFor(Crew), setUpController.updateCrew);

router.get("/roles/:companyName", setUpController.getRoles);

router.post("/roles", adminOnly, setUpController.addRole);

router.put("/roles/:id", adminOnlyFor(EmployeeRole), setUpController.updateRole);

router.post("/position-roles", managerUp, setUpController.addPositionRole);

router.get("/position-roles/:companyName", setUpController.getPositionRoles);

router.get("/departments/:companyName", setUpController.getDepartments);

router.post("/departments", adminOnly, setUpController.addDepartment);

router.get("/cost-centers/:companyName", setUpController.getCC);

router.post("/cost-centers", adminOnly, setUpController.addCC);

router.put("/cost-centers/remove-dept/:id", adminOnlyFor(CostCenter), setUpController.removeCCDept);

router.put("/cost-centers/:id", adminOnlyFor(CostCenter), setUpController.addCCDept);

router.delete("/cost-centers/:id", adminOnlyFor(CostCenter), setUpController.deleteCC);

router.get("/modules/:companyName", setUpController.getModules);

router.post("/modules", adminOnly, setUpController.addModule);

router.put("/modules/:id", adminOnlyFor(Module), setUpController.updateModule);

router.delete("/modules/:id", adminOnlyFor(Module), setUpController.deleteModule);

router.get("/groups/:companyName", setUpController.getGroups);

router.post("/groups", adminOnly, setUpController.addGroup);

router.put("/groups/:id", managerUpFor(Group), setUpController.updateGroup);

router.put("/groups/paycycle/:id", adminOnlyFor(Group), setUpController.updateGroupPaySchedule);

router.get("/empTypes/:companyName", setUpController.getEmpTypes);

router.post("/empTypes", adminOnly, setUpController.addEmpType);

module.exports = router;
