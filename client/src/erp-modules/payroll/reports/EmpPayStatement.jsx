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
  const [isPrintDisabled] = useState(record);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = useReactToPrint({
    // react-to-print v3: `content` -> `contentRef`, `onBeforeGetContent` -> `documentTitle`
    contentRef: componentRef,
    documentTitle: `${formatDateBar(record?.payPeriodEndDate)} PayPeriod#${record?.payPeriodNum} ${record?.empId?.fullName.replace(/\s+/g, "")} Review Payslip`,
    onAfterPrint: () => setIsPrinting(false),
    onPrintError: (location, err) => {
      console.error("Print failed", location, err);
      setIsPrinting(false);
    },
    pageStyle: `
			@page { size: A4 portrait; margin: 10mm 8mm; }
			@media print {
				html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
				/* the printed node is cloned with its on-screen styles; undo the
				   fixed viewport height / scroll box so the whole report prints */
				.print-root { height: auto !important; min-height: 0 !important; max-height: none !important; overflow: visible !important; }
			}
		`,
  });

  const handleClick = () => {
    if (isPrinting) return;
    setIsPrinting(true);
    setTimeout(() => handlePrint(), 1000);
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent
        sx={{ maxWidth: "850px", overflow: "auto" }}
        css={tabScrollCss}
      >
        <DrawerHeader p={0}>
          <DrawerCloseButton />
          <Flex w={"95%"} justify={"end"} alignItems={"center"}>
            <IconButton
              size={"lg"}
              icon={<FaPrint />}
              aria-label="Print"
              variant="round"
              onClick={handleClick}
              isLoading={isPrinting}
              isDisabled={!isPrintDisabled}
            />
          </Flex>
        </DrawerHeader>

        <DrawerBody
          className="print-root"
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
