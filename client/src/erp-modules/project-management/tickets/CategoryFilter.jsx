import { HStack, Stack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
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
		<BoxCard boxShadow="md" p={0} borderWidth="0" borderRadius="1em" minW="150px">
			<Stack
				alignItems="center"
				justify="space-between"
				bg="var(--banner_bg)"
				color="var(--primary_bg)"
				p="8px"
				gap={0}
			>
				<TextTitle size="14px" align="center" title={isMyChannel ? `${name} Channel` : name} />
				<Stack p="0 10px" gap={0}>
					<HStack spacing={1} justify="center">
						<TextTitle
							size="32px"
							align="center"
							width="30%"
							color="var(--open)"
							title={pending || 0}
						/>
						<PrimaryButton
							w="90px"
							cursor="text"
							color="var(--primary_bg)"
							bg="var(--open)"
							name="Open"
							size="xs"
							hover={{
								bg: "var(--pending)",
								color: "var(--primary_bg)",
							}}
						/>
					</HStack>
					<HStack spacing={1} justify="start">
						<TextTitle
							size="32px"
							align="center"
							width="30%"
							color="var(--ticket_hold)"
							title={onHold || 0}
						/>
						<PrimaryButton
							w="90px"
							cursor="text"
							color="var(--primary_bg)"
							bg="var(--ticket_hold)"
							name={TICKET_ACTION.ON_HOLD}
							size="xs"
							hover={{
								bg: "var(--ticket_hold)",
								color: "var(--primary_bg)",
							}}
						/>
					</HStack>
					<HStack spacing={1} justify="start">
						<TextTitle
							width="30%"
							size="32px"
							align="center"
							color="var(--ticket_progress)"
							title={inProgress || 0}
						/>
						<PrimaryButton
							w="90px"
							cursor="text"
							color="var(--primary_bg)"
							bg="var(--ticket_progress)"
							name={TICKET_ACTION.PROGRESS}
							size="xs"
							hover={{
								bg: "var(--ticket_progress)",
								color: "var(--primary_bg)",
							}}
						/>
					</HStack>
				</Stack>
				<PrimaryButton
					mt={3}
					onOpen={() => handlePresent(name)}
					color={filterName?.includes(name) ? "var(--product5)" : presentTitle.color}
					bg="var(--nav_menu)"
					name={filterName?.includes(name) ? "Presenting" : presentTitle.title}
					size="xs"
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
