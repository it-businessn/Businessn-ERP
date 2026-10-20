import {
  Alert,
  AlertIcon,
  Box,
  Divider,
  Flex,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import { useEffect, useRef, useState } from "react";
import { FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { formatDateBar } from "utils/convertDate";

const ModalLayout = ({
  title,
  isOpen,
  onClose,
  children,
  error,
  size = "5xl",
  hideOverlay,
  textAlign,
  fontSize,
  isCentered = true,
  isReport,
  spacing = "5",
  reportData,
  empName,
  p,
  fileName,
  w = "100%",
  mx,
}) => {
  const componentRef = useRef();
  const [isPrintDisabled, setIsPrintDisabled] = useState(true);
  // true only while a print is in flight; the button used to toggle itself off
  // permanently on the first click, which looked like "print does nothing".
  const [isPrinting, setIsPrinting] = useState(false);
  const [reportFileName, setReportFileName] = useState(null);

  useEffect(() => {
    if (isReport) {
      setIsPrintDisabled(children);
      setReportFileName(
        empName
          ? `${formatDateBar(reportData?.payPeriodEndDate)} PayPeriod#${
              reportData?.payPeriodNum
            } ${empName.replace(/\s+/g, "")} Paystub`
          : fileName ||
              `${formatDateBar(reportData?.payPeriodEndDate)} PayPeriod#${
                reportData?.payPeriodNum
              } Register Report`,
      );
    }
  }, [isReport]);

  const handlePrint = useReactToPrint({
    // react-to-print v3: `content` -> `contentRef`, `onBeforeGetContent` -> `documentTitle`
    contentRef: componentRef,
    documentTitle: reportFileName,
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
    <Modal
      isCentered={isCentered}
      size={size}
      isOpen={isOpen}
      onClose={onClose}
    >
      {!hideOverlay && (
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      )}
      <ModalContent>
        {!hideOverlay && (
          <ModalHeader
            position="sticky"
            zIndex="1"
            top={0}
            bg={"var(--main_color)"}
            textAlign={textAlign}
            fontSize={fontSize}
          >
            <Flex justify="space-between">
              {isReport && <Box w={"70px"} />}
              {title}
              {isReport ? (
                <HStack alignItems="center" gap={"1em"}>
                  <IconButton
                    size={"lg"}
                    icon={<FaPrint />}
                    aria-label="Print"
                    variant="round"
                    onClick={handleClick}
                    isLoading={isPrinting}
                    isDisabled={!isPrintDisabled}
                  />
                  <Box>
                    <ModalCloseButton sx={{ marginTop: "14px" }} />
                  </Box>
                </HStack>
              ) : (
                <ModalCloseButton />
              )}
            </Flex>
            <Divider />
          </ModalHeader>
        )}
        <ModalBody
          p={(hideOverlay || isReport) && 0}
          zIndex="0"
          className="print-root"
          ref={componentRef}
          bg={"#fff"}
          height={"100vh"}
          css={tabScrollCss}
        >
          <Stack w={w} mx={mx} p={p} spacing={spacing}>
            {children}
            {error && (
              <Alert status="error" mt={4}>
                <AlertIcon />
                {error}
              </Alert>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalLayout;
