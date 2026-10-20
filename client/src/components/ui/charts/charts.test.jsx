import { render } from "@testing-library/react";
import { Bar, ChartJS, Doughnut, Line } from "components/ui/charts";

// jsdom has no canvas; stub the 2D context so chart.js can construct.
beforeAll(() => {
	HTMLCanvasElement.prototype.getContext = () => ({
		canvas: { width: 300, height: 150 },
		save() {}, restore() {}, scale() {}, clearRect() {}, fillRect() {}, beginPath() {},
		moveTo() {}, lineTo() {}, arc() {}, closePath() {}, fill() {}, stroke() {}, rect() {},
		clip() {}, translate() {}, rotate() {}, setLineDash() {}, fillText() {}, strokeText() {},
		measureText: () => ({ width: 10 }), createLinearGradient: () => ({ addColorStop() {} }),
		getImageData: () => ({ data: [] }), putImageData() {}, setTransform() {}, resetTransform() {},
	});
});

const bar = { labels: ["a", "b"], datasets: [{ label: "x", data: [1, 2] }] };
const doughnut = { labels: ["a", "b"], datasets: [{ data: [1, 2] }] };

describe("chart registration (react-chartjs-2 v5 / chart.js v4)", () => {
	// NOTE: jsdom has no real canvas, so chart.js never attaches and never resolves
	// scales during render — a missing registration cannot surface in C-CHART-02.
	// This registry check is therefore the guard that matters.
	test("C-CHART-01 the parts every dashboard needs are registered", () => {
		for (const id of ["bar", "line", "doughnut"]) expect(ChartJS.registry.getController(id)).toBeTruthy();
		for (const id of ["category", "linear"]) expect(ChartJS.registry.getScale(id)).toBeTruthy();
		for (const id of ["bar", "line", "point", "arc"]) expect(ChartJS.registry.getElement(id)).toBeTruthy();
		for (const id of ["legend", "tooltip", "title", "filler"]) expect(ChartJS.registry.getPlugin(id)).toBeTruthy();
	});

	test("C-CHART-02 Bar, Line and Doughnut mount (smoke)", () => {
		const errors = [];
		const spy = jest.spyOn(console, "error").mockImplementation((...a) => errors.push(a.join(" ")));
		expect(() => {
			render(<Bar data={bar} options={{ scales: { y: { beginAtZero: true } } }} />);
			render(<Line data={bar} />);
			render(<Doughnut data={doughnut} options={{ cutout: "50%" }} />);
		}).not.toThrow();
		spy.mockRestore();
		expect(errors.filter((e) => /not a registered/i.test(e))).toEqual([]);
	});
});
