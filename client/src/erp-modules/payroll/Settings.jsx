import { HStack, Input, Tbody, Td, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const Settings = ({ company }) => {
	const [holidays, setHolidays] = useState([]);
	const [name, setName] = useState("");
	const [date, setDate] = useState("");
	const cols = ["Name", "Date", ""];
	useEffect(() => {
		const fetchStatHolidays = async () => {
			try {
				const { data } = await SettingService.getStatHolidays(company);

				setHolidays(data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchStatHolidays();
	}, []);

	const addHoliday = async () => {
		try {
			const { data } = await SettingService.addStatHoliday({
				name,
				date,
				company,
			});
			setHolidays([...holidays, data]);
			setName("");
			setDate("");
		} catch (error) {
			console.log("An error occurred. Please try again.", error);
		}
	};

	const deleteHoliday = async (id) => {
		await SettingService.deleteHoliday({}, id);
		setHolidays(holidays.filter((holiday) => holiday._id !== id));
	};

	return (
		<PageLayout title="Add Holidays">
			<BoxCard>
				<HStack mb={5} w="50%">
					<Input
						placeholder="Holiday Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<Input
						placeholder="Date"
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
					/>
					<PrimaryButton name="Add" onOpen={addHoliday} />
				</HStack>

				<TableLayout
					w="100%"
					tableSize="xs"
					cols={cols}
					position="sticky"
					top={-1}
					zIndex={1}
					textAlign="center"
				>
					<Tbody>
						{(!holidays || holidays?.length === 0) && (
							<EmptyRowRecord data={holidays} colSpan={cols.length} />
						)}
						{holidays?.map(({ _id, name, date }) => (
							<Tr key={_id}>
								<Td p={0}>
									<TextTitle size="sm" title={name} />
								</Td>
								<Td>
									<NormalTextTitle size="sm" title={date.slice(0, 10)} />
								</Td>
							</Tr>
						))}
					</Tbody>
				</TableLayout>
			</BoxCard>
		</PageLayout>
	);
};

export default Settings;
