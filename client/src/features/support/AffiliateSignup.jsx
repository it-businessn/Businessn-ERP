import { CloseIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Checkbox,
	Circle,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Image,
	Input,
	InputGroup,
	InputLeftElement,
	Stack,
	useToast,
	VStack,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import InputFormControl from "components/ui/form/InputFormControl";
import MandatoryField from "components/ui/form/MandatoryField";
import RadioFormControl from "components/ui/form/RadioFormControl";
import TextAreaFormControl from "components/ui/form/TextAreaFormControl";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { COUNTRIES, tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import affImg1 from "../../assets/affiliate/1.jpg";
import affImg2 from "../../assets/affiliate/2.jpg";
import affImg3 from "../../assets/affiliate/3.jpg";
import affImg4 from "../../assets/affiliate/4.jpg";
import logoSrc from "../../assets/logos/logoCover.png";

export default function AffiliateSignup() {
	const WEB = "https://www.businessn.com";
	const MotionImage = motion(Image);
	const AFFILIATE_IMG = [affImg1, affImg2, affImg3, affImg4];
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
		tiktik: "",
		youtube: [],
		content: "",
		marketingComms: false,
	});
	const provinces = COUNTRIES[0].provinces;
	const [index, setIndex] = useState(0);
	const total = AFFILIATE_IMG.length;

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPopup, setShowPopup] = useState(false);
	const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((i) => (i + 1) % total);
		}, 2000);

		return () => clearInterval(interval);
	}, []);

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleRedirect = () => (window.location.href = WEB);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		formData.interests = selectedCheckboxes;
		try {
			const { data } = await PayrollService.addAffiliateProfileInfo(formData);
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
	const handleChange = () => {};

	return (
		<Flex backgroundColor="var(--main_color)" h={"100vh"} overflow={"auto"}>
			<Box w="70%" p={40} css={tabScrollCss} overflow={"auto"} borderRadius={"xl"}>
				<Stack gap={4}>
					<HStack>
						<TextTitle size="xl" title="Interested in joining our ambassdor program?" />
						<CloseIcon cursor="pointer" onClick={handleRedirect} />
					</HStack>
					<NormalTextTitle
						title={`We're thrilled that you're ready to join our ever-growing community of Businessᴺ ambassadors. You'll be rewarded with products and earn commission in exchange for sharing our products with your audience. Sound good? Apply below!`}
					/>
					<HStack gap={4}>
						<InputFormControl
							required
							label="What's your first name?"
							name="firstName"
							placeholder="Enter First Name"
							valueText={formData?.firstName || ""}
							handleChange={handleInputChange}
						/>
						<InputFormControl
							required
							label="What's your last  name?"
							name="firstName"
							placeholder="Enter last  Name"
							valueText={formData?.lastName || ""}
							handleChange={handleInputChange}
						/>

						<InputFormControl
							required
							label="What's your email?"
							name="firstName"
							placeholder="Enter Email"
							valueText={formData?.email || ""}
							handleChange={handleInputChange}
						/>
					</HStack>
					<RadioFormControl
						direction="column"
						label="Which province are you located in?"
						handleChange={(value) =>
							handleInputChange("employerInfo", "preferredCommunication", value)
						}
						defaultVal="English"
						options={provinces}
					/>
					<HStack gap={4}>
						<FormControl>
							<FormLabel>Instagram</FormLabel>
							<InputGroup>
								<InputLeftElement>
									<Button size="sm" variant="unstyled" aria-label="Toggle Password Visibility">
										<ViewOffIcon />
									</Button>
								</InputLeftElement>
								<Input
									name="firstName"
									value={formData?.password}
									onChange={handleChange}
									required
								/>
							</InputGroup>
						</FormControl>
						<FormControl>
							<FormLabel>TikTok</FormLabel>
							<InputGroup>
								<InputLeftElement>
									<Button size="sm" variant="unstyled" aria-label="Toggle Password Visibility">
										<ViewOffIcon />
									</Button>
								</InputLeftElement>
								<Input
									name="firstName"
									value={formData?.password}
									onChange={handleChange}
									required
								/>
							</InputGroup>
						</FormControl>
					</HStack>
					<HStack gap={4}>
						<FormControl>
							<FormLabel>Youtube</FormLabel>
							<InputGroup>
								<InputLeftElement>
									<Button size="sm" variant="unstyled" aria-label="Toggle Password Visibility">
										<ViewOffIcon />
									</Button>
								</InputLeftElement>
								<Input
									name="firstName"
									value={formData?.password}
									onChange={handleChange}
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
									<Button size="sm" variant="unstyled" aria-label="Toggle Password Visibility">
										<ViewOffIcon />
									</Button>
								</InputLeftElement>
								<Input
									name="firstName"
									value={formData?.password}
									onChange={handleChange}
									required
								/>
							</InputGroup>
						</FormControl>
					</HStack>
					<TextAreaFormControl
						maxLength={500}
						label="What kind of content do you share?"
						name="issue"
						valueText={formData?.content}
						// handleChange={handleChange}
						required
						rows={3}
					/>
					<InputFormControl
						w={"50%"}
						label="Please enter your first name + space + the first letter of your last name"
						name="firstName"
						placeholder="Enter last  Name"
						valueText={formData?.lastName || ""}
						handleChange={handleInputChange}
					/>
					<Box bg={"var(--payStub_bg)"} borderRadius="lg" p={4}>
						<Checkbox
							colorScheme={"facebook"}
							isChecked={!formData.marketingComms}
							// onChange={() => setHasChecklist(!hasChecklist)}
						>
							<TextTitle title="Receive Marketing communication and updates" />
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
							size="sm"
							title={
								"By submitting this form I agree to Superfiliate handling my personal information in line with its privacy policy and Terms of Use."
							}
						/>
					</Box>
					<PrimaryButton
						w="full"
						name={"Submit"}
						bg="var(--banner_bg)"
						hover="none"
						// onOpen={() => setShowModal(true)}
					/>
				</Stack>
			</Box>

			<Box bg="var(--banner_bg)" w="30%" p={6} display="flex" justifyContent="space-between">
				<VStack w="100%" gap={8} h="100%" justifyContent="center">
					<a href="/" aria-current="page" className="w-inline-block w--current">
						<img src={logoSrc} loading="lazy" className="affiliate-logo " alt="main-logo" />
					</a>
					<Box h={"500px"} w={"300px"}>
						<AnimatePresence mode="wait">
							<MotionImage
								key={AFFILIATE_IMG[index]}
								src={AFFILIATE_IMG[index]}
								alt={`Slide ${index}`}
								objectFit="cover"
								width="100%"
								height="100%"
								initial={{ opacity: 0.5, x: 100 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0.5, x: -100 }}
								transition={{ duration: 0.2 }}
								borderRadius="lg"
							/>
						</AnimatePresence>
					</Box>
					<NormalTextTitle
						align="center"
						color="var(--main_color)"
						title="Get early access to services, free products and more!"
					/>
					<HStack spacing={3}>
						{AFFILIATE_IMG.map((_, i) => (
							<Circle
								key={i}
								size="10px"
								bg={i === index ? "blue.500" : "gray.300"}
								cursor="pointer"
								onClick={() => setIndex(i)}
								transition="background-color 0.3s"
							/>
						))}
					</HStack>
				</VStack>
			</Box>
		</Flex>
	);
}
