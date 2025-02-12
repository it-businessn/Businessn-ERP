import { HStack, VStack, useToast } from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import TimesheetService from "services/TimesheetService";
import { monthDayYear } from "utils/convertDate";

const EmployeeTimeCard = ({ selectedUser, company }) => {
	const [time, setTime] = useState(new Date());

	const toast = useToast();

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const formattedTime = time.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});

	const updateSubmit = async (punch, message) => {
		try {
			await TimesheetService.addTimesheetManual({
				punch,
				company,
				employeeId: selectedUser?._id,
			});
			toast({
				title: message,
				status: "success",
				duration: 1500,
				isClosable: true,
			});
		} catch (error) {
			console.error(error);
			toast({
				title: "Please try again.",
				status: "error",
				duration: 1500,
				isClosable: true,
			});
		}
	};

	return (
		<BoxCard gap={"1em"}>
			<VStack w={"100%"} spacing={3}>
				<LeftIconButton
					size="3em"
					name={
						<VStack p={3}>
							<TextTitle size="2xl" title={formattedTime} />
							<TextTitle title={monthDayYear} />
						</VStack>
					}
					variant="outline"
					colorScheme={"blue"}
					w={"full"}
				/>
				<HStack justify={"space-between"} w={"100%"}>
					<LeftIconButton
						size="xl"
						name={"Clock IN"}
						variant="solid"
						w={"50%"}
						bg={"var(--correct_ans)"}
						_hover={{ color: "var(--main_color)" }}
						handleClick={() => updateSubmit("0", `Clock In successful!`)}
					/>
					<LeftIconButton
						size="xl"
						name={"Break START"}
						variant="solid"
						w={"50%"}
						_hover={{ color: "var(--main_color)" }}
						handleClick={() => updateSubmit("3", `Break Started!`)}
					/>
				</HStack>
				<HStack justify={"space-between"} w={"100%"}>
					<LeftIconButton
						size="xl"
						name={"Clock OUT"}
						variant="solid"
						w={"50%"}
						bg={"var(--incorrect_ans)"}
						_hover={{ color: "var(--main_color)" }}
						handleClick={() => updateSubmit("1", `Clock Out Successful!`)}
					/>
					<LeftIconButton
						size="xl"
						name={"Break END"}
						variant="solid"
						w={"50%"}
						bg={"var(--event_color)"}
						_hover={{ color: "var(--main_color)" }}
						handleClick={() => updateSubmit("2", `Break Ended!`)}
					/>
				</HStack>
			</VStack>
			{/* <PrimaryButton mt={3} name="Add ClockIN" /> */}
		</BoxCard>
	);
};

export default EmployeeTimeCard;
