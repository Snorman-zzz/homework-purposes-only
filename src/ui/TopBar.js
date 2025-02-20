import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

/**
 * Renders the top bar with “Home”, “Equity Calculator”, “Report”.
 * We highlight the current tab if provided with props.currentTab
 */
function TopBar({ currentTab }) {
    const navigate = useNavigate();

    return (
        <div className="top-bar">
            <button
                onClick={() => navigate("/home")}
                className={`topbar-btn ${currentTab === "home" ? "active" : ""}`}
            >
                Home
            </button>
            <button
                onClick={() => navigate("/calculator")}
                className={`topbar-btn ${currentTab === "calculator" ? "active" : ""}`}
            >
                Equity Calculator
            </button>
            <button
                onClick={() => navigate("/report")}
                className={`topbar-btn ${currentTab === "report" ? "active" : ""}`}
            >
                Report
            </button>
        </div>
    );
}

export default TopBar;
