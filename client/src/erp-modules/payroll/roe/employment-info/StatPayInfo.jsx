import { Button, HStack, Input } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

export const StatPayInfo = ({ roeData, handleArrayChange, removeArrayRow, addArrayRow }) => {
	return (
		<>
			<TextTitle size="xl" title={"Statutory Holiday Pay"} />
			{roeData?.statHolidays.map((sh, i) => (
				<HStack key={i} spacing={2} align="end">
					<Input
						type="date"
						value={sh.date}
						onChange={(e) => handleArrayChange("statHolidays", i, "date", e.target.value)}
						placeholder="Date"
						flex={1}
					/>
					<Input
						type="number"
						step="0.01"
						value={sh.amount}
						onChange={(e) => handleArrayChange("statHolidays", i, "amount", e.target.value)}
						placeholder="Amount"
						flex={1}
					/>
					<Button colorScheme="red" onClick={() => removeArrayRow("statHolidays", i)}>
						X
					</Button>
				</HStack>
			))}
			{roeData?.statHolidays?.length < 10 && (
				<Button
					colorScheme="green"
					onClick={() => addArrayRow("statHolidays", { date: "", amount: "" })}
					alignSelf="flex-start"
				>
					+ Add Holiday
				</Button>
			)}
		</>
	);
};
