import React, { useState, useEffect } from "react";
import axios from "axios";

const Transactions = ({ selectedMonth }) => {
    const [transactions, setTransactions] = useState([]); // Holds the list of transactions
    const [search, setSearch] = useState(""); // Search input state
    const [page, setPage] = useState(1); // Current page state
    const [total, setTotal] = useState(0); // Total number of records

    // Fetch transactions whenever search, page, or month changes
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const { data } = await axios.get("http://localhost:5000/api/transactions", {
                    params: { 
                        page, 
                        perPage: 10, 
                        search, 
                        month: selectedMonth 
                    },
                });
                setTransactions(data.transactions);
                setTotal(data.total); // Update total count for pagination
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, [search, page, selectedMonth]);

    // Handle Previous button click
    const handlePrevious = () => {
        if (page > 1) setPage(page - 1);
    };

    // Handle Next button click
    const handleNext = () => {
        if (page * 10 < total) setPage(page + 1);
    };

    return (
        <div>
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by title, description, or price"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1); // Reset to the first page when searching
                }}
            />

            {/* Transactions Table */}
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Date of Sale</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? (
                        transactions.map((tx) => (
                            <tr key={tx._id}>
                                <td>{tx.title}</td>
                                <td>{tx.description}</td>
                                <td>${tx.price.toFixed(2)}</td>
                                <td>{new Date(tx.dateOfSale).toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No transactions found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                <button onClick={handlePrevious} disabled={page === 1}>
                    Previous
                </button>
                <span style={{ margin: "0 10px" }}>Page {page}</span>
                <button onClick={handleNext} disabled={page * 10 >= total}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Transactions;
