const Opportunity = require("../models/Opportunity");

const getOpportunities = async (req, res) => {
	try {
		const opportunities = await Opportunity.find({}).sort({
			createdOn: -1,
		});
		return res.status(200).json(opportunities);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const groupOpportunitiesByCategory = (categories) => {
	const groupedOpportunities = {};

	categories.forEach((category) => {
		const group = category.stage;

		if (!groupedOpportunities[group]) {
			groupedOpportunities[group] = {
				opportunities: [],
				categoryCount: {},
			};
		}
		groupedOpportunities[group].opportunities.push(category);
	});

	return groupedOpportunities;
};

const getGroupedOpportunities = async (req, res) => {
	try {
		const opportunities = await Opportunity.find({});
		const groupedOpportunities = groupOpportunitiesByCategory(opportunities);
		res.json(groupedOpportunities);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createOpportunity = async (req, res) => {
	const { name, clientName, stage, probability, dealAmount } = req.body;

	try {
		const data = {
			clientName,
			dealAmount,
			name,
			probability,
			stage,
		};

		const existingRecord = await Opportunity.findOne(data);
		if (existingRecord) {
			return res.status(409).json({ message: "Opportunity already exists" });
		}

		const newOpportunity = await Opportunity.create(data);
		return res.status(201).json(newOpportunity);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateOpportunity = async (req, res) => {
	const { opportunityId } = req.params;

	try {
		const updatedOpportunity = await Opportunity.findByIdAndUpdate(
			opportunityId,
			{ $set: req.body },
			{
				new: true,
			},
		);

		return res.status(201).json(updatedOpportunity);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = {
	createOpportunity,
	getOpportunities,
	getGroupedOpportunities,
	updateOpportunity,
};
