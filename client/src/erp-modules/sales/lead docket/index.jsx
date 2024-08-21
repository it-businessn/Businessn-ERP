import {
	Checkbox,
	Flex,
	HStack,
	Input,
	InputGroup,
	InputLeftElement,
	Spacer,
	Tbody,
	Td,
	Tr,
	useToast,
} from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import LeftIconButton from "components/ui/button/LeftIconButton";
import SelectList from "components/ui/form/select/SelectList";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import TableLayout from "components/ui/table/TableLayout";
import {
	INDUSTRIES,
	LEAD_SOURCES,
	PRODUCTS_SERVICES,
	REGIONS,
} from "erp-modules/project-management/workview/project/data";
import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { FaRegTrashAlt, FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { useNavigate } from "react-router";
import { useBreakpointValue } from "services/Breakpoint";
import LeadsService from "services/LeadsService";
import LocalStorageService from "services/LocalStorageService";
import { formatDate, toCapitalize } from "utils";
import AddOpportunity from "./AddOpportunity";
import Caption from "./Caption";
import Disburse from "./Disburse";
import Region from "./Region";
import SearchFilter from "./SearchFilter";
import { LEAD_DOCKET_COLUMNS } from "./data";

const LeadsDocket = () => {
	const { company } = useCompany(
		LocalStorageService.getItem("selectedCompany"),
	);
	const { isMobile, isIpad } = useBreakpointValue();
	const [leads, setLeads] = useState(null);
	const [allLeadIDs, setAllLeadIDs] = useState([]);
	const toast = useToast();
	const [data, setData] = useState([]);
	const [isRefresh, setIsRefresh] = useState(false);
	const [deleteRecord, setDeleteRecord] = useState(false);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

	const fetchAllLeads = async () => {
		try {
			const response = await LeadsService.getNotDisbursedLeads(company);
			setLeads(response.data);
			setAllLeadIDs(response.data.map((item) => item._id));
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllLeads();
	}, [isRefresh, company]);

	useEffect(() => {
		const addMultipleLeads = async () => {
			try {
				const response = await LeadsService.createMultipleOpportunity({
					newRecord: data,
					companyName: company,
				});
				setLeads(response.data);
				setAllLeadIDs(response.data.map((item) => item._id));
			} catch (error) {
				console.error(error);
			}
		};
		if (data.length > 0) {
			addMultipleLeads();
		}
	}, [data, company]);

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

	const handleDelete = async () => {
		try {
			await LeadsService.deleteLead({}, deleteRecord);
			setIsRefresh((prev) => !prev);
			setShowConfirmationPopUp((prev) => !prev);
		} catch (error) {
			console.error(error);
		}
	};

	const handleDisburse = async (e) => {
		e.preventDefault();
		try {
			await LeadsService.disburseLeads(checkedRows);
			navigate("/sales/leads-disburse");
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

	const handleClose = () => {
		setShowConfirmationPopUp((prev) => !prev);
	};

	return (
		<PageLayout width="full" title={"Lead Docket"} showBgLayer>
			{isMobile ? (
				<Flex flexDir="column">
					<Flex justify="space-between">
						<Caption title={"Lead Docket"} />
						<Disburse
							checkedRows={checkedRows}
							handleDisburse={handleDisburse}
						/>
					</Flex>
					<Region />
					<HStack spacing="1em" my="1em">
						<SearchFilter width={"200px"} />
					</HStack>
					<AddOpportunity company={company} data={data} setData={setData} />
				</Flex>
			) : isIpad ? (
				<Flex flexDir="column">
					<Flex gap={3} mb={"1em"}>
						<Caption title={"Lead Docket"} />
						<Spacer />
						<Disburse
							checkedRows={checkedRows}
							handleDisburse={handleDisburse}
						/>
						<AddOpportunity data={data} setData={setData} company={company} />
					</Flex>
					<Region />
					<HStack spacing="1em" my="1em">
						<SearchFilter width={"200px"} />
					</HStack>
				</Flex>
			) : (
				<HStack spacing={5} justify={"space-between"}>
					<Caption title={"Lead Docket"} />
					<Spacer />
					<HStack spacing={2}>
						<Spacer />
						<Disburse
							checkedRows={checkedRows}
							handleDisburse={handleDisburse}
						/>
						<Region />
						<LeftIconButton
							color={"var(--nav_color)"}
							border={"2px solid var(--filter_border_color)"}
							name={"Filter"}
							borderRadius={"10px"}
							variant={"ghost"}
							isFilter
							size="xs"
							ml={2}
							w={{ lg: "150px" }}
							// handleClick={() => setShowEditDetails(true)}
							icon={<MdOutlineFilterList />}
						/>
						<InputGroup
							size="xs"
							w={"40%"}
							borderRadius={"10px"}
							border={"1px solid var(--filter_border_color)"}
							fontSize="xs"
							fontWeight="bold"
						>
							<InputLeftElement size="xs" children={<FaSearch />} />
							<Input
								w={{ lg: "200px" }}
								size="xs"
								_placeholder={{
									color: "var(--nav_color)",
									fontSize: "xs",
								}}
								color={"var(--nav_color)"}
								bg={"var(--primary_bg)"}
								type="text"
								placeholder="Search here"
								pr="4.5rem"
								py={"1.1em"}
							/>
						</InputGroup>
						<AddOpportunity data={data} setData={setData} company={company} />
					</HStack>
				</HStack>
			)}
			{leads && (
				<TableLayout
					hasMulti
					cols={LEAD_DOCKET_COLUMNS}
					isSmall
					isAllChecked={isAllChecked}
					handleHeaderCheckboxChange={handleHeaderCheckboxChange}
					height={"73vh"}
				>
					<Tbody>
						{!leads?.length && <EmptyRowRecord />}
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
								name,
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
									<Td p={1}>{toCapitalize(name)}</Td>
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
									<Td p={1}>{`${address?.streetNumber || ""} ${
										address?.city || ""
									} ${address?.state || ""} ${address?.country || ""} ${
										address?.postalCode || ""
									}`}</Td>
									<Td p={1}>{formatDate(createdOn)}</Td>
									<Td textAlign={"center"}>
										<FaRegTrashAlt
											cursor={"pointer"}
											onClick={() => {
												setShowConfirmationPopUp(true);
												setDeleteRecord(_id);
											}}
										/>
									</Td>
								</Tr>
							),
						)}
					</Tbody>
				</TableLayout>
			)}
			{showConfirmationPopUp && (
				<DeletePopUp
					headerTitle={"Delete Lead"}
					textTitle={"Are you sure you want to delete the lead record?"}
					isOpen={showConfirmationPopUp}
					onClose={handleClose}
					onOpen={handleDelete}
				/>
			)}
		</PageLayout>
	);
};

export default LeadsDocket;
