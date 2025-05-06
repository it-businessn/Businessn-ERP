import {
	Button,
	Center,
	FormControl,
	HStack,
	PinInput,
	PinInputField,
	Stack,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { Field, Form, FormikProvider, useFormik } from "formik";
import { useAuthContext } from "hooks/useAuthContext";
import { useVerifyEmailOTP } from "hooks/useVerifyEmailOTP";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyPIN = () => {
	const { user } = useAuthContext();
	const { verifyEmailOTP, error, isLoading, message } = useVerifyEmailOTP();
	const [OTP, setOTP] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (verifyUserFormData) => {
		verifyUserFormData.otp = OTP;
		await verifyEmailOTP(verifyUserFormData);
	};
	if (message) {
		setTimeout(() => {
			navigate("/");
		}, 3000);
	}
	const formik = useFormik({
		initialValues: { email: user?.user?.email, otp: "" },
		onSubmit: handleSubmit,
	});

	return (
		<>
			<Center
				fontSize={{ base: "sm", sm: "md" }}
				fontWeight="bold"
				color={useColorModeValue("gray.800", "gray.400")}
			>
				{user?.user?.email}
			</Center>
			<HStack spacing="1" justify="center">
				<FormikProvider value={formik}>
					<Form>
						<Field name="pin">
							{() => (
								<FormControl>
									<HStack>
										<PinInput type="alphanumeric" onChange={(value) => setOTP(value)}>
											<PinInputField />
											<PinInputField />
											<PinInputField />
											<PinInputField />
											<PinInputField />
											<PinInputField />
										</PinInput>
									</HStack>
								</FormControl>
							)}
						</Field>
						<Stack>
							<Button marginTop="1em" variant="primary" type="submit" isLoading={isLoading}>
								Verify
							</Button>
						</Stack>
					</Form>
				</FormikProvider>
			</HStack>
			{message && (
				<Text color="var(--action_status_approve)" align="center">
					{message}
				</Text>
			)}
			{error && (
				<Text color="red" align="center">
					{error}
				</Text>
			)}
		</>
	);
};

export default VerifyPIN;
