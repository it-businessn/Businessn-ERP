import {
	Button,
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
import SelectList from "components/ui/SelectList";
import TableLayout from "components/ui/TableLayout";
import TextTitle from "components/ui/TextTitle";
import PrimaryButton from "components/ui/button/PrimaryButton";
import {
	PROJECT_ASSIGNEES,
	SUPERVISOR_ASSIGNEES,
} from "erp-modules/project-management/workview/data";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { useBreakpointValue } from "services/Breakpoint";
import LeadsService from "services/LeadsService";
import { formatDate } from "utils";
import AddNewOpportunity from "./AddNewOpportunity";
import { LEAD_STAGES } from "./data";

const Opportunities = () => {
	const { isMobile, isIpad } = useBreakpointValue();
	const [isAdded, setIsAdded] = useState(false);

	const [opportunities, setOpportunities] = useState(null);

	useEffect(() => {
		const fetchAllOpportunities = async () => {
			try {
				const response = await LeadsService.getOpportunities();
				setOpportunities(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchAllOpportunities();
	}, [isAdded]);

	const showFilterSearchOption = () => (
		<>
			<Button
				color={"brand.nav_color"}
				leftIcon={<MdOutlineFilterList />}
				border={"2px solid var(--filter_border_color)"}
				borderRadius={"10px"}
				px={"2em"}
				_hover={{ color: "brand.600", bg: "transparent" }}
			>
				Filter
			</Button>
			<InputGroup
				borderRadius={"10px"}
				border={"1px solid var(--filter_border_color)"}
				fontSize="sm"
				fontWeight="bold"
			>
				<InputLeftElement children={<FaSearch />} />
				<Input
					_placeholder={{
						color: "brand.nav_color",
						fontSize: "sm",
					}}
					color={"brand.nav_color"}
					bg={"brand.primary_bg"}
					type="text"
					placeholder="Search here"
				/>
			</InputGroup>
		</>
	);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const createOpportunity = () => (
		<PrimaryButton onOpen={onOpen} name={"Add new lead"} />
	);
	const caption = () => <TextTitle title={"Opportunities"} />;

	const columns = [
		"Opportunity name",
		"Abbr",
		"Company name",
		"Email",
		"Stage",
		"Primary assignee",
		"Supervisor assignee",
		"Created On",
	];

	return (
		<SectionLayout title="Opportunities">
			{isMobile || isIpad ? (
				<Flex flexDir="column">
					<Flex justify="space-between">
						{caption()}
						{createOpportunity()}
					</Flex>
					<HStack spacing="1em" mt="1em">
						{showFilterSearchOption()}
					</HStack>
				</Flex>
			) : (
				<Flex>
					{caption()}
					<Spacer />
					<HStack spacing={3}>
						{showFilterSearchOption()}
						{createOpportunity()}
					</HStack>
				</Flex>
			)}
			{!opportunities && <Loader />}
			{opportunities && (
				<TableLayout cols={columns}>
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
							}) => {
								return (
									<Tr key={_id}>
										<Td>{opportunityName}</Td>
										<Td>{abbreviation}</Td>
										<Td>{companyName}</Td>
										<Td>{email}</Td>
										<Td>
											<SelectList
												code="abbr"
												selectedValue={"defaultSelected.stag"}
												data={LEAD_STAGES}
											/>
										</Td>
										<Td>
											<SelectList
												code="name"
												selectedValue={"defaultSelected.primaryAssignee"}
												data={PROJECT_ASSIGNEES}
											/>
										</Td>
										<Td>
											<SelectList
												code="name"
												selectedValue={""}
												data={SUPERVISOR_ASSIGNEES}
											/>
										</Td>
										<Td>{formatDate(createdOn)}</Td>
									</Tr>
								);
							},
						)}
					</Tbody>
				</TableLayout>
			)}
			<AddNewOpportunity
				setIsAdded={setIsAdded}
				isOpen={isOpen}
				onClose={onClose}
			/>
		</SectionLayout>
	);
};

export default Opportunities;
