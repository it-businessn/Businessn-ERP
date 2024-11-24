import { Box, Button, Flex } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import Slide from "./Slide";

const mod = (a, b) => ((a % b) + b) % b;

const VerticalCarousel = ({
	slides,
	animationConfig,
	offsetRadius,
	showNavigation,
	closestRecordIndex,
}) => {
	const [index, setIndex] = useState(closestRecordIndex);

	// index wraps around slide length
	const modBySlidesLength = useCallback((i) => mod(i, slides.length), [slides.length]);

	// Moves the slide by a certain direction (up/down)
	const moveSlide = useCallback(
		(direction) => {
			setIndex((prevIndex) => modBySlidesLength(prevIndex + direction));
		},
		[modBySlidesLength],
	);

	const clampOffsetRadius = useCallback(
		(offsetRadius) => {
			const upperBound = Math.floor((slides.length - 1) / 2);
			if (offsetRadius < 0) return 0;
			if (offsetRadius > upperBound) return upperBound;
			return offsetRadius;
		},
		[slides.length],
	);

	// Computes the currently visible slides based on the index and offset
	const getPresentableSlides = useCallback(() => {
		const clampedOffset = clampOffsetRadius(offsetRadius);
		const presentableSlides = [];

		for (let i = -clampedOffset; i <= clampedOffset; i++) {
			presentableSlides.push(slides[modBySlidesLength(index + i)]);
		}

		return presentableSlides;
	}, [clampOffsetRadius, offsetRadius, slides, index, modBySlidesLength]);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.isComposing || event.keyCode === 229) return;
			if (event.keyCode === 38) moveSlide(-1);
			if (event.keyCode === 40) moveSlide(1);
		};
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [moveSlide]);

	const navigationButtons = showNavigation ? (
		<Flex
			position="relative"
			height="60px"
			mt="1rem"
			width="20%"
			margin="0 auto"
			justify="space-between"
			zIndex="1000"
		>
			<Button bg="white" p="15px" mb="10px" borderRadius="3px" onClick={() => moveSlide(1)}>
				&#8593;
			</Button>
			<Button bg="white" p="15px" mb="10px" borderRadius="3px" onClick={() => moveSlide(-1)}>
				&#8595;
			</Button>
		</Flex>
	) : null;

	return (
		<React.Fragment>
			<Box position="relative" display="flex" justifyContent="center" height="300px">
				{getPresentableSlides().map((slide, presentableIndex) => (
					<Slide
						key={`${slide.payPeriod}_${presentableIndex}`}
						content={slide}
						moveSlide={moveSlide}
						offsetRadius={clampOffsetRadius(offsetRadius)}
						index={presentableIndex}
						animationConfig={animationConfig}
					/>
				))}
			</Box>
			{navigationButtons}
		</React.Fragment>
	);
};

export default VerticalCarousel;
