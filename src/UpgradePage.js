// UpgradePage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeamContext } from "./TeamContext";
import MinimalTopBar from "./MinimalTopBar";

function UpgradePage() {
    const navigate = useNavigate();
    const { plan, setPlan } = useTeamContext();

    // "monthly" or "yearly"
    const [billingCycle, setBillingCycle] = useState("monthly");

    // Helper: compute cost text
    function buildCost() {
        return billingCycle === "monthly" ? "$0/mo" : "$0/yr";
    }
    function launchCost() {
        return billingCycle === "monthly" ? "$10/mo" : "$100/yr";
    }
    function scaleCost() {
        return billingCycle === "monthly" ? "$20/mo" : "$200/yr";
    }

    // On upgrade, change plan and go to Workspaces page
    function handleUpgrade(newPlan) {
        setPlan(newPlan);
        alert(`Upgraded to ${newPlan} plan!`);
        navigate("/workspaces");
    }

    // Simple style for whichever cycle is active
    const selectedBtnStyle = {
        backgroundColor: "#F26E21",
        color: "#fff",
        marginRight: "8px",
        borderRadius: 6,
        padding: "8px 16px",
        border: "none",
        cursor: "pointer",
    };

    const unselectedBtnStyle = {
        backgroundColor: "#2D2F31",
        color: "#fff",
        marginRight: "8px",
        borderRadius: 6,
        padding: "8px 16px",
        border: "none",
        cursor: "pointer",
    };

    // Renders a plan card
    function renderPlanCard(planName, costStr, featureList) {
        const isCurrent = plan === planName;
        return (
            <div
                style={{
                    flex: 1,
                    backgroundColor: "#2D2F31",
                    padding: "16px",
                    borderRadius: "6px",
                    color: isCurrent ? "#0A99A8" : "#fff",
                }}
            >
                <h3>{planName}</h3>
                <p style={{ fontWeight: "bold", marginBottom: "8px" }}>{costStr}</p>
                <ul style={{ marginLeft: "1.2rem", marginBottom: "1rem" }}>
                    {featureList.map((f, idx) => (
                        <li key={idx}>{f}</li>
                    ))}
                </ul>
                <button onClick={() => handleUpgrade(planName)} disabled={isCurrent}>
                    {isCurrent ? "Current Plan" : "Upgrade"}
                </button>
            </div>
        );
    }

    return (
        <div className="wrapper">
            <MinimalTopBar />
            <h1>Upgrade Your Plan</h1>

            {/* Billing Cycle Toggle */}
            <div className="section" style={{ display: "flex", gap: "16px" }}>
                <button
                    style={billingCycle === "monthly" ? selectedBtnStyle : unselectedBtnStyle}
                    onClick={() => setBillingCycle("monthly")}
                >
                    Monthly
                </button>
                <button
                    style={billingCycle === "yearly" ? selectedBtnStyle : unselectedBtnStyle}
                    onClick={() => setBillingCycle("yearly")}
                >
                    Yearly (Save More)
                </button>
            </div>

            {/* Plan Cards */}
            <div className="section" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {/* Build */}
                {renderPlanCard("Build", buildCost(), [
                    "1 Workspace",
                    "Limited Usage of Customization Options",
                ])}

                {/* Launch */}
                {renderPlanCard("Launch", launchCost(), [
                    "Everything in Build plus:",
                    "Unlimited Usage of Customization Options",
                ])}

                {/* Scale */}
                {renderPlanCard("Scale", scaleCost(), [
                    "Everything in Launch plus:",
                    "5 Workspaces",
                ])}

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
                    <p style={{ fontWeight: "bold", marginBottom: "8px" }}>Contact Us</p>
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

            {/* Comparison Table */}
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
                        <td>Monthly / Yearly Cost</td>
                        <td>{buildCost()}</td>
                        <td>{launchCost()}</td>
                        <td>{scaleCost()}</td>
                        <td>Contact Us</td>
                    </tr>
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
