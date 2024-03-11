import {
	Button,
	Checkbox,
	Flex,
	HStack,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	Select,
	Spacer,
	Tbody,
	Td,
	Tr,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import Loader from "components/Loader";
import PrimaryButton from "components/ui/button/PrimaryButton";
import SectionLayout from "components/ui/SectionLayout";
import SelectList from "components/ui/SelectList";
import TableLayout from "components/ui/TableLayout";
import TextTitle from "components/ui/TextTitle";
import {
	COLORS,
	INDUSTRIES,
	LEAD_SOURCES,
	PRODUCTS_SERVICES,
	REGIONS,
} from "erp-modules/project-management/workview/data";
import { useEffect, useRef, useState } from "react";
import { FaCaretDown, FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { SiMicrosoftexcel } from "react-icons/si";
import { useNavigate } from "react-router";
import { useBreakpointValue } from "services/Breakpoint";
import LeadsService from "services/LeadsService";
import { formatDate, generateLighterShade } from "utils";

const LeadsDocket = () => {
	const { isMobile, isIpad } = useBreakpointValue();
	const [leads, setLeads] = useState(null);
	const [allLeadIDs, setAllLeadIDs] = useState([]);
	const toast = useToast();

	const fetchAllLeads = async () => {
		try {
			const response = await LeadsService.getOpportunities();
			setLeads(response.data);
			setAllLeadIDs(response.data.map((item) => item._id));
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllLeads();
	}, []);

	const [checkedRows, setCheckedRows] = useState([]);
	const [isAllChecked, setIsAllChecked] = useState(false);

	const handleCheckboxChange = (rowId) => {
		if (checkedRows.includes(rowId)) {
			setCheckedRows(checkedRows.filter((id) => id !== rowId));
		} else {
			setCheckedRows([...checkedRows, rowId]);
		}
	};

	const handleHeaderCheckboxChange = (e) => {
		setIsAllChecked(e.target.checked);
		if (e.target.checked) setCheckedRows(allLeadIDs);
		if (!e.target.checked) setCheckedRows([]);
	};
	const navigate = useNavigate();
	const handleDisburse = async (e) => {
		e.preventDefault();
		try {
			await LeadsService.disburseLeads(checkedRows);
			// toast({
			// 	title: "Leads disbursed",
			// 	description:
			// 		"Leads has been successfully distributed among team members",
			// 	status: "success",
			// 	duration: 3000,
			// 	isClosable: true,
			// });
			navigate("/leads-disburse");
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
				border={"2px solid var(--filter_border_color)"}
				borderRadius={"10px"}
				variant={"ghost"}
				_hover={{ color: "brand.600", bg: "transparent" }}
			>
				Filter
			</Button>
			<InputGroup
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
			isDisabled={checkedRows.length === 0}
			w={{ lg: "400px" }}
			bg={generateLighterShade(COLORS.primary, 0.9)}
			color={"var(--primary_button_bg)"}
			variant={"outlined"}
			_hover={{ color: "brand.600" }}
			borderRadius={"10px"}
			border={`1px solid var(--primary_button_bg)`}
			onClick={handleDisburse}
		>
			Disburse Selected
		</Button>
	);

	const showRegion = () => (
		<Select
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
	);

	const caption = () => <TextTitle title={"Lead Docket"} />;

	const columns = [
		"Opportunity name",
		"Abbr",
		"Company name",
		"Region",
		"Industry",
		"Product Service",
		"Source",
		"Address",
		"Created On",
	];

	const { isOpen, onOpen, onClose } = useDisclosure();
	const fileInputRef = useRef(null);

	const handleIconButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};
	const handleFileUpload = (event) => {
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = (e) => {
				// try {
				// 	const workbook = XLSX.read(e.target.result, { type: "binary" });
				// 	const sheetName = workbook.SheetNames[0];
				// 	const excelData = XLSX.utils.sheet_to_json(
				// 		workbook.Sheets[sheetName],
				// 	);
				// 	const formattedData = excelData.map((row) => ({
				// 		...row,
				// 		selected: false,
				// 	}));
				// 	setData(formattedData);
				// 	// setData(excelData);
				// 	toast({
				// 		title: "File Uploaded",
				// 		description: "Excel sheet data has been loaded successfully.",
				// 		status: "success",
				// 		duration: 3000,
				// 		isClosable: true,
				// 	});
				// } catch (error) {
				// 	console.error("Error reading the Excel file:", error);
				// 	toast({
				// 		title: "Error",
				// 		description: "There was an error reading the Excel file.",
				// 		status: "error",
				// 		duration: 3000,
				// 		isClosable: true,
				// 	});
				// }
			};

			reader.readAsBinaryString(file);
		}
	};
	const createOpportunity = () => (
		<HStack justify={"flex-end"}>
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileUpload}
				accept=".xlsx, .xls"
				style={{ display: "none" }}
			/>
			<PrimaryButton onOpen={onOpen} name={"Add new lead"} />
			<IconButton
				icon={<SiMicrosoftexcel />}
				bg="var(--primary_button_bg)"
				variant={"solid"}
				aria-label="Attach Excel file"
				onClick={handleIconButtonClick}
			/>
		</HStack>
	);
	return (
		<SectionLayout title="Lead Docket">
			{isMobile ? (
				<Flex flexDir="column">
					<Flex justify="space-between">
						{caption()}
						{showDisburse()}
					</Flex>
					{showRegion()}
					<HStack spacing="1em" my="1em">
						{showFilterSearchOption()}
					</HStack>
					{createOpportunity()}
				</Flex>
			) : isIpad ? (
				<Flex flexDir="column">
					<Flex gap={3} mb={"1em"}>
						{caption()}
						<Spacer />
						{showDisburse()}
						{createOpportunity()}
					</Flex>
					{showRegion()}
					<HStack spacing="1em" my="1em">
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
						{createOpportunity()}
					</HStack>
				</Flex>
			)}
			{!leads && <Loader />}
			{leads && (
				<TableLayout
					hasMulti
					cols={columns}
					isSmall
					isAllChecked={isAllChecked}
					handleHeaderCheckboxChange={handleHeaderCheckboxChange}
				>
					<Tbody>
						{leads?.map(
							({
								_id,
								address,
								createdOn,
								companyName,
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
								isDisbursed,
								abbreviation,
							}) => (
								<Tr key={_id}>
									<Td>
										<Checkbox
											colorScheme="facebook"
											isChecked={checkedRows.includes(_id)}
											onChange={() => handleCheckboxChange(_id)}
										/>
									</Td>
									<Td p={1}>{opportunityName}</Td>
									<Td p={1}>{abbreviation}</Td>
									<Td p={1}>{companyName}</Td>
									<Td p={1}>
										<SelectList
											code="name"
											selectedValue={region}
											data={REGIONS}
										/>
									</Td>
									<Td p={1}>
										<SelectList
											code="name"
											selectedValue={industry}
											data={INDUSTRIES}
										/>
									</Td>
									<Td p={1}>
										<SelectList
											code="name"
											selectedValue={productService}
											data={PRODUCTS_SERVICES}
										/>
									</Td>
									<Td p={1}>
										<SelectList
											code="name"
											selectedValue={source}
											data={LEAD_SOURCES}
										/>
									</Td>
									<Td p={1}>{address}</Td>
									<Td p={1}>{formatDate(createdOn)}</Td>
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
