const Contact = require("../models/Contact");
const Note = require("../models/Note");
const Project = require("../models/Project");
const ProjectFile = require("../models/ProjectFile");
const SubTask = require("../models/SubTask");
const Task = require("../models/Task");

const getNotes = async (req, res) => {
	try {
		const notes = await Note.find({}).sort({
			createdOn: -1,
		});
		res.status(200).json(notes);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getNote = async (req, res) => {
	const { contactId } = req.params;

	try {
		const notes = await Note.find({ contactId }).sort({
			createdOn: -1,
		});
		res.status(200).json(notes);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createNote = async (req, res) => {
	const { contactId, createdBy, description, companyName } = req.body;

	try {
		const newNote = await Note.create({
			contactId,
			createdBy,
			description,
			companyName,
		});
		const contact = await Contact.findById(contactId);
		contact.notes.push(newNote._id);

		await contact.save();

		res.status(201).json(newNote);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateNotes = async (req, res) => {
	const { id } = req.params;

	const { type, notes } = req.body;
	try {
		const updatedData = { notes };
		if (type === "file") {
			const updatedProject = await ProjectFile.findByIdAndUpdate(
				id,
				{ $set: updatedData },
				{ new: true },
			);
			return res.status(201).json(updatedProject);
		}
		if (type === "project") {
			const updatedProject = await Project.findByIdAndUpdate(
				id,
				{ $set: updatedData },
				{ new: true },
			);
			return res.status(201).json(updatedProject);
		}
		if (type === "task") {
			const updatedTask = await Task.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
			return res.status(201).json(updatedTask);
		}
		if (type === "subtask") {
			const updatedTask = await SubTask.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
			return res.status(201).json(updatedTask);
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = { createNote, getNote, getNotes, updateNotes };
