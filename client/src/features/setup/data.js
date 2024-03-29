import CompanyPanel from "./CompanyPanel";
import PermissionsPanel from "./PermissionsPanel";
import TeamsPanel from "./TeamsPanel";
import UsersPanel from "./UsersPanel";

// export const SETUP_LIST = [
// 	{ id: 0, type: "Project Managers", name: <ManagersPanel /> },
// 	{ id: 1, type: "Roles", name: <RolesPanel /> },
// 	{ id: 2, type: "Departments", name: <DepartmentsPanel /> },
// 	{ id: 3, type: "Employment Types", name: <EmploymentPanel /> },
// 	{ id: 4, type: "Assignees/Approvers", name: <ApproversPanel /> },
// 	{ id: 5, type: "Companies", name: <CompaniesPanel /> },
// ];

export const SETUP_LIST = [
	{ id: 0, type: "Users", name: <UsersPanel /> },
	{ id: 1, type: "Company", name: <CompanyPanel /> },
	{ id: 2, type: "Permissions", name: <PermissionsPanel /> },
];

export const COMPANY_SETUP_TAB = [
	{ id: 0, type: "Modules", name: <UsersPanel /> },
	{ id: 1, type: "Teams", name: <TeamsPanel /> },
	{ id: 2, type: "Naming", name: <PermissionsPanel /> },
	{ id: 2, type: "Acct. Info", name: <PermissionsPanel /> },
];
