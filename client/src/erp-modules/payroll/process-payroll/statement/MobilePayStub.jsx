import {
	Box,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	VStack,
} from "@chakra-ui/react";

import TextTitle from "components/ui/text/TextTitle";
import LocalStorageService from "services/LocalStorageService";
import EmployeeInfo from "../preview-reports/EmployeeInfo";
import EmployeePayDetails from "../preview-reports/EmployeePayDetails";
import ChequeDetails from "./ChequeDetails";
import PayStubHeader from "./PayStubHeader";

const MobilePayStub = ({ reportData, isOpen, onClose, title }) => {
	const companyInfo = LocalStorageService.getItem("user")?.companyId;
	return (
		<Modal isOpen={isOpen} onClose={onClose} size="full">
			<ModalContent>
				<ModalHeader position="sticky" zIndex="1" top={0} bg={"var(--main_color)"}>
					<PayStubHeader isMobile companyInfo={companyInfo} />
					<TextTitle
						align={"center"}
						color={"var(--nav_color)"}
						size={"lg"}
						title={"EARNINGS STATEMENT"}
					/>
					<ModalCloseButton sx={{ marginTop: "14px" }} />
				</ModalHeader>
				<ModalBody px={3} pt={0}>
					<Box borderBottom="1px solid var(--calendar_border)">
						<VStack align="start" spacing={4} w="full">
							<EmployeeInfo
								isMobile
								data={reportData}
								companyNum={companyInfo?.registration_number}
							/>
							<EmployeePayDetails isMobile data={reportData} />
						</VStack>
						<ChequeDetails isMobile data={reportData} companyInfo={companyInfo} />
					</Box>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
export default MobilePayStub;
