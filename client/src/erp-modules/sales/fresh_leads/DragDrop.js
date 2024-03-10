import { Box, HStack, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const getItemStyle = (isDragging, draggableStyle) => ({
	userSelect: "none",
	padding: "8px",
	margin: `0 0 8px 0`,
	background: isDragging ? "var(--lead_cards_bg)" : "var(--main_color)",
	...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
	background: isDraggingOver ? "#dbe5ff" : "var(--main_color)",
	padding: 8,
	width: 250,
});

const LeftBox = ({ items }) => (
	<VStack spacing={4} align="stretch" width={250}>
		<Droppable droppableId="left-box">
			{(provided, snapshot) => (
				<Box
					ref={provided.innerRef}
					{...provided.droppableProps}
					style={getListStyle(snapshot.isDraggingOver)}
				>
					{items.map((item, index) => (
						<Draggable key={item.id} draggableId={item.id} index={index}>
							{(provided, snapshot) => (
								<Box
									ref={provided.innerRef}
									{...provided.draggableProps}
									{...provided.dragHandleProps}
									style={getItemStyle(
										snapshot.isDragging,
										provided.draggableProps.style,
									)}
								>
									{item.content}
								</Box>
							)}
						</Draggable>
					))}
					{provided.placeholder}
				</Box>
			)}
		</Droppable>
	</VStack>
);

const RightBox = ({ items }) => (
	<VStack spacing={4} align="stretch" width={250}>
		<Droppable droppableId="right-box">
			{(provided, snapshot) => (
				<Box
					ref={provided.innerRef}
					{...provided.droppableProps}
					style={getListStyle(snapshot.isDraggingOver)}
				>
					{items.map((item, index) => (
						<Draggable key={item.id} draggableId={item.id} index={index}>
							{(provided, snapshot) => (
								<Box
									ref={provided.innerRef}
									{...provided.draggableProps}
									{...provided.dragHandleProps}
									style={getItemStyle(
										snapshot.isDragging,
										provided.draggableProps.style,
									)}
								>
									{item.content}
								</Box>
							)}
						</Draggable>
					))}
					{provided.placeholder}
				</Box>
			)}
		</Droppable>
	</VStack>
);

const FreshLeads = () => {
	const [leftItems, setLeftItems] = useState([
		{ id: "1", content: "Left Item 1" },
		{ id: "2", content: "Left Item 2" },
		{ id: "3", content: "Left Item 3" },
	]);

	const [rightItems, setRightItems] = useState([
		{ id: "4", content: "right Item 3" },
	]);

	const onDragEnd = (result) => {
		if (!result.destination) return;

		const sourceList =
			result.source.droppableId === "left-box" ? leftItems : rightItems;
		const destinationList =
			result.destination.droppableId === "left-box" ? leftItems : rightItems;

		const [reorderedItem] = sourceList.splice(result.source.index, 1);
		destinationList.splice(result.destination.index, 0, reorderedItem);

		setLeftItems([...leftItems]);
		setRightItems([...rightItems]);
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<HStack spacing={4} direction="row">
				<LeftBox items={leftItems} />
				<RightBox items={rightItems} />
			</HStack>
		</DragDropContext>
	);
};
export default FreshLeads;
