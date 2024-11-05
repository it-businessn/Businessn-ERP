import { Box, HStack, Icon, SimpleGrid } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import useActiveEmployees from "hooks/useActiveEmployees";
import useEmployees from "hooks/useEmployees";
import { useEffect, useState } from "react";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import NotificationCard from "./NotificationCard";
import PayPeriodDetails from "./PayPeriodDetails";
import PayrollActionSection from "./PayrollActionSection";
import PayrollCard from "./PayrollCard";

const LeftPane = ({
	selectedPayGroup,
	setStats,
	company,
	closestRecord,
	payGroupSchedule,
	closestRecordIndex,
}) => {
	const prevSchedule = payGroupSchedule?.[closestRecordIndex - 1];
	const nextSchedule = payGroupSchedule?.[closestRecordIndex + 1];
	const { employees } = useEmployees(false, company, false, false, false);
	const activeUsers = useActiveEmployees(company);

	const [filter, setFilter] = useState(null);

	const navigate = useNavigate();

	const handleClick = (path) => navigate(path);

	useEffect(() => {
		if (closestRecord) {
			setFilter({
				startDate: closestRecord?.payPeriodStartDate,
				endDate: closestRecord?.payPeriodEndDate,
			});
		}
	}, [closestRecord]);

	const runType = closestRecord?.isExtraRun ? "Extra" : "Regular";
	const sections = [
		{
			name: "Payroll",
			content: (
				<PayrollCard
					prevSchedule={prevSchedule}
					closestRecord={closestRecord}
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
				/>
			),
		},
		{
			name: "",
			content: (
				<PayPeriodDetails
					handleClick={handleClick}
					company={company}
					employees={employees}
					activeUsers={activeUsers}
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
			<SimpleGrid
				mb={"1em"}
				columns={{ base: 2 }}
				spacing="1em"
				color={"var(--menu_item_color)"}
			>
				{/* <TimeCard selectedUser={selectedUser} company={company} /> */}

				{sections.map(({ name, content }, index) => (
					<BoxCard key={name}>
						{index === 0 ? (
							<HStack>
								<TextTitle title={name} mt={2} mb={"1em"} />
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
								</HStack>
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
