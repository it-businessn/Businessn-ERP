import { FormControl, HStack, Select } from "@chakra-ui/react";
import RequiredLabel from "components/ui/form/RequiredLabel";
import React from "react";
import { FaPlus } from "react-icons/fa";

const MultiSelectControl = ({ options }) =>
	options.map((menu) => (
		<React.Fragment key={menu.name}>
			{menu.data && (
				<>
					<FormControl mb={4}>
						<RequiredLabel
							required={menu.param_key !== "manager"}
							label={menu.name}
						/>
						<HStack justify={"space-between"} cursor={"pointer"}>
							<Select
								name={menu.param_key}
								value={menu.param_value}
								bg={"var(--main_color)"}
								onChange={menu.handleChange}
								placeholder={menu.placeholder}
							>
								{menu.data?.map((option) => (
									<option
										key={option._id}
										value={option?.name ?? option[menu.optionKey]}
									>
										{option?.name || option[menu.optionKey]}
									</option>
								))}
							</Select>
							{menu.param_key !== "manager" && (
								<FaPlus onClick={() => menu.setShowAdd(true)} />
							)}
						</HStack>
					</FormControl>
					{menu.showAdd && menu.content}
				</>
			)}
		</React.Fragment>
	));

export default MultiSelectControl;
