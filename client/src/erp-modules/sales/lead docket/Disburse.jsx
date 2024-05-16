import { Button } from "@chakra-ui/react";
import { COLORS } from "erp-modules/project-management/workview/project/data";
import { generateLighterShade } from "utils";

const Disburse = ({ checkedRows, handleDisburse }) => {
	return (
		<Button
			isDisabled={checkedRows.length === 0}
			w={{ lg: "300px" }}
			bg={generateLighterShade(COLORS.primary, 0.9)}
			color={"var(--primary_button_bg)"}
			variant={"outlined"}
			_hover={{ color: "brand.600" }}
			borderRadius={"10px"}
			border={`1px solid var(--primary_button_bg)`}
			onClick={handleDisburse}
			size={"xs"}
		>
			Disburse Selected
		</Button>
	);
};

export default Disburse;
