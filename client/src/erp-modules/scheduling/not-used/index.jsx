import { Stack } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import SelectFormControl from "components/ui/form/SelectFormControl";

const QuickSelection = ({
	crews,
	selectedFilter,
	setSelectedFilter,
	selectedCC,
	setSelectedCC,
	configCC,
}) => {
	return (
		<BoxCard fontWeight="bold">
			<Stack alignItems="flex-start">
				<SelectFormControl
					valueParam="name"
					name="name"
					label="Crew"
					valueText={selectedFilter || ""}
					handleChange={(e) => {
						if (e.target.value) setSelectedFilter(e.target.value);
					}}
					options={crews}
					placeholder="Select crew"
				/>
				<SelectFormControl
					valueParam="name"
					name="name"
					label="Cost Center"
					valueText={selectedCC || ""}
					handleChange={(e) => {
						if (e.target.value) setSelectedCC(e.target.value);
					}}
					options={configCC}
					placeholder="Select CC"
				/>
				{/* {empName && (
					<Tooltip label="Clear Filter">
						<span>
							<MdFilterAltOff onClick={clearFilter} />
						</span>
					</Tooltip>
				)} */}
			</Stack>

			{/* <TextTitle title="Role" mt={3} />
			{employees?.map((record) => (
				<VStack spacing={1} key={record.roleName} w={"100%"} alignItems={"self-start"} mb={3}>
					<TextTitle size="sm" title={record.roleName} />
					{record?.employees?.map(({ empId, name }) => (
						<HStack key={empId} w={"100%"}>
							<HStack
								w={"90%"}
								bgColor={record.color}
								borderRadius={"50px"}
								px={"1"}
								spacing={0}
								cursor={"pointer"}
							>
								<Avatar size={"xs"} name={name} />
								<Button
									onClick={() => setSelectedEmp(name)}
									variant="ghost"
									size="xs"
									color={"var(--bg_color_1)"}
								>
									{name}
								</Button>
							</HStack>
							<Icon
								cursor="pointer"
								as={RxDragHandleDots2}
								onClick={() => handleShift(empId, name, record.color, record.roleName)}
								boxSize={5}
							/>
						</HStack>
					))}
				</VStack>
			))} */}
		</BoxCard>
	);
};
export default QuickSelection;
