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
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { useBreakpointValue } from "services/Breakpoint";
import LeadsService from "services/LeadsService";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import { formatDate, isManager } from "utils";
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

	useEffect(() => {
		const fetchAllSalesAgents = async () => {
			try {
				const response = await UserService.getAllSalesAgents();
				response.data.forEach((item) => (item.name = item.fullName));
				setAssignees(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchAllSalesAgents();
	}, []);

	const fetchAllOpportunities = async () => {
		try {
			const response = await LeadsService.getOpportunities();
			const leadList = isManager(user?.role)
				? response.data
				: response.data?.filter(
						(item) =>
							(item.primaryAssignee.length > 0 &&
								item.primaryAssignee.find((_) => _.name === user?.fullName)) ||
							(item.supervisorAssignee.length > 0 &&
								item.supervisorAssignee.find((_) => _.name === user?.fullName)),
				  );
			setOpportunities(leadList);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllOpportunities();
	}, [isAdded]);

	const [formData, setFormData] = useState({
		id: null,
		stage: "",
		primaryAssignee: null,
		supervisorAssignee: null,
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
		<PrimaryButton onOpen={onOpen} name={"Add new lead"} size={"xs"} />
	);

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
				<TableLayout cols={OPP_COLUMNS}>
					<Tbody>
						{opportunities?.map(
							({
								_id,
								abbreviation,
								createdOn,
								companyName,
								email,
								opportunityName,
								primaryAssignee,
								stage,
								supervisorAssignee,
								isDisbursedConfirmed,
							}) => {
								return (
									<Tr key={_id}>
										<Td>{opportunityName}</Td>
										<Td>{abbreviation}</Td>
										<Td>{companyName}</Td>
										<Td>{email}</Td>
										<Td>
											<SelectList
												id={_id}
												code="abbr"
												selectedValue={stage}
												handleSelect={handleSelect}
												type="stage"
												data={LEAD_STAGES}
											/>
										</Td>
										<Td>
											<SelectList
												id={_id}
												code="fullName"
												selectedValue={primaryAssignee?.[0]?.name}
												type="primaryAssignee"
												handleSelect={handleSelect}
												data={assignees}
											/>
										</Td>
										<Td>
											<SelectList
												id={_id}
												code="fullName"
												selectedValue={supervisorAssignee?.[0]?.name}
												type="supervisorAssignee"
												handleSelect={handleSelect}
												data={assignees}
											/>
										</Td>
										<Td>{formatDate(createdOn)}</Td>
										<Td>{isDisbursedConfirmed ? "Yes" : "No"}</Td>
									</Tr>
								);
							},
						)}
					</Tbody>
				</TableLayout>
			)}
			<AddNewOpportunity
				assignees={assignees}
				setIsAdded={setIsAdded}
				isOpen={isOpen}
				onClose={onClose}
			/>
		</SectionLayout>
	);
};

export default Opportunities;
