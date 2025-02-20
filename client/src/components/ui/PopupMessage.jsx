import {
	CloseButton,
	HStack,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Select,
} from "@chakra-ui/react";
import { isBusinessNAdmin, PAYRUN_OPTIONS } from "constant";
import React, { useEffect, useState } from "react";
import { generateLighterShade } from "utils";
import TextTitle from "./text/TextTitle";

export default function PopupMessage({
	isOpen,
	setIsOpen,
	handleClick,
	loggedInUser,
	highlightColor,
	setHighlightColor,
	payrunOption,
	setPayrunOption,
}) {
	const [payOptions, setPayOptions] = useState([]);
	const [info, setInfo] = useState("");

	useEffect(() => {
		PAYRUN_OPTIONS.map((option) => {
			option.show = option.code === 4 ? isBusinessNAdmin(loggedInUser?.email) : true;
			return option;
		});
		setPayOptions(PAYRUN_OPTIONS);
	}, []);

	useEffect(() => {
		setHighlightColor(
			PAYRUN_OPTIONS.find(({ code }) => code === parseInt(payrunOption))?.highlightColor,
		);
		setIsOpen(true);
		setInfo(PAYRUN_OPTIONS.find(({ code }) => code === parseInt(payrunOption))?.info);
	}, [payrunOption]);

	const handlePayrun = (e) => {
		if (e.target.value !== "") setPayrunOption(e.target.value);
	};

	return (
		<Popover isOpen={isOpen} placement="right">
			<PopoverTrigger>
				<Select
					size={"sm"}
					border="1px solid var(--primary_button_bg)"
					borderRadius="10px"
					value={payrunOption}
					placeholder="Select Payrun Option"
					onChange={handlePayrun}
				>
					{payOptions?.map(({ name, code, show }) => (
						<React.Fragment key={name}>
							{show ? <option value={code}>{name}</option> : <></>}
						</React.Fragment>
					))}
				</Select>
			</PopoverTrigger>
			<PopoverContent w="auto" bg={generateLighterShade(highlightColor, 0.8)}>
				<PopoverBody display="flex" alignItems="center">
					<HStack justifyContent="space-between">
						<TextTitle title={info} size="sm" em="italic" />
						<CloseButton size="sm" ml={5} onClick={handleClick} />
					</HStack>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
}
