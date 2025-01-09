import React, { useEffect, useState } from "react";
import { Chart, ArcElement, CategoryScale, Tooltip, Legend } from 'chart.js';
import { Pie } from "react-chartjs-2";
import axios from "axios";

Chart.register(ArcElement, CategoryScale, Tooltip, Legend);
const PieChart = ({ selectedMonth }) => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const fetchPieChartData = async () => {
            const { data } = await axios.get("http://localhost:5000/api/pie-chart", {
                params: { month: selectedMonth },
            });
            setChartData(data);
        };
        fetchPieChartData();
    }, [selectedMonth]);

    const data = {
        labels: Object.keys(chartData),
        datasets: [
            {
                label: "Categories",
                data: Object.values(chartData),
                backgroundColor: [
                    "rgba(255,99,132,0.6)",
                    "rgba(54,162,235,0.6)",
                    "rgba(255,206,86,0.6)",
                    "rgba(75,192,192,0.6)",
                ],
            },
        ],
    };

    return <Pie data={data} />;
};

export default PieChart;
