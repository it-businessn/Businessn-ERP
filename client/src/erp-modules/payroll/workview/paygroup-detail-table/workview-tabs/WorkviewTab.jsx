import { Tbody, Td, Tr } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TableLayout from "components/ui/table/TableLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditPayDetail from "./EditPayDetail";

const WorkviewTab = ({ cols, data, path, setRefresh, isEditable }) => {
	const navigate = useNavigate();

	const [edit, setEdit] = useState(false);
	const [editFormData, setEditFormData] = useState({});

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
									index === cols.length - 1
										? col.pair
										: col.pair === "obj"
										? row.empId[col.pair_key]
										: row[col.pair];
								return (
									<Td
										p={1}
										key={col.key}
										onClick={() => {
											if (col.key === "") {
												navigate(`${path}/${row.empId._id}`);
												return;
											}
											setEdit(true);
											setEditFormData(data?.find((rec) => rec._id === row._id));
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
