import { Tbody, Td, Tr } from "@chakra-ui/react";
import TableLayout from "components/ui/table/TableLayout";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Timecard = () => {
	const data = [
		{
			title: "Row 1",
			content: "Content for Row 1",
			content1: "Content for Row 1s",
		},
		{
			title: "Row 2",
			content: "Content for Row 2",
			content1: "Content for Row 2s",
		},
		// Add more rows as needed
	];
	const CollapsibleTable = ({ data }) => {
		const [isOpen, setIsOpen] = useState(false);

		const toggleAccordion = () => {
			setIsOpen(!isOpen);
		};
		const [isExpanded, setExpanded] = useState(1);
		const COLS = [
			"Employees",
			"Status",
			"Clock In",
			"Clock Out",
			"Start Break",
			"End Break",
			"Clock In",
			"Clock Out",
			"Total Hours",
		];
		const handleToggle = (index) => {
			setExpanded(isExpanded === index ? -1 : index);
		};
		return (
			<TableLayout isTimesheet cols={COLS}>
				<Tbody>
					{data.map((row, index) => (
						<React.Fragment key={index}>
							<Tr>
								<Td>
									{isExpanded === index ? (
										<FaChevronUp
											onClick={(e) => {
												e.preventDefault();
												handleToggle(index);
											}}
										/>
									) : (
										<FaChevronDown
											onClick={(e) => {
												e.preventDefault();
												handleToggle(index);
											}}
										/>
									)}
								</Td>
								<Td>{row.content}</Td>
								<Td>{row.content}</Td>
							</Tr>
							{isExpanded === index && (
								<Tr>
									<Td>{"position"}</Td>
									<Td>{"prokjec name"}</Td>
								</Tr>
							)}
						</React.Fragment>
					))}
				</Tbody>
			</TableLayout>
		);
	};

	return <CollapsibleTable data={data} />;
};

export default Timecard;
