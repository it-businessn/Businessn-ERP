import { Box, Flex, Icon } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import Slide from "./Slide";

const mod = (a, b) => ((a % b) + b) % b;

const VerticalCarousel = ({ slides, animationConfig, closestRecordIndex }) => {
  const [index, setIndex] = useState(closestRecordIndex || 0);

  // index wraps around slide length
  const modBySlidesLength = useCallback(
    (i) => mod(i, slides.length),
    [slides.length],
  );

  // Moves the slide by a certain direction (prev/next)
  const moveSlide = useCallback(
    (direction) => {
      setIndex((prevIndex) => modBySlidesLength(prevIndex + direction));
    },
    [modBySlidesLength],
  );

  const getSurroundingSlides = useCallback(() => {
    const surroundingSlides = [];

    for (let offset = 0; offset < slides.length; offset++) {
      const i = modBySlidesLength(closestRecordIndex + offset);
      surroundingSlides.push(slides[i]);
    }

    // for (let offset = -5; offset <= 5; offset++) {
    // 	const i = modBySlidesLength(closestRecordIndex + offset);
    // 	surroundingSlides.push(slides[i]);
    // }

    return surroundingSlides;
  }, [closestRecordIndex, slides, modBySlidesLength]);

  const visibleSlides = getSurroundingSlides();

  // Function to handle keyboard navigation
  // useEffect(() => {
  // 	const handleKeyDown = (event) => {
  // 		if (event.isComposing || event.keyCode === 229) return;
  // 		if (event.keyCode === 37) moveSlide(-1); // Left arrow
  // 		if (event.keyCode === 39) moveSlide(1); // Right arrow
  // 	};
  // 	document.addEventListener("keydown", handleKeyDown);

  // 	return () => {
  // 		document.removeEventListener("keydown", handleKeyDown);
  // 	};
  // }, [moveSlide]);

  // If no slides, return null
  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <Box position="relative" width="100%" minH="260px">
      {/* Chevrons flank the slide as flex siblings instead of being absolutely
			    positioned over it, so they never cover the dates or buttons. */}
      <Flex
        width="100%"
        alignItems="center"
        justifyContent="center"
        gap={{ base: 1, md: 2 }}
      >
        {visibleSlides.length > 1 && (
          <Icon
            visibility={index === 0 ? "hidden" : "visible"}
            as={MdOutlineChevronLeft}
            boxSize={{ base: "32px", md: "40px" }}
            flexShrink={0}
            color="gray.600"
            cursor="pointer"
            bg="white"
            opacity="0.8"
            borderRadius="full"
            _hover={{ opacity: 1 }}
            onClick={() => moveSlide(-1)}
            padding="8px"
            aria-label="Previous pay period"
          />
        )}
        <Box flex={1} minW={0}>
          <Slide
            content={slides[index]}
            moveSlide={moveSlide}
            animationConfig={animationConfig}
          />
        </Box>
        {visibleSlides.length > 1 && (
          <Icon
            visibility={
              index === visibleSlides?.length - 1 ? "hidden" : "visible"
            }
            as={MdOutlineChevronRight}
            boxSize={{ base: "32px", md: "40px" }}
            flexShrink={0}
            color="gray.600"
            cursor="pointer"
            bg="white"
            opacity="0.8"
            borderRadius="full"
            _hover={{ opacity: 1 }}
            onClick={() => moveSlide(1)}
            padding="8px"
            aria-label="Next pay period"
          />
        )}
      </Flex>

      {/* Slide Indicator */}
      {visibleSlides?.length > 1 && (
        <Flex justify="center" mt="3" gap="2" flexWrap="wrap">
          {visibleSlides.map((_, i) => (
            <Box
              key={i}
              h="2"
              w="2"
              borderRadius="full"
              bg={i === index ? "var(--banner_bg)" : "gray.300"}
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
