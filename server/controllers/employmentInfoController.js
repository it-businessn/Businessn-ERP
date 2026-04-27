const moment = require("moment");
const Employee = require("../models/Employee");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const { fetchActiveEmployees } = require("./userController");
const { updatePayInfo } = require("./payInfoController");
const { addUserEmploymentInfo } = require("./empDataController");
const { updateTADEmployee } = require("./timecardController");
const { setInitialPermissions } = require("./permissionController");
const { checkExtraRun } = require("../helpers/payrollHelper");

const getAllEmploymentInfo = async (req, res) => {
	const { companyName, payDate, isExtraRun, groupId, deptName, selectedPayGroupOption } = req.body;

	try {
		const isExtraPayRun = checkExtraRun(isExtraRun);

		const activeEmployees = await fetchActiveEmployees(
			isExtraPayRun,
			groupId,
			payDate,
			companyName,
			deptName,
			selectedPayGroupOption,
		);
		// parallel execution instead of sequential loop
		const results = await Promise.allSettled(
			activeEmployees.map((employee) =>
				buildPayPeriodEmpDetails(companyName, employee?.empId?._id),
			),
		);
		const aggregatedResult = results
			.filter((r) => r.status === "fulfilled" && r.value)
			.map((r) => {
				const empInfo = r.value;
				const position = empInfo?.empPayStubResult?.positions?.find((p) => p?.title);

				return {
					...empInfo,
					_id: empInfo?.empPayStubResult?._id,
					empId: empInfo?.empPayStubResult?.empId,
					employmentCostCenter: position?.employmentDepartment,
				};
			});

		return res.status(200).json(aggregatedResult);
	} catch (error) {
		console.error("❌ getAllEmploymentInfo Pay period aggregation error:", {
			message: error.message,
			stack: error.stack,
			body: req.body,
		});

		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

const findEmpEmploymentInfo = async (empId) =>
	await EmployeeEmploymentInfo.findOne({
		empId,
	}).populate({
		path: "empId",
		model: "Employee",
		select: ["employeeId", "fullName"],
	});

const findEmpPayInfo = async (companyName) =>
	await EmployeePayInfo.find({
		companyName,
	}).select("empId roles");

const buildPayPeriodEmpDetails = async (companyName, employeeId) => {
	const empPayStubResult = await EmployeeEmploymentInfo.findOne({
		companyName,
		empId: employeeId,
		positions: { $exists: true, $not: { $size: 0 } },
	})
		.populate({
			path: "empId",
			model: "Employee",
			select: ["fullName"],
		})
		.select("empId positions employeeNo");

	const payInfoMapResult = await EmployeePayInfo.findOne({
		companyName,
		empId: employeeId,
		roles: { $exists: true, $not: { $size: 0 } },
	}).select("empId roles");
	if (empPayStubResult) return { empPayStubResult, payInfoMapResult };
};

const getCompanyLastBadgeID = async (req, res) => {
	const { companyName } = req.params;
	try {
		const allBadgeIds = await EmployeeEmploymentInfo.find({
			positions: { $exists: true, $not: { $size: 0 } },
			companyName,
		}).select("positions");

		const badgeIds = allBadgeIds
			.flatMap((rec) =>
				(rec.positions || [])
					.filter((pos) => pos?.timeManagementBadgeID != null)
					.map((pos) => Number(pos.timeManagementBadgeID)),
			)
			.filter((id) => !isNaN(id));

		const lastTimeManagementBadgeID = badgeIds.length > 0 ? Math.max(...badgeIds) : null;

		return res.status(200).json(lastTimeManagementBadgeID);
	} catch (error) {
		console.error("❌ getCompanyLastBadgeID Badge ID fetch error:", {
			message: error.message,
			stack: error.stack,
			companyName,
		});

		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

const getEmployeeEmploymentInfo = async (req, res) => {
	const { companyName, empId } = req.params;
	try {
		const result = await findEmployeeEmploymentInfo(empId, companyName);

		if (!result) {
			const user = await Employee.findById(empId).select("email position dateOfJoining").sort({
				createdOn: -1,
			});
			return res.status(200).json(user);
		}
		// generate employeeNo only if missing
		if (!result.employeeNo) {
			const currentDate = moment().utc().format("YYYYMMDD");

			const uniqueSuffix = Math.floor(100 + Math.random() * 900); // 100–999 safer

			result.employeeNo = `${companyName.slice(0, 2).toUpperCase()}${currentDate}${uniqueSuffix}`;

			await EmployeeEmploymentInfo.updateOne(
				{ _id: result._id },
				{ $set: { employeeNo: result.employeeNo } },
			);
		}

		return res.status(200).json(result);
	} catch (error) {
		console.error("❌ getEmployeeEmploymentInfo fetch error:", {
			message: error.message,
			stack: error.stack,
			empId,
			companyName,
		});

		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

const findEmployeeEmploymentInfo = async (empId, companyName) =>
	await EmployeeEmploymentInfo.findOne({
		empId,
		companyName,
	});

const updateEmploymentInfo = async (id, data) =>
	await EmployeeEmploymentInfo.findByIdAndUpdate(
		id,
		{ $set: data },
		{
			new: true,
		},
	);

const updateEmployee = async (empId, data) => {
	const { payrollStatus, employeeNo, employmentRole } = data;
	try {
		const employee = await Employee.findById(empId);
		if (!employee) {
			return res.status(404).json({
				message: "Employee not found",
			});
		}

		const updateFields = {};

		if (payrollStatus && employee.payrollStatus !== payrollStatus) {
			updateFields.payrollStatus = payrollStatus;
		}

		if (employeeNo && employeeNo.trim() !== "" && employee.employeeNo !== employeeNo) {
			updateFields.employeeNo = employeeNo;
		}

		if (employmentRole && employee.role !== employmentRole) {
			updateFields.role = employmentRole;
		}

		// only update if something changed
		if (Object.keys(updateFields).length > 0) {
			Object.assign(employee, updateFields);
			await employee.save();
		}

		return res.status(200).json(employee);
	} catch (error) {
		console.error("❌ updateEmployee update error:", {
			message: error.message,
			stack: error.stack,
			empId,
		});

		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

const addEmployeeEmploymentInfo = async (req, res) => {
	const {
		empId,
		companyName,
		payrollStatus,
		employeeNo,
		employmentStartDate,
		employmentLeaveDate,
		employmentRole,
		positions,
		employmentCountry,
		employmentRegion,
	} = req.body;
	try {
		const data = {
			payrollStatus,
			employeeNo,
			employmentRole,
		};
		const positionExists = positions?.find((p) => p?.title);

		if (positionExists) {
			const roles = [...positions];

			const existingPayInfo = await EmployeePayInfo.findOne({
				empId,
				companyName,
			});
			if (existingPayInfo) {
				await updatePayInfo(existingPayInfo._id, { roles });
			} else {
				await EmployeePayInfo.create([{ empId, companyName, roles }]);
			}
		}

		const existingEmploymentInfo = await findEmployeeEmploymentInfo(empId, companyName);

		let result;
		if (existingEmploymentInfo) {
			result = await updateEmploymentInfo(existingEmploymentInfo._id, {
				payrollStatus,
				employeeNo,
				employmentStartDate,
				employmentLeaveDate,
				employmentRole,
				positions,
				employmentCountry,
				employmentRegion,
			});
		} else {
			result = await EmployeeEmploymentInfo.create([
				{
					empId,
					payrollStatus,
					employeeNo,
					companyName,
					employmentStartDate,
					employmentLeaveDate,
					employmentRole,
					positions,
					employmentCountry,
					employmentRegion,
				},
			]);
		}

		await updateEmployee(empId, data);

		if (positionExists && positions?.length) {
			try {
				await updateTADEmployee(empId, companyName, positions[0]);
			} catch (error) {
				console.error("❌ TAD update failed:", {
					empId,
					companyName,
					message: error.message,
				});
			}
		}
		if (
			employmentRole !== existingEmploymentInfo?.employmentRole ||
			companyName !== existingEmploymentInfo?.companyName
		) {
			await setInitialPermissions(empId, employmentRole, companyName);
		}
		return res.status(200).json(result);
	} catch (error) {
		console.error("❌ addEmployeeEmploymentInfo  error:", {
			message: error.message,
			stack: error.stack,
			empId,
			companyName,
		});

		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

const updateEmployeeEmploymentInfo = async (req, res) => {
	const { id } = req.params;
	const {
		empId,
		companyName,
		payrollStatus,
		employeeNo,
		employmentRole,
		employmentStartDate,
		employmentCountry,
		employmentRegion,
		employmentLeaveDate,
		positions,
	} = req.body;
	try {
		const existingEmploymentInfo = await EmployeeEmploymentInfo.findOne({ empId, companyName });

		const positionExists = positions?.find((_) => _.title);
		if (positionExists) {
			const roles = [...positions];
			const existingPayInfo = await EmployeePayInfo.findOne({
				empId,
				companyName,
			});

			if (existingPayInfo) {
				await updatePayInfo(existingPayInfo._id, { roles });
			} else {
				await EmployeePayInfo.create({
					empId,
					companyName,
					roles,
				});
			}
		}
		if (existingEmploymentInfo) {
			if (employmentRole && employmentRole !== existingEmploymentInfo?.employmentRole) {
				await setInitialPermissions(existingEmploymentInfo.empId, employmentRole, companyName);
			}

			const updatedInfo = await updateEmploymentInfo(existingEmploymentInfo._id, {
				payrollStatus,
				employeeNo,
				companyName,
				employmentStartDate,
				employmentLeaveDate,
				employmentRole,
				positions,
				employmentCountry,
				employmentRegion,
			});

			if (positions?.length) {
				try {
					await updateTADEmployee(empId, companyName, positions[0]);
				} catch (err) {
					console.error("❌ TAD update failed:", err.message);
				}
			}
			return res.status(200).json(updatedInfo);
		}

		await setInitialPermissions(empId, employmentRole, companyName);
		const newRecord = await addUserEmploymentInfo(empId, companyName, req.body);
		if (!newRecord) {
			return res.status(500).json({
				message: "Failed to create employment record",
			});
		}
		return res.status(201).json(newRecord);
	} catch (error) {
		console.error("❌ updateEmployeeEmploymentInfo error:", {
			message: error.message,
			stack: error.stack,
			empId,
			companyName,
		});

		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

module.exports = {
	getAllEmploymentInfo,
	getEmployeeEmploymentInfo,
	getCompanyLastBadgeID,
	addEmployeeEmploymentInfo,
	updateEmployeeEmploymentInfo,
	findEmployeeEmploymentInfo,
	updateEmploymentInfo,
	findEmpPayInfo,
};
