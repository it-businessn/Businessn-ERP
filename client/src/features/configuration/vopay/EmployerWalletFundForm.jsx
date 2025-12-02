import { FormControl, FormLabel, Select, useToast } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { COUNTRIES } from "erp-modules/payroll/onboard-user/customInfo";
import { useState } from "react";
import VoPayService from "services/VoPayService";

const EmployerWalletFundForm = ({ setRefresh }) => {
	const toast = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const defaultFormData = {
		CompanyName: "TechCorp Ltd",
		Address1: "123 Bay Street",
		City: "Toronto",
		Province: "ON",
		Country: "CA",
		PostalCode: "M5J2N1",
		// AccountNumber: "987654321",
		// FinancialInstitutionNumber: "001",
		// BranchTransitNumber: "12345",
		Amount: 1,
		Currency: "CAD",
	};

	const [formData, setFormData] = useState(defaultFormData);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const submitClicked = async () => {
		setIsSubmitting(true);
		try {
			const { data } = await VoPayService.fundEmployerWallet(formData);
			if (data.Success === true) {
				setRefresh((prev) => !prev);
				setFormData(defaultFormData);
				toast({
					title: "Account added successfully",
					status: "success",
					duration: 1500,
					isClosable: true,
				});
			} else {
				toast({
					title: "Error",
					description: data?.ErrorMessage,
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: error?.response?.data?.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<TextTitle size="lg" title={`Employer Wallet Fund`} />
			<InputFormControl
				label={"Name"}
				size={"sm"}
				name="name"
				valueText={formData?.name}
				handleChange={handleChange}
				required
				placeholder="Name of the person/company"
			/>
			<InputFormControl
				required
				size={"sm"}
				label={"Email"}
				name="email"
				valueText={formData?.email}
				handleChange={handleChange}
				placeholder="Email address of the person/company"
			/>
			<FormControl isRequired>
				<FormLabel size="sm">Country</FormLabel>
				<Select
					size="sm"
					name="country"
					value={formData.country || ""}
					onChange={handleChange}
					placeholder="Select Country"
				>
					{COUNTRIES.map(({ type, code }) => (
						<option key={type} value={code}>
							{type}
						</option>
					))}
				</Select>
			</FormControl>

			<ActionButtonGroup
				submitBtnName="Add"
				onOpen={submitClicked}
				size="sm"
				justifyContent="end"
				isLoading={isSubmitting}
			/>
		</>
	);
};

export default EmployerWalletFundForm;
