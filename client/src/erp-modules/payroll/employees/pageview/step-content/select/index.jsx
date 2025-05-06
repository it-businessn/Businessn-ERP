import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";

const SelectTypeRecord = ({ param, formData, setFormData, handleConfirm, size = "sm" }) => {
	const newCostCenter =
		formData.employmentCostCenter === "Golf Operations" ? "Golf" : formData.employmentCostCenter;
	const [provinces, setProvinces] = useState([]);

	useEffect(() => {
		if (formData?.country || formData?.federalTax || formData?.employmentCountry) {
			const country = formData?.country || formData?.federalTax || formData?.employmentCountry;
			setProvinces(param.options?.find(({ type }) => type === country)?.provinces);
		}
	}, [formData?.country, formData?.federalTax, formData?.employmentCountry]);

	return (
		<FormControl>
			<FormLabel>{param.name}</FormLabel>
			<Select
				icon={<FaCaretDown />}
				borderRadius="10px"
				size={size}
				placeholder={`Select ${param.name}`}
				name={param.param_key}
				value={formData[param.param_key] || ""}
				onChange={(e) => {
					setFormData((prev) => ({
						...prev,
						[param.param_key]: e.target.value,
					}));
					handleConfirm();
				}}
			>
				{param.name === "Department" && formData.employmentCostCenter !== ""
					? param.options
							?.filter((_) => _.type?.includes(newCostCenter) || _.name)
							?.map((item) => (
								<option value={item.type || item.name} key={item.type || item.name}>
									{item.type || item.name}
								</option>
							))
					: ["Province / State", "Regional Tax", "Region"].includes(param.name)
					? provinces?.map((item) => (
							<option value={item} key={item}>
								{item}
							</option>
					  ))
					: param.options?.map((item) => (
							<option value={item?.type || item?.name} key={item?.type || item?.name}>
								{item?.type || item?.name}
							</option>
					  ))}
			</Select>
		</FormControl>
	);
};

export default SelectTypeRecord;
