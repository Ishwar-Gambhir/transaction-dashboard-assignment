import React, { useState, useEffect } from "react";
import axios from "axios";

const Statistics = ({ selectedMonth }) => {
    const [stats, setStats] = useState({ totalSale: 0, soldItems: 0, notSoldItems: 0 });

    useEffect(() => {
        const fetchStatistics = async () => {
            const { data } = await axios.get("http://localhost:5000/api/statistics", {
                params: { month: selectedMonth },
            });
            setStats(data);
        };
        fetchStatistics();
    }, [selectedMonth]);

    return (
        <div>
            <h3>Statistics</h3>
            <p>Total Sales: ${stats.totalSale}</p>
            <p>Sold Items: {stats.soldItems}</p>
            <p>Not Sold Items: {stats.notSoldItems}</p>
        </div>
    );
};

export default Statistics;
