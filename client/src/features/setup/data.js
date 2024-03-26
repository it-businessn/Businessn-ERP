import ApproversPanel from "./ApproversPanel";
import CompaniesPanel from "./CompaniesPanel";
import DepartmentsPanel from "./DepartmentsPanel";
import EmploymentPanel from "./EmploymentPanel";
import ManagersPanel from "./ManagersPanel";
import RolesPanel from "./RolesPanel";

export const SETUP_LIST = [
	{ id: 0, type: "Project Managers", name: <ManagersPanel /> },
	{ id: 1, type: "Roles", name: <RolesPanel /> },
	{ id: 2, type: "Departments", name: <DepartmentsPanel /> },
	{ id: 3, type: "Employment Types", name: <EmploymentPanel /> },
	{ id: 4, type: "Assignees/Approvers", name: <ApproversPanel /> },
	{ id: 5, type: "Companies", name: <CompaniesPanel /> },
];
