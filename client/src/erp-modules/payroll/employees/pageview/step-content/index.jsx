// import PayrollComplete from "./PayrollComplete";
import BoxCard from "components/ui/card";
import { HIDE_ONBOARDING_SECTION } from "erp-modules/payroll/workview/data";

const StepContent = ({ currentStep, steps, isOnboarding, h = "68vh" }) => {
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
		<BoxCard h={h}>
			{steps.map((step) => (
				<BoxCard
					mt={step?.mt || 0.1}
					key={step.title}
					display={isOnboarding && HIDE_ONBOARDING_SECTION.includes(step.title) && "none"}
				>
					{step.content}
				</BoxCard>
			))}
		</BoxCard>
	);
};

export default StepContent;
