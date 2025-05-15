import BoxCard from "components/ui/card";
import MiniCalendar from "erp-modules/sales/dashboard/rightpane/MiniCalendar";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import TaskService from "services/TaskService";
import AlertActivity from "./AlertActivity";
import PayrollUserStatInfo from "./PayrollUserStatInfo";

const RightPane = ({
	selectedUser,
	selectedPayGroup,
	company,
	payGroupSchedule,
	closestRecord,
	closestRecordIndex,
}) => {
	const [tickets, setTickets] = useState(null);
	const [chat, setChat] = useState(null);
	const [tasks, setTasks] = useState(null);
	const [appointments, setAppointments] = useState(null);

	useEffect(() => {
		const fetchAllUserTasks = async () => {
			try {
				const { data } = await TaskService.getTaskByAssignee({
					name: selectedUser?.fullName,
					company,
				});
				setTasks(data);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllUserChat = async () => {
			try {
				// const { data } = await CommunicationService.getUserConversations({
				// 	name: selectedUser?.fullName,
				// 	company,
				// });
				const { data } = await TaskService.getTaskByAssignee({
					name: selectedUser?.fullName,
					company,
				});
				setChat(data);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllUserAppointment = async () => {
			try {
				const { data } = await TaskService.getTaskByAssignee({
					name: selectedUser?.fullName,
					company,
				});
				setAppointments(data);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllUserTickets = async () => {
			try {
				const { data } = await TaskService.getTaskByAssignee({
					name: selectedUser?.fullName,
					company,
				});
				setTickets(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllUserTickets();
		fetchAllUserAppointment();
		fetchAllUserChat();
		fetchAllUserTasks();
	}, [selectedUser]);

	return (
		<BoxCard>
			<PayrollUserStatInfo
				name={selectedUser?.fullName}
				email={selectedUser?.email}
				payGroupSchedule={payGroupSchedule}
				closestRecord={closestRecord}
				closestRecordIndex={closestRecordIndex}
			/>
			<MiniCalendar user={selectedUser} company={company} isPayrollDashboard />
			{/* <ChatMessages userId={selectedPayGroup?._id} company={company} /> */}
			<AlertActivity tickets={tickets} chat={chat} tasks={tasks} appointments={appointments} />
		</BoxCard>
	);
};

export default RightPane;
