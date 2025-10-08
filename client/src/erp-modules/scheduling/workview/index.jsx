import { Box, Flex, HStack } from "@chakra-ui/react";
import ComingSoon from "components/ComingSoon";
import PrimaryButton from "components/ui/button/PrimaryButton";
import { addDays, startOfWeek } from "date-fns";
import useCrews from "hooks/useCrews";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import { CrewFilter } from "./header/CrewFilter";
import { WeekFilter } from "./header/WeekFilter";
import { WorkviewTabs } from "./header/WorkviewTabs";
import WeeklyCalendarView from "./scheduler/WeeklyCalendarView";

const ScheduleWorkView = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const TAB_VIEW = {
		WEEK: "weekly",
		DAILY: "daily",
	};
	const [timeFormat, setTimeFormat] = useState("12");
	const [view, setView] = useState(TAB_VIEW.WEEK);
	const [employeesList, setEmployeesList] = useState(null);
	const { crews, selectedCrew, setSelectedCrew } = useCrews(company);
	const [location, setLocation] = useState(null);
	const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));

	useEffect(() => {
		if (selectedCrew) {
			const record = crews?.find((crew) => crew.name === selectedCrew);
			// setConfigCC(record?.config?.costCenter);
			setEmployeesList(record?.config?.employee);
			setLocation(selectedCrew?.includes("Golf") ? "Golf course" : selectedCrew);
		}
	}, [selectedCrew]);

	const handleRepeat = () => {};

	return (
		<PageLayout title="">
			<Flex justify="space-between" alignItems="center" mb={3}>
				<CrewFilter
					crews={crews}
					selectedCrew={selectedCrew}
					setSelectedCrew={setSelectedCrew}
					timeFormat={timeFormat}
					setTimeFormat={setTimeFormat}
				/>
				<WeekFilter weekStart={weekStart} setWeekStart={setWeekStart} />
				<HStack alignItems="center">
					<PrimaryButton
						bg="var(--empName_bg)"
						onOpen={handleRepeat}
						size={"sm"}
						name="Repeat Schedule"
					/>
					<WorkviewTabs />
				</HStack>
			</Flex>

			{view === TAB_VIEW.WEEK && (
				<WeeklyCalendarView
					timeFormat={timeFormat}
					weekStart={weekStart}
					weekEnd={addDays(weekStart, 6)}
					company={company}
					location={location}
					selectedCrew={selectedCrew}
					employeesList={employeesList}
				/>
			)}
			{view === TAB_VIEW.DAILY && (
				<Box mt={4} textAlign="center">
					<ComingSoon message="Daily view coming soon" />
				</Box>
			)}
		</PageLayout>
	);
};

export default ScheduleWorkView;
