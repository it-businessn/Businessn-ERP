import { HStack } from "@chakra-ui/react";
import RadioButtonGroup from "components/ui/tab/RadioButtonGroup";
import { useState } from "react";
import AccessApprove from "./AccessApprove";
import AccessSent from "./AccessSent";
import BankTest from "./BankTest";
import CompanyConfigSetup from "./CompanyConfigSetup";
import CSRCheckin1 from "./CSRCheckin1";
import CSRCheckin2 from "./CSRCheckin2";
import FinalRevisions from "./FinalRevisions";
import GoLiveApprove from "./GoLiveApprove";
import GoLiveComplete from "./GoLiveComplete";
import GoLiveInitiate from "./GoLiveInitiate";
import InternalDemo from "./InternalDemo";
import Onboarding from "./Onboarding";
import Package from "./Package";
import PopulateData from "./PopulateData";
import Revisions from "./Revisions";
import TechConfigSetup from "./TechConfigSetup";
import WelcomeEmail from "./WelcomeEmail";

const SalesOnboardUser = ({ handleClose, company }) => {
	const handleNext = (id) => setViewMode(SETUP_LIST[id]?.type);
	const SETUP_LIST = [
		{
			id: 0,
			type: "Welcome Emails",
			name: <WelcomeEmail id={1} handleNext={handleNext} />,
		},
		{
			id: 1,
			type: "Onboarding",
			name: <Onboarding id={2} handleNext={handleNext} />,
		},
		{
			id: 2,
			type: "Bank Test",
			name: <BankTest id={3} handleNext={handleNext} />,
		},
		{
			id: 3,
			type: "Package",
			name: <Package id={4} handleNext={handleNext} />,
		},
		{
			id: 4,
			type: "Technical Configuration",
			name: <TechConfigSetup id={5} handleNext={handleNext} />,
		},
		{
			id: 5,
			type: "Company Configuration",
			name: <CompanyConfigSetup id={6} handleNext={handleNext} />,
		},
		{
			id: 6,
			type: "Data Populated",
			name: <PopulateData id={7} handleNext={handleNext} />,
		},
		{
			id: 7,
			type: "CSR CheckIn 1",
			name: <CSRCheckin1 id={8} handleNext={handleNext} />,
		},
		{
			id: 8,
			type: "Revisions",
			name: <Revisions id={9} handleNext={handleNext} />,
		},
		{
			id: 9,
			type: "CSR CheckIn 2",
			name: <CSRCheckin2 id={10} handleNext={handleNext} />,
		},
		{
			id: 10,
			type: "Final Revisions",
			name: <FinalRevisions id={11} handleNext={handleNext} />,
		},
		{
			id: 11,
			type: "Internal Demo",
			name: <InternalDemo id={12} handleNext={handleNext} />,
		},
		{
			id: 12,
			type: "Access Approved",
			name: <AccessApprove id={13} handleNext={handleNext} />,
		},
		{
			id: 13,
			type: "Access Sent",
			name: <AccessSent id={14} handleNext={handleNext} />,
		},
		{
			id: 14,
			type: "Go Live Approved",
			name: <GoLiveApprove id={15} handleNext={handleNext} />,
		},
		{
			id: 15,
			type: "Go Live Initiated",
			name: <GoLiveInitiate id={16} handleNext={handleNext} />,
		},
		{
			id: 16,
			type: "Go Live Completed",
			name: <GoLiveComplete id={17} handleNext={handleNext} />,
		},
	];
	const [tabs, setTabs] = useState(SETUP_LIST);
	const tabContent = SETUP_LIST[0]?.type;
	const [viewMode, setViewMode] = useState(tabContent);

	const currentTab = tabs.find(({ type }) => type === viewMode)?.id;

	const showComponent = (viewMode) => tabs.find(({ type }) => type === viewMode)?.name;

	return (
		<>
			<HStack spacing="1em" justifyContent={"space-between"} w="100%" py={"1EM"}>
				{tabs?.map((_) => (
					<RadioButtonGroup
						borderRadius="17px"
						p="1.2em"
						fontSize="0.9em"
						w="250px"
						h="4em"
						whiteSpace="wrap"
						key={_?.id}
						name={_?.type}
						selectedFilter={viewMode}
						handleFilterClick={(name) => setViewMode(name)}
					/>
				))}
			</HStack>
			{showComponent(viewMode)}
		</>
	);
};

export default SalesOnboardUser;
