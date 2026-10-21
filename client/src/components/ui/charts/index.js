/**
 * Single entry point for Chart.js charts (react-chartjs-2 v5 / chart.js v4).
 *
 * react-chartjs-2 v3 imported "chart.js/auto", which registered every controller,
 * scale, element and plugin globally. From v4 onwards the library is tree-shakable
 * and registration is explicit; a chart rendered without its parts throws
 * `"category" is not a registered scale` at runtime.
 *
 * Only the parts used by the dashboards are registered here. Import the chart
 * components from this module, never from "react-chartjs-2" directly, so the
 * registration always runs first.
 */
import {
	ArcElement,
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Filler,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from "chart.js";
import { createElement, forwardRef } from "react";
import { Bar as RawBar, Doughnut as RawDoughnut, Line as RawLine } from "react-chartjs-2";

ChartJS.register(
	CategoryScale, // x axis of Bar / Line
	LinearScale, // y axis of Bar / Line
	BarElement,
	LineElement,
	PointElement,
	ArcElement, // Doughnut
	Filler, // datasets declare `fill`
	Title,
	Tooltip,
	Legend,
);

/**
 * Pages keep chart data in state that starts as null and is filled by an API
 * call (e.g. the scheduling dashboard), or stays null when the call fails.
 * react-chartjs-2 v5 throws "Cannot read properties of null (reading 'labels')"
 * for that, taking the whole page down. Render an empty chart instead.
 */
const EMPTY_DATASETS = [];
const safeChartData = (data) =>
	data && Array.isArray(data.datasets)
		? data
		: { labels: Array.isArray(data?.labels) ? data.labels : [], datasets: EMPTY_DATASETS };

const withSafeData = (Chart, name) => {
	const SafeChart = forwardRef((props, ref) =>
		createElement(Chart, { ...props, ref, data: safeChartData(props.data) }),
	);
	SafeChart.displayName = name;
	return SafeChart;
};

const Bar = withSafeData(RawBar, "Bar");
const Line = withSafeData(RawLine, "Line");
const Doughnut = withSafeData(RawDoughnut, "Doughnut");

export { Bar, Doughnut, Line, ChartJS, safeChartData };
