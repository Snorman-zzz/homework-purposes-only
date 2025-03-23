// src/pages/BillingPage.js
import React from "react";
import { useTeamContext } from "../TeamContext";
import TopBar from '../ui/TopBar';
import { useNavigate } from "react-router-dom";

function BillingPage() {
    const { plan } = useTeamContext();
    const navigate = useNavigate();

    const planInfo = {
        Build: { features: ["1 Workspace", "Up to 3 Custom Categories"], cost: "Free" },
        Launch: { features: ["1 Workspace", "Unlimited Categories"], cost: "$85/mo" },
        Scale: { features: ["5 Workspaces", "Unlimited Categories"], cost: "$199/mo" },
        Enterprise: { features: ["Unlimited Workspaces", "Enterprise Support"], cost: "Custom" }
    };

    return (
        <div className="wrapper">
            <TopBar />
            <h1>Your Current Plan: {plan}</h1>
            <div className="section">
                <h2>Plan Features</h2>
                <ul>
                    {planInfo[plan].features.map((f, i) => (
                        <li key={i}>{f}</li>
                    ))}
                </ul>
                <button onClick={() => navigate("/upgrade")}>
                    {plan === "Build" ? "Upgrade Plan" : "Change Plan"}
                </button>
            </div>
        </div>
    );
}

export default BillingPage;
