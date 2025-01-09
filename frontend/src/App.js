import React, { useState } from "react";
import './App.css';
import Dropdown from "./components/Dropdown";
import Transactions from "./components/Transactions";
import Statistics from "./components/Statistics";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState("03");

  return (
      <div>
          <h1>Transaction Dashboard</h1>
           {/* Main Section: Dropdown + Statistics and Transactions Table */}
           <div className="main-section">
                <div className="sidebar">
                    <div className="dropdown-section">
                        <h3>Select Month</h3>
                        <Dropdown
                            selectedMonth={selectedMonth}
                            setSelectedMonth={setSelectedMonth}
                        />
                    </div>
                    <div className="statistics">
                        <Statistics selectedMonth={selectedMonth} />
                    </div>
                </div>
                <div className="transactions-table">
                    <Transactions selectedMonth={selectedMonth} />
                </div>
            </div>

          {/* Charts Section */}
          <div className="chart-section">
              <div className="chart-container">
                  <h3>Price Range (Bar Chart)</h3>
                  <BarChart selectedMonth={selectedMonth} />
              </div>
              <div className="chart-container">
                  <h3>Category Distribution (Pie Chart)</h3>
                  <PieChart selectedMonth={selectedMonth} />
              </div>
          </div>
      </div>
  );
};

export default App;
