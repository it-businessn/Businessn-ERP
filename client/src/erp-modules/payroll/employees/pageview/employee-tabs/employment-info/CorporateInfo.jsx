import { SimpleGrid, useToast } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import VerticalStepper from "components/ui/VerticalStepper";
import {
	EMP_IDENTIFICATION_STATUS_CONFIG,
	EMP_REGION_CONFIG,
	EMP_TENURE_CONFIG,
	getInitialCorporateInfo,
} from "config/payroll/employees/employmentInfo";
import useCostCenter from "hooks/useCostCenter";
import useDepartment from "hooks/useDepartment";
import useEmployeeEmploymentInfo from "hooks/useEmployeeEmploymentInfo";
import usePaygroup from "hooks/usePaygroup";
import usePositionRoles from "hooks/usePositionRoles";
import useRoles from "hooks/useRoles";
import useSelectedEmp from "hooks/useSelectedEmp";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import StepContent from "../../step-content";
import Record from "../../step-content/Record";
import PositionInfo from "./PositionInfo";

const CorporateInfo = ({ company, id, handleNext, handlePrev }) => {
	const toast = useToast();
	const { empId } = useSelectedEmp(LocalStorageService.getItem("empId"));
	const [refresh, setRefresh] = useState(false);
	const [positionAdded, setPositionAdded] = useState(false);

	const employmentInfo = useEmployeeEmploymentInfo(company, empId, true, false, refresh);
	const initialCorporateInfo = getInitialCorporateInfo(empId, company);
	const [formData, setFormData] = useState(initialCorporateInfo);
	const [isOpen, setIsOpen] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const { selectedPayGroup } = usePaygroup(company, false);
	const department = useDepartment(company);
	const costCentres = useCostCenter(company);
	const roles = useRoles(company);
	const positionRoles = usePositionRoles(company, positionAdded);

	useEffect(() => {
		if (employmentInfo) {
			employmentInfo.positions = employmentInfo?.positions?.filter((_) => _.title);
			if (employmentInfo.email) {
				employmentInfo.empId = employmentInfo._id;
				employmentInfo.positions = [{ title: employmentInfo?.position }];
				employmentInfo.employmentStartDate = employmentInfo?.dateOfJoining;
			}
			setFormData(employmentInfo);
		} else {
			setFormData(initialCorporateInfo);
		}
	}, [employmentInfo?._id, empId]);

	useEffect(() => {
		if (formData?.employeeNo) {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}, [formData?.employeeNo, formData?.payrollStatus]);

	const handleSubmit = async (position, updateRecordIndex) => {
		setIsLoading(true);
		try {
			if (position) {
				const existingPositions = formData?.positions;
				const positionIndex =
					updateRecordIndex > -1
						? updateRecordIndex
						: formData?.positions?.findIndex(({ title }) => title === position?.title);

				if (positionIndex === -1) {
					existingPositions.push(position);
					formData.positions = existingPositions;
				} else {
					formData.positions[positionIndex] = position;
				}
			}
			formData.companyName = company;
			await PayrollService.addEmployeeEmploymentInfo(formData, formData._id);
			setIsLoading(false);
			setIsOpen(false);
			setRefresh((prev) => !prev);
			toast({
				title: "Employment info updated successfully.",
				status: "success",
				duration: 1000,
				isClosable: true,
			});
		} catch (error) {}
	};

	const steps = [
		{
			title: "Identification and Status",
			content: (
				<Record
					handleConfirm={() => ""}
					formData={formData}
					setFormData={setFormData}
					title="Identification and Status"
					config={EMP_IDENTIFICATION_STATUS_CONFIG(roles)}
					handleSubmit={handleSubmit}
				/>
			),
		},
		{
			title: "Tenure",
			content: (
				<Record
					handleConfirm={() => ""}
					formData={formData}
					setFormData={setFormData}
					title="Tenure"
					config={EMP_TENURE_CONFIG}
					handleSubmit={handleSubmit}
				/>
			),
		},
		{
			title: "Positions",
			content: (
				<>
					<TextTitle title="Positions" />
					{isOpen ? (
						<PositionInfo
							company={company}
							isOpen={isOpen}
							setIsOpen={setIsOpen}
							isDisabled={isDisabled}
							setIsDisabled={setIsDisabled}
							selectedPayGroup={selectedPayGroup?.name}
							department={department}
							costCentres={costCentres}
							handleSubmit={handleSubmit}
							positionRoles={positionRoles}
							setPositionAdded={setPositionAdded}
						/>
					) : (
						<>
							<PrimaryButton
								my={3}
								size="xs"
								name="Add Role / Position"
								isLoading={isLoading}
								loadingText="Loading"
								onOpen={() => setIsOpen(true)}
							/>
							{formData?.positions?.map((position, index) => (
								<BoxCard
									mt={2}
									border="1px solid var(--lead_cards_border)"
									key={`${position?.title}_${index}`}
								>
									<PositionInfo
										updateRecordIndex={index}
										rolePos={`Position ${index + 1}`}
										currentRoleInfo={position}
										isOpen={isOpen}
										setIsOpen={setIsOpen}
										isDisabled={isDisabled}
										setIsDisabled={setIsDisabled}
										selectedPayGroup={selectedPayGroup?.name}
										department={department}
										costCentres={costCentres}
										handleSubmit={handleSubmit}
										company={company}
										positionRoles={positionRoles}
										setPositionAdded={setPositionAdded}
									/>
								</BoxCard>
							))}
						</>
					)}
				</>
			),
		},
		{
			title: "Region",
			content: (
				<Record
					handleConfirm={() => ""}
					formData={formData}
					setFormData={setFormData}
					title="Region"
					config={EMP_REGION_CONFIG}
					handleSubmit={handleSubmit}
				/>
			),
		},
	];
	const [currentStep, setCurrentStep] = useState(0);
	const goToNextStep = (index) => {
		setCurrentStep(index);
	};
	return (
		<SimpleGrid
			columns={{ base: 1, md: 1, lg: 2 }}
			spacing="4"
			mr="4"
			templateColumns={{ lg: "20% 80%" }}
		>
			<BoxCard>
				<VerticalStepper
					hideProgress
					steps={steps}
					currentStep={currentStep}
					handleClick={goToNextStep}
					id={id}
					handleNext={handleNext}
					handlePrev={handlePrev}
					handleSubmit={() => handleSubmit()}
					isLoading={isLoading}
					isDisabled={isDisabled}
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} />
		</SimpleGrid>
	);
};

export default CorporateInfo;
