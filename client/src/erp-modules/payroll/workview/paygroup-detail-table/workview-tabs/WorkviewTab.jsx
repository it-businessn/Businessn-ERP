import { Tbody, Td, Tr } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditPayDetail from "./EditPayDetail";

const WorkviewTab = ({
	cols,
	data,
	path,
	setRefresh,
	isEditable,
	isHourly,
	stepNum,
}) => {
	const navigate = useNavigate();

	const [edit, setEdit] = useState(false);
	const [editFormData, setEditFormData] = useState({});

	const handleClick = (key, row) => {
		if (key === "") {
			navigate(
				stepNum !== undefined
					? `${path}/${row.empId._id}/${stepNum}`
					: `${path}/${row.empId._id}`,
			);
			return;
		}
		setEdit(true);
		setEditFormData(data?.find((rec) => rec._id === row._id));
	};

	return (
		<BoxCard>
			{isEditable && edit && (
				<EditPayDetail
					editFormData={editFormData}
					isOpen={edit}
					onClose={() => setEdit(false)}
					setRefresh={setRefresh}
				/>
			)}
			<TableLayout cols={cols.map((_) => _.key)} isSmall height={"40vh"}>
				<Tbody>
					{data?.map((row) => (
						<Tr key={row._id}>
							{cols.map((col, index) => {
								const fieldValue =
									index === cols.length - 1 ? (
										col.pair
									) : col.pair === "obj" ? (
										col.pair_key === "fullName" ? (
											<TextTitle title={row.empId[col.pair_key]} />
										) : (
											row.empId[col.pair_key]
										)
									) : isHourly ? (
										`${(row[col.pair] / 60).toFixed(0)}:${row[col.pair] % 60}`
									) : (
										row[col.pair]
									);
								return (
									<Td
										p={1}
										key={col.key}
										onClick={() => {
											handleClick(col.key, row);
										}}
									>
										{fieldValue}
									</Td>
								);
							})}
						</Tr>
					))}
				</Tbody>
			</TableLayout>
		</BoxCard>
	);
};

export default WorkviewTab;
