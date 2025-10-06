import {
	Divider,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useToast,
} from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import TextTitle from "components/ui/text/TextTitle";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

import { BsSendCheck } from "react-icons/bs";
import LocalStorageService from "services/LocalStorageService";
import SchedulerService from "services/SchedulerService";
import { getFormattedAddress } from "utils/common";
import { convertTo12HourFormatRange } from "utils/convertDate";

export const EmpWeekScheduleModal = ({
	isOpen,
	onClose,
	selectedDays,
	empWeeklyShifts,
	weekStart,
	weekEnd,
	location,
	company,
	weekTitle,
	setSentResult,
}) => {
	const toast = useToast();
	const companyDetails = LocalStorageService.getItem("user")?.companyId;
	const componentRef = useRef();
	const [reportFileName, setReportFileName] = useState(null);

	const [isSending, setIsSending] = useState(false);

	useEffect(() => {
		if (empWeeklyShifts?.shifts?.length) {
			setReportFileName(`${empWeeklyShifts.name}_${weekStart}_${weekEnd}_Schedule.pdf`);
			empWeeklyShifts?.shifts?.map((entry) => {
				entry.title =
					entry?.shift === "Off" ? entry?.shift : convertTo12HourFormatRange(entry?.shift);
				return entry;
			});
		}
	}, [empWeeklyShifts?.shifts]);

	const sendSchedule = async () => {
		const element = componentRef.current;
		const opt = {
			margin: 0.5,
			filename: reportFileName,
			image: { type: "jpeg", quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
		};
		try {
			const pdfBlob = await window.html2pdf().from(element).set(opt).outputPdf("blob");
			const formData = new FormData();
			formData.append("companyName", company);
			formData.append("week", weekTitle);
			formData.append("fullName", empWeeklyShifts?.name);
			formData.append("file", pdfBlob, `${reportFileName}.pdf`);
			setIsSending(true);
			const { data } = await SchedulerService.sendSchedule(formData);
			toast({
				title: empWeeklyShifts?.name,
				description: `${data.message} at ${new Date(data?.date).toLocaleString()}`,
				status: "success",
				duration: 4000,
				isClosable: true,
			});
			setSentResult((prev) => !prev);
			onClose();
		} catch (error) {
			toast({
				title: "Error",
				description: error?.response?.data?.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsSending(false);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="2xl">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Weekly Schedule</ModalHeader>
				<ModalCloseButton />
				<ModalBody ref={componentRef}>
					<TextTitle color={"var(--main_color_black)"} size={"sm"} title={companyDetails?.name} />

					<Stack spacing={3}>
						<TextTitle
							color={"var(--main_color_black)"}
							size={"xs"}
							whiteSpace="wrap"
							title={getFormattedAddress(companyDetails?.address)}
						/>
						<Divider />
						<TextTitle
							size={"lg"}
							align={"center"}
							textTransform={"uppercase"}
							title={`Schedule for ${weekTitle}`}
						/>
						<Stack spacing={3}>
							<TextTitle title={`Name: ${empWeeklyShifts?.name}`} />
							<TextTitle title={`Role: ${empWeeklyShifts?.role}`} />
							<TextTitle title={`Location: ${empWeeklyShifts?.location || location}`} />
						</Stack>
						<TableContainer>
							<Table variant="simple">
								<Thead bg="gray.100">
									<Tr>
										<Th border="1px solid" borderColor="gray.300">
											Day
										</Th>
										<Th border="1px solid" borderColor="gray.300" textAlign="center">
											Shift Time
										</Th>
									</Tr>
								</Thead>
								<Tbody>
									{selectedDays?.map((day, i) => {
										return (
											<Tr key={day}>
												<Td border="1px solid" borderColor="gray.300" fontWeight="medium">
													{format(day, "EEE dd")}
												</Td>
												<Td border="1px solid" borderColor="gray.300" textAlign="center">
													<TextTitle
														size={"sm"}
														title={empWeeklyShifts?.shifts[i]?.title}
														color={
															empWeeklyShifts?.shifts[i]?.shift === "Off" ? "red.500" : "green.600"
														}
														fontWeight={
															empWeeklyShifts?.shifts[i]?.shift === "Off" ? "semibold" : "normal"
														}
													/>
												</Td>
											</Tr>
										);
									})}
								</Tbody>
							</Table>
						</TableContainer>
					</Stack>
				</ModalBody>

				<ModalFooter>
					<ActionButtonGroup
						submitBtnName={"Send"}
						onClose={onClose}
						closeLabel="Cancel"
						onOpen={sendSchedule}
						size="sm"
						loadingText="Processing"
						isLoading={isSending}
						rightIcon={<BsSendCheck size={16} />}
					/>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
