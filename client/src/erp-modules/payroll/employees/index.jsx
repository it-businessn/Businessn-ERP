import {
	Avatar,
	Badge,
	Button,
	Checkbox,
	HStack,
	SimpleGrid,
	Spacer,
	VStack,
} from "@chakra-ui/react";
import RadioButtonGroup from "components/ui/tab/RadioButtonGroup";
import TextTitle from "components/ui/text/TextTitle";
import SearchFilter from "erp-modules/sales/lead docket/SearchFilter";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { generateLighterShade } from "utils";
import BalanceInfo from "./info/BalanceInfo";
import BankingInfo from "./info/BankingInfo";
import EmploymentInfo from "./info/EmploymentInfo";
import GovernmentInfo from "./info/GovernmentInfo";
import PayInfo from "./info/PayInfo";
import ProfileInfo from "./info/ProfileInfo";

const Employees = () => {
	const [employee, setEmployee] = useState(null || "jk");

	const SETUP_LIST = [
		{
			id: 0,
			type: "Pay",
			name: <PayInfo />,
		},
		{
			id: 1,
			type: "Info",

			name: <ProfileInfo />,
		},
		{
			id: 2,
			type: "Employment",

			name: <EmploymentInfo />,
		},
		{
			id: 3,
			type: "Government",

			name: <GovernmentInfo />,
		},
		{
			id: 4,
			type: "Banking",

			name: <BankingInfo />,
		},
		{
			id: 5,
			type: "Balances",

			name: <BalanceInfo />,
		},
	];
	const [viewMode, setViewMode] = useState(SETUP_LIST[0].type);
	const showComponent = (viewMode) =>
		SETUP_LIST.find(({ type }) => type === viewMode)?.name;

	return (
		<PageLayout title={"Employees"}>
			<HStack spacing="1em" mt="1em" justifyContent={"space-between"}>
				<HStack spacing="1em" mt="1em" justifyContent={"space-between"}>
					<Avatar
						// onClick={handleToggle}
						name={employee}
						src=""
						boxSize="15"
					/>
					<VStack spacing={0} align={"start"}>
						<TextTitle size="sm" title={"User name"} />
						<TextTitle size="xs" weight="normal" title={"45677"} />
						<Badge bg="var(--correct_ans)" color="var(--primary_bg)">
							Active
						</Badge>
					</VStack>
				</HStack>
				<Spacer />
				<VStack spacing={0} w={"30%"} align={"start"}>
					<SearchFilter hideFilter placeholder="Search Employee" />
					<Checkbox
						colorScheme={"facebook"}
						// isChecked={hasChecklist}
						// onChange={() => setHasChecklist(!hasChecklist)}
					>
						Terminated
					</Checkbox>
				</VStack>
			</HStack>

			<HStack
				spacing="1em"
				mt="1em"
				justifyContent={"space-between"}
				w={"100%"}
			>
				<SimpleGrid
					columns={{ base: 4, lg: 6 }}
					spacing="1em"
					my="5"
					bg={"var(--primary_bg)"}
					borderRadius={"20px"}
					p={"8px"}
				>
					{SETUP_LIST.map((_) => (
						<RadioButtonGroup
							key={_.id}
							name={_.type}
							selectedFilter={viewMode}
							handleFilterClick={(name) => setViewMode(name)}
						/>
					))}
				</SimpleGrid>

				<Button
					borderRadius={"50px"}
					border={"1px"}
					w={"17%"}
					color={"var(--tab_radio)"}
					bgColor={generateLighterShade("#537eee", 0.8)}
					// onClick={() => handleFilterClick(name)}
					variant={"outline"}
					leftIcon={<FaSearch />}
				>
					Search here
				</Button>
			</HStack>
			{showComponent(viewMode)}
		</PageLayout>
	);
};

export default Employees;
