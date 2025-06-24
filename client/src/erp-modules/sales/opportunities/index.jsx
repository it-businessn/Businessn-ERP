import {
	Flex,
	HStack,
	Input,
	InputGroup,
	InputLeftElement,
	Spacer,
	Tbody,
	Td,
	Tr,
	useDisclosure,
} from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import SelectList from "components/ui/form/select/SelectList";
import TableLayout from "components/ui/table/TableLayout";

import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import Pagination from "components/ui/Pagination";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import useCompany from "hooks/useCompany";
import useManager from "hooks/useManager";
import useSalesAgentData from "hooks/useSalesAgentData";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { FaRegTrashAlt, FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";
import { useBreakpointValue } from "services/Breakpoint";
import LeadsService from "services/LeadsService";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import { isManager } from "utils";
import { formatDate } from "utils/convertDate";
import Caption from "../lead docket/Caption";
import SearchFilter from "../lead docket/SearchFilter";
import { OPPORTUNITY_COLUMNS } from "../lead docket/data";
import AddNewOpportunity from "./AddNewOpportunity";
import { LEAD_STAGES } from "./data";

const Opportunities = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const loggedInUser = LocalStorageService.getItem("user");
	const { isMobile, isIpad } = useBreakpointValue();
	const [isAdded, setIsAdded] = useState(false);

	const [opportunities, setOpportunities] = useState(null);
	const assignees = useSalesAgentData(company, false, true);
	const [refresh, setRefresh] = useState(false);
	const managers = useManager(company);
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

	const fetchAllOpportunities = async () => {
		try {
			const { data } = await LeadsService.getOpportunities(company, filter, {
				page: pageNum,
				limit,
			});
			const { totalPages, page, items } = data;
			const leadList = isManager(loggedInUser?.role)
				? items
				: items?.filter(
						(item) =>
							(item.primaryAssignee?.length > 0 &&
								item.primaryAssignee.find(({ name }) => name === loggedInUser?.fullName)) ||
							(item.supervisorAssignee?.length > 0 &&
								item.supervisorAssignee.find(({ name }) => name === loggedInUser?.fullName)),
				  );
			setOpportunities(leadList);
			setTotalPages(totalPages > 0 ? totalPages : 1);
			setPageNum(page);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllOpportunities();
	}, [isAdded, pageNum]);

	const [formData, setFormData] = useState({
		id: null,
		stage: "",
		primaryAssignee: null,
		supervisorAssignee: null,
		companyName: company,
	});

	useEffect(() => {
		const updateOpportunity = async () => {
			try {
				await LeadsService.updateLeadInfo(formData, formData?.id);
				fetchAllOpportunities();
			} catch (error) {}
		};
		const updateAgentsLead = async () => {
			try {
				if (formData?.primaryAssignee) {
					const agent = assignees.find(
						(agent) => agent.fullName === formData?.primaryAssignee[0].name,
					);
					await UserService.updateUserInfoById({ leads: [formData?.id] }, agent._id);
					return;
				}
				if (formData?.supervisorAssignee) {
					const agent = assignees.find(
						(agent) => agent.fullName === formData?.supervisorAssignee[0].name,
					);
					await UserService.updateUserInfoById({ leads: [formData?.id] }, agent._id);
					return;
				}
			} catch (error) {}
		};
		if (formData?.id) {
			updateOpportunity();
		}
		if (formData?.primaryAssignee || formData?.supervisorAssignee) {
			updateAgentsLead();
		}
	}, [formData]);

	const handleSelect = (type, value, id) => {
		const opportunity = opportunities.find(({ _id }) => _id === id);

		if (type === "stage") {
			setFormData((prevData) => ({
				...prevData,
				id,
				stage: value,
				primaryAssignee: opportunity.primaryAssignee,
				supervisorAssignee: opportunity.supervisorAssignee,
			}));
		}
		if (type === "primaryAssignee") {
			setFormData((prevData) => ({
				...prevData,
				id,
				stage: opportunity.stage,
				primaryAssignee: [{ name: value }],
				supervisorAssignee: opportunity.supervisorAssignee,
				isDisbursed: true,
				isDisbursedConfirmed: true,
			}));
		}
		if (type === "supervisorAssignee") {
			setFormData((prevData) => ({
				...prevData,
				id,
				stage: opportunity.stage,
				primaryAssignee: opportunity.primaryAssignee,
				supervisorAssignee: [{ name: value }],
				isDisbursed: true,
				isDisbursedConfirmed: true,
			}));
		}
	};
	const { isOpen, onOpen, onClose } = useDisclosure();
	const createOpportunity = () => (
		<PrimaryButton onOpen={handleOpen} name={"Add new lead"} size={"xs"} />
	);
	const [showEditLead, setShowEditLead] = useState(null);
	const [deleteRecord, setDeleteRecord] = useState(false);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

	const handleDelete = async () => {
		try {
			await LeadsService.deleteLead({}, deleteRecord);
			setIsAdded((prev) => !prev);
			setShowConfirmationPopUp(true);
		} catch (error) {
			console.error(error);
		}
	};

	const handleClose = () => {
		onClose();
		setShowEditLead(null);
		setShowConfirmationPopUp(false);
	};

	const handleOpen = () => {
		onOpen();
		setShowEditLead(null);
	};
	return (
		<PageLayout width="full" title="Opportunities" showBgLayer>
			{isMobile || isIpad ? (
				<Flex flexDir="column">
					<Flex justify="space-between">
						<Caption title={"Opportunities"} />
						{createOpportunity()}
					</Flex>
					<HStack spacing="1em" mt="1em">
						<SearchFilter />
					</HStack>
				</Flex>
			) : (
				<Flex pb={0}>
					<Caption title={"Opportunities"} />
					<Spacer />
					<HStack w={{ lg: "50%" }} spacing={3} justify={"flex-end"}>
						<LeftIconButton
							color={"var(--nav_color)"}
							border={"2px solid var(--filter_border_color)"}
							name={"Filter"}
							borderRadius={"10px"}
							variant={"ghost"}
							isFilter
							size="xs"
							ml={2}
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
						{createOpportunity()}
					</HStack>
				</Flex>
			)}

			<TableLayout
				isOpportunity
				cols={OPPORTUNITY_COLUMNS}
				height="calc(100vh - 240px)"
				css={tabScrollCss}
			>
				<Tbody>
					{(!opportunities || opportunities?.length === 0) && (
						<EmptyRowRecord data={opportunities} colSpan={OPPORTUNITY_COLUMNS?.length} />
					)}
					{opportunities?.map((_) => {
						return (
							<Tr key={_._id}>
								<Td py={"0.5em"}>
									<NormalTextTitle
										width="200px"
										size="xs"
										whiteSpace="wrap"
										textTransform={"capitalize"}
										title={_.opportunityName}
									/>
								</Td>
								<Td py={"0.5em"}>
									<NormalTextTitle
										width="200px"
										size="sm"
										whiteSpace="wrap"
										textTransform={"capitalize"}
										title={_.name}
									/>
								</Td>
								<Td py={"0.5em"}>
									<NormalTextTitle width="200px" whiteSpace="wrap" size="sm" title={_.email} />
								</Td>
								<Td p={0}>
									<SelectList
										id={_._id}
										code="abbr"
										selectedValue={_.stage}
										handleSelect={handleSelect}
										type="stage"
										data={LEAD_STAGES}
									/>
								</Td>
								<Td p={0} pl={2}>
									<SelectList
										id={_._id}
										code="fullName"
										selectedValue={_.primaryAssignee?.[0]?.name}
										type="primaryAssignee"
										handleSelect={handleSelect}
										data={assignees}
									/>
								</Td>
								<Td p={0} pl={2}>
									<SelectList
										id={_._id}
										code="fullName"
										selectedValue={_.supervisorAssignee?.[0]?.name}
										type="supervisorAssignee"
										handleSelect={handleSelect}
										data={managers}
									/>
								</Td>
								<Td py={"0.5em"}>
									<NormalTextTitle width="120px" size="sm" title={formatDate(_.createdOn)} />
								</Td>
								<Td py={"0.5em"}>{_.isDisbursedConfirmed ? "Yes" : "No"}</Td>
								<Td py={"0.5em"}>
									<HStack>
										<RiEditLine cursor={"pointer"} onClick={() => setShowEditLead(_)} />
										<FaRegTrashAlt
											cursor={"pointer"}
											onClick={() => {
												setShowConfirmationPopUp(true);
												setDeleteRecord(_._id);
											}}
										/>
									</HStack>
								</Td>
							</Tr>
						);
					})}
				</Tbody>
			</TableLayout>
			<Pagination pageNum={pageNum} setPageNum={setPageNum} totalPage={totalPage} />

			{(isOpen || showEditLead) && (
				<AddNewOpportunity
					showEditLead={showEditLead}
					setIsAdded={setIsAdded}
					isOpen={handleOpen}
					onClose={handleClose}
					company={company}
					assignees={assignees}
					managers={managers}
					companies={companies}
					setRefresh={setRefresh}
				/>
			)}
			{showConfirmationPopUp && (
				<DeletePopUp
					headerTitle={"Delete Opportunity"}
					textTitle={"Are you sure you want to delete the opportunity?"}
					isOpen={showConfirmationPopUp}
					onClose={handleClose}
					onOpen={handleDelete}
				/>
			)}
		</PageLayout>
	);
};

export default Opportunities;
