import { Box, Button, Flex, FormControl, Image, Input, Stack } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import CenterBoxLayout from "layouts/CenterBoxLayout";
import { useState } from "react";
import { Link } from "react-router-dom";
import { isMobileView } from "services/Breakpoint";
import PasswordService from "services/PasswordService";
import logoImgSrc from "../../assets/logos/logo1.png";
import Logo from "../../components/logo";

const ForgotPassword = () => {
	const [errorMessage, setErrorMessage] = useState("");
	const [captionTitle, setCaptionTitle] = useState("");

	const [email, setEmail] = useState("");
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { data } = await PasswordService.sendPassword({ email });
			setCaptionTitle(data.message);
		} catch (error) {
			setErrorMessage(error?.response?.data?.error);
		}
	};
	const LogoContent = () =>
		isMobileView ? (
			<Link to="/">
				<Image
					height={"50px"}
					width={"50px"}
					m={"0 auto"}
					objectFit="contain"
					src={logoImgSrc}
					alt="Company logo"
				/>
			</Link>
		) : (
			<Logo isCover isForgotPassword />
		);
	return captionTitle ? (
		<CenterBoxLayout spacing="0">
			<Flex h="24" m={"0 auto"}>
				<LogoContent />
			</Flex>
			<TextTitle
				title="
					Password Reset Link Sent"
				size="xl"
			/>
			<NormalTextTitle color="green" whiteSpace="wrap" title={captionTitle} />
		</CenterBoxLayout>
	) : (
		<CenterBoxLayout>
			<Stack
				spacing={{
					base: "2",
					md: "3",
				}}
			>
				<Flex h="24" m={"0 auto"}>
					<LogoContent />
				</Flex>
				<TextTitle
					size={{
						base: "lg",
						md: "2xl",
					}}
					align={"center"}
					title="Forgot your password?"
				/>
				<NormalTextTitle
					size="sm"
					title="Please enter your email address. You will receive a new password via email."
					whiteSpace="wrap"
				/>
				<Stack spacing="4">
					<form onSubmit={handleSubmit}>
						<Stack spacing={4}>
							<FormControl>
								<Input
									type="email"
									name="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</FormControl>
							<Button type="submit" bg="var(--banner_bg)">
								Get Password
							</Button>
						</Stack>
					</form>
				</Stack>
				{/* <HStack>
					<Divider />
					<Text textStyle="sm" color="fg.muted">
						OR
					</Text>
					<Divider />
				</HStack> */}
				{errorMessage && (
					<Box color="red">
						<TextTitle
							size="sm"
							whiteSpace="wrap"
							title="The email address you entered was not found."
						/>
						<TextTitle size="sm" whiteSpace="wrap" title={errorMessage} />
					</Box>
				)}
				{/* <HStack spacing="1" justify="center">
					<Text textStyle="sm" color="fg.muted">
						Having issues?
					</Text>
					<Button variant="text" size="sm">//send contact us link
						Contact us
					</Button>
				</HStack> */}
			</Stack>
		</CenterBoxLayout>
	);
};
export default ForgotPassword;
