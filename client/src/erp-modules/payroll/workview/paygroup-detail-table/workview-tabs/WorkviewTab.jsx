import { Tbody, Td, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { useNavigate } from "react-router-dom";

const WorkviewTab = ({
	cols,
	data,
	path,
	setRefresh,
	isEditable,
	isHourly,
	stepNum,
	renderEditableInput,
	cellClick,
	handleAddEmp,
	isExtraRun,
	handleDelete,
	setShowConfirmationPopUp,
}) => {
	const navigate = useNavigate();

	const handleClick = (col, row, name) => {
		const navigatePage = col.key === "" && name === "setup";
		if (navigatePage) {
			navigate(
				stepNum !== undefined
					? `${path}/${row.empId._id}/${stepNum}`
					: `${path}/${row.empId._id}`,
			);
			return;
		} else if (col.key === "") {
			setShowConfirmationPopUp(true);
			handleDelete(row.empId.fullName);
			return;
		} else if (isEditable) {
			cellClick(row);
		}
	};

	return (
		<BoxCard>
			<TableLayout cols={cols.map((_) => _.key)} isSmall height={"40vh"}>
				<Tbody>
					{!data?.length && <EmptyRowRecord />}
					{data?.map((row) => (
						<Tr key={row._id}>
							{cols.map((col) => {
								const fieldValue =
									col.key === "" ? (
										col.pair
									) : col.pair === "obj" ? (
										col.pair_key === "fullName" ? (
											<TextTitle title={row.empId[col.pair_key]} />
										) : (
											row.empId[col.pair_key]
										)
									) : // ) : isHourly ? (
									// 	`${(row[col.pair] / 60).toFixed(0)}:${row[col.pair] % 60}`
									col.round ? (
										row[col.pair]?.toFixed(2)
									) : (
										row[col.pair]
									);

								return (
									<Td
										p={1}
										key={col.key}
										onFocus={(el) => handleClick(col, row, el.target.name)}
									>
										{col.isEditable
											? renderEditableInput(row._id, col.pair, fieldValue)
											: fieldValue}
									</Td>
								);
							})}
						</Tr>
					))}
					{isExtraRun && (
						<Tr>
							<Td p={0}>
								<PrimaryButton
									name={"Add employee"}
									size="xs"
									px={0}
									onOpen={handleAddEmp}
								/>
							</Td>
						</Tr>
					)}
				</Tbody>
			</TableLayout>
		</BoxCard>
	);
};

export default WorkviewTab;
