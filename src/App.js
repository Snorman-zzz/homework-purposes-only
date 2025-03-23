// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { TeamProvider } from "./TeamContext";

// Pages
import HomePage from "./pages/HomePage";
import EquityCalculatorPage from "./pages/EquityCalculatorPage";
import ReportPage from "./pages/ReportPage";
import BillingPage from "./pages/BillingPage";
import UpgradePage from "./pages/UpgradePage";

function App() {
    return (
        <TeamProvider>
            <Router>
                <Routes>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/calculator" element={<EquityCalculatorPage />} />
                    <Route path="/report" element={<ReportPage />} />
                    <Route path="/billing" element={<BillingPage />} />
                    <Route path="/upgrade" element={<UpgradePage />} />
                    <Route path="/" element={<Navigate to="/calculator" />} />
                </Routes>
            </Router>
        </TeamProvider>
    );
}

export default App;
