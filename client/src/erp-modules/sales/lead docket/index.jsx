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
import NormalTextTitle from "components/ui/NormalTextTitle";
import Pagination from "components/ui/Pagination";
import LeftIconButton from "components/ui/button/LeftIconButton";
import SelectList from "components/ui/form/select/SelectList";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import TableLayout from "components/ui/table/TableLayout";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
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
import { getFormattedAddress } from "utils/common";
import { formatDate } from "utils/convertDate";
import AddOpportunity from "./AddOpportunity";
import Caption from "./Caption";
import Disburse from "./Disburse";
import Region from "./Region";
import SearchFilter from "./SearchFilter";
import { LEAD_DOCKET_COLUMNS } from "./data";

const LeadsDocket = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const { isMobile, isIpad } = useBreakpointValue();
	const [leads, setLeads] = useState(null);
	const [allLeadIDs, setAllLeadIDs] = useState([]);
	const toast = useToast();
	const [data, setData] = useState([]);
	const [isRefresh, setIsRefresh] = useState(false);
	const [deleteRecord, setDeleteRecord] = useState(false);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [companies, setCompanies] = useState(null);
	const [filter, setFilter] = useState(null);
	const [pageNum, setPageNum] = useState(1);
	const [totalPage, setTotalPages] = useState(1);
	const limit = 30;

	useEffect(() => {
		const fetchAllCompanies = async () => {
			try {
				const { data } = await LeadsService.getLeadCompanies(company);
				setCompanies(data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchAllCompanies();
	}, [refresh]);

	const fetchAllLeads = async () => {
		try {
			const { data } = await LeadsService.getNotDisbursedLeads(company, filter, {
				page: pageNum,
				limit,
			});
			const { totalPages, page, items } = data;
			setLeads(items);
			setAllLeadIDs(items?.map((item) => item._id));
			setTotalPages(totalPages > 0 ? totalPages : 1);
			setPageNum(page);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllLeads();
	}, [isRefresh, pageNum]);

	useEffect(() => {
		const addMultipleLeads = async () => {
			try {
				const { data } = await LeadsService.createMultipleOpportunity({
					newRecord: data,
					companyName: company,
				});
				setLeads(data);
				setAllLeadIDs(data.map((item) => item._id));
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
	const AddOpportunityForm = () => (
		<AddOpportunity
			data={data}
			setData={setData}
			company={company}
			companies={companies}
			setRefresh={setRefresh}
		/>
	);

	return (
		<PageLayout width="full" title="Lead Docket" showBgLayer>
			{isMobile ? (
				<Flex flexDir="column">
					<Flex justify="space-between">
						<Caption title={"Lead Docket"} />
						<Disburse checkedRows={checkedRows} handleDisburse={handleDisburse} />
					</Flex>
					<Region />
					<HStack spacing="1em" my="1em">
						<SearchFilter width={"200px"} />
					</HStack>
					<AddOpportunityForm />
				</Flex>
			) : isIpad ? (
				<Flex flexDir="column">
					<Flex gap={3} mb={"1em"}>
						<Caption title={"Lead Docket"} />
						<Spacer />
						<Disburse checkedRows={checkedRows} handleDisburse={handleDisburse} />
						<AddOpportunityForm />
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
						<Disburse checkedRows={checkedRows} handleDisburse={handleDisburse} />
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
						<AddOpportunityForm />
					</HStack>
				</HStack>
			)}
			<TableLayout
				hasMulti
				cols={LEAD_DOCKET_COLUMNS}
				isSmall
				isAllChecked={isAllChecked}
				handleHeaderCheckboxChange={handleHeaderCheckboxChange}
				height="calc(100vh - 238px)"
				css={tabScrollCss}
			>
				<Tbody>
					{(!leads || leads?.length === 0) && (
						<EmptyRowRecord data={leads} colSpan={LEAD_DOCKET_COLUMNS?.length} />
					)}
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
								<Td py={0}>
									<Checkbox
										colorScheme="facebook"
										isChecked={checkedRows.includes(_id)}
										onChange={() => handleCheckboxChange(_id)}
									/>
								</Td>
								<Td p={0.5}>
									<NormalTextTitle
										width="250px"
										size="xs"
										whiteSpace="wrap"
										textTransform={"capitalize"}
										title={opportunityName}
									/>
								</Td>
								<Td p={0.5}>
									<NormalTextTitle
										width="200px"
										size="sm"
										whiteSpace="wrap"
										textTransform={"capitalize"}
										title={name}
									/>
								</Td>
								<Td p={0.5}>
									<SelectList code="name" selectedValue={region} data={REGIONS} />
								</Td>
								<Td p={0.5}>
									<SelectList code="name" selectedValue={industry} data={INDUSTRIES} />
								</Td>
								<Td p={0.5}>
									<SelectList code="name" selectedValue={productService} data={PRODUCTS_SERVICES} />
								</Td>
								<Td p={0.5}>
									<SelectList code="name" selectedValue={source} data={LEAD_SOURCES} />
								</Td>
								<Td p={0.5}>
									<NormalTextTitle
										whiteSpace={"wrap"}
										size="sm"
										title={getFormattedAddress(address)}
									/>
								</Td>
								<Td p={0.5}>{formatDate(createdOn)}</Td>
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
			<Pagination pageNum={pageNum} setPageNum={setPageNum} totalPage={totalPage} />

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
