const Note = require("../models/Note");

const getNotes = () => async (req, res) => {
	try {
		const notes = (await Note.find()).sort((a, b) => b.date - a.date);
		res.status(200).json(notes);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getNoteById = () => async (req, res) => {
	const id = req.params.id;

	try {
		const notes = (await Note.find({ contactId: id })).sort(
			(a, b) => b.date - a.date,
		);
		res.status(200).json(notes);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createNote = () => async (req, res) => {
	const { contactId, description } = req.body;

	const note = new Note({ contactId, description, date: Date.now() });
	try {
		const newNote = await note.save();
		res.status(201).json(newNote);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = { createNote, getNoteById, getNotes };
