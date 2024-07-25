import { Tbody, Td, Tr } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TableLayout from "components/ui/table/TableLayout";
import { useNavigate } from "react-router-dom";

const WorkviewTab = ({ cols, data, path }) => {
	const navigate = useNavigate();

	return (
		<BoxCard>
			<TableLayout cols={cols.map((_) => _.key)}>
				<Tbody>
					{data?.map((item) => (
						<Tr key={item._id}>
							{cols.map((col, index) => (
								<Td
									key={col.key}
									onClick={() => {
										if (col.key === "") {
											navigate(`${path}/${item.empId._id}`);
										}
									}}
								>
									{index === cols.length - 1
										? col.pair
										: col.pair === "obj"
										? item.empId[col.pair_key]
										: item[col.pair]}
								</Td>
							))}
						</Tr>
					))}
					{/* <Tr>
						<Td>45453</Td>
						<Td>{}</Td>
						<Td>19/03/2024</Td>
						<Td>19/02-19/03</Td>
						<Td></Td>
						<Td></Td>
						<Td>{}</Td>
						<Td>{}</Td>
						<Td>{}</Td>
						<Td>{}</Td>
						<Td>
							<Button
								// onClick={onOpen}
								size={"xs"}
								borderRadius={"12px"}
								color={"var(--primary_bg)"}
								bg={"var(--pending)"}
							>
								Pending
							</Button>
						</Td>
						<Td>
							<PrimaryButton
								// isDisabled={isDisabled}
								name={"Pay now"}
								size="sm"
							/>
						</Td>
					</Tr>
					<Tr>
						<Td>45453</Td>
						<Td>{}</Td>
						<Td>19/03/2024</Td>
						<Td>19/02-19/03</Td>
						<Td></Td>
						<Td></Td>
						<Td>{}</Td>
						<Td>{}</Td>
						<Td>{}</Td>
						<Td>{}</Td>
						<Td>
							<Button
								// onClick={onOpen}
								size={"xs"}
								borderRadius={"12px"}
								color={"var(--primary_bg)"}
								bg={"var(--pending)"}
							>
								Pending
							</Button>
						</Td>
						<Td>
							<PrimaryButton
								// isDisabled={isDisabled}
								name={"Pay now"}
								size="sm"
							/>
						</Td>
					</Tr> */}
				</Tbody>
			</TableLayout>
		</BoxCard>
	);
};

export default WorkviewTab;
