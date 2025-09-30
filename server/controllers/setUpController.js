const { getShadowUserIds } = require("../helpers/userHelper");
const CostCenter = require("../models/CostCenter");
const Crew = require("../models/Crew");
const Department = require("../models/Department");
const EmployeeRole = require("../models/EmployeeRole");
const EmploymentPositionRole = require("../models/EmploymentPositionRole");
const EmploymentType = require("../models/EmploymentType");
const Group = require("../models/Group");
const Location = require("../models/Location");
const Module = require("../models/Module");
const Setup = require("../models/Setup");

const { CURRENT_YEAR } = require("../services/data");

const getAllSetup = async (req, res) => {
	try {
		const rule = await Setup.find({});
		return res.status(200).json(rule);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getLocations = async (req, res) => {
	const { companyName } = req.params;
	try {
		const locations = await Location.find({
			companyName,
		}).sort({
			name: 1,
		});
		return res.status(200).json(locations);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getPositionRoles = async (req, res) => {
	const { companyName } = req.params;
	try {
		const roles = await EmploymentPositionRole.find({
			companyName,
		}).sort({
			name: 1,
		});
		return res.status(200).json(roles);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getCrews = async (req, res) => {
	const { companyName } = req.params;
	try {
		const crews = await Crew.find({
			companyName,
		}).sort({
			createdOn: -1,
		});
		return res.status(200).json(crews);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getRoles = async (req, res) => {
	const { companyName } = req.params;
	try {
		const roles = await EmployeeRole.find({
			inactive: { $ne: true },
			companyName,
		}).sort({
			createdOn: -1,
		});
		return res.status(200).json(roles);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const addLocation = async (req, res) => {
	const { name, companyName } = req.body;

	try {
		const data = {
			name,
			companyName,
		};
		const existingRecord = await Location.findOne(data);
		if (existingRecord) {
			return res.status(409).json({ message: "Location already exists" });
		}
		const location = await Location.create(data);
		return res.status(201).json(location);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const addCrew = async (req, res) => {
	const { createdBy, crewName, companyName, include } = req.body;

	try {
		const data = {
			name: crewName,
			createdBy,
			config: include,
			companyName,
		};
		const existingRecord = await Crew.findOne(data);
		if (existingRecord) {
			return res.status(409).json({ message: "Crew already exists" });
		}
		const newCrew = await Crew.create(data);
		return res.status(201).json(newCrew);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateCrew = async (req, res) => {
	const { id } = req.params;
	try {
		const { createdBy, crewName, companyName, include } = req.body;
		const updatedData = {
			name: crewName,
			createdBy,
			config: include,
			companyName,
		};
		const crew = await Crew.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
		return res.status(200).json(crew);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const addRole = async (req, res) => {
	const { name, description, companyName } = req.body;

	try {
		const data = {
			name,
			companyName,
		};
		const checkRoleExists = await EmployeeRole.findOne(data);
		if (!checkRoleExists) {
			data.description = description;
			const newRole = await EmployeeRole.create(data);
			return res.status(201).json(newRole);
		}
		return res.status(409).json({ message: "Role already exists!" });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const addPositionRole = async (req, res) => {
	const { name, description, companyName } = req.body;

	try {
		// ******move from emplomntpositions to EmploymentPositionRole
		// const distinctTitles = await EmployeeEmploymentInfo.aggregate([
		// 	{
		// 		$match: { companyName },
		// 	},
		// 	{
		// 		$unwind: "$positions",
		// 	},
		// 	{
		// 		$match: {
		// 			"positions.title": { $exists: true, $ne: null },
		// 		},
		// 	},
		// 	{
		// 		$group: {
		// 			_id: null,
		// 			titles: { $addToSet: "$positions.title" },
		// 		},
		// 	},
		// 	{
		// 		$project: {
		// 			_id: 0,
		// 			titles: 1,
		// 		},
		// 	},
		// ]);
		// let roles = distinctTitles[0]?.titles || [];
		// roles = roles?.map((role) => ({
		// 	name: role,
		// 	companyName,
		// })); const k = await EmploymentPositionRole.insertMany(roles);

		// *************************

		const roleData = {
			name: name.trim(),
			companyName,
		};
		const checkRoleExists = await EmploymentPositionRole.findOne(roleData);
		if (!checkRoleExists) {
			roleData.description = description;
			const newRole = await EmploymentPositionRole.create(roleData);
			return res.status(201).json(newRole);
		}
		return res.status(409).json({ message: "Role already exists!" });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getCC = async (req, res) => {
	const { companyName } = req.params;
	try {
		const cc = await CostCenter.find({ companyName })
			.select("name departments")
			.sort({
				createdOn: -1,
			})
			.populate("departments", "name description");
		return res.status(200).json(cc);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getDepartments = async (req, res) => {
	const { companyName } = req.params;
	try {
		const department = await Department.find({ companyName }).select("name").sort({
			createdOn: 1,
		});
		if (!department.length) {
			const department = await Department.find({ companyName: null }).sort({
				createdOn: 1,
			});
			return res.status(200).json(department);
		}
		return res.status(200).json(department);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const removeCCDept = async (req, res) => {
	const { deptId } = req.body;
	const { id } = req.params;
	try {
		const setup = await CostCenter.findByIdAndUpdate(
			id,
			{ $pull: { departments: deptId } },
			{ new: true },
		);
		return res.status(200).json(setup);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const addCCDept = async (req, res) => {
	const { name, description, companyName } = req.body;
	const { id } = req.params;
	try {
		const data = { name, description, companyName };
		let deptId;
		const existingRecord = await Department.findOne(data);

		if (existingRecord) {
			deptId = existingRecord._id;
		} else {
			const newDept = await Department.create(data);
			deptId = newDept._id;
		}
		await CostCenter.findByIdAndUpdate(id, { $addToSet: { departments: deptId } }, { new: true });
		return res.status(200).json(deptId);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const deleteCC = async (req, res) => {
	const { id } = req.params;
	try {
		const CC = await CostCenter.findByIdAndDelete({
			_id: id,
		});
		if (CC) {
			return res.status(200).json(`CostCenter with id ${id} deleted successfully.`);
		}
		return res.status(404).json("CostCenter not found.");
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const addCC = async (req, res) => {
	const { name, description, companyName } = req.body;

	try {
		const data = {
			name,
			companyName,
		};
		const checkCCExists = await CostCenter.findOne(data);
		if (!checkCCExists) {
			data.description = description;
			const newCC = await CostCenter.create(data);
			return res.status(201).json(newCC);
		}
		return res.status(409).json({ message: "Cost Center of same name already exists!" });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const addDepartment = async (req, res) => {
	const { name, description, companyName } = req.body;

	try {
		const data = {
			name,
			description,
			companyName,
		};
		const existingRecord = await Department.findOne(data);
		if (existingRecord) {
			return res.status(409).json({ message: "Department already exists" });
		}
		const newDepartment = await Department.create(data);
		return res.status(201).json(newDepartment);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getModules = async (req, res) => {
	const { companyName } = req.params;
	try {
		const module = await Module.find({ companyName }).sort({
			createdOn: -1,
		});
		return res.status(200).json(module);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const addModule = async (req, res) => {
	const { name, description, companyName } = req.body;

	try {
		const data = {
			name,
			companyName,
			description,
		};
		const checkModuleExists = await Module.findOne(data);
		if (!checkModuleExists) {
			const newModule = await Module.create(data);
			return res.status(201).json(newModule);
		}
		return res.status(409).json({ message: "Module of same name already exists!" });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateModule = async (req, res) => {
	const { id } = req.params;
	try {
		const setup = await Module.findByIdAndUpdate(id, { $set: req.body }, { new: true });
		return res.status(200).json(setup);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getGroups = async (req, res) => {
	const { companyName } = req.params;
	try {
		const shadowEmpIds = await getShadowUserIds(companyName);

		let groups = await Group.find({ companyName });
		groups = groups.map((group) => {
			group.members = group.members.filter(
				(member) => member?.empId && !shadowEmpIds.includes(member.empId._id),
			);
			return group;
		});
		return res.status(200).json(groups);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const addGroup = async (req, res) => {
	const { name, baseModule, admin, company, payrollActivated } = req.body;

	try {
		const checkGroupExists = await Group.findOne({
			name,
			companyName: company,
		});
		if (!checkGroupExists) {
			const newModule = await Group.create({
				name,
				companyName: company,
				modules: baseModule,
				admin,
				payrollActivated,
				scheduleFrequency: req.body?.payFrequency,
			});
			if (payrollActivated) {
				await addPaygroupSchedules(newModule._id, req.body?.payFrequency);
			}
			return res.status(201).json(newModule);
		}
		return res.status(409).json({ message: "Paygroup of same name already exists!" });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const START_DATES = {
	2024: "2023-12-18",
	2025: "2024-12-16",
	2026: "2025-12-08",
};

const getStartDate = (year) => new Date(START_DATES[year] || "2023-12-18");

function addDays(date, days) {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

function addMonths(date, months) {
	const result = new Date(date);
	result.setMonth(result.getMonth() + months);
	return result;
}

const groupPaySchedules = async (groupID) => await Group.findById(groupID).select("yearSchedules");

const addPaygroupSchedules = async (groupID, frequency) => {
	try {
		const groupSchedules = await groupPaySchedules(groupID);
		const yearSchedules = groupSchedules.yearSchedules || [];

		const startDate = getStartDate(CURRENT_YEAR);
		const payPeriods = [];

		let numberOfPeriods = 0;
		let getPeriodEndDate;

		switch (frequency) {
			case "Daily":
				numberOfPeriods = 365;
				getPeriodEndDate = (start) => start;
				break;
			case "Weekly":
				numberOfPeriods = 52;
				getPeriodEndDate = (start) => addDays(start, 6);
				break;
			case "Biweekly":
				numberOfPeriods = 26;
				getPeriodEndDate = (start) => addDays(start, 13);
				break;
			case "Semimonthly":
				numberOfPeriods = 24;
				break;
			case "Monthly":
				numberOfPeriods = 12;
				break;
			case "Quarterly":
				numberOfPeriods = 4;
				break;
			case "Annually":
				numberOfPeriods = 1;
				break;
			default:
				throw new Error("Unsupported frequency: " + frequency);
		}
		let currentStart = new Date(startDate);

		for (let i = 0; i < numberOfPeriods; i++) {
			let endDate;
			if (frequency === "Semimonthly") {
				const isFirstHalf = i % 2 === 0;
				endDate = new Date(currentStart);
				endDate.setDate(
					isFirstHalf
						? 14
						: new Date(currentStart.getFullYear(), currentStart.getMonth() + 1, 0).getDate(),
				);
			} else if (["Monthly", "Quarterly", "Annually"].includes(frequency)) {
				const monthsToAdd = frequency === "Monthly" ? 1 : frequency === "Quarterly" ? 3 : 12;
				endDate = addDays(addMonths(currentStart, monthsToAdd), -1);
			} else {
				endDate = getPeriodEndDate(currentStart);
			}
			const processingDate = addDays(endDate, 2);
			const payDate = addDays(processingDate, 3);

			// const payPeriodStartDate = new Date(startDate);
			// payPeriodStartDate.setDate(startDate.getDate() + i * 14);

			// const payPeriodEndDate = new Date(payPeriodStartDate);
			// payPeriodEndDate.setDate(payPeriodStartDate.getDate() + 13);

			// const payPeriodProcessingDate = new Date(payPeriodEndDate);
			// payPeriodProcessingDate.setDate(payPeriodEndDate.getDate() + 2);

			// const payPeriodPayDate = new Date(payPeriodProcessingDate);
			// payPeriodPayDate.setDate(payPeriodProcessingDate.getDate() + 3);

			payPeriods.push({
				payPeriod: i + 1,
				payPeriodStartDate: new Date(currentStart),
				payPeriodEndDate: new Date(endDate),
				payPeriodProcessingDate: new Date(processingDate),
				payPeriodPayDate: new Date(payDate),
				year: CURRENT_YEAR,
			});

			if (["Monthly", "Quarterly", "Annually"].includes(frequency)) {
				currentStart = addMonths(
					currentStart,
					frequency === "Monthly" ? 1 : frequency === "Quarterly" ? 3 : 12,
				);
			} else if (frequency === "Semimonthly") {
				const nextDate = new Date(currentStart);
				if (i % 2 === 0) {
					nextDate.setDate(15);
				} else {
					nextDate.setMonth(nextDate.getMonth() + 1);
					nextDate.setDate(1);
				}
				currentStart = nextDate;
			} else {
				currentStart = addDays(
					currentStart,
					frequency === "Daily" ? 1 : frequency === "Weekly" ? 7 : 14,
				);
			}
		}

		const recordExists = yearSchedules.findIndex((rec) => rec.year === CURRENT_YEAR);
		if (recordExists === -1) {
			yearSchedules.push({ year: CURRENT_YEAR, payPeriods });
		} else {
			yearSchedules[recordExists].payPeriods = payPeriods;
		}

		await updatePayGroup(groupID, {
			scheduleSettings: payPeriods,
			yearSchedules,
		});
	} catch (error) {
		console.log(error);
	}
};

const findGroupEmployees = async (groupID, payDate) => {
	const groupSchedules = await groupPaySchedules(groupID);
	const schedule = groupSchedules.yearSchedules[0]?.payPeriods.find(
		(schedule) => schedule.payPeriodPayDate === payDate,
	);
	return schedule?.selectedEmp;
};

const updatePayGroup = async (id, data) =>
	await Group.findByIdAndUpdate(id, data, {
		new: true,
	});

const updateGroup = async (req, res) => {
	const { id } = req.params;
	const { scheduleSettings, payrollActivated } = req.body;
	try {
		// 	if (scheduleSettings && !scheduleSettings.length && payrollActivated) {
		// 		await addPaygroupSchedules(id);
		// 		return res.status(201).json("Added schedules");
		// 	}

		if (req.body?._id) delete req.body._id;
		const setup = await updatePayGroup(id, req.body);
		return res.status(200).json(setup);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getEmpTypes = async (req, res) => {
	const { companyName } = req.params;
	try {
		const empTypes = await EmploymentType.find({ companyName }).sort({
			createdOn: -1,
		});
		return res.status(200).json(empTypes);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const addEmpType = async (req, res) => {
	const { name, description, companyName } = req.body;

	try {
		const data = {
			name,
			description,
			companyName,
		};
		const existingRecord = await EmploymentType.findOne(data);
		if (existingRecord) {
			return res.status(409).json({ message: "Employment Type already exists" });
		}
		const newEmpType = await EmploymentType.create(data);
		return res.status(201).json(newEmpType);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateSetUp = async (req, res) => {
	const { id } = req.params;
	try {
		const updatedData = req.body;
		const setup = await Setup.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
		return res.status(200).json(setup);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const addSetUpRule = async (req, res) => {
	const { isIdleLeadReassignment, idleTimeHours, idleTimeMinutes, AssignLeadTo } = req.body;

	try {
		const data = {
			isIdleLeadReassignment,
			idleTimeHours,
			idleTimeMinutes,
			AssignLeadTo,
		};
		const existingRecord = await Setup.findOne(data);
		if (existingRecord) {
			return res.status(409).json({ message: "Setup rule already exists" });
		}
		const newSetup = await Setup.create(data);
		return res.status(201).json(newSetup);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = {
	addLocation,
	getLocations,
	addSetUpRule,
	getAllSetup,
	updateSetUp,
	addCrew,
	addRole,
	addPositionRole,
	getRoles,
	getCrews,
	getPositionRoles,
	getDepartments,
	addDepartment,
	getEmpTypes,
	addEmpType,
	addModule,
	getModules,
	updateModule,
	updateGroup,
	updateCrew,
	getGroups,
	addGroup,
	findGroupEmployees,
	addCC,
	getCC,
	addCCDept,
	removeCCDept,
	deleteCC,
};
