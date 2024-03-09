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
import BoxLayout from "components/ui/BoxLayout";
import SelectBox from "components/ui/SelectBox";
import TableLayout from "components/ui/TableLayout";
import TextTitle from "components/ui/TextTitle";
import Loader from "features/Loader";
import {
	INDUSTRIES,
	PRODUCTS_SERVICES,
	PROJECT_ASSIGNEES,
	REGIONS,
	SUPERVISOR_ASSIGNEES,
	WEIGHTING,
} from "features/project/workview/data";
import { useEffect, useState } from "react";
import { FaCaretDown, FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { useBreakpointValue } from "services/Breakpoint";
import LeadsService from "services/LeadsService";
import { formatDate, formatDateTime, generateLighterShade } from "utils";
import { LEAD_STAGES } from "../opportunities/data";

const LeadsDocket = () => {
	const { isMobile } = useBreakpointValue();
	const [leads, setLeads] = useState(null);

	const fetchAllLeads = async () => {
		try {
			const response = await LeadsService.getDisbursedLeads();
			setLeads(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllLeads();
	}, []);

	const [checkedRows, setCheckedRows] = useState([]);
	const toast = useToast();

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
				w={"200px"}
				color={"brand.nav_color"}
				leftIcon={<MdOutlineFilterList />}
				border={"2px solid #d3d3d3"}
				borderRadius={"10px"}
				variant={"ghost"}
				_hover={{ color: "brand.600", bg: "transparent" }}
			>
				Filter
			</Button>
			<InputGroup
				borderRadius={"10px"}
				border={"1px solid #d3d3d3"}
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
			w={{ lg: "400px" }}
			bg={generateLighterShade("#537eee", 0.9)}
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
		<Select
			icon={<Icon as={FaCaretDown} />}
			mt={{ base: "1em", md: 0 }}
			border={"2px solid var(--filter_color)"}
			borderRadius={"10px"}
		>
			{REGIONS.map(({ name, id }) => (
				<option key={id} value={name}>
					{name}
				</option>
			))}
		</Select>
	);

	const caption = () => <TextTitle title={"Lead Disbursement"} />;

	const columns = [
		"Opportunity Name",
		"Leads",
		"Region",
		"Last Login",
		"Role",
		"Address",
		"Weighting",
		"Created On",
		"Stage",
		"Primary Assignee",
		"Supervisor Assignee",
		"Product Service",
	];

	return (
		<BoxLayout title="Lead Disbursement">
			{isMobile ? (
				<Flex flexDir="column">
					<Flex justify="space-between">
						{caption()}
						{showDisburse()}
					</Flex>
					{showRegion()}
					<HStack spacing="1em" mt="1em">
						{showFilterSearchOption()}
					</HStack>
				</Flex>
			) : (
				<Flex>
					{caption()}
					<Spacer />
					<HStack spacing={3}>
						<Spacer />
						{showDisburse()}
						{showRegion()}
						{showFilterSearchOption()}
					</HStack>
				</Flex>
			)}
			{!leads && <Loader />}
			{leads && (
				<TableLayout hasMulti cols={columns} isSmall>
					<Tbody>
						{leads?.map(
							({
								_id,
								address,
								createdOn,
								email,
								industry,
								opportunityName,
								phone,
								primaryAssignee,
								productService,
								region,
								source,
								stage,
								supervisorAssignee,
								isDisbursedConfirmed,
							}) => (
								<Tr key={_id}>
									<Td>
										<Checkbox
											colorScheme="facebook"
											isChecked={
												isDisbursedConfirmed || checkedRows.includes(_id)
											}
											onChange={() => handleCheckboxChange(_id)}
										/>
									</Td>
									<Td p={1}>{opportunityName}</Td>
									<Td p={1}>{opportunityName}</Td>
									<Td p={1}>
										<SelectBox
											code="name"
											selectedValue={region}
											data={REGIONS}
										/>
									</Td>
									<Td p={1}>{formatDateTime(new Date())}</Td>
									<Td p={1}>
										<SelectBox
											code="name"
											selectedValue={industry}
											data={INDUSTRIES}
										/>
									</Td>
									<Td p={1}>{address}</Td>
									<Td p={1}>
										<SelectBox
											code="name"
											selectedValue={source}
											data={WEIGHTING}
										/>
									</Td>
									<Td p={1}>{formatDate(createdOn)}</Td>
									<Td p={1}>
										<SelectBox
											code="abbr"
											selectedValue={stage}
											data={LEAD_STAGES}
										/>
									</Td>
									<Td p={1}>
										<SelectBox
											code="name"
											selectedValue={primaryAssignee[0].name}
											data={PROJECT_ASSIGNEES}
										/>
									</Td>
									<Td p={1}>
										<SelectBox
											code="name"
											selectedValue={supervisorAssignee[0].name}
											data={SUPERVISOR_ASSIGNEES}
										/>
									</Td>
									<Td p={1}>
										<SelectBox
											code="name"
											selectedValue={productService}
											data={PRODUCTS_SERVICES}
										/>
									</Td>
								</Tr>
							),
						)}
					</Tbody>
				</TableLayout>
			)}
		</BoxLayout>
	);
};

export default LeadsDocket;
