import { Box, Card, Divider, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
import React, { useState } from "react";
import { FaAddressCard, FaUndoAlt } from "react-icons/fa";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import { toCapitalize } from "utils";
import ChangePassword from "../ChangePassword";
import EditUserInfo from "./EditUserInfo";

const UserProfileDetails = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const userData = LocalStorageService.getItem("user");
	const { isMobile } = useBreakpointValue();
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

	const { streetNumber, city, state, country, postalCode } = (userData && primaryAddress) || {};

	const getAddress = primaryAddress
		? toCapitalize(
				`${streetNumber || ""} ${city || ""} ${state || ""} ${country || ""} ${postalCode || ""}`,
		  )
		: "";

	const SECTION1 = [
		{ name: "Phone Number", value: phoneNumber },
		{ name: "Address", value: getAddress },
	];

	const SECTION2 = [
		{ name: "Manager", value: manager },
		{ name: "Role", value: role },
		{ name: "Department", value: department?.[0] },
		// { name: "Employment Type", value: employmentType },
	];
	const showActionButton = () => (
		<HStack p={"1em"}>
			<PrimaryButton
				isDisabled={editMode}
				name="Edit"
				type="submit"
				// isLoading={isLoading}
				onOpen={handleEditClick}
			/>
			<PrimaryButton
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
				m="1em"
				justifyContent="space-between"
				alignItems="flex-start"
			>
				<Card
					flex={1}
					m="1em"
					bg={"var(--lead_cards_bg)"}
					border={"1px solid var(--lead_cards_bg)"}
				>
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
					<VStack align="flex-start" color={"var(--menu_item_color)"} p={"1em"}>
						{SECTION1.map(({ name, value }) => (
							<React.Fragment key={name}>
								<TextTitle title={name} />
								<Text color={"var(--main_color_black)"}>{value}</Text>
							</React.Fragment>
						))}
					</VStack>
					<VStack align="flex-start" color={"var(--menu_item_color)"} p={"1em"}>
						{SECTION2.map(({ name, value }) => (
							<React.Fragment key={name}>
								<TextTitle title={name} />
								<Text color={"var(--main_color_black)"}>{value}</Text>
							</React.Fragment>
						))}
					</VStack>
					{showActionButton()}
				</Card>
				{editMode && (
					<>
						{!isMobile && (
							<Divider
								orientation="vertical"
								height="600px"
								borderWidth="1px"
								borderColor="gray.200"
							/>
						)}
						<EditUserInfo
							company={company}
							setEditMode={setEditMode}
							setError={setError}
							error={error}
						/>
					</>
				)}
				{changePasswordMode && (
					<>
						{!isMobile && (
							<Divider
								orientation="vertical"
								height="600px"
								borderWidth="1px"
								borderColor="gray.200"
							/>
						)}
						<ChangePassword setPasswordMode={setPasswordMode} setError={setError} error={error} />
					</>
				)}
			</HStack>
		</PageLayout>
	);
};

export default UserProfileDetails;
