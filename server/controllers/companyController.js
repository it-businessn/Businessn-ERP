const { getShadowUserIds } = require("../helpers/userHelper");
const Company = require("../models/Company");
const Module = require("../models/Module");
const { COMPANIES } = require("../services/data");

const getCompanies = async (req, res) => {
	try {
		const companies = await getAllCompanies();
		return res.status(200).json(companies);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getCompany = async (req, res) => {
	const { name } = req.params;
	try {
		const company = await Company.findOne({ name }).select(
			"address industry_type founding_year registration_number name cra_business_number",
		);
		return res.status(200).json(company);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
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
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateCompany = async (req, res) => {
	const { id } = req.params;
	try {
		if (req.body?._id) delete req.body._id;
		const updatedCompany = await Company.findByIdAndUpdate(id, { $set: req.body }, { new: true });
		return res.status(200).json(updatedCompany);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const addCompanyModules = async (companyName) => {
	try {
		const ERP_MODULES = [
			"Sales",
			"Project Management",
			"Payroll",
			"Scheduling",
			"HR",
			"Operations",
			"Accounting",
			"Budgeting",
		];
		const modules = ERP_MODULES.map((module) => {
			return { name: module, companyName };
		});
		await Module.insertMany(modules);
	} catch (error) {}
};

const addCompany = async (req, res) => {
	const { name, founding_year, registration_number, address, industry_type } = req.body;
	const { streetNumber, city, state, postalCode, country } = address;

	try {
		const shadowAdmins = await getShadowUserIds(COMPANIES.BUSINESSN_ORG);
		const companyExists = await Company.findOne({ name, registration_number });
		if (!companyExists) {
			const newCompany = await Company.create({
				name,
				founding_year,
				registration_number,
				industry_type,
				address: { streetNumber, city, state, postalCode, country },
				employees: shadowAdmins,
			});
			addCompanyModules(name);
			return res.status(201).json(newCompany);
		}
		return res.status(409).json({ message: "Company of same registration_number already exists!" });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
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
