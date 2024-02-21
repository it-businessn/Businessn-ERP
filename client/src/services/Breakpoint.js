import { useBreakpointValue as useChakraBreakpointValue } from "@chakra-ui/react";

export const useBreakpointValue = () => {
	const isMobile = useChakraBreakpointValue({
		base: true,
		md: false,
	});

	const isIpad = useChakraBreakpointValue({
		base: false,
		md: true,
		lg: false,
	});
	return {
		isMobile,
		isIpad,
	};
};
export const isMobileView = () => window.innerWidth <= 767;

export const isTabletView = () =>
	window.innerWidth > 767 && window.innerWidth <= 991;
