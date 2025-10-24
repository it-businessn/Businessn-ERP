import { Avatar, HStack, VStack } from "@chakra-ui/react";
import BoxCard from "./card";
import NormalTextTitle from "./NormalTextTitle";
import TextTitle from "./text/TextTitle";

const UserStatInfo = ({ name, email, stats }) => {
	return (
		<BoxCard>
			<VStack justify="center" align="center" mb="1" w={{ base: "auto", md: "106%" }} spacing={0}>
				<Avatar borderRadius="10%" name={name} src={name} />
				<TextTitle title={name} />
				<NormalTextTitle size="xs" title={email} />
			</VStack>
			<HStack my={"3"} spacing={2} justify={"space-between"}>
				{stats.map(({ name, value }) => (
					<VStack spacing={0} key={name}>
						<NormalTextTitle size="sm" title={name} />
						<TextTitle title={value} />
					</VStack>
				))}
			</HStack>
		</BoxCard>
	);
};

export default UserStatInfo;
