import { HStack, Input, InputGroup, InputRightElement, SimpleGrid, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import PayrollActions from "erp-modules/payroll/workview/paygroup-header-table/PayrollActions";
import { FaSearch } from "react-icons/fa";
import { FiUserCheck, FiUserPlus, FiUserX } from "react-icons/fi";

const ACTIONS = [
	{ key: "add", name: "Add Account", icon: FiUserPlus },
	{ key: "change", name: "Change Account", icon: FiUserCheck },
	{ key: "remove", name: "Remove Account", icon: FiUserX },
];

const BudgetQuickActions = ({ selectedCrew, setShowModal, handleInputChange, accName }) => {
	const handleClick = (val) => {
		if (val === "add") {
			setShowModal(true);
		}
	};

	return (
		<SimpleGrid
			columns={{ base: 1, md: 1, lg: 2 }}
			spacing="4"
			my="4"
			mr="4"
			templateColumns={{ lg: "70% 30%" }}
		>
			<VStack>
				<HStack w={"100%"} spacing={2} justifyContent={"space-between"}>
					<VStack spacing={1} w={"30%"} align={"start"} zIndex={2}>
						<InputGroup
							borderRadius={"10px"}
							border={"1px solid var(--filter_border_color)"}
							fontSize="xs"
							fontWeight="bold"
							size="xs"
						>
							<Input
								_placeholder={{
									color: "var(--nav_color)",
									fontSize: "sm",
								}}
								size="xs"
								name="accName"
								value={accName}
								onChange={(e) => handleInputChange(e.target.value)}
								color={"var(--nav_color)"}
								bg={"var(--primary_bg)"}
								type="text"
								placeholder="Search account"
								pr="4.5rem"
								py="1.1em"
							/>
							<InputRightElement size="xs" children={<FaSearch />} />
						</InputGroup>
					</VStack>
					<PrimaryButton
						name={"Add Account"}
						isDisabled={!selectedCrew}
						size="xs"
						px={0}
						onOpen={() => setShowModal(true)}
					/>
				</HStack>
			</VStack>

			<PayrollActions
				title="Chart of Account Actions"
				handleClick={handleClick}
				actions={ACTIONS}
			/>
		</SimpleGrid>
	);
};
export default BudgetQuickActions;
