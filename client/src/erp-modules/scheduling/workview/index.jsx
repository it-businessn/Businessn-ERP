import { Box, Flex, HStack, useToast } from "@chakra-ui/react";
import ComingSoon from "components/ComingSoon";
import PrimaryButton from "components/ui/button/PrimaryButton";
import { addDays, addWeeks, startOfWeek } from "date-fns";
import useCrews from "hooks/useCrews";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import SchedulerService from "services/SchedulerService";
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
	const toast = useToast();
	const startDate = startOfWeek(new Date(), { weekStartsOn: 0 });
	const startOfNextWeek = addWeeks(startDate, 1);

	const [employeeShifts, setEmployeeShifts] = useState(null);
	const [timeFormat, setTimeFormat] = useState("12");
	const [view, setView] = useState(TAB_VIEW.WEEK);
	const [employeesList, setEmployeesList] = useState(null);
	const { crews, selectedCrew, setSelectedCrew } = useCrews(company);
	const [location, setLocation] = useState(null);
	const [weekStart, setWeekStart] = useState(startDate);

	useEffect(() => {
		if (selectedCrew) {
			const record = crews?.find((crew) => crew.name === selectedCrew);
			// setConfigCC(record?.config?.costCenter);
			setEmployeesList(record?.config?.employee);
			setLocation(selectedCrew?.includes("Golf") ? "Golf course" : selectedCrew);
		}
	}, [selectedCrew]);

	const handleRepeat = async () => {
		try {
			const { data } = await SchedulerService.repeatWeeklySchedule({
				employeeShifts,
				startOfNextWeek,
				companyName: company,
				crew: selectedCrew,
				location,
			});
			toast({
				title: "Success",
				description: data.message,
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Error",
				description: error?.response?.data?.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

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
						isDisabled={true}
					/>
					<WorkviewTabs />
				</HStack>
			</Flex>

			{view === TAB_VIEW.WEEK && (
				<WeeklyCalendarView
					employeeShifts={employeeShifts}
					setEmployeeShifts={setEmployeeShifts}
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
