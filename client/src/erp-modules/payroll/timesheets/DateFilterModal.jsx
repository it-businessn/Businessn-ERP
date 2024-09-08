import { useDisclosure } from "@chakra-ui/react";
import FilterDatePicker from "components/FilterDateRangePicker";
import ModalLayout from "components/ui/modal/ModalLayout";

const DateFilterModal = ({
	showDateFilter,
	setShowDateFilter,
	thisPayPeriod,
	setFilter,
	lastPayPeriod,
}) => {
	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowDateFilter(false);
	};
	return (
		<ModalLayout
			title={"Filter record"}
			size="3xl"
			isOpen={showDateFilter}
			onClose={handleClose}
			isCentered={false}
		>
			<FilterDatePicker
				setFilter={setFilter}
				handleClose={handleClose}
				thisPayPeriod={thisPayPeriod}
				lastPayPeriod={lastPayPeriod}
			/>
		</ModalLayout>
	);
};

export default DateFilterModal;
