// src/pages/UpgradePage.js
import React from "react";
import { useTeamContext } from "../TeamContext";
import TopBar from '../ui/TopBar';
import { useNavigate } from "react-router-dom";

function UpgradePage() {
    const { plan, setPlan } = useTeamContext();
    const navigate = useNavigate();

    const plans = {
        Build: { price: 0, workspaces: 1, categories: 3 },
        Launch: { price: 85, workspaces: 1, categories: "Unlimited" },
        Scale: { price: 199, workspaces: 5, categories: "Unlimited" },
        Enterprise: { price: "Contact Us", workspaces: "Unlimited", categories: "Unlimited" }
    };

    return (
        <div className="wrapper">
            <TopBar />
            <h1>Upgrade Your Plan</h1>

            <div className="plans-container">
                {Object.entries(plans).map(([name, details]) => (
                    <div key={name} className="plan-card">
                        <h3>{name}</h3>
                        <div className="price">
                            {typeof details.price === "number" ? `$${details.price}/mo` : details.price}
                        </div>
                        <ul>
                            <li>{details.workspaces} Workspace{details.workspaces !== 1 && 's'}</li>
                            <li>{details.categories} Categories</li>
                        </ul>
                        <button
                            onClick={() => {
                                setPlan(name);
                                navigate("/calculator");
                            }}
                            disabled={plan === name}
                        >
                            {plan === name ? "Current Plan" : "Select Plan"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UpgradePage;
