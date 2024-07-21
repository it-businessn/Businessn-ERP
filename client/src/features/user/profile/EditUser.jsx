import { PhoneIcon } from "@chakra-ui/icons";
import {
	Button,
	Card,
	CardBody,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	InputGroup,
	InputLeftElement,
	Select,
	SimpleGrid,
	Spacer,
	Stack,
	StackDivider,
	useToast,
} from "@chakra-ui/react";
import { UserProfile } from "components";
import ProfileContainer from "components/ui/ProfileContainer";
import { UserSchema } from "config/schema";
import { TOAST } from "constant";
import { Field, Form, FormikProvider, useFormik } from "formik";
import { useAuthContext } from "hooks/useAuthContext";
import useSettings from "hooks/useSettings";
import { useNavigate, useParams } from "react-router-dom";
import UserService from "services/UserService";

export default function EditUser() {
	const { user, dispatch } = useAuthContext();
	const userData = user?.user;
	const navigate = useNavigate();
	const { id } = useParams();

	let initialValues = {
		firstName: userData?.firstName,
		middleName: userData?.middleName,
		lastName: userData?.lastName,
		email: userData?.email,
		password: userData?.password,
		role: userData?.role,
		department: userData?.department,
		dateOfJoining: userData?.dateOfJoining,
		phoneNumber: userData?.phoneNumber,
		streetNumber: userData?.address.streetNumber,
		city: userData?.address.city,
		state: userData?.address.state,
		postalCode: userData?.address.postalCode,
		country: userData?.address.country,
		annualSalary: userData?.annualSalary,
	};
	const formik = useFormik({
		initialValues,
		validationSchema: UserSchema,
		onSubmit: (formValues) => {
			try {
				handleSubmit(formValues);
			} catch (error) {
				console.log(error);
			}
		},
	});
	const userRole = useSettings("role");
	const departments = useSettings("department");
	const toast = useToast();
	const handleSubmit = async (values) => {
		try {
			const updatedData = await UserService.updateUserById(
				id,
				values,
				user.token,
			);

			const updatedUser = {
				user: updatedData.data,
				token: user.token,
			};
			dispatch({ type: "UPDATE_USER", payload: updatedUser });
			setTimeout(() => {
				navigate("/");
			}, 3000);
		} catch (error) {
			toast(TOAST.ERROR);

			console.log(error);
		}
	};

	return (
		<>
			<ProfileContainer>
				<FormikProvider value={formik}>
					<Form>
						<Stack
							spacing={{
								base: "8",
								lg: "6",
							}}
						>
							<Card>
								<CardBody>
									<Flex>
										<Stack
											spacing={{
												base: "5",
												sm: "6",
											}}
										>
											<UserProfile
												user={userData}
												image="https://tinyurl.com/yhkm2ek8"
											/>
										</Stack>
										<Spacer />
										<Button
											type="submit"
											variant="outline"
											onClick={() => navigate(-1)}
										>
											Cancel
										</Button>
										&nbsp;
										<Button type="submit" variant="primary">
											Update
										</Button>
									</Flex>
								</CardBody>
							</Card>
							<Card>
								<CardBody>
									<Stack divider={<StackDivider />}>
										<Flex>
											<Heading size="xs">Personal Information</Heading>

											<Spacer />
										</Flex>
										<SimpleGrid columns={3} spacing={8}>
											<Field name="firstName" key="firstName">
												{({ field }) => (
													<FormControl id="firstName">
														<FormLabel>First Name</FormLabel>
														<Input
															defaultValue={userData?.firstName}
															{...field}
														/>
													</FormControl>
												)}
											</Field>
											<Field name="middleName" key="middleName">
												{({ field }) => (
													<FormControl id="middleName">
														<FormLabel>Middle Name</FormLabel>
														<Input
															defaultValue={userData?.middleName}
															{...field}
														/>
													</FormControl>
												)}
											</Field>
											<Field name="lastName" key="lastName">
												{({ field }) => (
													<FormControl id="lastName">
														<FormLabel>Last Name</FormLabel>
														<Input
															defaultValue={userData?.lastName}
															{...field}
														/>
													</FormControl>
												)}
											</Field>
											<Field name="phoneNumber" key="phoneNumber">
												{({ field }) => (
													<FormControl id="phoneNumber">
														<FormLabel>Phone Number</FormLabel>
														<InputGroup>
															<InputLeftElement pointerEvents="none">
																<PhoneIcon color="gray.300" />
															</InputLeftElement>
															<Input
																type="tel"
																placeholder="Phone number"
																defaultValue={userData?.phoneNumber}
																{...field}
															/>
														</InputGroup>
													</FormControl>
												)}
											</Field>

											<Field name="role" key="role">
												{({ field }) => (
													<FormControl id="role">
														<FormLabel>Role</FormLabel>
														<Select placeholder={userData?.role} {...field}>
															{userRole.length &&
																userRole.map((item) => (
																	<option key={item} value={item}>
																		{item}
																	</option>
																))}
														</Select>
													</FormControl>
												)}
											</Field>
											<Field name="department" key="department">
												{({ field }) => (
													<FormControl id="department">
														<FormLabel>Department</FormLabel>
														<Select
															placeholder={userData?.department}
															{...field}
														>
															{departments.length &&
																departments.map((item) => (
																	<option key={item} value={item}>
																		{item}
																	</option>
																))}
														</Select>
													</FormControl>
												)}
											</Field>
										</SimpleGrid>
									</Stack>
								</CardBody>
							</Card>
							<Card>
								<CardBody>
									<Stack divider={<StackDivider />}>
										<Flex>
											<Heading size="xs">Address</Heading>

											<Spacer />
										</Flex>

										<SimpleGrid columns={3} spacing={8}>
											<Field name="streetNumber" key="streetNumber">
												{({ field }) => (
													<FormControl id="streetNumber">
														<FormLabel>Street Number</FormLabel>
														<Input
															defaultValue={userData?.address.streetNumber}
															{...field}
														/>
													</FormControl>
												)}
											</Field>
											<Field name="city" key="city">
												{({ field }) => (
													<FormControl id="city">
														<FormLabel>City</FormLabel>
														<Input
															defaultValue={userData?.address.city}
															{...field}
														/>
													</FormControl>
												)}
											</Field>
											<Field name="state" key="state">
												{({ field }) => (
													<FormControl id="state">
														<FormLabel>State / Province</FormLabel>
														<Input
															defaultValue={userData?.address.state}
															{...field}
														/>
													</FormControl>
												)}
											</Field>
											<Field name="postalCode" key="postalCode">
												{({ field }) => (
													<FormControl id="postalCode">
														<FormLabel>ZIP/ Postal Code</FormLabel>
														<Input
															defaultValue={userData?.address.postalCode}
															{...field}
														/>
													</FormControl>
												)}
											</Field>
											<Field name="country" key="country">
												{({ field }) => (
													<FormControl id="country">
														<FormLabel>Country</FormLabel>
														<Input
															defaultValue={userData?.address.country}
															{...field}
														/>
													</FormControl>
												)}
											</Field>
										</SimpleGrid>
									</Stack>
								</CardBody>
							</Card>
						</Stack>
					</Form>
				</FormikProvider>
			</ProfileContainer>
		</>
	);
}
