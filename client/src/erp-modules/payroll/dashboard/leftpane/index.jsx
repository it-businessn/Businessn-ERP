import { Box, HStack, Stack, VStack } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import useActiveEmployees from "hooks/useActiveEmployees";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "services/UserService";
import supportBg from "../../../../assets/support_bg.mp4";
import PayrollUserStatInfo from "../rightpane/PayrollUserStatInfo";
import Announcements from "./Announcements";
import PayrollCard from "./PayrollCard";

const LeftPane = ({
	company,
	closestRecord,
	payGroupSchedule,
	closestRecordIndex,
	selectedUser,
}) => {
	const prevSchedule = payGroupSchedule?.[closestRecordIndex - 1];
	const nextSchedule = payGroupSchedule?.[closestRecordIndex + 1];
	const activeUsers = useActiveEmployees(company);

	const [totalEmployees, setTotalEmployees] = useState(null);

	const navigate = useNavigate();

	const handleClick = (path) => navigate(path);

	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const { data } = await UserService.getAllCompanyUsersCount(company);
				setTotalEmployees(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEmployees();
	}, []);
	const videoRef = useRef(null);

	useEffect(() => {
		const video = videoRef.current;
		if (video) {
			video.playbackRate = 0.2;
		}
	}, []);

	return (
		<HStack w="100%" spacing={"10"} justifyContent="space-between" alignItems="center">
			<Stack spacing={0}>
				<BoxCard borderBottomWidth="1.5px">
					<TextTitle size="lg" color="var(--banner_bg)" title="Support" />
				</BoxCard>
				<Box position="relative" width="100%">
					<Box
						as="video"
						ref={videoRef}
						src={supportBg}
						autoPlay
						loop
						muted
						playsInline
						objectFit="cover"
						w="100%"
						h="100%"
						position="absolute"
						top={0}
						left={0}
						zIndex={0}
					/>
					<Announcements company={company} />
				</Box>
			</Stack>
			<VStack w="50%" spacing="1em" alignItems="start" justifyContent="start" h="100%">
				<BoxCard
					title={"Next Payroll"}
					width="100%"
					bg="white"
					p={0}
					boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
					_hover={{
						transform: "translateY(-4px)",
						boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.15)",
						transition: "all 0.3s ease",
					}}
				>
					<PayrollUserStatInfo
						name={selectedUser?.fullName}
						email={selectedUser?.email}
						payGroupSchedule={payGroupSchedule}
						closestRecord={closestRecord}
						closestRecordIndex={closestRecordIndex}
					/>
				</BoxCard>

				<BoxCard
					h={"380px"}
					width="100%"
					bg="white"
					overflowY="hidden"
					css={tabScrollCss}
					boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
					_hover={{
						transform: "translateY(-4px)",
						boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.15)",
						transition: "all 0.3s ease",
					}}
					p={0}
					title={"Payroll"}
				>
					<PayrollCard
						payGroupSchedule={payGroupSchedule}
						prevSchedule={prevSchedule}
						closestRecord={closestRecord}
						closestRecordIndex={closestRecordIndex}
						nextSchedule={nextSchedule}
						handleClick={handleClick}
						company={company}
					/>
				</BoxCard>

				{/* <BoxCard
					h={"calc(100vh - 580px)"}
					css={tabScrollCss}
					width="100%"
					bg="white"
					overflowY="hidden"
					boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
					_hover={{
						transform: "translateY(-4px)",
						boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.15)",
						transition: "all 0.3s ease",
					}}
				>
					<TextTitle size="lg" color="var(--banner_bg)" title="Payroll actions" mt={2} mb={"1em"} />
					<PayrollActionSection
						company={company}
						selectedPayPeriod={closestRecord?.payPeriod}
						handleClick={handleClick}
						activeUsers={activeUsers}
					/>
				</BoxCard> */}
			</VStack>
		</HStack>
	);
};

export default LeftPane;
