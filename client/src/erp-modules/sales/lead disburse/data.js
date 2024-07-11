import {
	Icon,
	Input,
	InputGroup,
	InputLeftElement,
	Select,
} from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import TextTitle from "components/ui/text/TextTitle";
import {
	DISBURSE_MODE_OPTIONS,
	REGIONS,
} from "erp-modules/project-management/workview/project/data";
import { FaCaretDown, FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";

export const showFilterSearchOption = () => (
	<>
		<LeftIconButton
			color={"var(--nav_color)"}
			border={"2px solid var(--filter_border_color)"}
			name={"Filter"}
			borderRadius={"10px"}
			variant={"ghost"}
			isFilter
			size="xs"
			ml={2}
			w={{ lg: "150px" }}
			// handleClick={() => setShowEditDetails(true)}
			icon={<MdOutlineFilterList />}
		/>
		<InputGroup
			size="xs"
			w={"40%"}
			borderRadius={"10px"}
			border={"1px solid var(--filter_border_color)"}
			fontSize="xs"
			fontWeight="bold"
		>
			<InputLeftElement size="xs" children={<FaSearch />} />
			<Input
				size="xs"
				_placeholder={{
					color: "var(--nav_color)",
					fontSize: "xs",
				}}
				color={"var(--nav_color)"}
				bg={"var(--primary_bg)"}
				type="text"
				placeholder="Search here"
				pr="4.5rem"
				py={"1.1em"}
			/>
		</InputGroup>
	</>
);

export const showRegion = () => (
	<>
		<Select
			w={{ lg: "250px" }}
			icon={<Icon as={FaCaretDown} />}
			mt={{ base: "1em", md: 0 }}
			border={"2px solid var(--filter_border_color)"}
			borderRadius={"10px"}
			size={"sm"}
		>
			{REGIONS.map(({ name, id }) => (
				<option key={id} value={name}>
					{name}
				</option>
			))}
		</Select>
		<Select
			w={{ lg: "300px" }}
			icon={<Icon as={FaCaretDown} />}
			mt={{ base: "1em", md: 0 }}
			border={"2px solid var(--filter_border_color)"}
			borderRadius={"10px"}
			size={"sm"}
		>
			{DISBURSE_MODE_OPTIONS.map(({ name, id }) => (
				<option key={id} value={name}>
					{name}
				</option>
			))}
		</Select>
	</>
);

export const caption = () => <TextTitle title={"Lead Disbursement"} />;

export const columns = [
	"Active",
	"Name",
	"Leads",
	"Last Login",
	"Role",
	"Address",
	"Areas",
	"Product Service",
	"Weighting",
];
