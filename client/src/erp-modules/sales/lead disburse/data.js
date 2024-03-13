import {
	Button,
	Icon,
	Input,
	InputGroup,
	InputLeftElement,
	Select,
} from "@chakra-ui/react";
import TextTitle from "components/ui/TextTitle";
import {
	DISBURSE_MODE_OPTIONS,
	REGIONS,
} from "erp-modules/project-management/workview/data";
import { FaCaretDown, FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";

export const showFilterSearchOption = () => (
	<>
		<Button
			w={{ lg: "100px" }}
			color={"brand.nav_color"}
			leftIcon={<MdOutlineFilterList />}
			border={"2px solid var(--filter_border_color)"}
			borderRadius={"10px"}
			variant={"ghost"}
			_hover={{ color: "brand.600", bg: "transparent" }}
		>
			Filter
		</Button>
		<InputGroup
			w={{ lg: "180px" }}
			borderRadius={"10px"}
			border={"1px solid var(--filter_border_color)"}
			fontWeight="bold"
		>
			<InputLeftElement size="xs" children={<FaSearch />} />
			<Input
				_placeholder={{
					color: "brand.nav_color",
				}}
				color={"brand.nav_color"}
				bg={"brand.primary_bg"}
				type="text"
				placeholder="Search here"
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
