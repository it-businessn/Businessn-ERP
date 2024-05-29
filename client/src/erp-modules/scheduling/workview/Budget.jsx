import React, { useState } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Input } from "@chakra-ui/react";

function Budget({ expenseData, onExpenseChange }) {
	const startDate = new Date();
	const daysInYear = 365;
	const days = Array.from({ length: daysInYear }, (_, index) => {
		const date = new Date(startDate);
		date.setDate(date.getDate() + index);
		return date;
	});

	const handleExpenseChange = (date, event) => {
		const newExpense = parseFloat(event.target.value);
		if (!isNaN(newExpense)) {
			onExpenseChange(date, newExpense);
		}
	};

	return (
		<Box>
			<Table variant="simple">
				<Thead>
					<Tr>
						<Th>Date</Th>
						<Th>Expenses</Th>
					</Tr>
				</Thead>
				<Tbody>
					{days.map((day, index) => (
						<Tr key={index}>
							<Td>{day.toDateString()}</Td>
							<Td>
								<Input
									type="number"
									defaultValue={expenseData[day.toISOString()] || 0}
									onChange={(event) => handleExpenseChange(day, event)}
								/>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
}

export default Budget;
