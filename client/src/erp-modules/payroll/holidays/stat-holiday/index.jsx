import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
	Box,
	Flex,
	HStack,
	IconButton,
	Select,
	Stack,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useToast,
} from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import TextTitle from "components/ui/text/TextTitle";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import { useEffect, useState } from "react";
import SettingService from "services/SettingService";
import { CURRENT_YEAR, dayMonthYear } from "utils/convertDate";

// past, present and future years, plus the selected year (e.g. a holiday just
// saved further out); computed on render so it follows the calendar
const yearOptions = (selected) => {
	const thisYear = new Date().getFullYear();
	const years = Array.from({ length: 7 }, (_, i) => thisYear - 3 + i);
	return [...new Set([...years, Number(selected)])].filter(Boolean).sort((a, b) => a - b);
};

export const StatHolidayTable = ({
	holidays,
	currentCompany,
	setHolidays,
	handleEdit,
	year = CURRENT_YEAR,
	setYear,
}) => {
	const toast = useToast();
	const [deleteRecordId, setDeleteRecordId] = useState(null);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

	const handleClose = () => {
		setShowConfirmationPopUp(false);
		setDeleteRecordId(null);
	};

	useEffect(() => {
		// a slower answer for a previously chosen year must not replace this year's list
		let current = true;
		const fetchStatHolidays = async () => {
			try {
				const { data } = await SettingService.getStatHolidays(currentCompany, year);
				if (current) setHolidays(data);
			} catch (error) {
				if (!current) return;
				toast({
					title: "Error",
					description: "Failed to fetch holidays",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			}
		};
		fetchStatHolidays();
		return () => {
			current = false;
		};
	}, [currentCompany, year]);

	const handleDelete = async () => {
		try {
			await SettingService.deleteHoliday({}, deleteRecordId);
			setHolidays(holidays.filter((holiday) => holiday._id !== deleteRecordId));
			toast({
				title: "Success",
				description: "Holiday deleted successfully",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			handleClose();
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete holiday",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	return (
		<Stack spacing={4}>
			<Flex justify="space-between" align="center">
				<HStack spacing={3}>
					<TextTitle title="Holiday List" />
					{setYear && (
						<Select
							aria-label="Year"
							size="sm"
							w="100px"
							value={year}
							onChange={(e) => setYear(Number(e.target.value))}
						>
							{yearOptions(year).map((y) => (
								<option key={y} value={y}>
									{y}
								</option>
							))}
						</Select>
					)}
				</HStack>
				<TextTitle title={`${holidays.length} ${holidays.length === 1 ? "holiday" : "holidays"}`} />
			</Flex>

			<Box overflowX="auto" css={tabScrollCss}>
				<Table variant="simple" size="sm">
					<Thead>
						<Tr>
							<Th>Name</Th>
							<Th>Date</Th>
							<Th width="100px">Actions</Th>
						</Tr>
					</Thead>
					<Tbody>
						{(!holidays || holidays?.length === 0) && (
							<EmptyRowRecord
								data={holidays}
								colSpan={3}
								title="No holidays added yet"
								description="Add record to see them listed here"
							/>
						)}
						{holidays?.map((holiday) => (
							<Tr key={holiday._id}>
								<Td>{holiday.name}</Td>
								<Td>{dayMonthYear(holiday.date)}</Td>
								<Td>
									<HStack spacing={2}>
										<IconButton
											aria-label="Edit holiday"
											icon={<EditIcon />}
											size="sm"
											onClick={() => handleEdit(holiday)}
											color="var(--banner_bg)"
											_hover={{
												bg: "var(--banner_bg)",
												color: "white",
											}}
										/>
										<IconButton
											aria-label="Delete holiday"
											icon={<DeleteIcon />}
											size="sm"
											color="var(--banner_bg)"
											_hover={{
												bg: "var(--banner_bg)",
												color: "white",
											}}
											onClick={() => {
												setShowConfirmationPopUp(true);
												setDeleteRecordId(holiday._id);
											}}
										/>
									</HStack>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</Box>
			{showConfirmationPopUp && (
				<DeletePopUp
					headerTitle="Please confirm"
					textTitle="Are you sure you want to delete the record?"
					isOpen={showConfirmationPopUp}
					onClose={handleClose}
					onOpen={handleDelete}
				/>
			)}
		</Stack>
	);
};
