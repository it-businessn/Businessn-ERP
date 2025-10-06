import PrimaryButton from "components/ui/button/PrimaryButton";

export const WorkviewTabs = () => {
	return (
		<>
			<PrimaryButton size={"sm"} name="Weekly View" />
			{/* <Tabs
				variant="enclosed"
				onChange={(i) => setView(i === 0 ? "weekly" : "daily")}
				isLazy
				lazyBehavior="unmount"
			>
				<TabList>
					<Tab>
						<PrimaryButton size={"sm"} name="Weekly View" />
					</Tab>
					<Tab>
						<PrimaryButton
							name="
									Daily View"
						/>
					</Tab>
				</TabList>
			</Tabs> */}
		</>
	);
};
