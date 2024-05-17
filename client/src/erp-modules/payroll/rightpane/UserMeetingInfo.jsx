import { Avatar, HStack, Text, VStack } from "@chakra-ui/react";

const UserMeetingInfo = ({ selectedUser, stats }) => {
	return (
		<>
			<VStack
				justify="center"
				align="center"
				mb="1"
				w={{ base: "auto", md: "106%" }}
				spacing={0}
			>
				<Avatar name={selectedUser?.fullName} src={selectedUser?.fullName} />
				<Text fontWeight="bold">{selectedUser?.fullName}</Text>
				<Text fontSize={"xs"}>{selectedUser?.email}</Text>
			</VStack>
			<HStack spacing={2} justify={"space-between"}>
				{stats.map(({ name, count }) => (
					<VStack spacing={0} key={name}>
						<Text fontSize="sm">{name}</Text>
						<Text fontWeight="bold">{count}</Text>
					</VStack>
				))}
				{/* <VStack spacing={0}>
<Text fontSize="xs">Days till next</Text>
<Text fontWeight="bold">3</Text>
</VStack>
<VStack spacing={0}>
<Text fontSize="xs">Approval Date</Text>
<Text fontWeight="bold">{formatDate(new Date())}</Text>
</VStack>
<VStack spacing={0}>
<Text fontSize="xs">Payment Date</Text>
<Text fontWeight="bold">{formatDate(new Date())}</Text>
</VStack> */}
			</HStack>
		</>
	);
};

export default UserMeetingInfo;
