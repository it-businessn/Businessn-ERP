import CompanyDetails from "./CompanyDetails";
import CompanyPanel from "./CompanyPanel";
import GroupsPanel from "./GroupsPanel";
import ModulePanel from "./ModulePanel";
import Naming from "./Naming";
import PermissionsPanel from "./PermissionsPanel";
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
	// { id: 3, type: "Roles", name: <RolesPanel /> },
];

export const COMPANY_SETUP_TAB = [
	{ id: 0, type: "Modules", name: <ModulePanel /> },
	{ id: 1, type: "Groups", name: <GroupsPanel /> },
	{ id: 2, type: "Naming", name: <Naming /> },
	{ id: 3, type: "Company Info", name: <CompanyDetails /> },
];
