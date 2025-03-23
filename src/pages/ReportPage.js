// src/pages/ReportPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeamContext } from "../TeamContext";
import TopBar from "../ui/TopBar";
import ReactMarkdown from "react-markdown";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../styles.css";
import placeholderArt from "../assets/placeholder_art.png";

ChartJS.register(ArcElement, Tooltip, Legend);

function ReportPage() {
    const navigate = useNavigate();
    const { activeWorkspaceId, getWorkspaceById, calculateFinalEquity } = useTeamContext();
    const [aiResponse, setAiResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showHelpPanel, setShowHelpPanel] = useState(false);

    // Early returns if no workspace is selected or found
    if (!activeWorkspaceId) {
        return (
            <div className="wrapper">
                <TopBar currentTab="report" />
                <h2>No workspace selected.</h2>
            </div>
        );
    }
    const ws = getWorkspaceById(activeWorkspaceId);
    if (!ws) {
        return (
            <div className="wrapper">
                <TopBar currentTab="report" />
                <h2>Workspace not found</h2>
            </div>
        );
    }

    // If the questionnaire is not complete, show a placeholder screen
    if (!ws.isFullQuestionnaireComplete) {
        return (
            <div className="wrapper">
                <TopBar currentTab="report" />
                <div style={{ position: "relative", textAlign: "center", marginTop: "32px" }}>
                    <img
                        src={placeholderArt}
                        alt="placeholder"
                        style={{ width: "100%", maxWidth: "800px", marginLeft: "-100px" }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: "40%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            color: "#333",
                            backgroundColor: "rgba(255,255,255,0.8)",
                            padding: "16px",
                            borderRadius: "8px",
                            maxWidth: "80%",
                        }}
                    >
                        <h2 style={{ marginBottom: "8px" }}>The secret of getting ahead is getting started</h2>
                        <p style={{ marginBottom: "16px" }}>
                            To calculate your equity split, get started with the questionnaires below.
                        </p>
                        <button
                            onClick={() => navigate("/calculator")}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#10B981",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "16px",
                            }}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Otherwise, if the questionnaire is complete, show the final report
    const { finalEquityMap } = calculateFinalEquity();
    const reservedPools = ws.part1Answers.reservedPools || [];
    const founderEntries = Object.entries(finalEquityMap || {});

    // Build arrays for the combined pie chart (founders + reserved pools)
    const pieLabels = [];
    const pieVals = [];
    founderEntries.forEach(([fn, eq]) => {
        pieLabels.push(fn);
        pieVals.push(eq);
    });
    reservedPools.forEach((rp) => {
        pieLabels.push(rp.name);
        pieVals.push(rp.weight);
    });

    const chartData = {
        labels: pieLabels,
        datasets: [
            {
                data: pieVals,
                backgroundColor: [
                    "#3b82f6",
                    "#ec4899",
                    "#f97316",
                    "#14B8A6",
                    "#8b5cf6",
                    "#f59e0b",
                    "#F43F5E",
                    "#6EE7B7",
                    "#C084FC",
                    "#22D3EE",
                ].slice(0, pieLabels.length),
            },
        ],
    };

    // Use the company name if provided; otherwise, fallback to the workspace name
    const companyName = ws.part1Answers.companyName || ws.name;

    // --- Local LLM integration using Ollama ---
    // This function calls the local LLM endpoint (assumed to be provided by Ollama running Llama 3)
    async function getEquityAnswer(prompt) {
        try {
            const response = await fetch("http://localhost:11434/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: prompt,
                    model: "llama3.2:latest",
                    // stream: true is the default
                }),
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const parsedChunk = JSON.parse(chunk);
                fullResponse += parsedChunk.response;
            }

            return fullResponse;

        } catch (err) {
            console.error("Local LLM API Error:", err);
            throw err;
        }
    }


    // Handler for generating the AI report
    const handleGenerateAIReport = async () => {
        setIsLoading(true);
        setError("");
        setAiResponse("");

        try {
            // Build data strings from context
            const contributionBreakdown = reservedPools
                .map(rp => `${rp.name}: ${rp.weight.toFixed(2)}%`)
                .join(", ");
            const teamBreakdown = founderEntries
                .map(([fn, eq]) => `${fn}: ${eq.toFixed(2)}%`)
                .join(", ");

            // Construct the detailed prompt for the local LLM
            const prompt = `Using the following equity breakdown data, generate an AI report that provides a detailed explanation for each founder's equity position. Apply these rules for each founder based on their total equity percentage:

- If the total equity is between 85% and 100%:
  "Oh wow you are really taking the lead on this venture! While you obviously have taken on a significant amount of the work within the company, you may want to consider delegation to your cofounders in order to be able to execute on your idea. Additionally, some cofounders have stated that they do not think that their partner would have 'stuck around' if they didn't have a substantial amount of equity within the company. On the opposite end, some cofounders were grateful that the equity reflected the work/risk/investment provided by their cofounder as it avoided any discouragement or bitterness when one wasn't contributing as much. At this level it also raises the question: do your cofounders have enough equity to be fully committed for the long haul? If their shares are too small, they may view their efforts more like a short-term job than a shared entrepreneurial journey, leading to halfhearted engagement and making it tough for you to rely on them during crunch times or when pivoting strategies. To address this, consider whether you have a structure in place to reward continued contributions—for instance, performance-based or milestone-based vesting, or offering additional grants to cofounders who take on greater responsibilities. A modest increase in cofounder stakes could pay off significantly if it secures their active participation and emotional investment; striking a thoughtful balance ensures everyone feels recognized for their role and stays dedicated to the company’s success."

- If the total equity is between 60% and 85%:
  "Having 60–85% of the company typically places you in a strong majority position. You’ll likely set the overarching vision and hold significant sway over critical decisions. This can be beneficial if you have a clear vision, but ensure other cofounders still feel their voices are heard and their equity reflects their ongoing contributions. In many startups, a single founder might take on 60–85% if they’ve personally financed a big chunk of operations or brought the original idea and the foundational work. Be sure to formalize everyone’s roles to avoid confusion about why you hold the majority stake. If done transparently, this equity division can maintain morale and keep everyone aligned on shared goals."

- If the total equity is between 40% and 60%:
  "If your equity stake sits in the 40–60% range, you likely play a pivotal role in the company while sharing substantial ownership with at least one other cofounder. This balance can be positive because you have significant influence without completely overshadowing your partners. On the other hand, if you’re near the higher end—say 55–60%—you might approach a de facto majority, making it essential to ensure the rest of the team still feels valued and heard. If you’re closer to 40%, you remain a major voice but may need to build consensus more often on key decisions. In either scenario, laying out clear roles, decision-making processes, and pathways for additional equity or responsibility helps maintain a sense of shared commitment. Ultimately, being in this 'middle-majority' zone can foster strong collaboration if everyone understands how contributions are recognized and how critical decisions will be made."

- If the total equity is between 20% and 40%:
  "If you hold 20–40% equity, you’re likely a core member of the founding or early team, yet you’re not the primary decision-maker. This share often reflects a combination of your specialized skill set, partial investment of funds, or a split of responsibilities with a cofounder who holds a majority. That said, the closer you are to the lower end (20–25%), the more you might question the risk-versus-reward balance—especially if you’re putting in long hours and facing the same startup pressures as others. Clarity around your role, future equity opportunities, and performance milestones can help ensure your stake feels proportional to the contributions and risks you’re taking on. Additionally, discuss transparent paths for growth if you sense your equity share might not fully compensate for your efforts. This could mean the potential for additional grants, performance-based increments, or profit-sharing mechanisms. Just as with smaller equity holders, you don’t want to be in a position where the toll of the entrepreneurial journey outweighs the benefits. Regular check-ins with other cofounders to recalibrate roles and responsibilities will help maintain motivation, alignment, and a sense that everyone’s getting their fair share of the upside."

- If the total equity is between 0% and 20%:
  "If you hold somewhere between 0–20% of the company, you’re likely involved in a specific, specialized capacity or you joined after the original idea and groundwork were already established. While even a small slice of a high-growth startup can turn out to be valuable, you may have limited sway over larger strategic decisions or pivots. It’s crucial to clarify how your contributions tie into the broader vision, and whether there’s a path to earn more equity if you assume bigger responsibilities over time. Establishing clear milestones or performance-based triggers can help you feel confident that your stake will grow in line with your contributions. That said, being on the lower end of the equity spectrum can make the entrepreneurial journey feel disproportionately risky. Long hours, emotional ups and downs, and financial uncertainty can weigh heavily when the potential upside seems small. If you’re concerned that the reward doesn’t match the toll of startup life, discuss alternative compensation structures—such as salary bumps, bonuses, or additional equity grants tied to performance. Ultimately, ensuring there’s a fair balance of risk and reward will help keep you motivated and aligned with the company’s success."

- If the equity split is exactly 50/50:
  "A 50/50 split is common among two-person founding teams, symbolizing complete equality in ownership, decision-making, and responsibility. This can work smoothly if you and your partner share similar values, vision, and work ethic, because neither can unilaterally outvote the other. However, a deadlock can occur if you disagree on major decisions—so make sure you have a plan for resolving disputes or stalemates. Many 50/50 partners create a neutral mechanism (like a board member or a trusted advisor) for arbitration. If you both bring equal skills and commitment, this evenly distributed equity can be empowering, fostering a deep sense of mutual ownership and accountability."

Equity Breakdown by Contribution Areas: ${contributionBreakdown}

Equity Breakdown by Team Member: ${teamBreakdown}

Generate the report accordingly for each founder. Focus on explaining each founder's position based on their percentage and provide actionable recommendations.`;

            const answer = await getEquityAnswer(prompt);
            setAiResponse(answer);
        } catch (err) {
            let errorMessage = err.message;
            if (errorMessage.includes("Rate limit")) errorMessage = "API quota exceeded - check your billing";
            if (errorMessage.includes("Incorrect API")) errorMessage = "Invalid API key - check configuration";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="wrapper">
            <TopBar currentTab="report" />

            <div
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    zIndex: 9999,
                }}
                id="help-panel"
            >
                {showHelpPanel && (
                    <div
                        style={{
                            backgroundColor: "#FAFAFA",
                            border: "1px solid #ccc",
                            padding: "16px",
                            borderRadius: "6px",
                            marginBottom: "8px",
                            width: "280px",
                            fontSize: "14px",
                            color: "#28435a"
                        }}
                    >
                        <p style={{ marginBottom: "12px", fontWeight: "600" }}>Founder Insight Articles:</p>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: "8px" }}>
                                <a href="https://thecofoundershub.com/" target="_blank" rel="noreferrer" style={{ color: "#0F66CC", textDecoration: "underline" }}>
                                    📌 Will you VEST? 4 years with 1 year cliff
                                </a>
                            </li>
                            <li style={{ marginBottom: "8px" }}>
                                <a href="https://thecofoundershub.com/" target="_blank" rel="noreferrer" style={{ color: "#0F66CC", textDecoration: "underline" }}>
                                    💡 Is investment a loan to be paid back from Revenue?
                                </a>
                            </li>
                            <li style={{ marginBottom: "8px" }}>
                                <a href="https://thecofoundershub.com/" target="_blank" rel="noreferrer" style={{ color: "#0F66CC", textDecoration: "underline" }}>
                                    🏢 Asset ownership: Company vs Personal
                                </a>
                            </li>
                            <li style={{ marginBottom: "8px" }}>
                                <a href="https://thecofoundershub.com/" target="_blank" rel="noreferrer" style={{ color: "#0F66CC", textDecoration: "underline" }}>
                                    ⚖️ Liability sunset clauses & equity redistribution
                                </a>
                            </li>
                            <li style={{ marginBottom: "8px" }}>
                                <a href="https://thecofoundershub.com/" target="_blank" rel="noreferrer" style={{ color: "#0F66CC", textDecoration: "underline" }}>
                                    📋 Founder expense responsibilities
                                </a>
                            </li>
                            <li>
                                <a href="https://thecofoundershub.com/" target="_blank" rel="noreferrer" style={{ color: "#0F66CC", textDecoration: "underline" }}>
                                    💭 Final thoughts on equity distribution
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
                <button
                    onClick={() => setShowHelpPanel(!showHelpPanel)}
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#28435a",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "18px",
                    }}
                    title="View Founder Insights"
                >
                    ?
                </button>
            </div>

            <h1>Equity Report for {companyName}</h1>

            {/* AI Reporting Section */}
            <div className="section" style={{ marginTop: "32px" }}>
                <h2>AI Equity Analysis</h2>
                <button
                    onClick={handleGenerateAIReport}
                    disabled={isLoading}
                    style={{
                        padding: "12px 24px",
                        backgroundColor: isLoading ? "#9CA3AF" : "#10B981",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "16px",
                        transition: "background-color 0.2s",
                    }}
                >
                    {isLoading ? "Analyzing..." : "Generate AI Report"}
                </button>
                {error && (
                    <div
                        style={{
                            marginTop: "16px",
                            padding: "12px",
                            backgroundColor: "#FEE2E2",
                            color: "#B91C1C",
                            borderRadius: "4px",
                        }}
                    >
                        Error: {error}
                    </div>
                )}
                {aiResponse && (
                    <div
                        className="report-md"
                        style={{
                            marginTop: "24px",
                            padding: "20px",
                            backgroundColor: "#F3F4F6",
                            borderRadius: "8px",
                        }}
                    >
                        <h3>AI Analysis Result</h3>
                        <div
                            style={{
                                marginTop: "12px",
                                lineHeight: 1.6,
                                fontFamily: "'Inter', sans-serif",
                                color: "#1F2937",
                            }}
                        >
                            <ReactMarkdown>{aiResponse}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>

            {/* Founders Table */}
            <div className="section">
                <h2>Founders</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Founder</th>
                        <th>Total Equity (%)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {founderEntries.map(([fn, eq]) => (
                        <tr key={fn}>
                            <td>{fn}</td>
                            <td>{eq.toFixed(2)}%</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Reserved Pools Table */}
            {reservedPools.length > 0 && (
                <div className="section">
                    <h2>Reserved Pools</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Pool</th>
                            <th>Weight (%)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reservedPools.map((p, i) => (
                            <tr key={i}>
                                <td>{p.name}</td>
                                <td>{p.weight.toFixed(2)}%</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pie Chart */}
            <div className="section" style={{ marginTop: "24px" }}>
                <h2>Combined Pie: Founders + Pools</h2>
                <div style={{ height: "300px", maxWidth: "600px" }}>
                    <Pie data={chartData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
}

export default ReportPage;