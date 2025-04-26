import { Avatar, Button, HStack, Icon, Tooltip, VStack } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import SelectFormControl from "components/ui/form/SelectFormControl";
import TextTitle from "components/ui/text/TextTitle";
import useDepartment from "hooks/useDepartment";
import { MdFilterAltOff } from "react-icons/md";
import { RxDragHandleDots2 } from "react-icons/rx";

const QuickSelection = ({
	dept,
	setDept,
	company,
	employees,
	setSelectedEmp,
	handleShift,
	clearFilter,
	empName,
}) => {
	const departments = useDepartment(company);

	return (
		<BoxCard fontWeight="bold">
			<HStack alignItems="flex-start">
				{departments && (
					<SelectFormControl
						valueParam="name"
						name="name"
						label="Department"
						valueText={dept || ""}
						handleChange={(e) => setDept(e.target.value)}
						options={departments}
						placeholder="Select department"
					/>
				)}
				{empName && (
					<Tooltip label="Clear Filter">
						<span>
							<MdFilterAltOff onClick={clearFilter} />
						</span>
					</Tooltip>
				)}
			</HStack>

			<TextTitle title="Role" mt={3} />
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
			))}
		</BoxCard>
	);
};
export default QuickSelection;
