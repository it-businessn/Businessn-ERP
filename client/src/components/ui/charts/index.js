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
import { Bar, Doughnut, Line } from "react-chartjs-2";

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

export { Bar, Doughnut, Line, ChartJS };
