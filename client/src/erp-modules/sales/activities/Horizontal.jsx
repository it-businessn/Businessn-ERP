import { Bar } from "react-chartjs-2";

const HorizontalBarChart = ({ data }) => {
	const chartData = {
		labels: ["Emails"],
		datasets: [
			{
				label: "Emails Sent",
				backgroundColor: "#547fe9",
				borderColor: "#547fe9",
				borderWidth: 1,
				hoverBackgroundColor: "#547fe9",
				hoverBorderColor: "#547fe9",
				data: [data],
			},
		],
	};

	const chartOptions = {
		indexAxis: "y",
		scales: {
			x: {
				beginAtZero: true,
				max: 4000,
			},
		},
	};

	return <Bar data={chartData} options={chartOptions} />;
};

export default HorizontalBarChart;
