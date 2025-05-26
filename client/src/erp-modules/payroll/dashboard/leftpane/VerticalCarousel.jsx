import { Box, Flex, Icon } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import Slide from "./Slide";

const mod = (a, b) => ((a % b) + b) % b;

const VerticalCarousel = ({ slides, animationConfig, closestRecordIndex }) => {
	const [index, setIndex] = useState(closestRecordIndex || 0);

	// index wraps around slide length
	const modBySlidesLength = useCallback((i) => mod(i, slides.length), [slides.length]);

	// Moves the slide by a certain direction (prev/next)
	const moveSlide = useCallback(
		(direction) => {
			setIndex((prevIndex) => modBySlidesLength(prevIndex + direction));
		},
		[modBySlidesLength],
	);

	// Function to handle keyboard navigation
	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.isComposing || event.keyCode === 229) return;
			if (event.keyCode === 37) moveSlide(-1); // Left arrow
			if (event.keyCode === 39) moveSlide(1); // Right arrow
		};
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [moveSlide]);

	// If no slides, return null
	if (!slides || slides.length === 0) {
		return null;
	}

	return (
		<Box position="relative" width="100%" height="250px">
			<Flex
				position="relative"
				height="100%"
				width="100%"
				alignItems="center"
				justifyContent="center"
			>
				<Slide content={slides[index]} moveSlide={moveSlide} animationConfig={animationConfig} />

				{/* Navigation Chevrons */}
				{slides.length > 1 && (
					<Flex
						position="absolute"
						width="100%"
						justifyContent="space-between"
						alignItems="center"
						px="2"
						zIndex="10"
						pointerEvents="none"
					>
						<Icon
							as={MdOutlineChevronLeft}
							boxSize="40px"
							color="gray.600"
							cursor="pointer"
							bg="white"
							opacity="0.8"
							borderRadius="full"
							_hover={{ opacity: 1 }}
							onClick={() => moveSlide(-1)}
							pointerEvents="auto"
							padding="8px"
						/>
						<Icon
							as={MdOutlineChevronRight}
							boxSize="40px"
							color="gray.600"
							cursor="pointer"
							bg="white"
							opacity="0.8"
							borderRadius="full"
							_hover={{ opacity: 1 }}
							onClick={() => moveSlide(1)}
							pointerEvents="auto"
							padding="8px"
						/>
					</Flex>
				)}
			</Flex>

			{/* Slide Indicator */}
			{slides.length > 1 && (
				<Flex justify="center" mt="3" gap="2">
					{slides.map((_, i) => (
						<Box
							key={i}
							h="2"
							w="2"
							borderRadius="full"
							bg={i === index ? "blue.500" : "gray.300"}
							cursor="pointer"
							onClick={() => setIndex(i)}
						/>
					))}
				</Flex>
			)}
		</Box>
	);
};

export default VerticalCarousel;
