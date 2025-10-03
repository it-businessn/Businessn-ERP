import { Box, Card, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import { FaAddressCard, FaUndoAlt } from "react-icons/fa";
import LocalStorageService from "services/LocalStorageService";
import { hasAdminConsoleAccess } from "utils";
import { getFormattedAddress } from "utils/common";
import ChangePassword from "../ChangePassword";
import EditUserInfo from "./EditUserInfo";

const UserProfileDetails = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const userData = LocalStorageService.getItem("user");
	const [editMode, setEditMode] = useState(false);

	const [changePasswordMode, setPasswordMode] = useState(false);
	const [error, setError] = useState(null);

	const handleEditClick = () => {
		setEditMode(true);
		setPasswordMode(false);
	};

	const handlePasswordClick = () => {
		setEditMode(false);
		setPasswordMode(true);
	};

	const handleReset = () => {
		setEditMode(false);
		setPasswordMode(false);
	};
	const {
		fullName,
		email,
		role,
		department,
		phoneNumber,
		primaryAddress,
		employmentType,
		manager,
	} = userData || {};

	const SECTION1 = [
		{ name: "Phone Number", value: phoneNumber },
		{ name: "Address", value: getFormattedAddress(primaryAddress) },
	];

	const SECTION2 = [
		{ name: "Manager", value: manager },
		{ name: "Role", value: role },
		{ name: "Department", value: department },
		// { name: "Employment Type", value: employmentType },
	];
	const showActionButton = () => (
		<HStack p={"1em"}>
			<PrimaryButton
				hover="none"
				isDisabled={editMode}
				name="Edit"
				type="submit"
				// isLoading={isLoading}
				onOpen={handleEditClick}
			/>
			<PrimaryButton
				hover="none"
				isDisabled={changePasswordMode}
				name="Change Password"
				ml={2}
				// isLoading={isLoading}
				onOpen={handlePasswordClick}
			/>
			<OutlineButton
				label={<FaUndoAlt />}
				size={"sm"}
				onClick={handleReset}
				colorScheme="gray"
				ml={2}
			/>
		</HStack>
	);

	return (
		<PageLayout>
			<HStack
				flexDir={{ base: "column", md: "row" }}
				borderRadius="10px"
				border="3px solid var(--main_color)"
				p="1em"
				justifyContent="space-between"
				alignItems="flex-start"
			>
				<Card flex={1} p="1em" bg={"var(--primary_bg)"}>
					<Box
						fontWeight="bold"
						p="1em"
						bg="var(--bg_color_1)"
						borderTopLeftRadius="10px"
						borderTopRightRadius="10px"
					>
						<VStack alignItems="self-start" spacing={5}>
							<Icon as={FaAddressCard} boxSize={10} />
							<Text fontSize="xl" fontWeight="bold">
								{fullName}
							</Text>
							<Text mr="3">{email}</Text>
						</VStack>
					</Box>
					<BoxCard>
						{SECTION1.map(({ name, value }) => (
							<HStack mt={3} key={name}>
								<TextTitle title={name} width="150px" />
								<NormalTextTitle title={value} />
							</HStack>
						))}

						{SECTION2.map(({ name, value }) => (
							<HStack mt={3} key={name}>
								<TextTitle title={name} width="150px" />
								<NormalTextTitle title={value} />
							</HStack>
						))}
					</BoxCard>

					{showActionButton()}
				</Card>
				{editMode && (
					<BoxCard flex={1}>
						<EditUserInfo
							isManager={hasAdminConsoleAccess(role)}
							company={company}
							setEditMode={setEditMode}
							setError={setError}
							error={error}
						/>
					</BoxCard>
				)}
				{changePasswordMode && (
					<BoxCard flex={1}>
						<ChangePassword setPasswordMode={setPasswordMode} setError={setError} error={error} />
					</BoxCard>
				)}
			</HStack>
		</PageLayout>
	);
};

export default UserProfileDetails;
