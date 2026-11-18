import { Box, Table, Tbody, Td, Thead, Tr, useToast } from "@chakra-ui/react";
import Loader from "components/Loader";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import SelectList from "components/ui/form/select/SelectList";
import NormalTextTitle from "components/ui/NormalTextTitle";
import SortableTh from "components/ui/table/SortableTh";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import useSortableData from "hooks/useSortableData";
import PageLayout from "layouts/PageLayout";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import OrderService from "services/OrderService";
import { isSettled } from "utils";
import { payrunType } from "utils/common";
import { getAmount } from "utils/convertAmt";
import CustomFilter from "./CustomFilter";

const Orders = () => {
	const ORDER_COLS = [
		"Order",
		"Created On ",
		"Customer",
		"Type",
		"Total Withdrawn",
		"Funds Received Status",
		"Total Employee Remittance",
		"Total Recipients",
		"Emp EFTSent Status",
		"Emp EFTDeposited Status",
		"Total CRA Remittance",
		"CRA Sent Status",
		"CRA Deposited Status",
		"Fulfillment Status",
	];
	const ORDER_SORT_KEYS = {
		Order: "orderNumber",
		"Created On ": "createdOn",
		Customer: "customer",
		Type: "type",
		"Total Withdrawn": "totalsRemitted",
		"Funds Received Status": "fundsReceivedStatus",
		"Total Employee Remittance": "totalEmpRemitted",
		"Total Recipients": "totalRecipients",
		"Emp EFTSent Status": "empEFTSentStatus",
		"Emp EFTDeposited Status": "empEFTDepositedStatus",
		"Total CRA Remittance": "totalCRARemitted",
		"CRA Sent Status": "craSentStatus",
		"CRA Deposited Status": "craDepositedStatus",
		"Fulfillment Status": "fulfillmentStatus",
	};
	const ORDER_STATUS = [{ name: "Settled" }, { name: "Unsettled" }];

	const company = LocalStorageService.getItem("selectedCompany");
	const { isMobile } = useBreakpointValue();
	const toast = useToast();

	const [selectedDateFilter, setSelectedDateFilter] = useState("This Week");

	const handleDateFilterChange = (event) => {
		setSelectedDateFilter(event.target.value);
		// Fetch data based on the selected date filter
	};
	const [orders, setOrders] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");

	// Search filters on top of the loaded orders; clearing it shows them all again.
	const filteredOrders = useMemo(() => {
		const term = searchTerm.trim().toLowerCase();
		if (!orders || !term) return orders;
		return orders.filter(({ orderNumber, customer, type }) =>
			[orderNumber, customer, type].some((field) =>
				String(field ?? "")
					.toLowerCase()
					.includes(term),
			),
		);
	}, [orders, searchTerm]);
	const { sortedItems, sortConfig, requestSort } = useSortableData(filteredOrders);

	useEffect(() => {
		const fetchAllOrders = async () => {
			try {
				const { data } = await OrderService.getCompOrders(company);
				data?.map((record) => {
					record.type = payrunType(record.fundingTotalsId);
					record.totalsRemitted = getAmount(record.fundingTotalsId?.totalFundingWithDrawals);
					record.totalEmpRemitted = getAmount(record.fundingTotalsId?.totalEmpPaymentRemitCost);
					record.totalCRARemitted = getAmount(record.fundingTotalsId?.totalGovtContr);
					return record;
				});
				setOrders(data);
			} catch (error) {
				console.error(error);
				setOrders([]);
				toast({
					title: "Failed to load orders",
					description: error?.response?.data?.message || "Please try again.",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
		};
		fetchAllOrders();
	}, []);

	// Each status change is saved right away (a "statusChanged" flag that stayed true after a
	// failed save used to block every later save).
	const handleSelect = (type, value, id) => {
		const savedRec = orders?.find(({ _id }) => _id === id);
		if (!savedRec) return;
		const updatedRec = { ...savedRec, [type]: value };
		setOrders((prev) =>
			prev?.map((record) => (record._id === id ? { ...record, [type]: value } : record)),
		);
		handleUpdate(
			{
				recordId: id,
				[type]: value,
				fundsReceivedStatus: updatedRec.fundsReceivedStatus,
				craDepositedStatus: updatedRec.craDepositedStatus,
				craSentStatus: updatedRec.craSentStatus,
				empEFTDepositedStatus: updatedRec.empEFTDepositedStatus,
				empEFTSentStatus: updatedRec.empEFTSentStatus,
			},
			type,
			savedRec[type],
		);
	};

	const handleUpdate = async (formData, type, savedValue) => {
		try {
			if (formData?.recordId) {
				const { data } = await OrderService.updateOrder(formData, formData?.recordId);

				if (data) {
					setOrders((prev) =>
						prev?.map((record) =>
							record._id === formData?.recordId
								? {
										...record,
										fundsReceivedStatus: data?.fundsReceivedStatus,
										craDepositedStatus: data?.craDepositedStatus,
										craSentStatus: data?.craSentStatus,
										empEFTDepositedStatus: data?.empEFTDepositedStatus,
										empEFTSentStatus: data?.empEFTSentStatus,
										fulfillmentStatus: data?.fulfillmentStatus,
								  }
								: record,
						),
					);
				}
			}
		} catch (error) {
			toast({
				title: "Failed to update order",
				description: error?.response?.data?.message || "Please try again.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			// Put the dropdown back to the saved value.
			setOrders((prev) =>
				prev?.map((record) =>
					record._id === formData?.recordId ? { ...record, [type]: savedValue } : record,
				),
			);
		}
	};
	const handleInputChange = (value) => setSearchTerm(value);

	return (
		<PageLayout title="Orders">
			<Box
				p="1em"
				bg={"var(--primary_bg)"}
				border="2px solid var(--main_color)"
				borderRadius="10px"
				color={"var(--nav_color)"}
			>
				<CustomFilter isMobile={isMobile} handleInputChange={handleInputChange} />
				{!orders && <Loader autoHeight />}
				{orders && (
					<Box overflow="auto" css={tabScrollCss} height={"calc(100vh - 210px)"}>
						<Table color={"var(--nav_color)"} variant="small">
							<Thead position="sticky" zIndex="docked" top={-1} bg="var(--lead_cards_bg)">
								<Tr fontSize="xs">
									{ORDER_COLS.map((col) => (
										<SortableTh
											key={col}
											sortKey={ORDER_SORT_KEYS[col]}
											sortConfig={sortConfig}
											onSort={requestSort}
											fontWeight={"bolder"}
											p={col === "Order" && 0}
											whiteSpace="wrap"
										>
											{col}
										</SortableTh>
									))}
								</Tr>
							</Thead>
							<Tbody color={"var(--nav_color)"}>
								{filteredOrders.length === 0 && (
									<EmptyRowRecord data={filteredOrders} colSpan={ORDER_COLS.length} />
								)}
								{sortedItems.map(
									({
										_id,
										orderNumber,
										totalsRemitted,
										craDepositedStatus,
										craSentStatus,
										createdOn,
										customer,
										empEFTDepositedStatus,
										empEFTSentStatus,
										fundsReceivedStatus,
										totalRecipients,
										totalEmpRemitted,
										totalCRARemitted,
										type,
										fulfillmentStatus,
									}) => (
										<Tr key={_id}>
											<Td p={0}>{`#${orderNumber}`}</Td>
											<Td py={0}>
												<NormalTextTitle
													size="sm"
													title={moment(createdOn).format("YYYY-MM-DD hh:mm A")}
												/>
											</Td>
											<Td py={0}>
												<NormalTextTitle size="sm" title={customer} />
											</Td>
											<Td py={0}>{type}</Td>
											{/* <Td py={0}>
												<Progress colorScheme="blue" size="sm" bg={"#d5def5"} value={55} />
												<NormalTextTitle size="xs" title={"Paid, preparing for shipment"} />
											</Td> */}

											<Td py={0}>{totalsRemitted}</Td>
											<Td py={0} pt={1}>
												<SelectList
													size="xs"
													w="100px"
													id={_id}
													code="name"
													selectedValue={fundsReceivedStatus}
													handleSelect={handleSelect}
													type="fundsReceivedStatus"
													data={ORDER_STATUS}
													isOrderAction
													isUnsettled={!isSettled(fundsReceivedStatus)}
												/>
											</Td>
											<Td py={0}>{totalEmpRemitted}</Td>
											<Td py={0}>{totalRecipients}</Td>
											<Td py={0} pt={1}>
												<SelectList
													size="xs"
													w="100px"
													id={_id}
													code="name"
													selectedValue={empEFTSentStatus}
													handleSelect={handleSelect}
													type="empEFTSentStatus"
													data={ORDER_STATUS}
													isOrderAction
													isUnsettled={!isSettled(empEFTSentStatus)}
												/>
											</Td>
											<Td py={0} pt={1}>
												<SelectList
													size="xs"
													w="100px"
													id={_id}
													code="name"
													selectedValue={empEFTDepositedStatus}
													handleSelect={handleSelect}
													type="empEFTDepositedStatus"
													data={ORDER_STATUS}
													isOrderAction
													isUnsettled={!isSettled(empEFTDepositedStatus)}
												/>
											</Td>
											<Td py={0}>{totalCRARemitted}</Td>
											<Td py={0} pt={1}>
												<SelectList
													size="xs"
													w="100px"
													id={_id}
													code="name"
													selectedValue={craSentStatus}
													handleSelect={handleSelect}
													type="craSentStatus"
													data={ORDER_STATUS}
													isOrderAction
													isUnsettled={!isSettled(craSentStatus)}
												/>
											</Td>
											<Td py={0} pt={1}>
												<SelectList
													size="xs"
													w="100px"
													id={_id}
													code="name"
													selectedValue={craDepositedStatus}
													handleSelect={handleSelect}
													type="craDepositedStatus"
													data={ORDER_STATUS}
													isOrderAction
													isUnsettled={!isSettled(craDepositedStatus)}
												/>
											</Td>
											<Td py={0}>
												<NormalTextTitle
													size="sm"
													bg={!isSettled(fulfillmentStatus) && "var(--order_unsettled)"}
													title={fulfillmentStatus}
												/>
											</Td>
										</Tr>
									),
								)}
							</Tbody>
						</Table>
					</Box>
				)}
			</Box>
		</PageLayout>
	);
};

export default Orders;
