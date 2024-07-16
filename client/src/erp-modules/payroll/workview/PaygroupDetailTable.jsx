import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import { useState } from "react";
import { styleConsole } from "utils";
import { TABS } from "./data";

const PaygroupDetailTable = () => {
	const [viewMode, setViewMode] = useState(TABS[0].type);

	const showComponent = (viewMode) => {
		styleConsole(viewMode);
		return TABS.find(({ type }) => type === viewMode)?.name;
	};

	return (
		<>
			<TabsButtonGroup
				tabs={TABS}
				setViewMode={setViewMode}
				viewMode={viewMode}
			/>
			{showComponent(viewMode)}
		</>
	);
};

export default PaygroupDetailTable;
