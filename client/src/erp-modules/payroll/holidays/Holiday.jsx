import { AddIcon } from "@chakra-ui/icons";
import {
	Button,
	FormControl,
	FormLabel,
	Grid,
	HStack,
	Input,
	Text,
	useToast,
	VStack,
} from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import SettingService from "services/SettingService";
import { StatHolidayTable } from "./stat-holiday";

const Holiday = ({ company }) => {
	const currentCompany = company || LocalStorageService.getItem("selectedCompany");

	const [holidays, setHolidays] = useState([]);
	const [name, setName] = useState("");
	const [date, setDate] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const toast = useToast();

	const handleEdit = (holiday) => {
		setName(holiday.name);
		setDate(holiday.date.slice(0, 10));
		setEditingId(holiday._id);
	};

	const handleSubmit = async () => {
		if (!name || !date) {
			toast({
				title: "Validation Error",
				description: "Please fill in all fields",
				status: "warning",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		try {
			setIsLoading(true);
			if (editingId) {
				await SettingService.updateHoliday({ name, date, company: currentCompany }, editingId);
				setHolidays(
					holidays.map((holiday) =>
						holiday._id === editingId ? { ...holiday, name, date } : holiday,
					),
				);
				toast({
					title: "Success",
					description: "Holiday updated successfully",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			} else {
				const { data } = await SettingService.addStatHoliday({
					name,
					date,
					company: currentCompany,
				});
				setHolidays([...holidays, data]);
				toast({
					title: "Success",
					description: "Holiday added successfully",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			}
			resetForm();
		} catch (error) {
			toast({
				title: "Error",
				description: error?.response?.data?.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const resetForm = () => {
		setName("");
		setDate("");
		setEditingId(null);
	};

	return (
		<PageLayout title={company ? "" : "Holiday Calendar"}>
			{currentCompany && (
				<Grid templateColumns={{ base: "1fr", lg: "0.3fr 0.7fr" }} gap={6}>
					<BoxCard bg="white" p={6} boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)">
						<VStack spacing={4} align="stretch">
							<Text fontSize="lg" fontWeight="bold">
								{editingId ? "Edit Holiday" : "Add New Holiday"}
							</Text>
							<FormControl>
								<FormLabel>Holiday Name</FormLabel>
								<Input
									placeholder="Enter holiday name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									size="md"
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Date</FormLabel>
								<Input
									type="date"
									value={date}
									onChange={(e) => setDate(e.target.value)}
									size="md"
								/>
							</FormControl>
							<HStack spacing={4}>
								<Button
									colorScheme="purple"
									onClick={handleSubmit}
									isLoading={isLoading}
									leftIcon={<AddIcon />}
									w="full"
									bg="var(--banner_bg)"
									_hover={{
										bg: "var(--banner_bg)",
										opacity: 0.9,
									}}
								>
									{editingId ? "Update" : "Add"}
								</Button>
								{editingId && (
									<Button variant="outline" onClick={resetForm} w="full">
										Cancel
									</Button>
								)}
							</HStack>
						</VStack>
					</BoxCard>

					<BoxCard bg="white" boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)">
						<StatHolidayTable
							holidays={holidays}
							setHolidays={setHolidays}
							currentCompany={currentCompany}
							handleEdit={handleEdit}
						/>
					</BoxCard>
				</Grid>
			)}
		</PageLayout>
	);
};

export default Holiday;
