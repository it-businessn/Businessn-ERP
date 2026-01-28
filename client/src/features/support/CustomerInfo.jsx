import {
	Box,
	Center,
	Checkbox,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Image,
	Select,
	Stack,
	useToast,
} from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import RequiredLabel from "components/ui/form/RequiredLabel";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { COUNTRIES, tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import TicketService from "services/TicketService";
import logoImgSrc from "../../assets/logos/logoCover.png";

export default function CustomerInfo() {
	const INTERESTS = {
		set1: ["Payroll", "Time management", "Scheduling", "Accounting"],
		set2: ["Project Management", "CRM", "HR"],
	};

	const toast = useToast();
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
		companyName: "",
	});
	const [provinces, setProvinces] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPopup, setShowPopup] = useState(false);
	const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

	useEffect(() => {
		if (formData?.country) {
			setProvinces(COUNTRIES.find(({ code }) => code === formData?.country)?.provinces);
		}
	}, [formData?.country]);

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
	const handleRedirect = () => (window.location.href = process.env.WEBSITE);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		formData.interests = selectedCheckboxes;
		try {
			const { data } = await TicketService.createLeadTicket(formData);
			setIsSubmitting(false);
			if (data) {
				setShowPopup(true);
				toast({
					title: "Action successful!",
					status: "success",
					duration: 2000,
					isClosable: true,
				});

				setTimeout(() => {
					handleRedirect();
				}, 2000);
			}
		} catch (error) {
			console.error("Error saving info:", error);
			toast({
				title: "Something went wrong.",
				description: "Please try again.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	return (
		<Box
			padding={"1em"}
			backgroundColor="var(--logo_bg)"
			h={"100vh"}
			overflow={"auto"}
			css={tabScrollCss}
		>
			<Center>
				<Link to="/">
					<Image
						height={"40px"}
						width={200}
						m={"0 auto"}
						objectFit="contain"
						src={logoImgSrc}
						alt="Company logo"
					/>
				</Link>
			</Center>
			<Box
				borderRadius={"lg"}
				backgroundColor="var(--main_color)"
				w={{ base: "100%", md: "80%", lg: "70%" }}
				py="2em"
				m="1em auto"
			>
				{showPopup ? (
					<Flex
						alignItems="center"
						justifyContent="center"
						flexDirection="column"
						minH="calc(100vh - 192px)"
						css={tabScrollCss}
					>
						<TextTitle
							align="center"
							size={{ base: "xl", md: "3xl" }}
							title="Thank you for reaching out."
						/>
						<NormalTextTitle
							align="center"
							size="xl"
							title="
							Our representative will get back to you shortly."
						/>
					</Flex>
				) : (
					<>
						<NormalTextTitle
							align="center"
							whiteSpace="wrap"
							title="
				Please fill in the form below and our representative will contact you shortly."
						/>
						<form>
							<Stack spacing="1em" p="2em">
								<HStack spacing={5} flexDir={{ base: "column", md: "row" }}>
									<InputFormControl
										fontSize="md"
										label="First Name"
										name="firstName"
										placeholder="Enter First Name"
										valueText={formData?.firstName || ""}
										handleChange={handleInputChange}
									/>
									<InputFormControl
										fontSize="md"
										label="Last Name"
										name="lastName"
										placeholder="Enter Last Name"
										valueText={formData?.lastName || ""}
										handleChange={handleInputChange}
									/>
								</HStack>
								<HStack spacing={5} flexDir={{ base: "column", md: "row" }}>
									<InputFormControl
										fontSize="md"
										label="Your Title"
										name="title"
										placeholder="Enter Role"
										valueText={formData?.title || ""}
										handleChange={handleInputChange}
									/>
									<InputFormControl
										fontSize="md"
										label="Your Company Name"
										name="companyName"
										placeholder="Enter Company Name"
										valueText={formData?.companyName || ""}
										handleChange={handleInputChange}
									/>
								</HStack>

								<HStack spacing={5} flexDir={{ base: "column", md: "row" }}>
									<InputFormControl
										fontSize="md"
										label="Work Email"
										name="email"
										placeholder="Enter Email"
										valueText={formData?.email || ""}
										type="email"
										handleChange={handleInputChange}
									/>
									<InputFormControl
										fontSize="md"
										label="Phone"
										name="phone"
										placeholder="Enter Phone"
										valueText={formData?.phone || ""}
										type="tel"
										handleChange={handleInputChange}
									/>
								</HStack>
								<HStack spacing={5} flexDir={{ base: "column", md: "row" }}>
									<FormControl>
										<RequiredLabel required label="Country" />
										<Select
											icon={<FaCaretDown />}
											placeholder="Select Country"
											value={formData?.country || ""}
											onChange={(e) => {
												if (e.target.value) {
													setFormData((prevData) => ({
														...prevData,
														country: e.target.value,
													}));
												}
											}}
										>
											{COUNTRIES.map(({ type, code }) => (
												<option key={type} value={code}>
													{type}
												</option>
											))}
										</Select>
									</FormControl>
									<FormControl>
										<RequiredLabel required label="Province / State" />
										<Select
											icon={<FaCaretDown />}
											placeholder="Select Province / State"
											value={formData?.province || ""}
											onChange={(e) => {
												if (e.target.value) {
													setFormData((prevData) => ({
														...prevData,
														province: e.target.value,
													}));
												}
											}}
										>
											{provinces.map(({ name, id }) => (
												<option key={name} value={id}>
													{name}
												</option>
											))}
										</Select>
									</FormControl>
								</HStack>
								<InputFormControl
									fontSize="md"
									label="Annual Revenue"
									name="annualRevenue"
									placeholder="Enter Annual Revenue"
									valueText={formData?.annualRevenue || ""}
									handleChange={handleInputChange}
								/>
								<InputFormControl
									fontSize="md"
									label="Number of Employees"
									name="totalEmployees"
									valueText={formData?.totalEmployees || ""}
									typ="number"
									handleChange={handleInputChange}
								/>
								<FormControl>
									<FormLabel fontSize="md">I'm interested in</FormLabel>
									<Stack>
										<HStack
											spacing={{ base: 1, md: 8 }}
											flexDir={{ base: "column", md: "row" }}
											alignItems={{ base: "start", md: "center" }}
										>
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
										<HStack
											spacing={{ base: 1, md: 8 }}
											flexDir={{ base: "column", md: "row" }}
											alignItems={{ base: "start", md: "center" }}
										>
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
									isDisabled={!formData?.country || !formData.province}
									isLoading={isSubmitting}
									onOpen={handleSubmit}
									justifyContent="center"
								/>
							</Stack>
						</form>
					</>
				)}
			</Box>
		</Box>
	);
}
