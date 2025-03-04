import { Box, Stack, Table, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import SettingService from "services/SettingService";

const CCForm = ({ companyName, handleClose, showList, cc }) => {
	const toast = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [CCName, setCCName] = useState("");
	const [CCDescription, setCCDescription] = useState("");

	const handleCCSubmit = async () => {
		setIsSubmitting(true);
		try {
			await SettingService.addCC({
				name: CCName,
				description: CCDescription,
				companyName,
			});
			toast({
				title: "CC added successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			setCCName("");
			setCCDescription("");
			handleClose();
		} catch (error) {
			console.log("An error occurred. Please try again.", error);
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<>
			<Stack spacing={4}>
				<InputFormControl
					label={"Name"}
					name="CCName"
					valueText={CCName}
					handleChange={(e) => setCCName(e.target.value)}
					required
					placeholder="Enter CC Name"
				/>
				<InputFormControl
					label={"Description"}
					name="CCDescription"
					valueText={CCDescription}
					handleChange={(e) => setCCDescription(e.target.value)}
					required
					placeholder="Enter CC Description"
				/>
				<ActionButtonGroup
					submitBtnName={"Add CC"}
					isDisabled={CCName === "" || CCDescription === ""}
					isLoading={isSubmitting}
					onClose={handleClose}
					onOpen={handleCCSubmit}
				/>
			</Stack>
			{showList && cc && (
				<Box>
					<TextTitle mt={3} title="All Cost Centers" />
					<Table variant="simple" size="sm">
						<Thead>
							<Tr>
								<Th>Name</Th>
							</Tr>
						</Thead>
						<Tbody>
							{(!cc || cc?.length === 0) && <EmptyRowRecord data={cc} colSpan={2} />}
							{cc?.map(({ _id, name }) => (
								<Tr key={_id}>
									<Td>{name}</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>
			)}
		</>
	);
};

export default CCForm;
