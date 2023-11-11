import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ labels, title, textTitle, dataValue }) {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
            },
            title: {
                display: true,
                text: title,
            },
            dataLabels: { display: true, color: "#36A2EB" },
        },
    };
    const data = {
        labels: labels,
        datasets: [
            {
                label: textTitle,
                data: dataValue,
                backgroundColor: [
                    "#78AD48",
                    "#848C9C",
                    "#172C44",
                    "#C5DD9C",
                    "#3D550C",
                ],
                borderColor: ["#EBEBE8", "#EBEBE8"],
                borderWidth: 1,
            },
        ],
    };
    return <Pie data={data} options={options} />;
}
