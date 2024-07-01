import { Avatar, HStack, Text, VStack } from "@chakra-ui/react";

const UserStatInfo = ({ name, email, stats }) => {
	return (
		<>
			<VStack
				justify="center"
				align="center"
				mb="1"
				w={{ base: "auto", md: "106%" }}
				spacing={0}
			>
				<Avatar name={name} src={name} />
				<Text fontWeight="bold">{name}</Text>
				<Text fontSize={"xs"}>{email}</Text>
			</VStack>
			<HStack my={"3"} spacing={2} justify={"space-between"}>
				{stats.map(({ name, value }) => (
					<VStack spacing={0} key={name}>
						<Text fontSize="sm">{name}</Text>
						<Text fontWeight="bold">{value}</Text>
					</VStack>
				))}
			</HStack>
		</>
	);
};

export default UserStatInfo;
