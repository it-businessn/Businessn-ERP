import { Tbody, Td, Tr } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TableLayout from "components/ui/table/TableLayout";

const WorkviewTab = ({ label, cols, data }) => {
	return (
		<BoxCard>
			<TableLayout cols={cols.map((_) => _.key)}>
				<Tbody>
					{data?.map((_) => (
						<Tr key={_.id}>
							{cols.map((item, index) => (
								<Td key={item.key}>
									{index === cols.length - 1 ? item.pair : data[0][item.pair]}
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
