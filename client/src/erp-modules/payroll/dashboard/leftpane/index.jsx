import { HStack, VStack } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import useActiveEmployees from "hooks/useActiveEmployees";
import { useEffect, useState } from "react";
import { FaBullhorn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserService from "services/UserService";
import PayrollUserStatInfo from "../rightpane/PayrollUserStatInfo";
import Announcements from "./Announcements";
import PayrollActionSection from "./PayrollActionSection";
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

	const runType = closestRecord?.isExtraRun ? "Extra" : "Regular";

	return (
		<HStack w="100%" spacing={"1em"} justifyContent="space-between" alignItems="center">
			<VStack w="50%" spacing={"1em"} alignItems="start" justifyContent="start" h="100%">
				<BoxCard
					width="100%"
					bg="white"
					boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
					_hover={{
						transform: "translateY(-4px)",
						boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.15)",
						transition: "all 0.3s ease",
					}}
				>
					{/* <HStack spacing={0}>
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
					<PayrollUserStatInfo
						name={selectedUser?.fullName}
						email={selectedUser?.email}
						payGroupSchedule={payGroupSchedule}
						closestRecord={closestRecord}
						closestRecordIndex={closestRecordIndex}
					/>
				</BoxCard>
				<BoxCard
					h={"calc(100vh - 370px)"}
					css={tabScrollCss}
					width="100%"
					bg="white"
					boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
					_hover={{
						transform: "translateY(-4px)",
						boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.15)",
						transition: "all 0.3s ease",
					}}
				>
					<HStack mt={2} alignItems="center">
						<FaBullhorn color="var(--dbl_overtime)" />
						<TextTitle size="lg" color="var(--banner_bg)" title={"Notifications"} />
					</HStack>
					<Announcements company={company} />
				</BoxCard>
			</VStack>
			<VStack w="50%" spacing="1em" alignItems="start" justifyContent="start" h="100%">
				<BoxCard
					h={"380px"}
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
					<TextTitle size="lg" color="var(--banner_bg)" title="Payroll" mt={2} mb={"1em"} />
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
				</BoxCard>

				<BoxCard
					h={"calc(100vh - 585px)"}
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
				</BoxCard>
			</VStack>
		</HStack>
	);
};

export default LeftPane;
