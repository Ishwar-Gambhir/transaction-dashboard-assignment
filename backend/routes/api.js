const express = require("express");
const axios = require("axios");
const Transaction = require("../models/transaction");

const router = express.Router();

// Initialize Database
router.get("/init", async (req, res) => {
    try {
        // Fetch data from the external URL
        const { data } = await axios.get(
            "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
        );

        // Log the fetched data to check its structure
        console.log("Fetched data:", data);

        // Ensure the data is an array
        if (Array.isArray(data)) {
            // Clean and prepare data for insertion (if necessary)
            const cleanedData = data.map(item => ({
                title: item.title || "",
                description: item.description || "",
                price: Number(item.price) || 0,
                dateOfSale: item.dateOfSale || "",
                category: item.category || "",
                sold: item.sold || false,
            }));

            // Delete any existing records in the database
            await Transaction.deleteMany({});

            // Insert the fetched data into the MongoDB collection
            const result = await Transaction.insertMany(cleanedData);
            console.log(`${result.length} records inserted into the database`);

            // Send success response
            res.status(200).send("Database initialized with new data.");
        } else {
            // If the data is not an array, send an error response
            res.status(400).send("Invalid data format. Expected an array.");
        }
    } catch (error) {
        // Log the error details
        console.error("Error during data fetch or database insertion:", error);
        
        // Send error response
        res.status(500).send("Error initializing database.");
    }
});


// List Transactions with Search and Pagination
router.get("/transactions", async (req, res) => {
    const { page = 1, perPage = 10, search = "", month } = req.query;
    const filter = {
        dateOfSale: { $regex: `-${month}-` },
    };

    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { price: Number(search) || { $exists: true } },
        ];
    }

    try {
        const transactions = await Transaction.find(filter)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));
        const total = await Transaction.countDocuments(filter);

        res.json({ transactions, total });
    } catch (error) {
        res.status(500).send("Error fetching transactions");
    }
});

// Get Statistics
router.get("/statistics", async (req, res) => {
    const { month } = req.query;

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $regex: `-${month}-` },
        });

        const totalSale = transactions.reduce((sum, t) => sum + t.price, 0);
        const soldItems = transactions.filter((t) => t.sold).length;
        const notSoldItems = transactions.filter((t) => !t.sold).length;

        res.json({ totalSale, soldItems, notSoldItems });
    } catch (error) {
        res.status(500).send("Error fetching statistics");
    }
});

// Bar Chart Data
router.get("/bar-chart", async (req, res) => {
    const { month } = req.query;

    const priceRanges = [
        [0, 100],
        [101, 200],
        [201, 300],
        [301, 400],
        [401, 500],
        [501, 600],
        [601, 700],
        [701, 800],
        [801, 900],
        [901, Infinity],
    ];

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $regex: `-${month}-` },
        });

        const barData = priceRanges.map(([min, max]) => ({
            range: `${min}-${max}`,
            count: transactions.filter((t) => t.price >= min && t.price <= max).length,
        }));

        res.json(barData);
    } catch (error) {
        res.status(500).send("Error fetching bar chart data");
    }
});

// Pie Chart Data
router.get("/pie-chart", async (req, res) => {
    const { month } = req.query;

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $regex: `-${month}-` },
        });

        const categories = transactions.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + 1;
            return acc;
        }, {});

        res.json(categories);
    } catch (error) {
        res.status(500).send("Error fetching pie chart data");
    }
});

// Combined Data
router.get("/combined", async (req, res) => {
    const { month } = req.query;

    try {
        const statistics = await axios.get(`http://localhost:5000/api/statistics`, {
            params: { month },
        });

        const barChart = await axios.get(`http://localhost:5000/api/bar-chart`, {
            params: { month },
        });

        const pieChart = await axios.get(`http://localhost:5000/api/pie-chart`, {
            params: { month },
        });

        res.json({
            statistics: statistics.data,
            barChart: barChart.data,
            pieChart: pieChart.data,
        });
    } catch (error) {
        res.status(500).send("Error fetching combined data");
    }
});

module.exports = router;
