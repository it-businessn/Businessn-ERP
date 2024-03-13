import {
	Flex,
	HStack,
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
import PrimaryButton from "components/ui/button/PrimaryButton";
import {
	PROJECT_ASSIGNEES,
	SUPERVISOR_ASSIGNEES,
} from "erp-modules/project-management/workview/data";
import { useEffect, useState } from "react";
import { useBreakpointValue } from "services/Breakpoint";
import LeadsService from "services/LeadsService";
import { formatDate } from "utils";
import Caption from "../lead docket/Caption";
import SearchFilter from "../lead docket/SearchFilter";
import { OPP_COLUMNS } from "../lead docket/data";
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

	const { isOpen, onOpen, onClose } = useDisclosure();
	const createOpportunity = () => (
		<PrimaryButton onOpen={onOpen} name={"Add new lead"} />
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
					<HStack spacing={3}>
						<SearchFilter />
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
