import { Box, HStack, Input, Tbody, Td, Tr, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import moment from "moment";
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
		<Box p={5}>
			<TextTitle title="Add Holidays" />
			<VStack align="start" spacing={4}>
				<HStack>
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
									<NormalTextTitle size="sm" title={moment.utc(date).format("dddd, YYYY-MM-DD")} />
								</Td>
							</Tr>
						))}
					</Tbody>
				</TableLayout>
			</VStack>
		</Box>
	);
};

export default Settings;
