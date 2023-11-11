import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function HalfDoughnutChart({ text, label, datalist }) {
    const options = {
        responsive: true,
        rotation: -90,
        circumference: 180,
        plugins: {
            legend: {
                position: "bottom",
            },
            title: {
                display: true,
                text: text,
            },
        },
    };
    const data = {
        labels: ["0%", "25%", "50%", "75%", "100%"],
        datasets: [
            {
                label: label,
                data: datalist,
                backgroundColor: ["#3D550C", "#81B622", "#ECF87F", "#59981A"],
                borderColor: ["#3D550C", "#81B622", "#ECF87F", "#59981A"],
                borderWidth: 1,
            },
        ],
    };
    return <Doughnut options={options} data={data} />;
}
