import {
	Button,
	Checkbox,
	Flex,
	HStack,
	Icon,
	Input,
	InputGroup,
	InputLeftElement,
	Select,
	Spacer,
	Tbody,
	Td,
	Tr,
	useToast,
} from "@chakra-ui/react";
import Loader from "components/Loader";
import SectionLayout from "components/ui/SectionLayout";
import SelectList from "components/ui/SelectList";
import TableLayout from "components/ui/TableLayout";
import TextTitle from "components/ui/TextTitle";
import {
	AREAS,
	COLORS,
	DISBURSE_MODE_OPTIONS,
	PRODUCTS_SERVICES,
	REGIONS,
	WEIGHTING,
} from "erp-modules/project-management/workview/data";
import { useEffect, useState } from "react";
import { FaCaretDown, FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { useBreakpointValue } from "services/Breakpoint";
import LeadsService from "services/LeadsService";
import UserService from "services/UserService";
import { generateLighterShade } from "utils";

const LeadsDocket = () => {
	const { isMobile, isIpad } = useBreakpointValue();
	const [agents, setAgents] = useState(null);

	const fetchAllAgents = async () => {
		try {
			const response = await UserService.getAllUsers();
			setAgents(response.data.filter((user) => user.role.includes("Sales")));
		} catch (error) {
			console.error(error);
		}
	};

	const [leads, setLeads] = useState(null);
	const [checkedRows, setCheckedRows] = useState([]);
	const toast = useToast();
	const [assignedNewWeights, setAssignedNewWeights] = useState([]);
	const [assignedLeadWeights, setAssignedLeadWeights] = useState([]);

	useEffect(() => {
		const fetchAllLeads = async () => {
			try {
				const response = await LeadsService.getDisbursedLeads();
				setLeads(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllLeads();
		fetchAllAgents();
	}, []);

	const handleSelect = (weight, id) => {
		setAssignedNewWeights([
			...assignedNewWeights,
			{ id, weight: parseInt(weight) },
		]);

		updateUserAssignedLeads(
			[...assignedNewWeights, { id, weight: parseInt(weight) }],
			id,
		);
	};

	const updateUserAssignedLeads = async (assignedNewWeights, id) => {
		await UserService.updateUserAssignedLeads(assignedNewWeights, id);
		fetchAllAgents();
	};

	const handleCheckboxChange = (rowId) => {
		if (checkedRows.includes(rowId)) {
			setCheckedRows(checkedRows.filter((id) => id !== rowId));
		} else {
			setCheckedRows([...checkedRows, rowId]);
		}
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
	const showFilterSearchOption = () => (
		<>
			<Button
				w={{ lg: "100px" }}
				color={"brand.nav_color"}
				leftIcon={<MdOutlineFilterList />}
				border={"2px solid var(--filter_border_color)"}
				borderRadius={"10px"}
				variant={"ghost"}
				_hover={{ color: "brand.600", bg: "transparent" }}
			>
				Filter
			</Button>
			<InputGroup
				w={{ lg: "180px" }}
				borderRadius={"10px"}
				border={"1px solid var(--filter_border_color)"}
				fontWeight="bold"
			>
				<InputLeftElement size="xs" children={<FaSearch />} />
				<Input
					_placeholder={{
						color: "brand.nav_color",
					}}
					color={"brand.nav_color"}
					bg={"brand.primary_bg"}
					type="text"
					placeholder="Search here"
				/>
			</InputGroup>
		</>
	);

	const showDisburse = () => (
		<Button
			w={{ lg: "200px" }}
			isDisabled={checkedRows.length === 0}
			bg={generateLighterShade(COLORS.primary, 0.9)}
			color={"var(--primary_button_bg)"}
			variant={"outlined"}
			_hover={{ color: "brand.600" }}
			borderRadius={"10px"}
			border={`1px solid var(--primary_button_bg)`}
			onClick={handleDisburse}
		>
			Confirm Disbursement
		</Button>
	);

	const showRegion = () => (
		<>
			<Select
				w={{ lg: "250px" }}
				icon={<Icon as={FaCaretDown} />}
				mt={{ base: "1em", md: 0 }}
				border={"2px solid var(--filter_border_color)"}
				borderRadius={"10px"}
			>
				{REGIONS.map(({ name, id }) => (
					<option key={id} value={name}>
						{name}
					</option>
				))}
			</Select>
			<Select
				w={{ lg: "300px" }}
				icon={<Icon as={FaCaretDown} />}
				mt={{ base: "1em", md: 0 }}
				border={"2px solid var(--filter_border_color)"}
				borderRadius={"10px"}
			>
				{DISBURSE_MODE_OPTIONS.map(({ name, id }) => (
					<option key={id} value={name}>
						{name}
					</option>
				))}
			</Select>
		</>
	);

	const caption = () => <TextTitle title={"Lead Disbursement"} />;

	const columns = [
		"Active",
		"Name",
		"Leads",
		"Last Login",
		"Role",
		"Address",
		"Areas",
		"Product Service",
		"Weighting",
	];

	return (
		<SectionLayout title="Lead Disbursement">
			{isMobile || isIpad ? (
				<Flex flexDir="column" gap={{ base: 0, md: 3 }}>
					<Flex justify="space-between">
						{caption()}
						{showDisburse()}
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
				<Flex>
					{caption()}
					<Spacer />
					<HStack spacing={3}>
						{showDisburse()}
						{showRegion()}
						{showFilterSearchOption()}
					</HStack>
				</Flex>
			)}
			{!agents && <Loader />}
			{agents && (
				<TableLayout cols={columns} isSmall>
					<Tbody>
						{agents?.map(
							({
								_id,
								isActive,
								lastLogin,
								fullName,
								assignedLeads,
								role,
								address,
								assignedAreas,
								assignedProducts,
								assignedWeight,
							}) => (
								<Tr key={_id}>
									<Td p={1}>
										<Checkbox
											colorScheme="facebook"
											isChecked={isActive || checkedRows.includes(_id)}
											onChange={() => handleCheckboxChange(_id)}
										/>
									</Td>
									<Td p={1}>{fullName}</Td>
									<Td p={1}>
										{/* <SelectList
											isRight
											code="name"
											selectedValue={assignedLeads}
											data={REGIONS}
										/> */}
										{`${assignedLeads || 0} leads`}
									</Td>
									{/* <Td p={1}>{formatDateTime(lastLogin || new Date())}</Td> */}
									<Td p={1}>{"1 hr ago"}</Td>

									<Td p={1}>{role}</Td>
									<Td p={1}>{address}</Td>
									<Td p={1}>
										<SelectList
											code="name"
											selectedValue={assignedAreas}
											data={AREAS}
										/>
									</Td>
									<Td p={1}>
										<SelectList
											code="name"
											selectedValue={assignedProducts}
											data={PRODUCTS_SERVICES}
										/>
									</Td>
									<Td p={1}>
										<SelectList
											id={_id}
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
		</SectionLayout>
	);
};

export default LeadsDocket;
