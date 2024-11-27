import {
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Select,
	Spacer,
	Stack,
	Text,
} from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import RequiredLabel from "components/ui/form/RequiredLabel";
import ModalLayout from "components/ui/modal/ModalLayout";
import {
	INDUSTRIES,
	LEAD_SOURCES,
	PRODUCTS_SERVICES,
	REGIONS,
} from "erp-modules/project-management/workview/project/data";
import { useState } from "react";
import { FaCaretDown, FaPlus } from "react-icons/fa";
import LeadsService from "services/LeadsService";
import { toCapitalize } from "utils";
import { today } from "utils/convertDate";
import AddCompany from "./AddCompany";
import AssigneeSelector from "./AssigneeSelector";
import { LEAD_STAGES } from "./data";

const AddNewOpportunity = ({
	isOpen,
	onClose,
	setIsAdded,
	isDocket,
	company,
	showEditLead,
	assignees,
	managers,
	companies,
	setRefresh,
}) => {
	const defaultOpportunity = {
		abbreviation: "",
		address: {
			streetNumber: "",
			city: "",
			state: "",
			postalCode: "",
			country: "",
		},
		name: "",
		companyName: company,
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

	const savedData = {
		abbreviation: showEditLead?.abbreviation,
		address: {
			streetNumber: showEditLead?.address?.streetNumber,
			city: showEditLead?.address?.city,
			state: showEditLead?.address?.state,
			postalCode: showEditLead?.address?.postalCode,
			country: showEditLead?.address?.country,
		},
		name: toCapitalize(showEditLead?.name),
		email: showEditLead?.email,
		industry: showEditLead?.industry,
		opportunityName: showEditLead?.opportunityName,
		phone: showEditLead?.phone,
		primaryAssignee: showEditLead?.primaryAssignee,
		productService: showEditLead?.productService,
		region: showEditLead?.region,
		source: showEditLead?.source,
		stage: showEditLead?.stage,
		supervisorAssignee: showEditLead?.supervisorAssignee,
		companyName: company,
	};

	const [isSubmitting, setSubmitting] = useState(false);
	const [error, setError] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);
	const [assigneeError, setAssigneeError] = useState(null);
	const [stageError, setStageError] = useState(null);
	const [companyError, setCompanyError] = useState(null);

	const [showAddCompany, setShowAddCompany] = useState(false);

	const [formData, setFormData] = useState(showEditLead ? savedData : defaultOpportunity);

	const [selectedProductService, setSelectedProductService] = useState(
		showEditLead ? savedData?.productService : [],
	);
	const [selectedPrimaryAssignees, setSelectedPrimaryAssignees] = useState(
		showEditLead ? savedData?.primaryAssignee : [],
	);
	const [selectedSupervisorAssignees, setSelectedSupervisorAssignees] = useState(
		showEditLead ? savedData?.supervisorAssignee : [],
	);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
		if (name === "stage") {
			setStageError(null);
		}
		if (name === "companyName") {
			setCompanyError(null);
		}
		if (isDisabled) {
			setIsDisabled(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { stage, companyName } = formData;
		if (selectedPrimaryAssignees?.length === 0) {
			setAssigneeError("Please select primary assignee");
			setIsDisabled(true);
		}

		if (stage === "") {
			setStageError("Please select stage");
			setIsDisabled(true);
		}
		if (companyName === "") {
			setCompanyError("Please select company");
			setIsDisabled(true);
		}
		const isNotValid =
			stage === "" || selectedPrimaryAssignees?.length === 0 || companyName === "" || isDisabled;
		if (isNotValid) return;
		formData.productService = selectedProductService;
		formData.primaryAssignee = selectedPrimaryAssignees;
		formData.supervisorAssignee = selectedSupervisorAssignees;

		formData.abbreviation = `${formData.name.replace(" ", "_").toUpperCase()}${today}`;
		formData.opportunityName = formData.abbreviation;
		setSubmitting(true);
		try {
			if (showEditLead) {
				await LeadsService.updateLeadInfo(formData, showEditLead._id);
			} else {
				await LeadsService.createOpportunity(formData);
			}
			setIsAdded((prev) => !prev);
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
			title={`${showEditLead ? "Edit" : "Add New"} Opportunity`}
			isOpen={isOpen || showEditLead}
			onClose={onClose}
			error={error}
		>
			<form onSubmit={handleSubmit}>
				<Stack spacing={4}>
					<HStack>
						<FormControl>
							<FormLabel>Company Name</FormLabel>
							<HStack justify={"space-between"}>
								<Select
									icon={<FaCaretDown />}
									borderRadius="10px"
									size="sm"
									placeholder="Select Company"
									name="name"
									value={formData.name}
									onChange={handleChange}
								>
									{companies?.map(({ _id, name }) => (
										<option value={name} key={_id}>
											{name}
										</option>
									))}
								</Select>
								<FaPlus onClick={() => setShowAddCompany(true)} />
							</HStack>
						</FormControl>

						{showAddCompany && (
							<AddCompany
								showAddCompany={showAddCompany}
								setRefresh={setRefresh}
								setShowAddCompany={setShowAddCompany}
								company={company}
							/>
						)}
					</HStack>
					{companyError && (
						<Flex>
							<Spacer flex={0.5} />
							<Text flex={0.5} color={"red"}>
								{companyError}
							</Text>
						</Flex>
					)}
					<HStack>
						<InputFormControl
							label={"Phone"}
							name="phone"
							valueText={formData.phone}
							handleChange={handleChange}
							required
						/>
						<InputFormControl
							label={"Email"}
							name="email"
							type="email"
							valueText={formData.email}
							handleChange={handleChange}
							required
						/>
					</HStack>

					<FormControl>
						<RequiredLabel label="Address" required />
						<HStack>
							<Input
								type="text"
								name="streetNumber"
								size={"sm"}
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
								required
							/>

							<Input
								type="text"
								name="city"
								size={"sm"}
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
								required
							/>
						</HStack>
						<HStack mt={3}>
							<Input
								type="text"
								name="state"
								size={"sm"}
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
								required
							/>
							<Input
								type="text"
								name="postalCode"
								size={"sm"}
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
								required
							/>
							<Input
								type="text"
								name="country"
								size={"sm"}
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
								required
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
								required
								assigneeError={assigneeError}
								setAssigneeError={setAssigneeError}
								isDisabled={isDisabled}
								setIsDisabled={setIsDisabled}
								assignees={assignees}
								selectedAssignees={selectedPrimaryAssignees}
								onAssigneeChange={setSelectedPrimaryAssignees}
								onRemoveAssignee={setSelectedPrimaryAssignees}
								label="Primary Assignee"
								name="primaryAssignee"
							/>
							{assigneeError && <Text color={"red"}>{assigneeError}</Text>}
							<AssigneeSelector
								assignees={managers}
								selectedAssignees={selectedSupervisorAssignees}
								onAssigneeChange={setSelectedSupervisorAssignees}
								onRemoveAssignee={setSelectedSupervisorAssignees}
								label="Supervisor Assignee"
								name="supervisorAssignee"
							/>
							<FormControl>
								<RequiredLabel label={"Stage"} required />
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
							{stageError && <Text color={"red"}>{stageError}</Text>}
						</>
					)}
					<ActionButtonGroup
						submitBtnName={showEditLead ? "Save" : "Add"}
						isDisabled={isDisabled}
						isLoading={isSubmitting}
						onClose={onClose}
					/>
				</Stack>
			</form>
		</ModalLayout>
	);
};

export default AddNewOpportunity;
