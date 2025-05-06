import {
	Button,
	Divider,
	Flex,
	FormControl,
	Heading,
	HStack,
	Input,
	Stack,
	Text,
} from "@chakra-ui/react";
import CenterBoxLayout from "layouts/CenterBoxLayout";
import { useState } from "react";
import { Link } from "react-router-dom";
import PasswordService from "services/PasswordService";
import Logo from "../../components/logo";

const ForgotPassword = () => {
	const [hasError, setErrorMessage] = useState("");
	const [captionTitle, setCaptionTitle] = useState("");

	const [email, setEmail] = useState("");
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { data } = await PasswordService.sendPassword({ email });
			setCaptionTitle(data.message);
			setErrorMessage("");
		} catch (error) {
			setCaptionTitle("Sorry! Unable to sent reset link!");
			setErrorMessage(error?.response?.data?.error);
			console.log(error);
		}
	};
	return (
		<CenterBoxLayout>
			<Stack
				spacing={{
					base: "2",
					md: "3",
				}}
				textAlign="center"
			>
				<Flex h="24" m={"0 auto"}>
					<Logo isCover isForgotPassword />
				</Flex>
				<Heading
					size={{
						base: "xs",
						md: "sm",
					}}
				>
					Forgot your password?
				</Heading>
				<Text color="fg.muted">You'll get an email with a reset link</Text>
			</Stack>

			<Stack spacing="6">
				<Stack spacing="4">
					{!captionTitle && (
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
									Continue with email
								</Button>
							</Stack>
						</form>
					)}
					{captionTitle && (
						<>
							<Text color="green">{captionTitle}</Text>
							<Link to="/">
								<Button width="100%" bg="var(--banner_bg)">
									Back to Login
								</Button>
							</Link>
						</>
					)}
				</Stack>
				<HStack>
					<Divider />
					<Text textStyle="sm" color="fg.muted">
						OR
					</Text>
					<Divider />
				</HStack>
			</Stack>

			{hasError && <Text color="red">{hasError}</Text>}
			<HStack spacing="1" justify="center">
				<Text textStyle="sm" color="fg.muted">
					Having issues?
				</Text>
				<Button variant="text" size="sm">
					Contact us
				</Button>
			</HStack>
		</CenterBoxLayout>
	);
};
export default ForgotPassword;
