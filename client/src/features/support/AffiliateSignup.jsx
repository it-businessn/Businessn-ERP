import { CloseIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Input,
	InputGroup,
	InputLeftElement,
	Stack,
	useToast,
} from "@chakra-ui/react";
import LinkButton from "components/ui/button/LinkButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import InputFormControl from "components/ui/form/InputFormControl";
import MandatoryField from "components/ui/form/MandatoryField";
import RadioFormControl from "components/ui/form/RadioFormControl";
import TextAreaFormControl from "components/ui/form/TextAreaFormControl";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { COUNTRIES, tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import { useState } from "react";
import { FaInstagram, FaLinkedin, FaTiktok, FaYoutube } from "react-icons/fa";
import PayrollService from "services/PayrollService";
import MotionCover from "./MotionCover";

export default function AffiliateSignup() {
	const WEB = "https://www.businessn.com";
	const toast = useToast();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		linkedIn: "",
		email: "",
		phone: "",
		country: "CA",
		province: "",
		insta: "",
		tiktok: "",
		youtube: "",
		contentToShare: "",
		marketingComms: false,
	});
	const provinces = COUNTRIES[0].provinces;
	const [affiliate, setAffiliate] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
	};

	const goToHome = () => {
		window.location.href = WEB;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			const { data } = await PayrollService.addAffiliateProfileInfo(formData);
			setIsSubmitting(false);
			setAffiliate(data);
			toast({
				title: "Registration Successful!",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
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

	const handleCopy = () => {
		navigator.clipboard.writeText(affiliate.referralLink);
		toast({
			title: "Text copied!",
			status: "success",
			duration: 2000,
			isClosable: true,
		});
	};
	return (
		<Flex
			backgroundColor="var(--main_color)"
			h={"100vh"}
			flexDirection={{ base: "column", md: "row" }}
			overflow={"hidden"}
		>
			<Box
				w={{ base: "100%", md: "50%", lg: "70%" }}
				p={{ base: "3em", xl: "8em" }}
				css={tabScrollCss}
				overflow={"auto"}
				borderRadius={"xl"}
			>
				{affiliate ? (
					<div className="bg-green-50 p-4 rounded-lg">
						<NormalTextTitle
							title="
							🎉 Welcome to our affiliate program. Share your referral link below."
						/>
						<Stack>
							<HStack>
								<NormalTextTitle width={"auto"}> Your Affiliate Link:</NormalTextTitle>
								<TextTitle width={"auto"} title={affiliate.referralLink} />
							</HStack>
							<Flex w={"50%"} gap={5}>
								<PrimaryButton
									isLoading={isSubmitting}
									name={"Copy Link"}
									bg="var(--primary_button_bg1)"
									hover="none"
									onOpen={handleCopy}
								/>
								<LinkButton name="Go to website" onClick={goToHome} />
							</Flex>
						</Stack>
					</div>
				) : (
					<Stack gap={4}>
						<HStack>
							<TextTitle
								size="xl"
								whiteSpace="wrap"
								title="Interested in joining our ambassador program?"
							/>
							<CloseIcon cursor="pointer" onClick={goToHome} />
						</HStack>
						<NormalTextTitle
							whiteSpace="wrap"
							size="sm"
							title={`We're thrilled that you're ready to join our ever-growing community of Businessᴺ ambassadors. You'll be rewarded with products and earn commission in exchange for sharing our products with your audience.`}
						/>
						<HStack gap={4} flexDirection={{ base: "column", lg: "row" }}>
							<InputFormControl
								size="sm"
								required
								label="What's your first name?"
								name="firstName"
								placeholder="Enter First Name"
								valueText={formData?.firstName}
								handleChange={handleInputChange}
							/>
							<InputFormControl
								size="sm"
								required
								label="What's your last  name?"
								name="lastName"
								placeholder="Enter Last Name"
								valueText={formData?.lastName}
								handleChange={handleInputChange}
							/>

							<InputFormControl
								size="sm"
								required
								label="What's your email?"
								name="email"
								placeholder="Enter Email"
								type="email"
								valueText={formData?.email}
								handleChange={handleInputChange}
							/>
						</HStack>
						<RadioFormControl
							direction="column"
							label="Which province are you located in?"
							handleChange={(value) => setFormData({ ...formData, province: value })}
							defaultVal="BC"
							name="province"
							options={provinces}
						/>
						<HStack gap={4} flexDirection={{ base: "column", lg: "row" }}>
							<FormControl>
								<FormLabel>Instagram</FormLabel>
								<InputGroup>
									<InputLeftElement>
										<Button
											display="flex"
											bg={"var(--banner_bg)"}
											color={"var(--main_color)"}
											variant="unstyled"
											aria-label="Toggle Password Visibility"
										>
											<FaInstagram />
										</Button>
									</InputLeftElement>
									<Input
										ml={3}
										name="insta"
										value={formData?.insta}
										onChange={handleInputChange}
										required
									/>
								</InputGroup>
							</FormControl>
							<FormControl>
								<FormLabel>TikTok</FormLabel>
								<InputGroup>
									<InputLeftElement>
										<Button
											display="flex"
											bg={"var(--banner_bg)"}
											color={"var(--main_color)"}
											variant="unstyled"
											aria-label="Toggle Password Visibility"
										>
											<FaTiktok />
										</Button>
									</InputLeftElement>
									<Input
										ml={3}
										name="tiktok"
										value={formData?.tiktok}
										onChange={handleInputChange}
										required
									/>
								</InputGroup>
							</FormControl>
						</HStack>
						<HStack gap={4} flexDirection={{ base: "column", lg: "row" }}>
							<FormControl>
								<FormLabel>Youtube</FormLabel>
								<InputGroup>
									<InputLeftElement>
										<Button
											display="flex"
											bg={"var(--banner_bg)"}
											color={"var(--main_color)"}
											variant="unstyled"
											aria-label="Toggle Password Visibility"
										>
											<FaYoutube />
										</Button>
									</InputLeftElement>
									<Input
										ml={3}
										name="youtube"
										value={formData?.youtube}
										onChange={handleInputChange}
										required
									/>
								</InputGroup>
							</FormControl>
							<FormControl>
								<FormLabel>
									LinkedIn <MandatoryField color={"red"} />
								</FormLabel>
								<InputGroup>
									<InputLeftElement>
										<Button
											display="flex"
											bg={"var(--banner_bg)"}
											color={"var(--main_color)"}
											variant="unstyled"
											aria-label="Toggle Password Visibility"
										>
											<FaLinkedin />
										</Button>
									</InputLeftElement>
									<Input
										ml={3}
										name="linkedIn"
										value={formData?.linkedIn}
										onChange={handleInputChange}
										required
									/>
								</InputGroup>
							</FormControl>
						</HStack>
						<TextAreaFormControl
							maxLength={500}
							label="What kind of content do you share?"
							name="contentToShare"
							valueText={formData?.contentToShare}
							handleChange={handleInputChange}
							required
							rows={3}
						/>
						{/* <InputFormControl
						w={{ base: "100%", lg: "50%" }}
						label="Please enter your first name + space + the first letter of your last name"
						name="firstName"
						placeholder="Enter last  Name"
						valueText={formData?.lastName}
						handleChange={handleInputChange}
					/> */}
						<Box bg={"var(--payStub_bg)"} borderRadius="lg" p={4}>
							<Checkbox
								colorScheme={"facebook"}
								name="marketingComms"
								isChecked={formData.marketingComms}
								onChange={handleInputChange}
							>
								<TextTitle whiteSpace="wrap" title="Receive Marketing communication and updates" />
							</Checkbox>

							<NormalTextTitle
								size="sm"
								whiteSpace="wrap"
								p={"0 0 0 2em"}
								title="I consent to receiving marketing communications, updates, promotions, and newsletters from Businessᴺ. I acknowledge my ability to unsubscribe at any time via provided instructions."
							/>
						</Box>
						<Box bg={"var(--payStub_bg)"} borderRadius="lg" p={4}>
							<NormalTextTitle
								whiteSpace="wrap"
								size="sm"
								title={
									"By submitting this form I agree to Superfiliate handling my personal information in line with its privacy policy and Terms of Use."
								}
							/>
						</Box>
						<PrimaryButton
							isLoading={isSubmitting}
							w="full"
							name={"Submit"}
							bg="var(--banner_bg)"
							hover="none"
							onOpen={handleSubmit}
						/>
					</Stack>
				)}
			</Box>
			<MotionCover />
		</Flex>
	);
}
