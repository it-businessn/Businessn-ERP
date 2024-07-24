// import PayrollComplete from "./PayrollComplete";
import BoxCard from "components/ui/card";

const StepContent = ({ currentStep, steps }) => {
	// const { isOpen: isPayrollStepupOpen, onToggle: onPayrollStepupToggle } =
	// 	useDisclosure({
	// 		defaultIsOpen: false,
	// 	});
	// const { isOpen: isInputsReviewOpen, onToggle: onInputsReviewToggle } =
	// 	useDisclosure({
	// 		defaultIsOpen: false,
	// 	});
	// const { isOpen: isAlertsOpen, onToggle: onAlertsOpenToggle } = useDisclosure({
	// 	defaultIsOpen: false,
	// });
	// const { isOpen: isReportsOpen, onToggle: onReportsToggle } = useDisclosure({
	// 	defaultIsOpen: false,
	// });
	// const { isOpen: isFinalizeOpen, onToggle: onFinalizeToggle } = useDisclosure({
	// 	defaultIsOpen: false,
	// });

	// useEffect(() => {
	// 	handleStepChange();
	// }, [currentStep]);

	// const handleStepChange = () => {
	// 	if (currentStep === 0) {
	// 		onPayrollStepupToggle();
	// 	} else if (currentStep === 1) {
	// 		onInputsReviewToggle();
	// 	} else if (currentStep === 2) {
	// 		onAlertsOpenToggle();
	// 	} else if (currentStep === 3) {
	// 		onReportsToggle();
	// 	} else if (currentStep === 4) {
	// 		onFinalizeToggle();
	// 	}
	// };
	return (
		<BoxCard h="68vh">
			{steps.map((step) => (
				<BoxCard mt={0.1} key={step.title}>
					{step.content}
				</BoxCard>
			))}
		</BoxCard>
	);
};

export default StepContent;
