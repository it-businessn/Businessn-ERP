import { Bar } from "react-chartjs-2";

const HorizontalBarChart = ({ data, label, target }) => {
	const chartData = {
		labels: [label],
		datasets: [
			{
				label,
				backgroundColor: "#547fe9",
				borderColor: "#547fe9",
				borderWidth: 1,
				data: [data],
			},
		],
	};

	const chartOptions = {
		indexAxis: "y",
		scales: {
			x: {
				beginAtZero: true,
				max: target * 2,
			},
		},
		plugins: {
			legend: {
				display: false,
			},
		},
	};

	return <Bar data={chartData} options={chartOptions} />;
};

export default HorizontalBarChart;
