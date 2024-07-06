import TextTitle from "components/ui/text/TextTitle";

const PayrollComplete = () => {
	return (
		<>
			<TextTitle
				mt="2em"
				title={
					"Payroll is ready for final submission. Submit payroll to complete payrun."
				}
			/>
			{/* onsuccessful
		submission */}
			<TextTitle
				color="green"
				mt="2em"
				title={"Payroll is processed for payrun."}
			/>
		</>
	);
};

export default PayrollComplete;
