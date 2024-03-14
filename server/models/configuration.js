const mongoose = require("mongoose");

const { Schema } = mongoose;
const configurationSchema = new Schema(
	{
		name: String,
		key: String,
		description: String,
		items: [
			{
				itemType: {
					type: String,
					enum: ["Department", "LeaveType", "EmploymentType"],
				},

				item: {
					type: mongoose.Schema.Types.ObjectId,
					refPath: "items.itemType",
				},
			},
		],
	},
	{ timestamps: true },
	{ collection: "ConfigurationSettings" },
);

module.exports = mongoose.model("ConfigurationSettings", configurationSchema);
