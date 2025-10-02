const Project = require("../models/Project");
const SubTask = require("../models/SubTask");
const Task = require("../models/Task");

const getPercent = (totalActualHours, totalEstimatedHours) =>
	Math.min(Math.max((totalActualHours / totalEstimatedHours) * 100, 0), 100).toFixed(2);

const calculateTaskCompletionPercent = (task) => {
	let totalEstimatedHours = parseInt(task.timeToComplete) || 0;
	const totalActualHours = parseInt(task.actualHours) || 0;

	let totalEstimatedHoursGGC = 0;
	for (const subtask of task.subtasks) {
		// totalEstimatedHoursGGC=calcTotal(subtask.subtasks, "timeToComplete")
		for (const grandchildTask of subtask.subtasks) {
			totalEstimatedHoursGGC += parseInt(grandchildTask.timeToComplete) || 0;
		}
	}

	if (totalActualHours > totalEstimatedHoursGGC) {
		totalEstimatedHours = totalActualHours / 0.9; // Assuming a 10% increase
	}

	return getPercent(totalActualHours, totalEstimatedHours);
};

const calculateSubtaskCompletionPercent = (subtask) => {
	let totalEstimatedHours = parseInt(subtask.timeToComplete) || 0;
	const totalActualHours = parseInt(subtask.actualHours) || 0;

	let totalEstimatedHoursTasks = 0;
	for (const task of subtask.subtasks) {
		totalEstimatedHoursTasks += parseInt(task.timeToComplete) || 0;
	}

	if (totalActualHours > totalEstimatedHoursTasks) {
		totalEstimatedHours = totalActualHours / 0.9; // Assuming a 10% increase
	}

	return getPercent(totalActualHours, totalEstimatedHours);
};

const calculateSubSubtaskCompletionPercent = (subSubtask) => {
	const totalEstimatedHours = parseInt(subSubtask.timeToComplete) || 0;
	const totalActualHours = parseInt(subSubtask.actualHours) || 0;

	return getPercent(totalActualHours, totalEstimatedHours);
};

const calculateProjectCompletionPercent = (project, childTotalActualHours) => {
	let totalEstimatedHours = parseInt(project.timeToComplete) || 0;
	const totalActualHours = parseInt(childTotalActualHours) || 0;

	let totalEstimatedHoursTasks = 0;
	for (const task of project.tasks) {
		totalEstimatedHoursTasks += parseInt(task.timeToComplete) || 0;
	}

	if (totalActualHours > totalEstimatedHoursTasks) {
		totalEstimatedHours = totalActualHours / 0.9;
	}

	return getPercent(totalActualHours, totalEstimatedHours);
};

const calculateAndSaveTotalEstimatedHours = async (projects) => {
	try {
		for (const project of projects) {
			let childTotalActualHours = 0;
			for (const task of project.tasks) {
				let subtaskTotalActualHours = parseInt(task.actualHours);
				childTotalActualHours += subtaskTotalActualHours;

				for (const subtask of task.subtasks) {
					let subtaskTotalActualHours = parseInt(subtask.actualHours);
					childTotalActualHours += subtaskTotalActualHours;

					for (const subsubtask of subtask.subtasks) {
						let subtaskTotalActualHours = parseInt(subsubtask.actualHours);
						childTotalActualHours += subtaskTotalActualHours;

						subsubtask.completionPercent = calculateSubSubtaskCompletionPercent(subsubtask);

						const index = subtask.subtasks.findIndex(
							(item) => item.taskName === subsubtask.taskName,
						);
						if (index === -1) {
							console.error("Subsubtask not found in subtask.subtasks.");
						} else {
							subtask.subtasks[index] = subsubtask;
						}
					}

					subtask.completionPercent = calculateSubtaskCompletionPercent(subtask);

					await SubTask.findByIdAndUpdate(
						subtask._id,
						{
							$set: {
								completionPercent: subtask.completionPercent,
							},
						},
						{ new: true },
					);
				}
				task.completionPercent = calculateTaskCompletionPercent(task);

				await Task.findByIdAndUpdate(
					task._id,
					{
						$set: {
							completionPercent: task.completionPercent,
						},
					},
					{ new: true },
				);
			}
			project.completionPercent = calculateProjectCompletionPercent(project, childTotalActualHours);

			await Project.findByIdAndUpdate(
				project._id,
				{
					$set: {
						completionPercent: project.completionPercent,
					},
				},
				{ new: true },
			);
		}
		console.log("Completion percentage calculated and saved successfully.");
		return projects;
	} catch (error) {
		console.error("Error calculating and saving completion percentage:", error);
		throw error;
	}
};

module.exports = {
	calculateAndSaveTotalEstimatedHours,
};
