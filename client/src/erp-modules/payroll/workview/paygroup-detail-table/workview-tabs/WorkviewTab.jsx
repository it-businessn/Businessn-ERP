import { Tbody, Td, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import WorkviewTable from "components/ui/table/WorkviewTable";
import TextTitle from "components/ui/text/TextTitle";
import { useNavigate } from "react-router-dom";
import { getAmount } from "utils";

const WorkviewTab = ({
	cols,
	data,
	path,
	isEditable,
	stepNum,
	renderEditableInput,
	cellClick,
	handleAddEmp,
	isExtraRun,
	handleDelete,
	setShowConfirmationPopUp,
	overflowX,
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
			<WorkviewTable
				cols={cols.map((_) => _.key)}
				isSmall
				height={"32vh"}
				whiteSpace="wrap"
				textAlign={"center"}
				overflowX={overflowX}
			>
				<Tbody>
					{(!data || data?.length === 0) && (
						<EmptyRowRecord data={data} colSpan={cols.length} />
					)}
					{data?.map((row) => (
						<Tr key={row?.empId?._id}>
							{cols.map((col) => {
								const fieldValue =
									col.key === "" ? (
										col.pair
									) : col.pair === "obj" ? (
										col.pair_key === "fullName" ? (
											<TextTitle
												bg="var(--empName_bg)"
												color="var(--main_color)"
												borderRadius="6px"
												p="7px"
												title={row.empId[col.pair_key]}
												whiteSpace="wrap"
												width="150px"
												mr={"0.5em"}
											/>
										) : (
											row.empId[col.pair_key]
										)
									) : // ) : isHourly ? (
									// 	`${(row[col.pair] / 60).toFixed(0)}:${row[col.pair] % 60}`
									col.round ? (
										getAmount(row[col.pair])
									) : (
										row[col.pair]
									);

								return (
									<Td
										color="var(--main_color_black)"
										textAlign={col?.align}
										p={0.5}
										key={col.key}
										onFocus={(el) => handleClick(col, row, el.target.name)}
									>
										{col.isEditable
											? renderEditableInput(
													row?.empId?._id,
													col.pair,
													fieldValue,
											  )
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
			</WorkviewTable>
		</BoxCard>
	);
};

export default WorkviewTab;
