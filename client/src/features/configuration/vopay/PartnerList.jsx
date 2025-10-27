import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import VoPayService from "services/VoPayService";

export const PartnerList = ({ partners }) => {
	const getOnboardingLink = async (id) => {
		try {
			const { data } = await VoPayService.getOnboardingLink(id);
			if (data.OnboardingURL) window.open(data.OnboardingURL, "_blank");
		} catch (error) {}
	};

	return (
		<Table variant="simple" size="sm">
			<Thead>
				<Tr>
					<Th>Name</Th>
					<Th>Email</Th>
					<Th>Phone</Th>
					<Th>Address</Th>
					<Th>Status</Th>
				</Tr>
			</Thead>
			<Tbody>
				{(!partners || partners?.length === 0) && <EmptyRowRecord data={partners} colSpan={3} />}
				{partners?.map((partner) => (
					<Tr key={partner?.AccountID} onClick={() => getOnboardingLink(partner?.AccountID)}>
						<Td>{partner?.AccountName}</Td>
						<Td whiteSpace="pre-wrap">{partner?.Email}</Td>
						<Td>{partner?.Phone}</Td>
						<Td whiteSpace="pre-wrap">{`${partner?.Address}, ${partner?.City} ${partner?.Province} ${partner?.Country} ${partner?.PostalCode}`}</Td>
						<Td>{partner?.AccountStatus}</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
};
