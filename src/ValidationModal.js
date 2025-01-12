import React from "react";
import { useTeamContext } from "./TeamContext";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function ValidationModal({ onClose }) {
    const navigate = useNavigate();
    const { format, areas, members } = useTeamContext();

    const errors = [];

    // 1) Must have >= 1 member
    if (members.length === 0) {
        errors.push("Your team must have at least 1 member (your team has 0).");
    }

    // 2) No area can exceed 100%
    areas.forEach((area) => {
        const sum = members.reduce((acc, m) => acc + (m.contributions[area.name] || 0), 0);
        if (sum > 100) {
            errors.push(
                `Area "${area.name}" is over-allocated by ${sum - 100}%. (Total: ${sum}%)`
            );
        }
    });

    // 3) No member with zero total equity
    members.forEach((m) => {
        if (m.totalEquity === 0) {
            errors.push(`${m.name} has no equity (it must have at least one).`);
        }
    });

    // 4) External investor if "Tech Startup / Seed" or Series X
    const roundsNeedingInvestor = [
        "Tech Startup / Seed",
        "Tech Startup / Series A",
        "Tech Startup / Series B",
        "Tech Startup / Series C",
        "Tech Startup / Series D",
    ];
    if (roundsNeedingInvestor.includes(format)) {
        const fundingArea = areas.find((a) => a.name.toLowerCase() === "funding");
        if (fundingArea) {
            let hasExternalInvestor = false;
            for (let m of members) {
                let sumNonFunding = 0;
                let fundingValue = 0;
                for (let areaName in m.contributions) {
                    if (areaName.toLowerCase() === "funding") {
                        fundingValue = m.contributions[areaName];
                    } else {
                        sumNonFunding += m.contributions[areaName];
                    }
                }
                if (fundingValue > 0 && sumNonFunding === 0) {
                    hasExternalInvestor = true;
                    break;
                }
            }
            if (!hasExternalInvestor) {
                errors.push(
                    `For ${format}, you must have at least 1 external investor with >0% in "Funding" and 0% in all other areas.`
                );
            }
        } else {
            errors.push(
                `For ${format}, you must have a "Funding" area and at least 1 external investor.`
            );
        }
    }

    const isValid = errors.length === 0;

    function handleOK() {
        onClose();
    }

    function handleViewReport() {
        onClose();
        navigate("/reports");
    }

    return (
        <div className="validation-modal">
            {!isValid ? (
                <>
                    <h2>Your team was rejected for the following reasons:</h2>
                    <ul>
                        {errors.map((err, idx) => (
                            <li key={idx}>{err}</li>
                        ))}
                    </ul>
                    <button onClick={handleOK}>OK</button>
                </>
            ) : (
                <>
                    <h2>Your team is valid for {format || "the selected format"}.</h2>
                    <button onClick={handleOK}>OK</button>
                    <button onClick={handleViewReport} style={{ marginLeft: "8px" }}>
                        Print/View Report
                    </button>
                </>
            )}
        </div>
    );
}

export default ValidationModal;
