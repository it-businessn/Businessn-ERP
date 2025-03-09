import {
	Box,
	Center,
	Checkbox,
	FormControl,
	FormLabel,
	HStack,
	Stack,
	useToast,
} from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import TicketService from "services/TicketService";

export default function CustomerInfo({ onClose }) {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		title: "",
		email: "",
		phone: "",
		country: "",
		province: "",
		annualRevenue: "",
		totalEmployees: "",
		interests: [],
	});

	const INTERESTS = {
		set1: ["Payroll", "Time management", "Scheduling", "Accounting"],
		set2: ["Project Management", "CRM", "HR"],
	};
	const [isSubmitting, setIsSubmitting] = useState(false);

	const toast = useToast();
	const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

	const handleCheckboxChange = (value) => {
		if (selectedCheckboxes.includes(value)) {
			setSelectedCheckboxes(selectedCheckboxes.filter((checkbox) => checkbox !== value));
		} else {
			setSelectedCheckboxes([...selectedCheckboxes, value]);
		}
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		formData.interests = selectedCheckboxes;
		try {
			const { data } = await TicketService.saveCustomerPricingInfo(formData);
			setIsSubmitting(false);
			toast({
				title: "Info saved successfully.",
				status: "success",
				duration: 1000,
				isClosable: true,
			});
		} catch (error) {
			console.error("Error saving info:", error);
		}
	};

	return (
		<Box padding={"24px"} backgroundColor="var(--main_color)" h={"100vh"}>
			<Center>
				<a href="/" aria-current="page" className="main-logo w-inline-block w--current">
					<img
						src="https://cdn.prod.website-files.com/66d2b99c721c32f423762484/66dade9174eaeb438087f3ff_logo.png"
						loading="lazy"
						sizes="(max-width: 479px) 100vw, (max-width: 767px) 180px, (max-width: 991px) 23vw, 213px"
						srcSet="https://cdn.prod.website-files.com/66d2b99c721c32f423762484/66dade9174eaeb438087f3ff_logo-p-500.png 500w, https://cdn.prod.website-files.com/66d2b99c721c32f423762484/66dade9174eaeb438087f3ff_logo-p-800.png 800w, https://cdn.prod.website-files.com/66d2b99c721c32f423762484/66dade9174eaeb438087f3ff_logo.png 852w"
						alt="main-logo"
					/>
				</a>
			</Center>
			<Box w={"100%"} p={"2em 35em"}>
				<TextTitle align="center" size="3xl" title="Plans & Pricing" />
				<NormalTextTitle
					align="center"
					title="
				Please fill in the form below and our representative will contact you shortly."
				/>
				<form>
					<Stack spacing="1em" p="2em">
						<HStack spacing={5}>
							<InputFormControl
								fontSize="md"
								label="First Name"
								name="firstName"
								placeholder="Enter First Name"
								valueText={formData.firstName || ""}
								// handleChange={(e) => {
								// 	setFormData((prev) => ({
								// 		...prev,
								// 		payRate: e.target.value,
								// 	}));
								// }}
								handleChange={handleInputChange}
							/>
							<InputFormControl
								fontSize="md"
								label="Last Name"
								name="lastName"
								placeholder="Enter Last Name"
								valueText={formData.lastName || ""}
								handleChange={handleInputChange}
							/>
						</HStack>
						<InputFormControl
							fontSize="md"
							label="Your Title"
							name="title"
							placeholder="Enter Role"
							valueText={formData.title || ""}
							// handleChange={(e) => {
							// 	setFormData((prev) => ({
							// 		...prev,
							// 		payRate: e.target.value,
							// 	}));
							// }}
							handleChange={handleInputChange}
						/>
						<HStack spacing={5}>
							<InputFormControl
								fontSize="md"
								label="Work Email"
								name="email"
								placeholder="Enter Email"
								valueText={formData.email || ""}
								type="email"
								handleChange={handleInputChange}
							/>
							<InputFormControl
								fontSize="md"
								label="Phone"
								name="phone"
								placeholder="Enter Phone"
								valueText={formData.phone || ""}
								type="number"
								handleChange={handleInputChange}
							/>
						</HStack>
						<HStack spacing={5}>
							<InputFormControl
								fontSize="md"
								label="Country"
								name="country"
								placeholder="Enter Country"
								valueText={formData.country || ""}
								handleChange={handleInputChange}
							/>
							<InputFormControl
								fontSize="md"
								label="Province / State"
								name="province"
								placeholder="Enter Province / State"
								valueText={formData.province || ""}
								handleChange={handleInputChange}
							/>
						</HStack>
						<InputFormControl
							fontSize="md"
							label="Annual Revenue"
							name="annualRevenue"
							placeholder="Enter Annual Revenue"
							valueText={formData.annualRevenue || ""}
							handleChange={handleInputChange}
						/>
						<InputFormControl
							fontSize="md"
							label="Number of Employees"
							name="totalEmployees"
							valueText={formData.totalEmployees || ""}
							typ="number"
							handleChange={handleInputChange}
						/>
						<FormControl>
							<FormLabel fontSize="md">I'm interested in</FormLabel>
							<Stack>
								<HStack spacing={8}>
									{INTERESTS.set1?.map((name, index) => (
										<Checkbox
											colorScheme="facebook"
											key={`${name}_${index}`}
											size="md"
											onChange={() => handleCheckboxChange(name)}
										>
											<NormalTextTitle title={name} />
										</Checkbox>
									))}
								</HStack>
								<HStack spacing={8}>
									{INTERESTS.set2?.map((name, index) => (
										<Checkbox
											colorScheme="facebook"
											key={`${name}_${index}`}
											size="md"
											onChange={() => handleCheckboxChange(name)}
										>
											<NormalTextTitle title={name} />
										</Checkbox>
									))}
								</HStack>
							</Stack>
						</FormControl>
						<ActionButtonGroup
							submitBtnName={"Submit"}
							isDisabled={formData.fullName === ""}
							isLoading={isSubmitting}
							onOpen={handleSubmit}
							justifyContent="center"
						/>
					</Stack>
				</form>
			</Box>
		</Box>
	);
}
