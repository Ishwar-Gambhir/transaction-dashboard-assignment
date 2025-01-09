import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components for Bar chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ selectedMonth }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchBarChartData = async () => {
            const { data } = await axios.get("http://localhost:5000/api/bar-chart", {
                params: { month: selectedMonth },
            });
            setChartData(data);
        };
        fetchBarChartData();
    }, [selectedMonth]);

    const data = {
        labels: chartData.map((d) => d.range),
        datasets: [
            {
                label: "Items Count",
                data: chartData.map((d) => d.count),
                backgroundColor: "rgba(75,192,192,0.6)",
            },
        ],
    };

    return <Bar data={data} />;
};

export default BarChart;
