import { useCallback, useMemo, useState } from "react";

/**
 * TABLE-SORT: client-side sorting for any list shown in a table.
 *
 *   const { sortedItems, sortConfig, requestSort } = useSortableData(rows);
 *   <TableLayout cols={cols} sortKeys={{ Name: "fullName", "Pay Date": "payDate" }}
 *     sortConfig={sortConfig} onSort={requestSort}> ... sortedItems.map(...)
 *
 * A sort key is a field name, a dotted path ("empId.fullName") or a function
 * (row) => value. Clicking a column sorts ascending, then descending, then back
 * to the original order. Empty values always go last. Numbers, amounts
 * ("$1,234.50", "12%"), dates and text ("Item 2" before "Item 10") each compare
 * the natural way. The rows themselves are never changed.
 */

export const SORT_DIRECTION = { ASC: "asc", DESC: "desc" };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}([T ][\d:.]+(Z|[+-]\d{2}:?\d{2})?)?$/;
const AMOUNT = /^\(?-?\s*[$€£]?\s*-?[\d,]*\.?\d+\s*%?\)?$/;

export const getSortValue = (row, key) => {
	if (typeof key === "function") return key(row);
	if (typeof key !== "string" || !key) return undefined;
	return key.split(".").reduce((value, part) => (value == null ? undefined : value[part]), row);
};

const isEmpty = (v) => v === null || v === undefined || (typeof v === "string" && v.trim() === "");

/** Turns a cell value into something comparable: { type, value }. */
export const normalize = (v) => {
	if (v instanceof Date) return { type: "number", value: v.getTime() };
	if (typeof v === "number") return { type: "number", value: v };
	if (typeof v === "boolean") return { type: "number", value: v ? 1 : 0 };
	const text = String(v).trim();
	if (AMOUNT.test(text) && /\d/.test(text)) {
		const negative = text.includes("-") || (text.startsWith("(") && text.endsWith(")"));
		const n = Number(text.replace(/[^\d.]/g, ""));
		if (Number.isFinite(n)) return { type: "number", value: negative ? -n : n };
	}
	if (ISO_DATE.test(text)) {
		const t = Date.parse(text);
		if (!Number.isNaN(t)) return { type: "number", value: t };
	}
	return { type: "text", value: text };
};

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

/** Ascending comparison of two raw values; empty values are handled by the caller. */
export const compareValues = (a, b) => {
	const x = normalize(a);
	const y = normalize(b);
	if (x.type === "number" && y.type === "number") return x.value - y.value;
	return collator.compare(String(x.value), String(y.value));
};

export const sortRows = (items, { key, direction } = {}) => {
	if (!Array.isArray(items)) return items;
	if (!key || !direction) return items;
	const sign = direction === SORT_DIRECTION.DESC ? -1 : 1;
	return items
		.map((row, index) => ({ row, index, value: getSortValue(row, key) }))
		.sort((a, b) => {
			const emptyA = isEmpty(a.value);
			const emptyB = isEmpty(b.value);
			if (emptyA || emptyB) return emptyA === emptyB ? a.index - b.index : emptyA ? 1 : -1;
			return sign * compareValues(a.value, b.value) || a.index - b.index;
		})
		.map(({ row }) => row);
};

const useSortableData = (items, initialConfig = { key: null, direction: null }) => {
	const [sortConfig, setSortConfig] = useState(initialConfig);

	const sortedItems = useMemo(() => sortRows(items, sortConfig), [items, sortConfig]);

	// asc -> desc -> original order
	const requestSort = useCallback((key) => {
		setSortConfig((prev) => {
			const same = prev.key === key || (typeof key === "function" && prev.key === key);
			if (!same) return { key, direction: SORT_DIRECTION.ASC };
			if (prev.direction === SORT_DIRECTION.ASC) return { key, direction: SORT_DIRECTION.DESC };
			return { key: null, direction: null };
		});
	}, []);

	return { sortedItems, sortConfig, requestSort };
};

export default useSortableData;
