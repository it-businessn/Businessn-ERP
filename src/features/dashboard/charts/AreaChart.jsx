import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top",
        },
        title: {
            display: true,
            text: "Overtime Ratio",
        },
    },
};
const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
    labels,
    datasets: [
        {
            fill: true,
            label: "Overtime",
            data: [10.5, 11, 12, 12, 12, 12, 12],
            borderColor: "#C5DD9C",
            backgroundColor: "#C5DD9C",
        },
    ],
};

export default function AreaChart() {
    return <Line height={300} options={options} data={data} />;
}
