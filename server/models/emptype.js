[
	{
		name: "Employment Type",
		desc: "Different types of employees based on their work arrangements and employment status",

		createdon: "",
		updatedaon: "",
		updatedby: "",
		item: [
			{
				name: "Part-Time Employee",
				description:
					"Part-time employees work fewer hours than full-time employees, often with a fixed schedule. They may receive some benefits but usually on a pro-rata basis",
				isSystemMenu: true,
			},
			{
				name: "Full-Time Employee",
				description:
					"Full-time employees work for a standard number of hours per week, typically 35 to 40 hours. They are entitled to all benefits provided by the employer.",
				isSystemMenu: true,
			},
			{
				name: "Temporary Employee (Contractor)",
				description:
					"Temporary employees work for a fixed duration or until the completion of a specific project. They are not considered permanent employees and might not be eligible for certain benefits",
				isSystemMenu: true,
			},
			{
				name: "Independent Contractor",
				description:
					"Independent contractors are self-employed individuals who provide services to a company without being considered employees. They are responsible for their own taxes and do not receive traditional employee benefits",
				isSystemMenu: true,
			},
			{
				name: "Intern",
				description:
					"Interns are usually students or recent graduates gaining practical work experience. They may be paid or unpaid, depending on local labor laws.",
				isSystemMenu: true,
			},
			{
				name: "Contracter",
				description: "Part time contractor",
				isSystemMenu: false,
				isEditable: true,
				isActive: true,
				isVisible: true,
			},
		],
	},
];

[
	{
		name: "Deduction",
		desc: "Employee deductions represent  the amounts that are subtracted from an employee's salary to cover various expenses or contributions",

		createdon: "",
		updatedaon: "",
		updatedby: "",
		item: [
			{
				name: "Health Insurance Deduction",
				description:
					"This deduction covers the employee's health insurance premium.",
				isSystemMenu: true,
				deductionAmt: "Amount Percentage: 5% of the employee's gross salary.",
			},
			{
				name: "Retirement Savings Contribution",
				description:
					"This deduction is for the employee's retirement savings plan (e.g., 401(k) or pension)",
				isSystemMenu: true,
				deductionAmt: "Amount Percentage: 3% of the employee's gross salary.",
			},
			{
				name: "Social Security Tax",
				description:
					"This deduction goes towards the employee's contribution to social security.",
				isSystemMenu: true,
				deductionAmt: "Amount Percentage: 6.2% of the employee's gross salary.",
			},
			{
				name: "Income Tax Withholding",
				description:
					"This deduction represents the amount withheld from the employee's salary for income tax purposes ",
				isSystemMenu: true,
				deductionAmt:
					"Amount Percentage: Varies based on the employee's tax bracket and government regulations.",
			},
			{
				name: "Charitable Contributions:",
				description:
					"This deduction allows employees to contribute to charitable organizations through payroll deductions",
				deductionAmt:
					"Amount Percentage: Employee-defined, typically between 1% to 5% of the gross salary.",
				isSystemMenu: true,
			},
			{
				name: "Contracter",
				description: "Part time contractor",
				isSystemMenu: false,
				isEditable: true,
				isActive: true,
				isVisible: true,
			},
		],
	},
];

[
	{
		name: "Department",
		desc: "Different departments within an organization",

		createdon: "",
		updatedaon: "",
		updatedby: "",
		item: [
			{
				name: "Human Resources/HR Department",
				description:
					"The HR department is responsible for managing employee relations, recruitment, hiring, benefits administration, training, and ensuring compliance with labor laws and regulations.",
				isSystemMenu: true,
			},
			{
				name: "Finance and Accounting",
				description:
					"The Finance and Accounting department handles financial transactions, payroll processing, budgeting, financial reporting, tax management, and other financial aspects of the organization",
				isSystemMenu: true,
			},
			{
				name: "Sales and Marketing",
				description:
					"The Sales and Marketing department focuses on promoting and selling the organization's products or services, market research, advertising, lead generation, customer relations, and achieving sales targets",
				isSystemMenu: true,
			},
			{
				name: "Information Technology (IT)",
				description:
					"The IT department is responsible for managing the organization's technology infrastructure, including hardware, software, networks, cybersecurity, data management, and IT support for employees",
				isSystemMenu: true,
			},
			{
				name: "Customer Service and Support",
				description:
					"The Customer Service and Support department handles customer inquiries, complaints, order processing, product support, and ensures high levels of customer satisfaction",
				isSystemMenu: true,
			},
			{
				name: "Administration and Facilities",
				description:
					"The Administration and Facilities department manages administrative tasks, office operations, facilities maintenance, vendor management, and ensures a comfortable working environment for employees",
				isSystemMenu: true,
			},
			{
				name: "Legal and Compliance",
				description:
					"The Legal and Compliance department handles legal matters, contracts, regulatory compliance, risk management, and ensures that the organization operates within the boundaries of the law",
				isSystemMenu: true,
			},
			{
				name: "Public Relations (PR) and Communications",
				description:
					"The PR and Communications department manages the organization's public image, media relations, press releases, internal and external communications, and brand reputation",
				isSystemMenu: true,
			},
			{
				name: "Operations Department",
				description: "Allows operation access",
				isSystemMenu: true,
			},
			{
				name: "Logistics",
				description: "Logistics",
				isSystemMenu: true,
			},
		],
	},
];

[
	{
		name: "Leave Balance",
		desc: "Available days under each category of leaves",

		createdon: "",
		updatedaon: "",
		updatedby: "",
		item: [
			{
				name: "Annual Leave/Vacation Leave",
				description:
					"Paid time off that employees can take for vacation or personal reasons",
				isSystemMenu: true,
				totalDays: "15 days per calendar year",
			},
			{
				name: "Sick Leave",
				description:
					"Paid time off that employees can use when they are ill or need medical attention",
				isSystemMenu: true,
				totalDays: "10 days per calendar year.",
			},
			{
				name: "Maternity Leave",
				description: "12 weeks (equivalent to 60 working days)",
				isSystemMenu: true,
				totalDays:
					"Paid time off that employees can take when they become new parents, either due to childbirth or adoption.",
			},
			{
				name: "Paternity Leave",
				description:
					"Paid time off that employees can take when they become new parents, either due to childbirth or adoption.",
				isSystemMenu: true,
				totalDays: "4 weeks (equivalent to 20 working days)",
			},
			{
				name: "Parental Leave",
				description:
					"Paid time off that employees can take for vacation or personal reasons",
				isSystemMenu: true,
				totalDays: "84",
			},
			{
				name: "Bereavement Leave",
				description: "Paid time off for the loss of a close family member.",
				isSystemMenu: true,
				totalDays: "5 days per calendar year",
			},
			{
				name: "Compensatory Leave",
				description:
					"Paid time off that employees can take for vacation or personal reasons",
				isSystemMenu: true,
				totalDays: "5 days per calendar year",
			},
			{
				name: "Public Holidays",
				description: "Paid time off for nationally recognized holidays",
				isSystemMenu: true,
				totalDays: "Varies based on the country and company policy.",
			},
			{
				name: "Study Leave/Educational Leave",
				description:
					"Paid time off that employees can take for vacation or personal reasons",
				isSystemMenu: true,
				totalDays: "5 days per calendar year",
			},
			{
				name: "Unpaid Leave",
				description:
					"Paid time off that employees can take for vacation or personal reasons",
				isSystemMenu: true,
				totalDays: "30 days per calendar year",
			},
			{
				name: "Personal Leave",
				description: "Paid time off for personal reasons",
				isSystemMenu: true,
				totalDays: "5 days per calendar year",
			},
			{
				name: "Sabbatical Leave",
				description:
					"Paid time off that employees can take for vacation or personal reasons",
				isSystemMenu: true,
				totalDays: "90 days per calendar year",
			},
			{
				name: "Personal",
				description:
					"Paid time off that employees can take for vacation or personal reasons",
				isSystemMenu: false,
				totalDays: "d per calendar year",
			},
		],
	},
];

[
	{
		name: "Attendance Status",
		desc: "Employee attendance status with description",

		createdon: "",
		updatedaon: "",
		updatedby: "",
		item: [
			{
				name: "Present",
				description:
					"The employee was present and worked for the full scheduled shift.",
				isSystemMenu: true,
			},
			{
				name: "Absent",
				description:
					"The employee was not present at work on a particular day without any valid reason or leave approval.",
				isSystemMenu: true,
			},
			{
				name: "Late Arrival",
				description:
					"The employee arrived at work later than the scheduled start time.",
				isSystemMenu: true,
			},
			{
				name: "Early Departure",
				description:
					"The employee left work earlier than the scheduled end time",
				isSystemMenu: true,
			},
			{
				name: "On-Duty Travel",
				description: "The employee was traveling for work-related purposes",
				isSystemMenu: true,
			},
			{
				name: "Overtime",
				description:
					"The employee worked additional hours beyond the regular work hours.",
				isSystemMenu: true,
			},
		],
	},
];

[
	{
		name: "Leave Request Status",
		desc: "Leave Request and status description",

		createdon: "",
		updatedaon: "",
		updatedby: "",
		item: [
			{
				name: "Pending Approval",
				description:
					"The leave request has been submitted by the employee but has not been reviewed or approved by the relevant authority yet",
				isSystemMenu: true,
				issoftdeleted: true,
			},
			{
				name: "Rejected",
				description:
					"The leave request has been reviewed and denied by the manager or HR department. The employee's request for leave has not been approved.",
				isSystemMenu: true,
				issoftdeleted: true,
			},
			{
				name: "Pending Approval",
				description:
					"The leave request has been submitted by the employee but has not been reviewed or approved by the relevant authority yet",
				isSystemMenu: true,
				issoftdeleted: true,
			},
			{
				name: "Cancelled",
				description:
					"The employee or the relevant authority has canceled the previously approved leave request. The employee will not be taking the approved leave",
				isSystemMenu: true,
				issoftdeleted: true,
			},
			{
				name: "Half-Day",
				description:
					"The employee has requested and been granted a half-day leave, allowing them to be absent for only half of a working day",
				isSystemMenu: true,
				issoftdeleted: true,
			},
			{
				name: "Present",
				description: "Present for teh day",
				isSystemMenu: true,
				issoftdeleted: true,
			},
		],
	},
];

[
	{
		name: "Approver",
		desc: "Aprrovers/Managers to approve request",

		createdon: "",
		updatedaon: "",
		updatedby: "",
		item: [
			{
				name: "hr@team.com",
				role: "Immediate Supervisor",
				description:
					"The employee's direct supervisor or manager responsible for managing their team and approving leave requests",
				isSystemMenu: true,
			},
			{
				name: "admin@team.com",
				role: "Human Resources Manager",
				description:
					"The HR manager or HR department representative responsible for overseeing HR-related matters, including leave management, and approving leave requests in accordance with company policies.",
				isSystemMenu: true,
			},
		],
	},
];

[
	{
		name: "Payment Method",
		desc: "Different payment methods with description",

		createdon: "",
		updatedaon: "",
		updatedby: "",
		item: [
			{
				name: "Retirement Plans",
				description:
					"Retirement plans, such as 401(k) or pension plans, help employees save and invest for their retirement. Employers may offer matching contributions to encourage employees to save for the future.",
				isSystemMenu: true,
			},
			{
				name: "Physical Check",
				description:
					"Employees receive a physical paper check as their salary payment.",
				isSystemMenu: true,
			},
			{
				name: "Pay Card (Prepaid Debit Card)",
				description:
					"Employees receive their salary on a prepaid debit card provided by the employer.",
				isSystemMenu: true,
			},
			{
				name: "Cash",
				description:
					"Employees receive their payment in cash directly from the employer",
				isSystemMenu: true,
			},
			{
				name: "Salary Advance",
				description:
					"Employees receive a portion of their salary in advance before the regular payday.",
				isSystemMenu: true,
			},
			{
				name: "Bonuses and Commissions",
				description:
					"Employees receive additional payments based on performance or achievements",
				isSystemMenu: true,
			},
		],
	},
];

[
	{
		name: "User Role",
		desc: "Role of user",

		createdon: "",
		updatedaon: "",
		updatedby: "",
		item: [
			{
				name: "Administrator",
				description:
					"This role has full access to all features and settings within the payroll software. They can manage employee profiles, process payroll, set up deductions and benefits, generate reports, and configure system settings",
				aprrover: "admin@team.com",
				isSystemMenu: true,
				permissions: [
					{
						name: "View Employee Information",
						desc: "Allows users to view basic information about employees, such as names, job titles, and contact details.",
						subtext:
							"Example: HR staff can access and view employee records to update contact information",
					},
					{
						name: "Edit Employee Information",
						desc: "Enables users to make changes to employee records, such as updating addresses, phone numbers, and emergency contacts",
						subtext:
							"Example: HR managers can edit employee details in the system after an employee reports a change of address",
					},
					{
						name: "View Salary Details",
						desc: " Grants access to view salary-related information of employees.",
						subtext:
							"Example: The finance manager may have this permission to view and verify salary details for budgeting purposes",
					},
					{
						name: "Manage Salary Details",
						desc: "Allows the user to update salary information, such as changing salary amounts or setting up bonuses",
						subtext:
							"Example: The payroll specialist may have this permission to manage payroll adjustments",
					},
					{
						name: "View Payroll Data",
						desc: "Grants access to view payroll-related information, such as salary, bonuses, deductions, and tax details",
						subtext:
							"Example: Finance team members can see payroll reports and verify the amounts before processing payments",
					},
					{
						name: "Process Payroll",
						desc: "Authorizes users to run the payroll process, calculate salaries, and generate payslips for employees",
						subtext:
							"Example: Payroll administrators can run the monthly payroll process after verifying the correctness of input data",
					},
					{
						name: "Approve Timesheets",
						desc: "Allows users to approve or reject employee timesheets before processing payroll",
						subtext:
							"Example: Department managers can review and approve timesheets submitted by their team members",
					},
					{
						name: "Manage Deductions and Benefits",
						desc: "Permits users to add, modify, or remove payroll deductions and benefits for employees.",
						subtext:
							"HR specialists can update benefit plans and manage deductions like health insurance and retirement contributions.",
					},
					{
						name: "Generate Payroll Reports",
						desc: "Enables users to create various payroll reports, such as tax reports, leave balances, and salary summaries",
						subtext:
							"Example: Finance executives can generate monthly payroll reports for budgeting and financial analysis",
					},
					{
						name: "Access Tax Information",
						desc: "Grants access to view and manage tax-related data, including tax rates and employee tax declarations",
						subtext:
							"Example: Tax specialists can enter tax-related information and ensure compliance with tax regulations",
					},
					{
						name: "View Audit Trail",
						desc: "Allows users to see a log of all changes made to employee records and payroll data",
						subtext:
							"Example: Administrators can monitor any modifications to payroll information for security and auditing purposes",
					},
					{
						name: "Admin Access",
						desc: "Provides full administrative access to all payroll functionalities and settings",
						subtext:
							"Payroll system administrators can manage user permissions, configure system settings, and perform all payroll-related tasks",
					},
				],
			},
			{
				name: "HR Manager",
				description:
					"This role has full access to all features and settings within the payroll software. They can manage employee profiles, process payroll, set up deductions and benefits, generate reports, and configure system settings",
				aprrover: "admin@team.com",
				isSystemMenu: true,
				permissions: [
					{
						name: "View Employee Information",
						desc: "Allows users to view basic information about employees, such as names, job titles, and contact details.",
						subtext:
							"Example: HR staff can access and view employee records to update contact information",
					},
					{
						name: "Edit Employee Information",
						desc: "Enables users to make changes to employee records, such as updating addresses, phone numbers, and emergency contacts",
						subtext:
							"Example: HR managers can edit employee details in the system after an employee reports a change of address",
					},
					{
						name: "View Salary Details",
						desc: " Grants access to view salary-related information of employees.",
						subtext:
							"Example: The finance manager may have this permission to view and verify salary details for budgeting purposes",
					},
					{
						name: "Manage Salary Details",
						desc: "Allows the user to update salary information, such as changing salary amounts or setting up bonuses",
						subtext:
							"Example: The payroll specialist may have this permission to manage payroll adjustments",
					},
					{
						name: "View Payroll Data",
						desc: "Grants access to view payroll-related information, such as salary, bonuses, deductions, and tax details",
						subtext:
							"Example: Finance team members can see payroll reports and verify the amounts before processing payments",
					},
					{
						name: "Process Payroll",
						desc: "Authorizes users to run the payroll process, calculate salaries, and generate payslips for employees",
						subtext:
							"Example: Payroll administrators can run the monthly payroll process after verifying the correctness of input data",
					},
					{
						name: "Approve Timesheets",
						desc: "Allows users to approve or reject employee timesheets before processing payroll",
						subtext:
							"Example: Department managers can review and approve timesheets submitted by their team members",
					},
					{
						name: "Manage Deductions and Benefits",
						desc: "Permits users to add, modify, or remove payroll deductions and benefits for employees.",
						subtext:
							"HR specialists can update benefit plans and manage deductions like health insurance and retirement contributions.",
					},
					{
						name: "Generate Payroll Reports",
						desc: "Enables users to create various payroll reports, such as tax reports, leave balances, and salary summaries",
						subtext:
							"Example: Finance executives can generate monthly payroll reports for budgeting and financial analysis",
					},
					{
						name: "Access Tax Information",
						desc: "Grants access to view and manage tax-related data, including tax rates and employee tax declarations",
						subtext:
							"Example: Tax specialists can enter tax-related information and ensure compliance with tax regulations",
					},
					{
						name: "View Audit Trail",
						desc: "Allows users to see a log of all changes made to employee records and payroll data",
						subtext:
							"Example: Administrators can monitor any modifications to payroll information for security and auditing purposes",
					},
					{
						name: "Admin Access",
						desc: "Provides full administrative access to all payroll functionalities and settings",
						subtext:
							"Payroll system administrators can manage user permissions, configure system settings, and perform all payroll-related tasks",
					},
				],
			},
			{
				name: "Payroll Manager",
				description:
					"This role focuses on processing payroll, including inputting employee hours, calculating wages, managing tax withholdings, and generating paychecks. They may have access to payroll-related features but not necessarily broader HR functions",
				aprrover: "hr@team.com",
				isSystemMenu: true,
				permissions: [
					{
						name: "View Employee Information",
						desc: "Allows users to view basic information about employees, such as names, job titles, and contact details.",
						subtext:
							"Example: HR staff can access and view employee records to update contact information",
					},
					{
						name: "Edit Employee Information",
						desc: "Enables users to make changes to employee records, such as updating addresses, phone numbers, and emergency contacts",
						subtext:
							"Example: HR managers can edit employee details in the system after an employee reports a change of address",
					},
					{
						name: "View Salary Details",
						desc: " Grants access to view salary-related information of employees.",
						subtext:
							"Example: The finance manager may have this permission to view and verify salary details for budgeting purposes",
					},
					{
						name: "Manage Salary Details",
						desc: "Allows the user to update salary information, such as changing salary amounts or setting up bonuses",
						subtext:
							"Example: The payroll specialist may have this permission to manage payroll adjustments",
					},
					{
						name: "View Payroll Data",
						desc: "Grants access to view payroll-related information, such as salary, bonuses, deductions, and tax details",
						subtext:
							"Example: Finance team members can see payroll reports and verify the amounts before processing payments",
					},
					{
						name: "Process Payroll",
						desc: "Authorizes users to run the payroll process, calculate salaries, and generate payslips for employees",
						subtext:
							"Example: Payroll administrators can run the monthly payroll process after verifying the correctness of input data",
					},
					{
						name: "Approve Timesheets",
						desc: "Allows users to approve or reject employee timesheets before processing payroll",
						subtext:
							"Example: Department managers can review and approve timesheets submitted by their team members",
					},
					{
						name: "Manage Deductions and Benefits",
						desc: "Permits users to add, modify, or remove payroll deductions and benefits for employees.",
						subtext:
							"HR specialists can update benefit plans and manage deductions like health insurance and retirement contributions.",
					},
					{
						name: "Generate Payroll Reports",
						desc: "Enables users to create various payroll reports, such as tax reports, leave balances, and salary summaries",
						subtext:
							"Example: Finance executives can generate monthly payroll reports for budgeting and financial analysis",
					},
					{
						name: "Access Tax Information",
						desc: "Grants access to view and manage tax-related data, including tax rates and employee tax declarations",
						subtext:
							"Example: Tax specialists can enter tax-related information and ensure compliance with tax regulations",
					},
					{
						name: "View Audit Trail",
						desc: "Allows users to see a log of all changes made to employee records and payroll data",
						subtext:
							"Example: Administrators can monitor any modifications to payroll information for security and auditing purposes",
					},
					{
						name: "Admin Access",
						desc: "Provides full administrative access to all payroll functionalities and settings",
						subtext:
							"Payroll system administrators can manage user permissions, configure system settings, and perform all payroll-related tasks",
					},
				],
			},
			{
				name: "Finance Manager",
				description:
					"Responsible for overseeing financial aspects of payroll, this role ensures accurate financial reporting, handles tax filings, reconciles payroll accounts, and generates financial reports related to payroll expenses",
				aprrover: "admin@team.com",
				isSystemMenu: true,
				permissions: [],
			},
			{
				name: "Employee",
				description:
					"Employees can have access to their payroll information through a self-service portal. They can view pay stubs, update personal information, access tax forms, and make changes related to tax withholding",
				aprrover: "admin@team.com",
				isSystemMenu: true,
				permissions: [],
			},
			{
				name: "Time Entry User",
				description:
					"This role focuses on inputting and managing employee time and attendance data. They may not have full access to payroll processing but are responsible for recording accurate work hours",
				aprrover: "admin@team.com",
				isSystemMenu: true,
				permissions: [],
			},
			{
				name: "Benefits Administrator",
				description:
					"This role manages employee benefits and deductions, such as health insurance, retirement plans, and other deductions. They may handle enrollment, changes, and reconciliations related to these benefits",
				aprrover: "admin@team.com",
				isSystemMenu: true,
				permissions: [],
			},
			{
				name: "Tax Specialist",
				description:
					"This role ensures compliance with tax regulations. They manage tax settings, updates, and calculations, as well as handle tax form generation",
				aprrover: "admin@team.com",
				isSystemMenu: true,
				permissions: [],
			},
			{
				name: "Technical Administrator",
				description:
					"This role manages the technical aspects of the payroll software system, including user access, security settings, system updates, and integration with other software or systems",
				aprrover: "admin@team.com",
				isSystemMenu: true,
				permissions: [],
			},
		],
	},
];

[
	{
		name: "User Permission",
		desc: "Assign/Revoke permissions for users",

		createdon: "",
		updatedaon: "",
		updatedby: "",
		item: [
			{
				name: "View Employee Information",
				description:
					"Allows users to view basic information about employees, such as names, job titles, and contact details.",
				subtext:
					"Example: HR staff can access and view employee records to update contact information",
				isSystemMenu: true,
			},
			{
				name: "Edit Employee Information",
				description:
					"Enables users to make changes to employee records, such as updating addresses, phone numbers, and emergency contacts",
				subtext:
					"Example: HR managers can edit employee details in the system after an employee reports a change of address",
				isSystemMenu: true,
			},
			{
				name: "View Salary Details",
				description:
					"Grants access to view salary-related information of employees.",
				subtext:
					"Example: The finance manager may have this permission to view and verify salary details for budgeting purposes",
				isSystemMenu: true,
			},
			{
				name: "Manage Salary Details",
				description:
					"Allows the user to update salary information, such as changing salary amounts or setting up bonuses",
				subtext:
					"Example: The payroll specialist may have this permission to manage payroll adjustments",
				isSystemMenu: true,
			},
			{
				name: "View Payroll Data",
				description:
					"Grants access to view payroll-related information, such as salary, bonuses, deductions, and tax details",
				subtext:
					"Example: Finance team members can see payroll reports and verify the amounts before processing payments",
				isSystemMenu: true,
			},
			{
				name: "Process Payroll",
				description:
					"Authorizes users to run the payroll process, calculate salaries, and generate payslips for employees",
				subtext:
					"Example: Payroll administrators can run the monthly payroll process after verifying the correctness of input data",
				isSystemMenu: true,
			},
			{
				name: "Approve Timesheets",
				description:
					"Allows users to approve or reject employee timesheets before processing payroll",
				subtext:
					"Example: Department managers can review and approve timesheets submitted by their team members",
				isSystemMenu: true,
			},
			{
				name: "Manage Deductions and Benefits",
				description:
					"Permits users to add, modify, or remove payroll deductions and benefits for employees.",
				subtext:
					"HR specialists can update benefit plans and manage deductions like health insurance and retirement contributions.",
				isSystemMenu: true,
			},
			{
				name: "Generate Payroll Reports",
				description:
					"Enables users to create various payroll reports, such as tax reports, leave balances, and salary summaries",
				subtext:
					"Example: Finance executives can generate monthly payroll reports for budgeting and financial analysis",
				isSystemMenu: true,
			},
			{
				name: "Access Tax Information",
				description:
					"Grants access to view and manage tax-related data, including tax rates and employee tax declarations",
				subtext:
					"Example: Tax specialists can enter tax-related information and ensure compliance with tax regulations",
				isSystemMenu: true,
			},
			{
				name: "View Audit Trail",
				description:
					"Allows users to see a log of all changes made to employee records and payroll data",
				subtext:
					"Example:Administrators can monitor any modifications to payroll information for security and auditing purposes",
				isSystemMenu: true,
			},
			{
				name: "Admin Access",
				description:
					"Provides full administrative access to all payroll functionalities and settings",
				subtext:
					"Payroll system administrators can manage user permissions, configure system settings, and perform all payroll-related tasks",
				isSystemMenu: true,
			},
		],
	},
];

[
	{
		name: "User Benefit",
		desc: "Enable benefits applicable for users",

		createdon: "",
		updatedaon: "",
		updatedby: "",
		item: [
			{
				name: "Enable benefits applicable for users",
				description:
					"The HR department is responsible for managing employee relations, recruitment, hiring, benefits administration, training, and ensuring compliance with labor laws and regulations.",
			},
			{
				name: "Health Insurance",
				description:
					"Health insurance is one of the most common and valuable benefits provided by employers. It covers medical expenses, doctor visits, hospitalization, prescription drugs, and other healthcare services. Employers may fully cover the premiums or share the cost with the employees",
			},
			{
				name: "Paid Time Off (PTO)",
				description:
					"PTO includes vacation days, sick leave, and holidays that employees are entitled to take with pay. The number of days and policies vary based on tenure and company policy.",
			},
			{
				name: "Flexible Spending Accounts (FSA) or Health Savings Accounts (HSA)",
				description:
					"FSAs and HSAs allow employees to set aside pre-tax money to cover eligible medical expenses or dependent care costs",
			},
			{
				name: "Dental and Vision Insurance",
				description:
					"Employers may provide dental and vision insurance to cover dental check-ups, eye exams, glasses, and contact lenses.",
			},
			{
				name: "Life Insurance",
				description:
					"Life insurance provides financial support to an employee's beneficiaries in case of the employee's death. Employers may offer a basic life insurance policy or allow employees to purchase additional coverage.",
			},
			{
				name: "Disability Insurance",
				description:
					"Disability insurance provides income replacement if an employee becomes disabled and unable to work for an extended period",
			},
			{
				name: "Employee Assistance Programs (EAP)",
				description:
					"EAPs offer confidential counseling and support services to employees and their families to address personal or work-related issues",
			},
			{
				name: "Wellness Programss",
				description:
					"Wellness programs promote employee health and well-being, offering resources and incentives for healthy behaviors, such as gym memberships or wellness challenges",
			},
			{
				name: "Childcare Benefits",
				description:
					"Employers may provide on-site childcare facilities or offer subsidies for childcare expenses to support working parents.",
			},
		],
	},
];
