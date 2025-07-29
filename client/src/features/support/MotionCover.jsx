import { Box, Circle, HStack, Image, VStack } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import affImg1 from "../../assets/affiliate/1.jpg";
import affImg2 from "../../assets/affiliate/2.jpg";
import affImg3 from "../../assets/affiliate/3.jpg";
import affImg4 from "../../assets/affiliate/4.jpg";
import logoSrc from "../../assets/logos/logoCover.png";

export default function MotionCover() {
	const MotionImage = motion(Image);
	const AFFILIATE_IMG = [affImg1, affImg2, affImg3, affImg4];
	const [index, setIndex] = useState(0);
	const total = AFFILIATE_IMG.length;

	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((i) => (i + 1) % total);
		}, 2000);

		return () => clearInterval(interval);
	}, []);

	return (
		<Box
			bg="var(--banner_bg)"
			w={{ base: "100%", md: "50%", lg: "30%" }}
			p={6}
			display={{ base: "none", md: "flex" }}
			justifyContent="space-between"
		>
			<VStack w="100%" gap={8} h="100%" justifyContent="center">
				<a href="/" aria-current="page" className="w-inline-block w--current">
					<img src={logoSrc} loading="lazy" className="affiliate-logo " alt="main-logo" />
				</a>
				<Box h={{ base: "50%", lg: "500px" }} w={{ base: "100%", lg: "300px" }}>
					<AnimatePresence mode="wait">
						<MotionImage
							key={AFFILIATE_IMG[index]}
							src={AFFILIATE_IMG[index]}
							alt={`Slide ${index}`}
							objectFit="cover"
							width="100%"
							height="100%"
							// initial={{ opacity: 0.5, x: 100 }}
							// animate={{ opacity: 1, x: 0 }}
							// exit={{ opacity: 0.5, x: -100 }}
							// transition={{ duration: 0.2 }}
							initial={false}
							animate={{}}
							exit={false}
							transition={false}
							borderRadius="lg"
						/>
					</AnimatePresence>
				</Box>
				<NormalTextTitle
					align="center"
					color="var(--main_color)"
					title="Get early access to services, free products and more!"
				/>
				<HStack spacing={3}>
					{AFFILIATE_IMG.map((_, i) => (
						<Circle
							key={i}
							size="10px"
							bg={i === index ? "blue.500" : "gray.300"}
							cursor="pointer"
							onClick={() => setIndex(i)}
							transition="background-color 0.3s"
						/>
					))}
				</HStack>
			</VStack>
		</Box>
	);
}
