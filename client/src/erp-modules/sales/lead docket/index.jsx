import {
	Checkbox,
	Flex,
	HStack,
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
import {
	INDUSTRIES,
	LEAD_SOURCES,
	PRODUCTS_SERVICES,
	REGIONS,
} from "erp-modules/project-management/workview/data";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useBreakpointValue } from "services/Breakpoint";
import LeadsService from "services/LeadsService";
import { formatDate } from "utils";
import AddOpportunity from "./AddOpportunity";
import Caption from "./Caption";
import Disburse from "./Disburse";
import Region from "./Region";
import SearchFilter from "./SearchFilter";
import { LEAD_DOCKET_COLUMNS } from "./data";

const LeadsDocket = () => {
	const { isMobile, isIpad } = useBreakpointValue();
	const [leads, setLeads] = useState(null);
	const [allLeadIDs, setAllLeadIDs] = useState([]);
	const toast = useToast();

	const fetchAllLeads = async () => {
		try {
			const response = await LeadsService.getNotDisbursedLeads();
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

	return (
		<SectionLayout title="Lead Docket">
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
					<AddOpportunity />
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
						<AddOpportunity />
					</Flex>
					<Region />
					<HStack spacing="1em" my="1em">
						<SearchFilter width={"200px"} />
					</HStack>
				</Flex>
			) : (
				<Flex>
					<Caption title={"Lead Docket"} />
					<Spacer />
					<HStack spacing={3}>
						<Spacer />
						<Disburse
							checkedRows={checkedRows}
							handleDisburse={handleDisburse}
						/>
						<Region />
						<SearchFilter width={"200px"} />
						<AddOpportunity />
					</HStack>
				</Flex>
			)}
			{!leads && <Loader />}
			{leads && (
				<TableLayout
					hasMulti
					cols={LEAD_DOCKET_COLUMNS}
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
									<Td
										p={1}
									>{`${address.streetNumber} ${address.city} ${address.state} ${address.country} ${address.postalCode}`}</Td>
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
