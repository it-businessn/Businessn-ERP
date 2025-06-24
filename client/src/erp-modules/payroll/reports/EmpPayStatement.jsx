import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	IconButton,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { formatDateBar } from "utils/convertDate";
import { tabScrollCss } from "../onboard-user/customInfo";
import PayStubStatement from "../process-payroll/statement/PayStubStatement";

const EmpPayStatement = ({ record, isOpen, onClose }) => {
	const componentRef = useRef();
	const [isPrintDisabled, setIsPrintDisabled] = useState(record);

	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		onBeforeGetContent: () => {
			document.title = `${formatDateBar(record?.payPeriodEndDate)} PayPeriod#${
				record?.payPeriodNum
			} ${record?.empId?.fullName.replace(/\s+/g, "")} Review Payslip`;
		},
	});

	const handleClick = () => {
		setIsPrintDisabled((prev) => !prev);
		setTimeout(() => handlePrint(), 1000);
	};
	return (
		<Drawer isOpen={isOpen} onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent sx={{ maxWidth: "850px", overflow: "auto" }} css={tabScrollCss}>
				<DrawerHeader p={0}>
					<DrawerCloseButton />
					<Flex w={"95%"} justify={"end"} alignItems={"center"}>
						<IconButton
							size={"lg"}
							icon={<FaPrint />}
							aria-label="Print"
							variant="round"
							onClick={handleClick}
							isDisabled={!isPrintDisabled}
						/>
					</Flex>
				</DrawerHeader>

				<DrawerBody
					ref={componentRef}
					bg={"var(--main_color)"}
					minH="100vh"
					p="5px"
					css={tabScrollCss}
				>
					{record && <PayStubStatement data={record} height="98vh" />}
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};
export default EmpPayStatement;
