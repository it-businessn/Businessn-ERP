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
import Loader from "components/Loader";
import SectionLayout from "components/ui/SectionLayout";
import LeftIconButton from "components/ui/button/LeftIconButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import SelectList from "components/ui/form/select/SelectList";
import TableLayout from "components/ui/table/TableLayout";
import { useEffect, useState } from "react";
import { FaRegTrashAlt, FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";
import { useBreakpointValue } from "services/Breakpoint";
import LeadsService from "services/LeadsService";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import { formatDate, isManager, toCapitalize } from "utils";
import Caption from "../lead docket/Caption";
import SearchFilter from "../lead docket/SearchFilter";
import { OPP_COLUMNS } from "../lead docket/data";
import AddNewOpportunity from "./AddNewOpportunity";
import { LEAD_STAGES } from "./data";

const Opportunities = () => {
	const { isMobile, isIpad } = useBreakpointValue();
	const [isAdded, setIsAdded] = useState(false);

	const [opportunities, setOpportunities] = useState(null);
	const [assignees, setAssignees] = useState(null);
	const user = LocalStorageService.getItem("user");
	const [company, setCompany] = useState(
		LocalStorageService.getItem("selectedCompany"),
	);

	useEffect(() => {
		const handleSelectedCompanyChange = (event) => setCompany(event.detail);

		document.addEventListener(
			"selectedCompanyChanged",
			handleSelectedCompanyChange,
		);

		return () => {
			document.removeEventListener(
				"selectedCompanyChanged",
				handleSelectedCompanyChange,
			);
		};
	}, []);
	useEffect(() => {
		const fetchAllSalesAgents = async () => {
			try {
				const response = await UserService.getAllSalesAgents(company);
				response.data.forEach((item) => (item.name = item.fullName));
				setAssignees(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchAllSalesAgents();
	}, [company]);

	const fetchAllOpportunities = async () => {
		try {
			const response = await LeadsService.getOpportunities(company);
			const leadList = isManager(user?.role)
				? response.data
				: response.data?.filter(
						(item) =>
							(item.primaryAssignee?.length > 0 &&
								item.primaryAssignee.find((_) => _.name === user?.fullName)) ||
							(item.supervisorAssignee?.length > 0 &&
								item.supervisorAssignee.find((_) => _.name === user?.fullName)),
				  );
			setOpportunities(leadList);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllOpportunities();
	}, [isAdded, company]);

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
				await LeadsService.updateLeadInfo(formData, formData.id);
				fetchAllOpportunities();
			} catch (error) {}
		};
		const updateAgentsLead = async () => {
			try {
				if (formData.primaryAssignee) {
					const agent = assignees.find(
						(agent) => agent.fullName === formData.primaryAssignee[0].name,
					);
					await UserService.updateUserInfoById(
						{ leads: [formData.id] },
						agent._id,
					);
					return;
				}
				if (formData.supervisorAssignee) {
					const agent = assignees.find(
						(agent) => agent.fullName === formData.supervisorAssignee[0].name,
					);
					await UserService.updateUserInfoById(
						{ leads: [formData.id] },
						agent._id,
					);
					return;
				}
			} catch (error) {}
		};
		if (formData.id) {
			updateOpportunity();
		}
		if (formData.primaryAssignee || formData.supervisorAssignee) {
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

	const handleDelete = async (_id) => {
		try {
			await LeadsService.deleteLead({}, _id);
			setIsAdded((prev) => !prev);
		} catch (error) {
			console.error(error);
		}
	};
	const handleClose = () => {
		onClose();
		setShowEditLead(null);
	};
	const handleOpen = () => {
		onOpen();
		setShowEditLead(null);
	};
	return (
		<SectionLayout title="Opportunities">
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
				<Flex>
					<Caption title={"Opportunities"} />
					<Spacer />
					<HStack w={{ lg: "50%" }} spacing={3} justify={"flex-end"}>
						<LeftIconButton
							color={"brand.nav_color"}
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
									color: "brand.nav_color",
									fontSize: "xs",
								}}
								color={"brand.nav_color"}
								bg={"brand.primary_bg"}
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
			{!opportunities && <Loader />}
			{opportunities && (
				<TableLayout isOpportunity cols={OPP_COLUMNS}>
					<Tbody>
						{opportunities?.map((_) => {
							return (
								<Tr key={_._id}>
									<Td>{_.opportunityName}</Td>
									<Td>{toCapitalize(_.name)}</Td>
									<Td>{_.email}</Td>
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
											data={assignees}
										/>
									</Td>
									<Td>{formatDate(_.createdOn)}</Td>
									<Td>{_.isDisbursedConfirmed ? "Yes" : "No"}</Td>
									<Td>
										<HStack>
											<RiEditLine
												cursor={"pointer"}
												onClick={() => setShowEditLead(_)}
											/>
											<FaRegTrashAlt
												cursor={"pointer"}
												onClick={() => handleDelete(_._id)}
											/>
										</HStack>
									</Td>
								</Tr>
							);
						})}
					</Tbody>
				</TableLayout>
			)}
			{(isOpen || showEditLead) && (
				<AddNewOpportunity
					showEditLead={showEditLead}
					assignees={assignees}
					setIsAdded={setIsAdded}
					isOpen={handleOpen}
					onClose={handleClose}
					company={company}
				/>
			)}
		</SectionLayout>
	);
};

export default Opportunities;
