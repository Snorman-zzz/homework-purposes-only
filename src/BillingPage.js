// BillingPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTeamContext } from "./TeamContext";
import MinimalTopBar from "./MinimalTopBar";

function BillingPage() {
    const navigate = useNavigate();
    const { plan } = useTeamContext();

    function getPlanInfo() {
        switch (plan) {
            case "Build":
                return {
                    name: "Build (Free)",
                    cost: "$0/mo",
                    features: ["1 Workspace", "Up to 3 Custom Categories"]
                };
            case "Launch":
                return {
                    name: "Launch",
                    cost: "$85/mo",
                    features: ["1 Workspace", "Unlimited Custom Categories"]
                };
            case "Scale":
                return {
                    name: "Scale",
                    cost: "$199/mo",
                    features: ["5 Workspaces", "Unlimited Custom Categories"]
                };
            case "Enterprise":
                return {
                    name: "Enterprise",
                    cost: "Contact Us",
                    features: ["Unlimited Workspaces", "Unlimited Custom Categories"]
                };
            default:
                return { name: plan, cost: "?", features: [] };
        }
    }

    const planInfo = getPlanInfo();

    return (
        <div className="wrapper">
            <MinimalTopBar />

            <h1>Billing</h1>
            <div className="section">
                <h2>Current Plan: {planInfo.name}</h2>
                <p>Cost: {planInfo.cost}</p>
                <ul>
                    {planInfo.features.map((f, idx) => (
                        <li key={idx}>{f}</li>
                    ))}
                </ul>
                <button onClick={() => navigate("/upgrade")}>Change Plan</button>
            </div>
        </div>
    );
}

export default BillingPage;
