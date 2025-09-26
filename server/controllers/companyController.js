const Company = require("../models/Company");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const { ROLES } = require("../services/data");

const getCompanies = async (req, res) => {
	try {
		const companies = await getAllCompanies();
		res.status(200).json(companies);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getCompany = async (req, res) => {
	const { name } = req.params;
	try {
		const company = await Company.findOne({ name }).select(
			"address industry_type founding_year registration_number name cra_business_number",
		);
		res.status(200).json(company);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getCompanyEmployees = async (req, res) => {
	const { employees } = req.params;
	try {
		// const company = "6646b03e96dcdc0583fb5dca";
		// const existingCompany = await Company.findById(company);
		// existingCompany.employees.push(id);
		// await existingCompany.save();

		const result = await Company.find({ employees });

		// const updatedLeads = await Company.findByIdAndUpdate(
		// 	"6646b03e96dcdc0583fb5dca",
		// 	{
		// 		employees,
		// 	},
		// 	{ new: true },
		// );
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const updateCompany = async (req, res) => {
	const { id } = req.params;
	try {
		const { CRABusinessNo } = req.body;
		const updatedCompany = await Company.findByIdAndUpdate(
			id,
			{ $set: { cra_business_number: CRABusinessNo } },
			{ new: true },
		);
		res.status(200).json(updatedCompany);
	} catch (error) {
		console.log(error, "Error in updating");
	}
};

const addCompany = async (req, res) => {
	const { name, founding_year, registration_number, address, industry_type } = req.body;
	const { streetNumber, city, state, postalCode, country } = address;

	try {
		const adminEmployees = await EmployeeEmploymentInfo.find({
			employmentRole: ROLES.SHADOW_ADMIN,
			empId: { $exists: true },
		}).select("empId");
		const newCompany = await Company.create({
			name,
			founding_year,
			registration_number,
			industry_type,
			address: { streetNumber, city, state, postalCode, country },
			employees: adminEmployees,
		});

		res.status(201).json(newCompany);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getAllCompanies = async () =>
	await Company.find({}).sort({
		createdOn: -1,
	});

module.exports = {
	addCompany,
	getCompany,
	getCompanies,
	getCompanyEmployees,
	getAllCompanies,
	updateCompany,
};
