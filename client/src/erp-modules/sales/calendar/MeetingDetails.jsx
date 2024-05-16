import { VStack } from "@chakra-ui/react";
import LinkButton from "components/ui/button/LinkButton";
import TextTitle from "components/ui/text/TextTitle";
import moment from "moment";
import React from "react";
import { formatDate, toCapitalize } from "utils";

const MeetingDetails = ({ event }) => {
	const DETAILS = [
		{
			title: "Type",
			value: event?.eventType && toCapitalize(event?.eventType),
		},
		{
			title: "Description",
			value: event?.description,
		},
		{
			title: "Start",
			value: `${formatDate(event?.fromDate)} ${moment(
				event?.fromTime,
				"HH:mm",
			).format("hh:mm A")}`,
		},
		{
			title: "End",
			value: `${formatDate(event?.toDate)} ${moment(
				event?.fromTime,
				"HH:mm",
			).format("hh:mm A")}`,
		},
	];
	return (
		<VStack align="flex-start" color={"brand.200"} spacing={0}>
			{DETAILS.map(({ title, value }) => (
				<React.Fragment key={title}>
					<TextTitle size={"sm"} title={title} />
					<TextTitle size={"xs"} weight="normal" title={value} />
				</React.Fragment>
			))}

			{event?.eventLink && (
				<>
					<TextTitle title="Link" size={"sm"} />
					<LinkButton fontSize="sm" name={event?.eventLink} />
				</>
			)}
			{event?.location && (
				<>
					<TextTitle title="Location" size={"sm"} />
					<TextTitle size={"xs"} weight="normal" title={event?.location} />
				</>
			)}
		</VStack>
	);
};

export default MeetingDetails;
