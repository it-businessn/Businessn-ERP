import { HStack, Stack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { TICKET_ACTION } from "erp-modules/payroll/timesheets/data";

const CategoryFilter = ({ name, data, isMyChannel, presentTitle, filterTicket, filterName }) => {
	const pending = isMyChannel
		? data?.find(({ _id }) => _id === TICKET_ACTION.OPEN)?.count
		: data?.statuses?.find(({ status }) => status === TICKET_ACTION.OPEN)?.count;

	const onHold = isMyChannel
		? data?.find(({ _id }) => _id === TICKET_ACTION.ON_HOLD)?.count
		: data?.statuses?.find(({ status }) => status === TICKET_ACTION.ON_HOLD)?.count;

	const inProgress = isMyChannel
		? data?.find(({ _id }) => _id === TICKET_ACTION.PROGRESS)?.count
		: data?.statuses?.find(({ status }) => status === TICKET_ACTION.PROGRESS)?.count;

	const handlePresent = (name) => {
		filterTicket(name);
	};

	return (
		<BoxCard boxShadow="md" p={0} borderWidth="0" borderRadius="1em" minW="160px">
			<Stack
				alignItems="center"
				justify="space-between"
				bg="var(--banner_bg)"
				color="var(--primary_bg)"
				p="8px"
				gap={0}
			>
				<TextTitle
					h="2.7em"
					size="lg"
					whiteSpace="wrap"
					align="center"
					title={isMyChannel ? `${name} Channel` : name}
				/>
				<Stack p="0 10px" gap={0}>
					<HStack spacing={1}>
						<TextTitle
							size="1.8em"
							align="center"
							width="50px"
							color="var(--open)"
							title={pending || 0}
						/>
						<NormalTextTitle size="1.1em" title={TICKET_ACTION.OPEN} />
					</HStack>
					<HStack spacing={1}>
						<TextTitle
							size="1.8em"
							align="center"
							width="50px"
							color="var(--ticket_hold)"
							title={onHold || 0}
						/>
						<NormalTextTitle size="1.1em" title={TICKET_ACTION.ON_HOLD} />
					</HStack>
					<HStack spacing={1}>
						<TextTitle
							width="50px"
							size="1.8em"
							align="center"
							color="var(--ticket_progress)"
							title={inProgress || 0}
						/>
						<NormalTextTitle size="1.1em" title={TICKET_ACTION.PROGRESS} />
					</HStack>
				</Stack>
				<PrimaryButton
					mt={3}
					onOpen={() => handlePresent(name)}
					color={filterName?.includes(name) ? "var(--product5)" : presentTitle.color}
					bg="var(--nav_menu)"
					name={filterName?.includes(name) ? "Presenting" : presentTitle.title}
					size="sm"
					hover={{
						bg: "var(--nav_menu)",
						color: "var(--primary_bg)",
					}}
				/>
			</Stack>
		</BoxCard>
	);
};

export default CategoryFilter;
