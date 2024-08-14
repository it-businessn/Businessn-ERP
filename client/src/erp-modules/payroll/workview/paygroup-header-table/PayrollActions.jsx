import { HStack, Icon, VStack } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import { MdOutlineChevronRight } from "react-icons/md";
import { PAYGROUP_ACTIONS } from "../data";

const PayrollActions = ({ handleClick }) => {
	return (
		<BoxCard>
			<TextTitle title={"Payroll actions"} mt={2} mb={"1em"} />
			<VStack spacing={3} align={"start"}>
				{PAYGROUP_ACTIONS.map((action) => (
					<HStack
						spacing={2}
						key={action.key}
						onClick={() => {
							if (action.key === "extra") {
								handleClick();
							}
						}}
					>
						<TextTitle title={action.name} width="auto" />
						<Icon
							borderRadius={"50%"}
							as={MdOutlineChevronRight}
							boxSize="5"
							color="var(--primary_button_bg)"
						/>
					</HStack>
				))}
			</VStack>
		</BoxCard>
	);
};

export default PayrollActions;
