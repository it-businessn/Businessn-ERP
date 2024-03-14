import {
	Button,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Select,
	Stack,
} from "@chakra-ui/react";
import ModalLayout from "components/ui/ModalLayout";
import PrimaryButton from "components/ui/button/PrimaryButton";
import {
	INDUSTRIES,
	LEAD_SOURCES,
	PRODUCTS_SERVICES,
	PROJECT_ASSIGNEES,
	REGIONS,
} from "erp-modules/project-management/workview/data";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import LeadsService from "services/LeadsService";
import AssigneeSelector from "./AssigneeSelector";
import { LEAD_STAGES } from "./data";

const AddNewOpportunity = ({ isOpen, onClose, setIsAdded, isDocket }) => {
	const defaultOpportunity = {
		abbreviation: "",
		address: {
			streetNumber: "",
			city: "",
			state: "",
			postalCode: "",
			country: "",
		},
		companyName: "",
		email: "",
		industry: "",
		opportunityName: "",
		phone: "",
		primaryAssignee: [],
		productService: [],
		region: "",
		source: "",
		stage: "",
		supervisorAssignee: [],
	};

	const [isSubmitting, setSubmitting] = useState(false);
	const [error, setError] = useState(false);
	const [formData, setFormData] = useState(defaultOpportunity);

	const [selectedProductService, setSelectedProductService] = useState([]);
	const [selectedPrimaryAssignees, setSelectedPrimaryAssignees] = useState([]);
	const [selectedSupervisorAssignees, setSelectedSupervisorAssignees] =
		useState([]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		formData.productService = selectedProductService;
		formData.primaryAssignee = selectedPrimaryAssignees;
		formData.supervisorAssignee = selectedSupervisorAssignees;

		setSubmitting(true);

		try {
			await LeadsService.createOpportunity(formData);
			setIsAdded(true);
			onClose();
			setFormData(defaultOpportunity);
			setSubmitting(false);
		} catch (error) {
			console.log(error);
			// setError("An error occurred while creating new opportunity");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<ModalLayout
			title={"Add New Opportunity"}
			isOpen={isOpen}
			onClose={onClose}
			error={error}
		>
			<form onSubmit={handleSubmit}>
				<Stack spacing={4}>
					<FormControl>
						<FormLabel>Opportunity name</FormLabel>
						<Input
							type="text"
							name="opportunityName"
							value={formData.opportunityName}
							onChange={handleChange}
							required
						/>
					</FormControl>
					<HStack>
						<FormControl>
							<FormLabel>Abbreviation</FormLabel>
							<Input
								type="text"
								name="abbreviation"
								value={formData.abbreviation}
								onChange={handleChange}
								required
							/>
						</FormControl>
						<FormControl>
							<FormLabel>Company Name</FormLabel>
							<Input
								type="text"
								name="companyName"
								value={formData.companyName}
								onChange={handleChange}
								required
							/>
						</FormControl>
					</HStack>
					<HStack>
						<FormControl>
							<FormLabel>Phone</FormLabel>
							<Input
								type="text"
								name="phone"
								value={formData.phone}
								onChange={handleChange}
								required
							/>
						</FormControl>
						<FormControl>
							<FormLabel>Email</FormLabel>
							<Input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								required
							/>
						</FormControl>
					</HStack>

					<FormControl>
						<FormLabel>Address</FormLabel>
						<HStack>
							<Input
								type="text"
								name="streetNumber"
								value={formData.address.streetNumber}
								onChange={(e) => {
									setFormData({
										...formData,
										address: {
											...formData.address,
											streetNumber: e.target.value,
										},
									});
								}}
								placeholder="Street Number"
							/>

							<Input
								type="text"
								name="city"
								value={formData.address.city}
								onChange={(e) => {
									setFormData({
										...formData,
										address: {
											...formData.address,
											city: e.target.value,
										},
									});
								}}
								placeholder="City"
							/>
						</HStack>
						<HStack mt={3}>
							<Input
								type="text"
								name="state"
								value={formData.address.state}
								onChange={(e) => {
									setFormData({
										...formData,
										address: {
											...formData.address,
											state: e.target.value,
										},
									});
								}}
								placeholder="State"
							/>
							<Input
								type="text"
								name="postalCode"
								value={formData.address.postalCode}
								onChange={(e) => {
									setFormData({
										...formData,
										address: {
											...formData.address,
											postalCode: e.target.value,
										},
									});
								}}
								placeholder="Postal Code"
							/>
							<Input
								type="text"
								name="country"
								value={formData.address.country}
								onChange={(e) => {
									setFormData({
										...formData,
										address: {
											...formData.address,
											country: e.target.value,
										},
									});
								}}
								placeholder="Country"
							/>
						</HStack>
					</FormControl>
					<HStack>
						<FormControl>
							<FormLabel>Region</FormLabel>
							<Select
								icon={<FaCaretDown />}
								borderRadius="10px"
								size="sm"
								placeholder="Select Region"
								name="region"
								value={formData.region}
								onChange={handleChange}
							>
								{REGIONS.map(({ id, name }) => (
									<option value={name} key={id}>
										{name}
									</option>
								))}
							</Select>
						</FormControl>
						<FormControl>
							<FormLabel>Industry</FormLabel>
							<Select
								icon={<FaCaretDown />}
								borderRadius="10px"
								size="sm"
								placeholder="Select Industry"
								name="industry"
								value={formData.industry}
								onChange={handleChange}
							>
								{INDUSTRIES.map(({ id, name }) => (
									<option value={name} key={id}>
										{name}
									</option>
								))}
							</Select>
						</FormControl>
					</HStack>
					<FormControl>
						<FormLabel>Source</FormLabel>
						<Select
							icon={<FaCaretDown />}
							borderRadius="10px"
							size="sm"
							placeholder="Select Lead Source"
							name="source"
							value={formData.source}
							onChange={handleChange}
						>
							{LEAD_SOURCES.map(({ id, name }) => (
								<option value={name} key={id}>
									{name}
								</option>
							))}
						</Select>
					</FormControl>
					<AssigneeSelector
						assignees={PRODUCTS_SERVICES}
						selectedAssignees={selectedProductService}
						onAssigneeChange={setSelectedProductService}
						onRemoveAssignee={setSelectedProductService}
						label="Product Service"
						name="supervisorAssignee"
					/>
					{!isDocket && (
						<>
							<AssigneeSelector
								assignees={PROJECT_ASSIGNEES}
								selectedAssignees={selectedPrimaryAssignees}
								onAssigneeChange={setSelectedPrimaryAssignees}
								onRemoveAssignee={setSelectedPrimaryAssignees}
								label="Primary Assignee"
								name="primaryAssignee"
							/>
							<AssigneeSelector
								assignees={PROJECT_ASSIGNEES}
								selectedAssignees={selectedSupervisorAssignees}
								onAssigneeChange={setSelectedSupervisorAssignees}
								onRemoveAssignee={setSelectedSupervisorAssignees}
								label="Supervisor Assignee"
								name="supervisorAssignee"
							/>
							<FormControl>
								<FormLabel>Stage</FormLabel>
								<Select
									icon={<FaCaretDown />}
									borderRadius="10px"
									size="sm"
									placeholder="Select Stage"
									name="stage"
									value={formData.stage}
									onChange={handleChange}
								>
									{LEAD_STAGES.map(({ abbr, name }) => (
										<option value={abbr} key={abbr}>
											{`${abbr} - ${name}`}
										</option>
									))}
								</Select>
							</FormControl>
						</>
					)}

					<HStack justifyContent={"end"}>
						<PrimaryButton name="Add" isLoading={isSubmitting} px="2em" />

						<Button onClick={onClose} colorScheme="gray">
							Cancel
						</Button>
					</HStack>
				</Stack>
			</form>
		</ModalLayout>
	);
};

export default AddNewOpportunity;
