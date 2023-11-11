import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ title, labels, text, datalist }) {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
            },
            title: {
                display: true,
                text: text,
            },
            labels: { display: true },
        },
    };
    const data = {
        labels: labels,
        datasets: [
            {
                label: title,
                data: datalist,
                backgroundColor: ["#76B947", "#B1D8B7", "#2F5233", "#94C973"],
                borderColor: ["#76B947", "#B1D8B7", "#2F5233", "#94C973"],
                borderWidth: 1,
            },
        ],
    };
    return <Doughnut options={options} data={data} />;
}
