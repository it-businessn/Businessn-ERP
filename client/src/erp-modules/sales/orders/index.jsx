import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import SelectList from "components/ui/form/select/SelectList";
import NormalTextTitle from "components/ui/NormalTextTitle";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import OrderService from "services/OrderService";
import { getAmount } from "utils/convertAmt";
import { formatDateBar } from "utils/convertDate";
import CustomFilter from "./CustomFilter";
import OrderGraph from "./OrderGraph";

const Orders = () => {
	const ORDER_COLS = [
		"Order",
		"Created On ",
		"Customer",
		"Type",
		"Total Remitted",
		"Total Employee Remittance",
		"Total CRA Remittance",
		"Total Recipients",
		"Funds Received Status",
		"Emp EFTSent Status",
		"Emp EFTDeposited Status",
		"CRA Sent Status",
		"CRA Deposited Status",
	];
	const ORDER_STATUS = [{ name: "Settled" }, { name: "Unsettled" }];

	const initialFormData = {
		fundsReceivedStatus: "",
		craDepositedStatus: "",
		craSentStatus: "",
		empEFTDepositedStatus: "",
		empEFTSentStatus: "",
		recordId: null,
	};

	const company = LocalStorageService.getItem("selectedCompany");
	const { isMobile } = useBreakpointValue();

	const [selectedDateFilter, setSelectedDateFilter] = useState("This Week");

	const handleDateFilterChange = (event) => {
		setSelectedDateFilter(event.target.value);
		// Fetch data based on the selected date filter
	};
	const [orders, setOrders] = useState(null);
	const [statusChanged, setStatusChanged] = useState(false);
	const [formData, setFormData] = useState(initialFormData);

	useEffect(() => {
		const fetchAllOrders = async () => {
			try {
				const { data } = await OrderService.getCompOrders(company);
				data?.map((record) => {
					const { isExtraRun, totalFundingWithDrawals, totalEmpPaymentRemitCost, totalGovtContr } =
						record.fundingTotalsId;
					record.type = isExtraRun ? "Extra" : "Regular";
					record.totalsRemitted = getAmount(totalFundingWithDrawals);
					record.totalEmpRemitted = getAmount(totalEmpPaymentRemitCost);
					record.totalCRARemitted = getAmount(totalGovtContr);
					return record;
				});
				setOrders(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllOrders();
	}, []);

	useEffect(() => {
		if (statusChanged) {
			handleUpdate();
		}
	}, [statusChanged]);

	const handleSelect = (type, value, id) => {
		const updatedData = orders?.map((record) =>
			record._id === id ? { ...record, [type]: value } : record,
		);
		setFormData({
			recordId: id,
			[type]: value,
		});
		setStatusChanged(true);
		setOrders(updatedData);
	};

	const handleUpdate = async () => {
		try {
			const updatedRec = orders.find(({ _id }) => _id === formData.recordId);
			formData.fundsReceivedStatus = updatedRec.fundsReceivedStatus;
			formData.craDepositedStatus = updatedRec.craDepositedStatus;
			formData.craSentStatus = updatedRec.craSentStatus;
			formData.empEFTDepositedStatus = updatedRec.empEFTDepositedStatus;
			formData.empEFTSentStatus = updatedRec.empEFTSentStatus;

			if (formData.recordId) {
				const { data } = await OrderService.updateOrder(formData, formData.recordId);

				if (data) {
					const updatedData = orders?.map((record) =>
						record._id === formData.recordId
							? {
									...record,
									fundsReceivedStatus: data?.fundsReceivedStatus,
									craDepositedStatus: data?.craDepositedStatus,
									craSentStatus: data?.craSentStatus,
									empEFTDepositedStatus: data?.empEFTDepositedStatus,
									empEFTSentStatus: data?.empEFTSentStatus,
							  }
							: record,
					);
					setOrders(updatedData);
				}
				setStatusChanged(false);
			}
		} catch (error) {}
	};

	return (
		<PageLayout title="Orders">
			<OrderGraph />
			<Box
				p="1em"
				bg={"var(--primary_bg)"}
				border="2px solid var(--main_color)"
				borderRadius="10px"
				color={"var(--nav_color)"}
			>
				<CustomFilter isMobile={isMobile} />
				{orders && (
					<Box overflow="auto" height={"450px"}>
						<Table color={"var(--nav_color)"} bg={"var(--primary_bg)"} variant="small">
							<Thead>
								<Tr fontSize="xs">
									{ORDER_COLS.map((col) => (
										<Th key={col} fontWeight={"bolder"} p={col === "Order" && 0} whiteSpace="wrap">
											{col}
										</Th>
									))}
								</Tr>
							</Thead>
							<Tbody color={"var(--nav_color)"}>
								{orders.map(
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
									}) => (
										<Tr key={_id}>
											<Td p={0}>{`#${orderNumber}`}</Td>
											<Td py={0}>
												<NormalTextTitle size="xs" title={formatDateBar(createdOn)} />
											</Td>
											<Td py={0}>
												<NormalTextTitle size="xs" title={customer} />
											</Td>
											<Td py={0}>{type}</Td>
											{/* <Td py={0}>
												<Progress colorScheme="blue" size="sm" bg={"#d5def5"} value={55} />
												<NormalTextTitle size="xs" title={"Paid, preparing for shipment"} />
											</Td> */}

											<Td py={0}>{totalsRemitted}</Td>
											<Td py={0}>{totalEmpRemitted}</Td>
											<Td py={0}>{totalCRARemitted}</Td>
											<Td py={0}>{totalRecipients}</Td>
											<Td py={0}>
												<SelectList
													w="100px"
													id={_id}
													code="name"
													selectedValue={fundsReceivedStatus}
													handleSelect={handleSelect}
													type="fundsReceivedStatus"
													data={ORDER_STATUS}
													isOrderAction
												/>
											</Td>
											<Td py={0}>
												<SelectList
													w="100px"
													id={_id}
													code="name"
													selectedValue={empEFTSentStatus}
													handleSelect={handleSelect}
													type="empEFTSentStatus"
													data={ORDER_STATUS}
													isOrderAction
												/>
											</Td>
											<Td py={0}>
												<SelectList
													w="100px"
													id={_id}
													code="name"
													selectedValue={empEFTDepositedStatus}
													handleSelect={handleSelect}
													type="empEFTDepositedStatus"
													data={ORDER_STATUS}
													isOrderAction
												/>
											</Td>
											<Td py={0}>
												<SelectList
													w="100px"
													id={_id}
													code="name"
													selectedValue={craSentStatus}
													handleSelect={handleSelect}
													type="craSentStatus"
													data={ORDER_STATUS}
													isOrderAction
												/>
											</Td>
											<Td py={0}>
												<SelectList
													w="100px"
													id={_id}
													code="name"
													selectedValue={craDepositedStatus}
													handleSelect={handleSelect}
													type="craDepositedStatus"
													data={ORDER_STATUS}
													isOrderAction
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
