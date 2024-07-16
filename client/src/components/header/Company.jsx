import { Flex, IconButton, VStack } from "@chakra-ui/react";
import Logo from "components/logo";
import SelectBox from "components/ui/form/select/SelectBox";
import { FaSyncAlt } from "react-icons/fa";

const Company = ({ value, handleChange, data }) => (
	<VStack align="start" m={0}>
		<Logo />
		<Flex flexDir={"column"} w={{ base: "60%", md: "auto" }}>
			{data && (
				<SelectBox
					icon={
						<IconButton
							ml={"1em"}
							size="sm"
							icon={<FaSyncAlt />}
							aria-label="Refresh"
							variant="round"
						/>
					}
					value={value}
					handleChange={handleChange}
					data={data}
					name="name"
					fontWeight="bold"
					// placeholder={"No companies found"}
				/>
			)}
		</Flex>
	</VStack>
);

export default Company;
