import { Box, HStack, VStack } from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import TextTitle from "components/ui/text/TextTitle";
import moment from "moment";
import { useEffect, useState } from "react";

const TimeCard = () => {
	const [time, setTime] = useState(new Date());
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
	const formattedDate = moment(new Date()).format("MMM DD, YYYY");
	const clockIn = () => console.log("clockIn", time.getTime());
	const clockOut = () => console.log("clockOut", time.getTime());
	const breakStart = () => console.log("breakStart", time.getTime());
	const breakEnd = () => console.log("breakEnd", time.getTime());
	return (
		<Box
			p="1em"
			bg={"brand.primary_bg"}
			border="3px solid var(--main_color)"
			borderRadius="10px"
			fontWeight="bold"
			gap={"1em"}
		>
			<VStack w={"100%"} spacing={3}>
				<LeftIconButton
					size="3em"
					name={
						<VStack p={3}>
							<TextTitle size="2xl" title={formattedTime} />
							<TextTitle title={formattedDate} />
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
						handleClick={clockIn}
					/>
					<LeftIconButton
						size="xl"
						name={"Break START"}
						variant="solid"
						w={"50%"}
						_hover={{ color: "var(--main_color)" }}
						handleClick={breakStart}
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
						handleClick={clockOut}
					/>
					<LeftIconButton
						size="xl"
						name={"Break END"}
						variant="solid"
						w={"50%"}
						bg={"var(--event_color)"}
						_hover={{ color: "var(--main_color)" }}
						handleClick={breakEnd}
					/>
				</HStack>
			</VStack>
		</Box>
	);
};

export default TimeCard;
