import { Box, HStack, SimpleGrid } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import useActiveEmployees from "hooks/useActiveEmployees";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PayrollService from "services/PayrollService";
import UserService from "services/UserService";
import NotificationCard from "./NotificationCard";
import PayPeriodDetails from "./PayPeriodDetails";
import PayrollActionSection from "./PayrollActionSection";
import PayrollCard from "./PayrollCard";

const LeftPane = ({ setStats, company, closestRecord, payGroupSchedule, closestRecordIndex }) => {
	const prevSchedule = payGroupSchedule?.[closestRecordIndex - 1];
	const nextSchedule = payGroupSchedule?.[closestRecordIndex + 1];
	const activeUsers = useActiveEmployees(company);

	const [totalEmployees, setTotalEmployees] = useState(null);
	const [filter, setFilter] = useState(null);
	const [totalAlerts, setTotalAlerts] = useState(null);

	const navigate = useNavigate();

	const handleClick = (path) => navigate(path);

	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const response = await UserService.getAllCompanyUsers(company);
				setTotalEmployees(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEmployees();
	}, []);

	useEffect(() => {
		if (closestRecord) {
			const { payPeriodStartDate, payPeriodEndDate, payPeriod } = closestRecord;
			setFilter({
				startDate: payPeriodStartDate,
				endDate: payPeriodEndDate,
			});
			const fetchAlerts = async () => {
				try {
					const response = await PayrollService.getTotalAlerts(company, payPeriod);
					setTotalAlerts(response.data);
				} catch (error) {
					console.error(error);
				}
			};
			fetchAlerts();
		}
	}, [closestRecord]);

	const runType = closestRecord?.isExtraRun ? "Extra" : "Regular";
	const sections = [
		{
			name: "Payroll",
			content: (
				<PayrollCard
					payGroupSchedule={payGroupSchedule}
					prevSchedule={prevSchedule}
					closestRecord={closestRecord}
					closestRecordIndex={closestRecordIndex}
					runType={runType}
					nextSchedule={nextSchedule}
					handleClick={handleClick}
					company={company}
				/>
			),
		},
		{
			name: "Payroll actions",
			content: (
				<PayrollActionSection
					company={company}
					filter={filter}
					selectedPayPeriod={closestRecord}
					handleClick={handleClick}
					activeUsers={activeUsers}
					totalAlerts={totalAlerts}
				/>
			),
		},
		{
			name: "",
			content: (
				<PayPeriodDetails
					handleClick={handleClick}
					company={company}
					activeUsers={activeUsers}
					employees={totalEmployees}
				/>
			),
		},
		{
			name: "Notifications",
			content: <NotificationCard />,
		},
	];
	return (
		<Box>
			<SimpleGrid mb={"1em"} columns={{ base: 2 }} spacing="1em" color={"var(--menu_item_color)"}>
				{/* <TimeCard selectedUser={selectedUser} company={company} /> */}

				{sections.map(({ name, content }, index) => (
					<BoxCard key={name}>
						{index === 0 ? (
							<HStack>
								{/* <TextTitle title={name} mt={2} mb={"1em"} />
								<HStack spacing={0}>
									<Icon
										borderRadius={"50%"}
										as={MdOutlineChevronLeft}
										// onClick={() => handleChangeDate("prev")}
										boxSize="5"
										color="fg.muted"
									/>

									<Icon
										as={MdOutlineChevronRight}
										// onClick={() => handleChangeDate("next")}
										boxSize="5"
										color="fg.muted"
									/>
								</HStack> */}
							</HStack>
						) : (
							<TextTitle title={name} mt={2} mb={"1em"} />
						)}

						{content}
					</BoxCard>
				))}
			</SimpleGrid>
		</Box>
	);
};

export default LeftPane;
