import { FormControl, FormLabel, HStack, Select, Stack } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import useSalesAgentData from "hooks/useSalesAgentData";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import LeadsService from "services/LeadsService";
import PayoutService from "services/PayoutService";

const AddNewSale = ({ isOpen, onClose, setIsAdded, company }) => {
	const defaultPayout = {
		amount: 0,
		fullName: "",
		saleId: "",
		companyName: company,
	};
	const [isSubmitting, setSubmitting] = useState(false);
	const [formData, setFormData] = useState(defaultPayout);

	const [leads, setLeads] = useState(null);
	const reps = useSalesAgentData(company, false, true);

	useEffect(() => {
		const fetchAllLeads = async () => {
			try {
				const { data } = await LeadsService.getOpportunityNames(company);
				setLeads(data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchAllLeads();
	}, [company]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setSubmitting(true);

		try {
			await PayoutService.addPayout(formData);
			setIsAdded(true);
			onClose();
			setFormData(defaultPayout);
			setSubmitting(false);
		} catch (error) {
			console.log(error);
		} finally {
			setSubmitting(false);
		}
	};
	return (
		<ModalLayout title={"Add New Sale"} isOpen={isOpen} onClose={onClose}>
			<form onSubmit={handleSubmit}>
				<Stack spacing={4}>
					<HStack>
						<FormControl>
							<FormLabel>Sale</FormLabel>
							<Select
								icon={<FaCaretDown />}
								borderRadius="10px"
								size="sm"
								placeholder="Select Lead"
								name="saleId"
								value={formData?.saleId}
								onChange={handleChange}
							>
								{leads?.map(({ _id, opportunityName }) => (
									<option value={_id} key={_id}>
										{opportunityName}
									</option>
								))}
							</Select>
						</FormControl>
						<FormControl>
							<FormLabel>Salesperson</FormLabel>
							<Select
								icon={<FaCaretDown />}
								borderRadius="10px"
								size="sm"
								placeholder="Select Agent"
								name="fullName"
								value={formData?.fullName}
								onChange={handleChange}
							>
								{reps?.map(({ _id, fullName }) => (
									<option value={fullName} key={_id}>
										{fullName}
									</option>
								))}
							</Select>
						</FormControl>
					</HStack>
					<InputFormControl
						label={"Amount"}
						name="amount"
						valueText={formData?.amount}
						handleChange={handleChange}
						required
						type="number"
					/>
					<ActionButtonGroup submitBtnName={"Add"} isLoading={isSubmitting} onClose={onClose} />
				</Stack>
			</form>
		</ModalLayout>
	);
};

export default AddNewSale;
