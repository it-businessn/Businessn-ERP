const Opportunity = require("../models/Opportunity");

const getOpportunities = async (req, res) => {
	try {
		const opportunities = (await Opportunity.find({})).sort();
		res.status(200).json(opportunities);
	} catch (error) {
		res.status(404).json({ error: error.message });
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
		res.status(500).json({ message: error.message });
	}
};

const createOpportunity = async (req, res) => {
	const { name, clientName, stage, probability, dealAmount } = req.body;

	try {
		const newOpportunity = await Opportunity.create({
			clientName,
			createdOn: Date.now(),
			dealAmount,
			name,
			probability,
			stage,
		});

		res.status(201).json(newOpportunity);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateOpportunity = async (req, res) => {
	const { opportunityId } = req.params;

	try {
		const updatedOpportunity = await Opportunity.findByIdAndUpdate(
			opportunityId,
			req.body,
			{ new: true },
		);

		res.status(201).json(updatedOpportunity);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	createOpportunity,
	getOpportunities,
	getGroupedOpportunities,
	updateOpportunity,
};
