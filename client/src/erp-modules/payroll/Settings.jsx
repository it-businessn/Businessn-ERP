import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Grid,
	HStack,
	IconButton,
	Input,
	Stack,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useToast,
	VStack,
} from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import SettingService from "services/SettingService";
import { tabScrollCss } from "./onboard-user/customInfo";

const Settings = ({ company }) => {
	const [holidays, setHolidays] = useState([]);
	const [name, setName] = useState("");
	const [date, setDate] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const toast = useToast();

	useEffect(() => {
		fetchStatHolidays();
	}, []);

	const fetchStatHolidays = async () => {
		try {
			setIsLoading(true);
			const { data } = await SettingService.getStatHolidays(company);
			setHolidays(data);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to fetch holidays",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
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
				await SettingService.updateHoliday(editingId, { name, date, company });
				setHolidays(holidays.map((h) => (h._id === editingId ? { ...h, name, date } : h)));
				toast({
					title: "Success",
					description: "Holiday updated successfully",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			} else {
				const { data } = await SettingService.addStatHoliday({ name, date, company });
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
				description: "An error occurred. Please try again.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = (holiday) => {
		setName(holiday.name);
		setDate(holiday.date.slice(0, 10));
		setEditingId(holiday._id);
	};

	const handleDelete = async (id) => {
		try {
			setIsLoading(true);
			await SettingService.deleteHoliday({}, id);
			setHolidays(holidays.filter((holiday) => holiday._id !== id));
			toast({
				title: "Success",
				description: "Holiday deleted successfully",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete holiday",
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
		<PageLayout title="Holiday Calendar">
			<Grid templateColumns={{ base: "1fr", lg: "300px 1fr" }} gap={6} w="100%">
				<BoxCard p={6} bg="white" boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)">
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
							<Input type="date" value={date} onChange={(e) => setDate(e.target.value)} size="md" />
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
					<Stack spacing={4}>
						<Flex justify="space-between" align="center">
							<Text fontSize="lg" fontWeight="bold">
								Holiday List
							</Text>
							<Text color="gray.500">
								{holidays.length} {holidays.length === 1 ? "holiday" : "holidays"}
							</Text>
						</Flex>

						<Box overflowX="auto" css={tabScrollCss}>
							<Table variant="simple">
								<Thead>
									<Tr>
										<Th>Name</Th>
										<Th>Date</Th>
										<Th width="100px">Actions</Th>
									</Tr>
								</Thead>
								<Tbody>
									{holidays.length === 0 ? (
										<Tr>
											<Td colSpan={3} textAlign="center" py={8}>
												<Text color="gray.500">No holidays added yet</Text>
											</Td>
										</Tr>
									) : (
										holidays.map((holiday) => (
											<Tr key={holiday._id}>
												<Td>{holiday.name}</Td>
												<Td>{new Date(holiday.date).toLocaleDateString()}</Td>
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
															onClick={() => handleDelete(holiday._id)}
														/>
													</HStack>
												</Td>
											</Tr>
										))
									)}
								</Tbody>
							</Table>
						</Box>
					</Stack>
				</BoxCard>
			</Grid>
		</PageLayout>
	);
};

export default Settings;
