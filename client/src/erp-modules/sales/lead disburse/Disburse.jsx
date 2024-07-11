import { Button } from "@chakra-ui/react";
import { COLORS } from "erp-modules/project-management/workview/project/data";
import { generateLighterShade } from "utils";

const Disburse = ({ leads, checkedRows, handleDisburse }) => {
	return (
		<Button
			w={{ lg: "200px" }}
			isDisabled={leads?.length === 0 || checkedRows?.length === 0}
			bg={generateLighterShade(COLORS.primary, 0.9)}
			color={"var(--primary_button_bg)"}
			variant={"outlined"}
			_hover={{ color: "var(--main_color_black)" }}
			borderRadius={"10px"}
			border={`1px solid var(--primary_button_bg)`}
			onClick={handleDisburse}
			size={"xs"}
		>
			Confirm Disbursement
		</Button>
	);
};

export default Disburse;
