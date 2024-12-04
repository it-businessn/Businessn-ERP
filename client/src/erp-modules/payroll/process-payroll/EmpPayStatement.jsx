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
import PayStubStatement from "./statement/PayStubStatement";

const EmpPayStatement = ({ record, isOpen, onClose }) => {
	const componentRef = useRef();
	const [isPrintDisabled, setIsPrintDisabled] = useState(record);

	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});

	const handleClick = () => {
		setIsPrintDisabled((prev) => !prev);
		setTimeout(() => handlePrint(), 1000);
	};
	return (
		<Drawer isOpen={isOpen} onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent sx={{ maxWidth: "900px" }}>
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

				<DrawerBody ref={componentRef} bg={"var(--main_color)"} minH={"100vh"}>
					{record && <PayStubStatement data={record} />}
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};
export default EmpPayStatement;
