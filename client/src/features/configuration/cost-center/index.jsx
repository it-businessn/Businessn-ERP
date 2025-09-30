import {
	AddIcon,
	ChevronDownIcon,
	ChevronRightIcon,
	DeleteIcon,
	SmallAddIcon,
} from "@chakra-ui/icons";
import {
	Badge,
	Box,
	Collapse,
	Flex,
	HStack,
	IconButton,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import ActionButton from "components/ui/button/ActionButton";
import BoxCard from "components/ui/card";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import TextTitle from "components/ui/text/TextTitle";
import useCostCenter from "hooks/useCostCenter";
import { useEffect, useState } from "react";
import SettingService from "services/SettingService";
import AddCCDepartment from "./AddCCDepartment";
import AddCostCenter from "./AddCostCenter";

const CostCenterPanel = ({ companyName }) => {
	const [ccAdded, setCcAdded] = useState(false);
	const [openAddCC, setOpenAddCC] = useState(false);
	const [openEditCC, setOpenEditCC] = useState(false);
	const [editingCC, setEditingCC] = useState(null);
	const [addDeptCCId, setAddDeptCCId] = useState(null);
	const [openAddDept, setOpenAddDept] = useState(false);
	const [expanded, setExpanded] = useState({});
	const [deleteRecordId, setDeleteRecordId] = useState(null);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

	const costCenters = useCostCenter(companyName, ccAdded);
	const [allCC, setAllCC] = useState(null);

	useEffect(() => {
		if (costCenters) setAllCC(costCenters);
	}, [costCenters]);

	function handleOpenEditCC(cc) {
		setEditingCC(cc);
		setOpenEditCC(true);
	}

	function handleOpenAddDept(cc, ccId) {
		setAddDeptCCId(ccId);
		setOpenAddDept(true);
		setEditingCC(cc);
	}

	const handleCloseCC = () => {
		setOpenAddCC(false);
		setOpenAddDept(false);
	};
	function toggleExpand(id) {
		setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
	}

	function addDepartment(id, name) {
		setAllCC((prev) =>
			prev.map((cc) =>
				cc._id === addDeptCCId
					? cc.departments.some((d) => d._id === id)
						? cc
						: {
								...cc,
								departments: [...cc.departments, { id, name }],
						  }
					: cc,
			),
		);
		setExpanded((prev) => ({ ...prev, [addDeptCCId]: true }));
	}

	const confirmDelete = async (ccId) => {
		setShowConfirmationPopUp(true);
		setDeleteRecordId(ccId);
	};

	const deleteCostCenter = async () => {
		setAllCC(allCC.filter((cc) => cc._id !== deleteRecordId));
		await SettingService.deleteCC({}, deleteRecordId);
		closeConfirmation();
	};

	const closeConfirmation = () => setShowConfirmationPopUp(false);

	const deleteDepartment = async (ccId, deptId) => {
		setAllCC((prev) =>
			prev.map((cc) => ({
				...cc,
				departments: cc.departments.filter((d) => d._id !== deptId),
			})),
		);
		await SettingService.removeCCDept({ deptId }, ccId);
	};

	return (
		<Stack spacing={4} mx={"auto"} w={"50%"}>
			<TextTitle title={companyName} />
			<Flex alignItems={"center"} justifyContent={"space-between"}>
				<Badge>{allCC?.length} cost center(s)</Badge>
				<ActionButton
					leftIcon={<SmallAddIcon />}
					size={"sm"}
					name="Add Cost Center"
					onClick={() => setOpenAddCC(true)}
				/>
			</Flex>
			<VStack align="stretch" spacing={2}>
				{!allCC?.length && <Text color="gray.500">No cost centers yet. Add one.</Text>}

				{allCC?.map((cc) => (
					<BoxCard key={cc._id}>
						<HStack justify="space-between">
							<HStack>
								<IconButton
									aria-label="toggle"
									color="var(--banner_bg)"
									size={"lg"}
									icon={expanded[cc._id] ? <ChevronDownIcon /> : <ChevronRightIcon />}
									onClick={() => toggleExpand(cc._id)}
								/>
								<TextTitle title={cc.name} />
							</HStack>

							<HStack>
								{/* <IconButton
									variant="ghost"
									color="var(--banner_bg)"
									aria-label="edit"
									size="sm"
									icon={<EditIcon />}
									onClick={() => handleOpenEditCC(cc)}
								/> */}
								<IconButton
									variant="ghost"
									color="var(--banner_bg)"
									aria-label="add-dept"
									size="sm"
									icon={<AddIcon />}
									onClick={() => handleOpenAddDept(cc, cc._id)}
								/>
								<IconButton
									aria-label="delete"
									size="sm"
									color="var(--banner_bg)"
									icon={<DeleteIcon />}
									onClick={() => confirmDelete(cc._id)}
								/>
							</HStack>
						</HStack>

						<Collapse in={!!expanded[cc._id]} animateOpacity>
							<Box mt={3} pl={8} bg={"white"}>
								{cc?.departments?.length === 0 && (
									<Text color="gray.500">No departments yet. Add one.</Text>
								)}
								<VStack align="stretch">
									{cc?.departments?.map((d) => (
										<HStack key={d._id} justify="space-between" p={2} borderRadius="md">
											<Text>- {d.name}</Text>
											<IconButton
												aria-label="del-dept"
												size="sm"
												color="var(--banner_bg)"
												icon={<DeleteIcon />}
												onClick={() => deleteDepartment(cc._id, d._id)}
											/>
										</HStack>
									))}
								</VStack>
							</Box>
						</Collapse>
					</BoxCard>
				))}
			</VStack>

			{openAddCC && (
				<AddCostCenter
					isOpen={openAddCC}
					onClose={handleCloseCC}
					companyName={companyName}
					setCcAdded={setCcAdded}
				/>
			)}
			{/* {openEditCC && (
				<EditCostCenter
					isOpen={openEditCC}
					onClose={handleCloseCC}
					companyName={companyName}
					setCcAdded={setOpenEditCC}
					cc={editingCC}
				/>
			)} */}
			{openAddDept && (
				<AddCCDepartment
					cc={editingCC}
					addDeptCCId={addDeptCCId}
					isOpen={openAddDept}
					onClose={handleCloseCC}
					companyName={companyName}
					setCcAdded={setCcAdded}
					addDepartment={addDepartment}
				/>
			)}
			{showConfirmationPopUp && (
				<DeletePopUp
					headerTitle="Please confirm"
					textTitle="Are you sure you want to delete the record?"
					isOpen={showConfirmationPopUp}
					onClose={closeConfirmation}
					onOpen={deleteCostCenter}
				/>
			)}
		</Stack>
	);
};

export default CostCenterPanel;
