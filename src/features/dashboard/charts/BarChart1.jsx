import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import { LABELS } from "config/constant";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart1({
  title,
  titleText,
  legend,
  indexAxis = "x",
}) {
  const options = {
    indexAxis: indexAxis,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: title,
      },
      datalabels: { display: true, color: "#36A2EB" },
    },
  };
  const data = {
    labels: LABELS,
    datasets: [
      {
        label: legend,
        data: [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
        // data: labels.map((x) => data1.find((y) => y.month === x).count),
        backgroundColor: ["#78AD48"],
      },
    ],
  };
  return <Bar options={options} data={data} />;
}
