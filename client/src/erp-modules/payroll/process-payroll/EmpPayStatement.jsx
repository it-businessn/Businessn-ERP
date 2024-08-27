import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerOverlay,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import PayStubStatement from "./preview-reports/PayStubStatement";

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
		<Drawer isOpen={isOpen} onClose={onClose} size="xl">
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerBody
					h={"100vh"}
					ref={componentRef}
					bg={"var(--main_color)"}
					overflowX={"hidden"}
				>
					{record && <PayStubStatement data={record} />}
				</DrawerBody>
				<DrawerFooter>
					<PrimaryButton
						name={"Print"}
						onOpen={handleClick}
						isDisabled={!isPrintDisabled}
					/>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};
export default EmpPayStatement;
