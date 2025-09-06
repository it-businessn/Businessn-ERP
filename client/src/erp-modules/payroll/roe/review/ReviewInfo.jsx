import { Box, Flex, HStack, IconButton, Image, Spacer, Text, VStack } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useRef, useState } from "react";
import { FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import flag from "../../../../assets/world.png";
import {
	Block1,
	Block10,
	Block11,
	Block12,
	Block13,
	Block14,
	Block15a,
	Block15b,
	Block15c,
	Block16,
	Block17,
	Block18,
	Block19,
	Block2,
	Block20,
	Block21,
	Block22,
	Block3,
	Block4,
	Block5,
	Block6,
	Block7,
	Block8,
	Block9,
} from "./blocks";

const PAGE_SIZES = {
	letter: { label: "Letter 816×1056", w: 816, h: 1056 },
	a4: { label: "A4 ~794×1123", w: 794, h: 1123 },
};

const ReviewInfo = ({ formData, handleFieldChange, setFormData }) => {
	const componentRef = useRef();
	const [isPrintDisabled, setIsPrintDisabled] = useState(false);
	const [reportFileName, setReportFileName] = useState(null);

	useEffect(() => {
		setReportFileName("asf");
	}, []);

	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		onBeforeGetContent: () => {
			document.title = reportFileName;
		},
	});

	const handleClick = () => {
		setTimeout(() => handlePrint(), 1000);
	};
	return (
		<>
			<IconButton
				size={"lg"}
				icon={<FaPrint />}
				aria-label="Print"
				variant="round"
				onClick={handleClick}
			/>
			<Box
				ref={componentRef}
				position="relative"
				mx="auto"
				bg="white"
				fontFamily="sans-serif"
				fontSize="xs"
				h={"100%"}
				// w={"60%"}
				p={10}
			>
				{/* Watermark */}
				<Text
					position="absolute"
					top="50%"
					left="50%"
					transform="translate(-50%, -50%) rotate(-45deg)"
					fontSize="10em"
					fontWeight="bold"
					color="gray.300"
					opacity={0.5}
					pointerEvents="none"
					zIndex={0}
					w={"100%"}
				>
					DRAFT COPY
				</Text>
				<Box
					position="relative"
					zIndex={1}
					bg="white"
					fontFamily="Arial, sans-serif"
					fontSize="10px"
				>
					<Flex justify="space-between" align="center">
						<Flex align="center" gap={4} alignItems={"center"}>
							<Image src={flag} alt="Canada" boxSize="10" />
							<Text fontWeight="bold" lineHeight={1} fontSize={"12px"} w={"50px"}>
								Service Canada
							</Text>
						</Flex>
						<Box textAlign="right" fontSize="10px">
							<Text>Protected when completed - B</Text>
						</Box>
					</Flex>

					<HStack>
						<TextTitle size={"md"} align={"left"} title={"RECORD OF EMPLOYMENT (ROE)"} />
						<Box w={"400px"} border={"1px solid"} pl={2}>
							<NormalTextTitle size="xs" title={"UNIQUE IDENTIFIER"} />
						</Box>
						<Box w={"120px"} border={"1px solid"} pl={2}>
							<NormalTextTitle size="xs" title={"sad"} />
						</Box>
					</HStack>
					<HStack w={"100%"} spacing={0} alignItems={"self-start"} justifyContent={"space-between"}>
						<Block1 />
						<Block2 />
						<Block3 />
					</HStack>
					<HStack spacing={0} alignItems={"self-start"} borderLeft={"1px solid"}>
						<VStack flex={1} alignItems={"start"}>
							<Block4 />
							<HStack w={"100%"} justifyContent={"space-between"}>
								<Spacer />
								<Block7 />
							</HStack>
						</VStack>
						<VStack
							flex={0.5}
							spacing={0}
							alignItems={"self-start"}
							border={"1px solid"}
							borderBottom={"0"}
						>
							<Box h={"17px"} w={"130px"} mt={"-17px"} ml={"-1px"} borderLeft={"1px solid"} />
							<Block5 />
							<Block6 />
							<Block14 />
						</VStack>
						<VStack flex={0.5} borderRight="1px solid" alignItems={"self-start"}>
							<Block8 />
							<Block10 />
							<Block11 />
							<Block12 />
							<Block13 />
						</VStack>
					</HStack>

					<HStack alignItems={"self-start"} spacing={0}>
						<VStack border="1px solid" flex={1} alignItems={"self-start"}>
							<Block9 />
							<Block16 />
							<Block17 />
							<Block18 />
							<Block19 />
							<HStack borderTop="1px solid" w={"100%"}>
								<Block20 /> <Block21 />
							</HStack>

							<Block22 />
						</VStack>
						<VStack flex={1} border="1px solid" borderLeft={0} alignItems={"self-start"}>
							<Block15a />
							<Block15b />
							<Block15c />
						</VStack>
					</HStack>
					{/* </Flex> */}
					{/* <Box mt={1} border={"1px solid"}>
						<NormalTextTitle
							size="xs"
							whiteSpace={"wrap"}
							title={`THIS RECORD OF EMPLOYMENT IS SUBMITTED BY Payroll Service Provider Name, PAYROLL SERVICE
					PROVIDER, ON BEHALF OF THE EMPLOYER NAMED IN [BOX4], AS AUTHORIZED BY A LETTER OF
					AGREEMENT BETWEEN THE PAYROLL SERVICE PROVIDER AND THE EMPLOYER.`}
						/>
					</Box> */}
				</Box>
			</Box>
		</>
	);
};

export default ReviewInfo;
