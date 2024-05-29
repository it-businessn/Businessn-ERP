import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import ProjectService from "services/ProjectService";

const AddTask = ({ isOpen, onClose, assignee, setRefresh }) => {
	const [taskName, setTaskName] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await ProjectService.addSchedulingProjectTask({ assignee, taskName });
			onClose();
			setRefresh((prev) => !prev);
		} catch (error) {
			console.log("An error occurred. Please try again.");
		}
	};
	return (
		<ModalLayout size="lg" title={"Add Task"} isOpen={isOpen} onClose={onClose}>
			<form onSubmit={handleSubmit}>
				<InputFormControl
					label={"Task name"}
					name="taskName"
					valueText={taskName}
					handleChange={(e) => setTaskName(e.target.value)}
					required
				/>
				<ActionButtonGroup
					submitBtnName={"Add"}
					// isDisabled={isDisabled}
					// isLoading={isSubmitting}
					onClose={onClose}
				/>
			</form>
		</ModalLayout>
	);
};

export default AddTask;
