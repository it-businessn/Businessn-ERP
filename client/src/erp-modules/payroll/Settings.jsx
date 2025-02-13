import { Box, HStack, Input, Tbody, Td, Tr, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
import moment from "moment";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import SettingService from "services/SettingService";

const Settings = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
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
			console.log("An error occurred. Please try again.");
		}
	};

	const deleteHoliday = async (id) => {
		await SettingService.deleteHoliday({}, id);
		setHolidays(holidays.filter((holiday) => holiday._id !== id));
	};

	return (
		<PageLayout title="Settings">
			<Box p={5}>
				<TextTitle title="Setup Stat Holidays" />
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
						tableSize="sm"
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
									<Td p={0} px={"0.5em"} borderBottomColor={"var(--filter_border_color)"}>
										<NormalTextTitle size="sm" title={name} />
									</Td>
									<Td>{moment.utc(date).format("dddd, YYYY-MM-DD")}</Td>
								</Tr>
							))}
						</Tbody>
					</TableLayout>
				</VStack>
			</Box>
		</PageLayout>
	);
};

export default Settings;
