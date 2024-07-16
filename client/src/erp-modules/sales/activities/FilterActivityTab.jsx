import { Flex, SimpleGrid } from "@chakra-ui/react";
import RadioButtonGroup from "components/ui/tab/RadioButtonGroup";
import { useBreakpointValue } from "services/Breakpoint";

const FilterActivityTab = ({ selectedFilter, handleFilterClick }) => {
	const { isMobile, isIpad } = useBreakpointValue();

	const showFilterTab = () =>
		["Daily", "Weekly", "Monthly", "Quarterly", "Annual"].map((_) => (
			<RadioButtonGroup
				key={_}
				name={_}
				selectedFilter={selectedFilter}
				handleFilterClick={handleFilterClick}
			/>
		));

	return isMobile || isIpad ? (
		<SimpleGrid
			columns={{ base: 3, md: 5 }}
			spacing="1em"
			my="5"
			bg={"var(--primary_bg)"}
			borderRadius={"20px"}
			p={"8px"}
		>
			{showFilterTab()}
		</SimpleGrid>
	) : (
		<SimpleGrid columns={{ base: 5, lg: 2 }} spacing="1em" my="5">
			<Flex gap="2em" bg={"var(--primary_bg)"} borderRadius={"20px"} p={"8px"}>
				{showFilterTab()}
			</Flex>
		</SimpleGrid>
	);
};

export default FilterActivityTab;
