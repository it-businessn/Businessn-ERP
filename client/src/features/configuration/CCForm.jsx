import { Stack, Table, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import ActionButton from "components/ui/button/ActionButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import useCostCenter from "hooks/useCostCenter";
import { useState } from "react";
import SettingService from "services/SettingService";
import { ConfigTabLayout } from "./ConfigTabLayout";

const CCForm = ({ companyName }) => {
	const toast = useToast();

	const [ccAdded, setCcAdded] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [CCName, setCCName] = useState("");
	const [CCDescription, setCCDescription] = useState("");
	const cc = useCostCenter(companyName, ccAdded);

	const handleCCSubmit = async () => {
		setIsSubmitting(true);
		try {
			await SettingService.addCC({
				name: CCName,
				description: CCDescription,
				companyName,
			});
			toast({
				title: "Cost Center added successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			setCCName("");
			setCCDescription("");
			setCcAdded((prev) => !prev);
		} catch (error) {
			toast({
				title: "Error",
				description: error?.response?.data?.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			console.log("An error occurred. Please try again.", error);
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<ConfigTabLayout
			tableData={cc}
			tableTitle="All Cost Centers"
			tableContent={
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
			}
			leftContent={
				<Stack spacing={4}>
					<TextTitle align={"center"} title="New Cost Center" />
					<InputFormControl
						label={"Name"}
						size={"sm"}
						name="CCName"
						valueText={CCName}
						handleChange={(e) => setCCName(e.target.value)}
						required
						placeholder="Enter CC Name"
					/>
					<InputFormControl
						size={"sm"}
						label={"Description"}
						name="CCDescription"
						valueText={CCDescription}
						handleChange={(e) => setCCDescription(e.target.value)}
						required
						placeholder="Enter CC Description"
					/>
					<ActionButton
						size={"sm"}
						isDisabled={CCName === "" || CCDescription === ""}
						isLoading={isSubmitting}
						name="Add Cost Center"
						onClick={handleCCSubmit}
					/>
				</Stack>
			}
		/>
	);
};

export default CCForm;
