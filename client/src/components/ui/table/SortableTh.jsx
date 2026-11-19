import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { HStack, Th } from "@chakra-ui/react";
import { SORT_DIRECTION } from "hooks/useSortableData";

/**
 * TABLE-SORT: a header cell that sorts its column. Without `sortKey` (or
 * without `onSort`) it is a plain <Th>. Click or press Enter / Space to sort;
 * the arrow shows the current direction and aria-sort tells screen readers.
 */
const SortableTh = ({ sortKey, sortConfig, onSort, children, ...props }) => {
	if (!sortKey || !onSort) return <Th {...props}>{children}</Th>;

	const active = sortConfig?.key === sortKey && Boolean(sortConfig?.direction);
	const direction = active ? sortConfig.direction : null;
	const ariaSort = !active ? "none" : direction === SORT_DIRECTION.ASC ? "ascending" : "descending";
	const handle = () => onSort(sortKey);

	return (
		<Th
			{...props}
			aria-sort={ariaSort}
			tabIndex={0}
			cursor="pointer"
			userSelect="none"
			onClick={handle}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					handle();
				}
			}}
			_hover={{ color: "var(--accent_text)" }}
			_focusVisible={{ outline: "2px solid var(--accent_text)", outlineOffset: "-2px" }}
			title={active ? "Click to change the sort order" : "Click to sort"}
		>
			<HStack spacing={1} display="inline-flex" alignItems="center">
				<span>{children}</span>
				{direction === SORT_DIRECTION.ASC ? (
					<TriangleUpIcon boxSize={2.5} aria-hidden />
				) : direction === SORT_DIRECTION.DESC ? (
					<TriangleDownIcon boxSize={2.5} aria-hidden />
				) : (
					<TriangleDownIcon boxSize={2.5} opacity={0.25} aria-hidden />
				)}
			</HStack>
		</Th>
	);
};

export default SortableTh;
