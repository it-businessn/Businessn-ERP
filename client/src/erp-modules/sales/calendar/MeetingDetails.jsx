import { VStack } from "@chakra-ui/react";
import LinkButton from "components/ui/button/LinkButton";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import moment from "moment";
import React from "react";
import { toCapitalize } from "utils";
import { formatDate } from "utils/convertDate";

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
			value: `${formatDate(event?.fromDate)} ${moment(event?.start).format("hh:mm A")}`,
		},
		{
			title: "End",
			value: `${formatDate(event?.toDate)} ${moment(event?.end).format("hh:mm A")}`,
		},
	];
	return (
		<VStack align="flex-start" color={"var(--menu_item_color)"} spacing={0}>
			{DETAILS.map(({ title, value }) => (
				<React.Fragment key={title}>
					<TextTitle size={"sm"} title={title} />
					<NormalTextTitle size={"xs"} title={value} />
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
					<NormalTextTitle size={"xs"} title={event?.location} />
				</>
			)}
		</VStack>
	);
};

export default MeetingDetails;
