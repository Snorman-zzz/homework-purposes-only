// UpgradePage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeamContext } from "./TeamContext";
import TopBar from "./TopBar";

function UpgradePage() {
    const navigate = useNavigate();
    const { plan, setPlan } = useTeamContext();
    const [billingCycle, setBillingCycle] = useState("monthly");

    function handleUpgrade(newPlan) {
        setPlan(newPlan);
        alert(`Upgraded to ${newPlan} plan!`);
        navigate("/billing");
    }

    function buildCost() {
        return billingCycle === "monthly" ? "$0/mo" : "$0/yr";
    }
    function launchCost() {
        return billingCycle === "monthly" ? "$85/mo" : "$1020/yr";
    }
    function scaleCost() {
        return billingCycle === "monthly" ? "$199/mo" : "$2388/yr";
    }

    return (
        <div className="wrapper">
            <TopBar />

            <h1>Upgrade Your Plan</h1>

            <div className="section">
                <button onClick={() => setBillingCycle("yearly")} style={{ marginRight: "8px" }}>
                    Yearly (Save More)
                </button>
                <button onClick={() => setBillingCycle("monthly")}>Monthly</button>
            </div>

            <div className="section" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {/* Build */}
                <div
                    style={{
                        flex: 1,
                        backgroundColor: "#2D2F31",
                        padding: "16px",
                        borderRadius: "6px",
                        color: plan === "Build" ? "#0A99A8" : "#fff",
                    }}
                >
                    <h3>Build (Free)</h3>
                    <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
                        {buildCost()}
                    </p>
                    <ul style={{ marginLeft: "1.2rem", marginBottom: "1rem" }}>
                        <li>1 Workspace</li>
                        <li>Limited Usage of Customization Options</li>
                    </ul>
                    <button onClick={() => handleUpgrade("Build")} disabled={plan === "Build"}>
                        {plan === "Build" ? "Current Plan" : "Upgrade"}
                    </button>
                </div>

                {/* Launch */}
                <div
                    style={{
                        flex: 1,
                        backgroundColor: "#2D2F31",
                        padding: "16px",
                        borderRadius: "6px",
                        color: plan === "Launch" ? "#0A99A8" : "#fff",
                    }}
                >
                    <h3>Launch</h3>
                    <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
                        {launchCost()}
                    </p>
                    <ul style={{ marginLeft: "1.2rem", marginBottom: "1rem" }}>
                        <li>Everything in Build plus:</li>
                        <li>Unlimited Usage of Customization Options</li>
                    </ul>
                    <button onClick={() => handleUpgrade("Launch")} disabled={plan === "Launch"}>
                        {plan === "Launch" ? "Current Plan" : "Upgrade"}
                    </button>
                </div>

                {/* Scale */}
                <div
                    style={{
                        flex: 1,
                        backgroundColor: "#2D2F31",
                        padding: "16px",
                        borderRadius: "6px",
                        color: plan === "Scale" ? "#0A99A8" : "#fff",
                    }}
                >
                    <h3>Scale</h3>
                    <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
                        {scaleCost()}
                    </p>
                    <ul style={{ marginLeft: "1.2rem", marginBottom: "1rem" }}>
                        <li>Everything in Launch plus:</li>
                        <li>5 Workspaces</li>
                    </ul>
                    <button onClick={() => handleUpgrade("Scale")} disabled={plan === "Scale"}>
                        {plan === "Scale" ? "Current Plan" : "Upgrade"}
                    </button>
                </div>

                {/* Enterprise */}
                <div
                    style={{
                        flex: 1,
                        backgroundColor: "#2D2F31",
                        padding: "16px",
                        borderRadius: "6px",
                        color: plan === "Enterprise" ? "#0A99A8" : "#fff",
                    }}
                >
                    <h3>Enterprise</h3>
                    <p style={{ fontWeight: "bold", marginBottom: "8px" }}>Contact us</p>
                    <ul style={{ marginLeft: "1.2rem", marginBottom: "1rem" }}>
                        <li>Unlimited Workspaces</li>
                        <li>Unlimited Usage of Customization Options</li>
                    </ul>
                    <button
                        onClick={() => handleUpgrade("Enterprise")}
                        disabled={plan === "Enterprise"}
                    >
                        {plan === "Enterprise" ? "Current Plan" : "Upgrade"}
                    </button>
                </div>
            </div>

            <div className="section">
                <h2>Compare Plans</h2>
                <table>
                    <thead>
                    <tr>
                        <th></th>
                        <th>Build</th>
                        <th>Launch</th>
                        <th>Scale</th>
                        <th>Enterprise</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Workspaces</td>
                        <td>1</td>
                        <td>1</td>
                        <td>5</td>
                        <td>Unlimited</td>
                    </tr>
                    <tr>
                        <td>Customization</td>
                        <td>Limited</td>
                        <td>Unlimited</td>
                        <td>Unlimited</td>
                        <td>Unlimited</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UpgradePage;