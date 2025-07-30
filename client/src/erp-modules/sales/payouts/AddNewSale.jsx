import { FormControl, FormLabel, HStack, Select, Stack } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { TIMESHEET_STATUS_LABEL } from "erp-modules/payroll/timesheets/data";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import PayrollService from "services/PayrollService";

const AddNewSale = ({ isOpen, onClose, setIsAdded, company }) => {
	const initialSale = {
		amount: 0,
		affiliate: "",
		customerName: "",
		customerCode: "",
		saleId: "",
		companyName: company,
		status: TIMESHEET_STATUS_LABEL.PENDING,
	};
	const [isSubmitting, setSubmitting] = useState(false);
	const [formData, setFormData] = useState(initialSale);
	const [affiliates, setAffiliates] = useState(null);

	useEffect(() => {
		const fetchAllAffiliates = async () => {
			try {
				const { data } = await PayrollService.getAllAffiliateMembers(company);
				data.map((emp) => {
					emp.fullName = `${emp?.firstName} ${emp?.middleName || ""} ${emp?.lastName}`;
					emp._id = emp?.empId;
					return emp;
				});
				setAffiliates(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAffiliates();
	}, [company]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		formData.saleId = affiliates.find(
			({ fullName }) => fullName === formData.affiliate,
		).affiliateCode;
		try {
			await PayrollService.addAffiliateSale(formData);
			setIsAdded(true);
			onClose();
			setFormData(initialSale);
		} catch (error) {
			console.log(error);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<ModalLayout size="2xl" title={"Add New Sale"} isOpen={isOpen} onClose={onClose}>
			<form onSubmit={handleSubmit}>
				<Stack spacing={4}>
					<HStack>
						<InputFormControl
							label={"Customer Name"}
							name="customerName"
							valueText={formData?.customerName}
							handleChange={handleChange}
							required
						/>
						<InputFormControl
							label={"Customer Code"}
							name="customerCode"
							valueText={formData?.customerCode}
							handleChange={handleChange}
							required
						/>
					</HStack>
					<HStack>
						<InputFormControl
							label={"Amount"}
							name="amount"
							valueText={formData?.amount}
							handleChange={handleChange}
							required
							type="number"
						/>
						<FormControl>
							<FormLabel>Affiliate member</FormLabel>
							<Select
								icon={<FaCaretDown />}
								borderRadius="10px"
								placeholder="Select affiliate"
								name="affiliate"
								value={formData?.affiliate}
								onChange={handleChange}
							>
								{affiliates?.map(({ _id, fullName }) => (
									<option value={fullName} key={_id}>
										{fullName}
									</option>
								))}
							</Select>
						</FormControl>
					</HStack>
					<ActionButtonGroup
						bg={"var(--banner_bg)"}
						submitBtnName={"Add"}
						isLoading={isSubmitting}
						onClose={onClose}
					/>
				</Stack>
			</form>
		</ModalLayout>
	);
};

export default AddNewSale;
