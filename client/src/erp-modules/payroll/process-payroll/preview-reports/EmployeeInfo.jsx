import { Box, HStack, Stack, VStack } from "@chakra-ui/react";
import Logo from "components/logo";
import TextTitle from "components/ui/text/TextTitle";
import { formatDateBar } from "utils";
import logoImg from "../../../../assets/coverImgPaystub.png";

const EmployeeInfo = ({ data }) => {
	return (
		<VStack
			spacing={1}
			textAlign={"center"}
			alignItems="center"
			py={5}
			minH={"78vh"}
			w={"30%"}
			position="relative"
		>
			<Box
				position="absolute"
				top={0}
				left={0}
				width="100%"
				height="100%"
				backgroundImage={logoImg}
				backgroundSize="cover"
				backgroundPosition="center"
				backgroundColor="var(--lead_cards_border)"
				backgroundBlendMode="overlay"
				zIndex={1}
				filter={"opacity(0.2)"}
			>
				<Stack mt={10}>
					<Logo isCover isForgotPassword />
				</Stack>
			</Box>
			<Box w={"80%"} mt={"10em"}>
				<TextTitle size={"xl"} title={data.empId.fullName} />
				<HStack
					mx={"auto"}
					w={"70%"}
					mt={5}
					backgroundColor="var(--filter_border_color)"
				>
					<TextTitle align="left" title={"Net Pay:"} size={"lg"} />
					<TextTitle
						align="center"
						title={`$${data.currentNetPay.toFixed(2)}`}
						size={"lg"}
					/>
				</HStack>
				<HStack
					mx={"auto"}
					w={"70%"}
					backgroundColor="var(--filter_border_color)"
				>
					<TextTitle align="left" title={"Pay Date:"} size={"lg"} />
					<TextTitle
						align="center"
						title={formatDateBar(data.payPeriodPayDate)}
						size={"lg"}
					/>
				</HStack>
				<HStack
					w={"70%"}
					mt={12}
					mx={"auto"}
					backgroundColor="var(--filter_border_color)"
				>
					<TextTitle align="left" title={"Employee#:"} size={"lg"} />
					<TextTitle align="center" title={data.empId.employeeId} size={"lg"} />
				</HStack>
				<HStack
					w={"70%"}
					mx={"auto"}
					backgroundColor="var(--filter_border_color)"
				>
					<TextTitle align="left" title={"Company#:"} size={"lg"} />
					<TextTitle align="center" title={"NA"} size={"lg"} />
				</HStack>
				<HStack
					w={"70%"}
					mt={8}
					mx={"auto"}
					spacing={0}
					backgroundColor="var(--filter_border_color)"
				>
					<TextTitle
						border={"1px solid black"}
						align="left"
						title={"Pay Period #:"}
						size={"lg"}
						weight="normal"
					/>
					<TextTitle
						border={"1px solid black"}
						align="center"
						weight="normal"
						title={data.payPeriodNum}
						size={"lg"}
						borderLeftWidth={0}
					/>
				</HStack>
				<HStack
					border={"1px solid black"}
					borderTopWidth={0}
					w={"70%"}
					mx={"auto"}
					backgroundColor="var(--filter_border_color)"
				>
					<TextTitle
						weight="normal"
						align="center"
						title={`${formatDateBar(data.payPeriodStartDate)} - ${formatDateBar(
							data.payPeriodEndDate,
						)}`}
						size={"lg"}
					/>
				</HStack>
			</Box>
		</VStack>
	);
};

export default EmployeeInfo;
