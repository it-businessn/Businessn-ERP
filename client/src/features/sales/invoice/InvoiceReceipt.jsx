import {
	Box,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	HStack,
	SimpleGrid,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	VStack,
} from "@chakra-ui/react";
import Logo from "components/logo";

const InvoiceReceipt = ({ invoice, isOpen, onClose, isMobileView }) => {
	return (
		<Drawer isOpen={isOpen} onClose={onClose} placement="right" size={"lg"}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>Invoice Receipt</DrawerHeader>
				<DrawerBody>
					<Box p={4}>
						<SimpleGrid columns={2}>
							<VStack fontSize={"sm"} spacing={0} alignItems={"flex-start"}>
								<Text>ABC Corporation</Text>
								<Text>123 Main Street</Text>
								<Text>Cityville, ST 78901</Text>
								<Text>US</Text>
							</VStack>
							<VStack alignItems={"end"}>
								<Logo />
							</VStack>
						</SimpleGrid>
						<SimpleGrid columns={2}>
							<VStack />
							<VStack fontSize={"sm"} spacing={0} alignItems={"end"}>
								<Text>(555) 123-4567</Text>
								<Text>12 Main Street</Text>
								<Text>Cityville, US 87609</Text>
							</VStack>
						</SimpleGrid>
						<SimpleGrid columns={{ base: 1, md: 2 }} spacing="0">
							<VStack fontSize={"sm"} spacing={0} alignItems={"flex-start"}>
								<HStack>
									<Text fontWeight="bold">Receipt #</Text>
									<Text>{invoice?.InvoiceNumber}</Text>
								</HStack>
								<HStack>
									<Text fontWeight="bold">Receipt Date</Text>
									<Text>{invoice?.DueDate}</Text>
								</HStack>
							</VStack>
							<VStack alignItems={"end"} />
						</SimpleGrid>

						{/* <Box mt={4}>
							<Heading size="md">Total: ${invoice?.total.toFixed(2)}</Heading>
						</Box> */}
					</Box>
					<Table size={isMobileView ? "sm" : "md"}>
						<Thead>
							<Tr>
								<Th>ITEMS</Th>
								<Th>PRICE</Th>
								<Th>QUANTITY</Th>
								<Th textAlign={"right"}>AMOUNT</Th>
							</Tr>
						</Thead>
						<Tbody>
							<Tr>
								<Td>Product A</Td>
								<Td>$50.00</Td>
								<Td>1</Td>
								<Td textAlign={"right"}>$50.00</Td>
							</Tr>
							<Tr>
								<Td colSpan={3}>Subtotal</Td>
								<Td textAlign={"right"}>$50.00</Td>
							</Tr>
						</Tbody>
					</Table>
					<Box p={4}>
						<HStack spacing={1} flexDir={isMobileView ? "column" : "row"}>
							<Table>
								<Thead>
									<Tr>
										<Th pl={0} bg={"transparent"} fontSize={"sm"}>
											Payment instruction
										</Th>
									</Tr>
								</Thead>
								<Tbody>
									<Tr>
										<Td pb={0} px={0}>
											Paypal email
										</Td>
									</Tr>
									<Tr>
										<Td p={0}>wiz@test.com</Td>
									</Tr>

									<Tr>
										<Td pb={0} px={0}>
											Make checks payable to
										</Td>
									</Tr>
									<Tr>
										<Td p={0}>Jon K</Td>
									</Tr>
									<Tr>
										<Td pb={0} px={0}>
											Bank Transfer
										</Td>
									</Tr>
									<Tr>
										<Td p={0}>Routing (ABA): 06785990</Td>
									</Tr>
								</Tbody>
							</Table>
							<Table border={"none"}>
								<Thead>
									<Tr>
										<Th pl={0} fontSize={"sm"} bg={"transparent"}>
											Subtotal
										</Th>
										<Th
											pr={0}
											textAlign={"right"}
											fontSize={"sm"}
											bg={"transparent"}
										>
											USD 8000.00
										</Th>
									</Tr>
								</Thead>
								<Tbody>
									<Tr>
										<Td p={0}>Discount (20%):</Td>
										<Td textAlign={"right"} p={0}>
											USD 0.00
										</Td>
									</Tr>
									<Tr>
										<Td p={0}>Shipping Cost:</Td>
										<Td textAlign={"right"} p={0}>
											USD 0.00
										</Td>
									</Tr>

									<Tr>
										<Td p={0}>Sales Tax:</Td>
										<Td textAlign={"right"} p={0}>
											USD 450.00
										</Td>
									</Tr>
									<Tr>
										<Td fontWeight={"bold"} pb={0} px={0}>
											Total:
										</Td>
										<Td textAlign={"right"} fontWeight={"bold"} pb={0} px={0}>
											USD 8,480.00
										</Td>
									</Tr>
									<Tr>
										<Td pb={0} px={0}>
											Amount paid:
										</Td>
										<Td textAlign={"right"} pb={0} px={0}>
											USD 0.00
										</Td>
									</Tr>
									<Tr>
										<Td fontSize={"lg"} fontWeight={"bold"} pb={0} px={0}>
											Balance Due:
										</Td>
										<Td
											textAlign={"right"}
											fontSize={"lg"}
											fontWeight={"bold"}
											pb={0}
											px={0}
										>
											USD 8,480.00
										</Td>
									</Tr>
								</Tbody>
							</Table>
						</HStack>
					</Box>
				</DrawerBody>
				<DrawerFooter></DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default InvoiceReceipt;
