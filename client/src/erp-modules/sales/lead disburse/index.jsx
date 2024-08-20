import {
	Button,
	Checkbox,
	Flex,
	HStack,
	Spacer,
	Tbody,
	Td,
	Text,
	Tr,
	useToast,
} from "@chakra-ui/react";
import SelectList from "components/ui/form/select/SelectList";
import TableLayout from "components/ui/table/TableLayout";
import {
	AREAS,
	COLORS,
	PRODUCTS_SERVICES,
	WEIGHTING,
} from "erp-modules/project-management/workview/project/data";
import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { FaCaretRight } from "react-icons/fa";
import { useBreakpointValue } from "services/Breakpoint";
import LeadsService from "services/LeadsService";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import { generateLighterShade, timeSpan } from "utils";
import AutoAssign from "./AutoAssign";
import Disburse from "./Disburse";
import { caption, columns, showFilterSearchOption, showRegion } from "./data";

const LeadsDisbursed = () => {
	const { company } = useCompany(
		LocalStorageService.getItem("selectedCompany"),
	);
	const { isMobile, isIpad } = useBreakpointValue();
	const [agents, setAgents] = useState(null);
	const [activity, setActivity] = useState(null);

	const fetchAllUserActivity = async () => {
		try {
			const response = await UserService.getAllUserActivity();
			setActivity(response.data);
		} catch (error) {
			console.error(error);
		}
	};
	const fetchAllAgents = async () => {
		try {
			const response = await UserService.getAllSalesAgents(company);
			if (activity) {
				response.data?.map((agent) => {
					const user = activity?.find((_) => _.userID === agent._id);
					agent.lastLoginStatus = user
						? user?.logoutTime
							? null
							: "Is logged In"
						: "";
					agent.lastLogin = user?.loginTime;
					return agent;
				});
			}
			setAgents(response.data);
			setCheckedRows(response.data.filter((user) => user.isActive === true));
		} catch (error) {
			console.error(error);
		}
	};

	const [leads, setLeads] = useState(null);
	const [checkedRows, setCheckedRows] = useState([]);
	const toast = useToast();

	const [formData, setFormData] = useState({
		_id: null,
		isActive: false,
		assignedAreas: [],
		assignedProducts: [],
		assignedWeight: 0,
	});

	useEffect(() => {
		const fetchAllLeads = async () => {
			try {
				const response = await LeadsService.getDisbursedLeads(company);
				setLeads(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllLeads();
		fetchAllUserActivity();
	}, [company]);

	useEffect(() => {
		fetchAllAgents();
	}, [activity]);

	useEffect(() => {
		const updateUserProfile = async () => {
			try {
				await UserService.updateUserProfile(formData, formData._id);
				fetchAllAgents();
			} catch (error) {}
		};
		if (formData._id) {
			updateUserProfile(formData);
		}
	}, [formData]);

	useEffect(() => {
		const updateUserAssignedLeads = async () => {
			try {
				await UserService.updateUserAssignedLeads(formData, formData._id);
				fetchAllAgents();
			} catch (error) {}
		};
		if (formData._id && formData.assignedWeight) {
			updateUserAssignedLeads(formData);
		}
	}, [formData.assignedWeight]);

	const handleSelect = (type, value, rowId) => {
		const user = agents.find((agent) => agent._id === rowId);
		if (user) {
			setFormData({
				assignedAreas: user?.assignedAreas,
				assignedProducts: user?.assignedProducts,
				assignedWeight: user?.assignedWeight,
			});
		}

		if (type === "areas") {
			setFormData((prev) => {
				if (!prev.assignedAreas.includes(value)) {
					return {
						...prev,
						_id: rowId,
						assignedAreas: [...prev.assignedAreas, value],
					};
				}
				return prev;
			});
		}
		if (type === "product_service") {
			setFormData((prev) => {
				if (!prev.assignedProducts.includes(value)) {
					return {
						...prev,
						_id: rowId,
						assignedProducts: [...prev.assignedProducts, value],
					};
				}
				return prev;
			});
		}
		if (type === "weight") {
			setFormData((prev) => {
				if (prev.assignedWeight === parseInt(value)) {
					return prev;
				}
				return {
					...prev,
					_id: rowId,
					assignedWeight: parseInt(value),
				};
			});
		}
	};

	const handleCheckboxChange = (rowId, checked) => {
		setFormData({ _id: rowId, isActive: checked });
		try {
			if (checkedRows.includes(rowId)) {
				setCheckedRows(checkedRows.filter((id) => id !== rowId));
			} else {
				setCheckedRows([...checkedRows, rowId]);
			}
		} catch (error) {}
	};

	const handleDisburse = async (e) => {
		e.preventDefault();
		try {
			await LeadsService.confirmDisburseLeads(checkedRows);
			toast({
				title: "Leads disbursed",
				description:
					"Leads has been successfully distributed among team members",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			console.error(error);
			toast({
				title: "Error",
				description: "There was an error disbursing the leads",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "top-right",
			});
		}
	};

	return (
		<PageLayout width="full" title={"Lead Disbursement"} showBgLayer>
			<AutoAssign />
			{isMobile || isIpad ? (
				<Flex flexDir="column" gap={{ base: 0, md: 3 }}>
					<Flex justify="space-between">
						{caption()}
						<Disburse
							leads={leads}
							checkedRows={checkedRows}
							handleDisburse={handleDisburse}
						/>
					</Flex>
					{showRegion()}
					<HStack
						justify={{ md: "flex-end" }}
						spacing="1em"
						mt={{ base: "1em", md: 0 }}
					>
						{showFilterSearchOption()}
					</HStack>
				</Flex>
			) : (
				<HStack spacing={5} justify={"space-between"}>
					{caption()}
					<Spacer />
					<HStack spacing={2}>
						<Disburse
							leads={leads}
							checkedRows={checkedRows}
							handleDisburse={handleDisburse}
						/>
						{showRegion()}
						{showFilterSearchOption()}
					</HStack>
				</HStack>
			)}

			{activity && (
				<TableLayout cols={columns} isSmall>
					<Tbody>
						{agents?.map(
							({
								_id,
								isActive,
								lastLogin,
								fullName,
								lastLoginStatus,
								assignedLeads,
								role,
								primaryAddress,
								assignedAreas,
								assignedProducts,
								assignedWeight,
							}) => (
								<Tr key={_id}>
									<Td p={1}>
										<Checkbox
											colorScheme="facebook"
											isChecked={isActive || checkedRows.includes(_id)}
											onChange={(e) =>
												handleCheckboxChange(_id, e.target.checked)
											}
										/>
									</Td>
									<Td p={1}>{fullName}</Td>
									<Td p={1}>
										<Button
											borderRadius={"10px"}
											h={"2.25em"}
											w={"10em"}
											_hover={{ bg: "transparent" }}
											px={3}
											variant={"outline"}
											justifyContent={"space-between"}
											color={"var(--primary_button_bg)"}
											rightIcon={<FaCaretRight />}
											bg={generateLighterShade(COLORS.primary, 0.9)}
											border={`1px solid var(--primary_button_bg)`}
										>{`${assignedLeads} leads`}</Button>
									</Td>
									<Td p={1}>
										{lastLoginStatus ? (
											<Text color={"green"}>{lastLoginStatus}</Text>
										) : lastLogin ? (
											timeSpan(lastLogin)
										) : (
											"Not logged in"
										)}
									</Td>

									<Td p={1}>{role}</Td>
									<Td
										p={1}
									>{`${primaryAddress.streetNumber} ${primaryAddress.city} ${primaryAddress.state} ${primaryAddress.country} ${primaryAddress.postalCode}`}</Td>
									<Td p={1}>
										<SelectList
											id={_id}
											type="areas"
											handleSelect={handleSelect}
											code="name"
											selectedValue={assignedAreas}
											data={AREAS}
										/>
									</Td>
									<Td p={1}>
										<SelectList
											id={_id}
											type="product_service"
											handleSelect={handleSelect}
											code="name"
											selectedValue={assignedProducts}
											data={PRODUCTS_SERVICES}
										/>
									</Td>
									<Td p={1}>
										<SelectList
											id={_id}
											type="weight"
											handleSelect={handleSelect}
											code="name"
											selectedValue={assignedWeight}
											data={WEIGHTING}
										/>
									</Td>
								</Tr>
							),
						)}
					</Tbody>
				</TableLayout>
			)}
		</PageLayout>
	);
};

export default LeadsDisbursed;
