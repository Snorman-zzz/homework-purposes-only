// src/TeamContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const TeamContext = createContext();

function loadFromLocalStorage() {
    try {
        const data = localStorage.getItem("EQUITY_CALC_DATA");
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error("Error reading from localStorage", err);
        return null;
    }
}

function saveToLocalStorage(state) {
    try {
        localStorage.setItem("EQUITY_CALC_DATA", JSON.stringify(state));
    } catch (err) {
        console.error("Error writing to localStorage", err);
    }
}

export function TeamProvider({ children }) {
    // Define a default workspace with all required fields.
    const defaultWorkspace = {
        id: 1,
        name: "Default Workspace",
        part1Answers: {
            companyName: "",
            foundingTeamSize: 0,
            founderNames: [],
            reservedPools: [],
            foundersCashInvested: {},
            foundersTime: {},
            foundersAssets: {},
            ratingFinancialImpact: 3,
            ratingTimeImportance: 3,
            ratingAssetImportance: 3,
        },
        part2Answers: {
            equityDistributionAdjustment: {},
            coreFactors: [],
            preFormation: [],
            roleResponsibility: [],
            experienceNetworks: [],
        },
        visitedQuestionsPart1: {},
        visitedQuestionsPart2: {},
        isFullQuestionnaireComplete: false,
    };

    const storedData = loadFromLocalStorage();

    // Workspaces: use stored data if available; otherwise default to one workspace.
    const [workspaces, setWorkspaces] = useState(
        storedData?.workspaces || [defaultWorkspace]
    );

    // Active workspace: defaults to workspace id 1.
    const [activeWorkspaceId, setActiveWorkspaceId] = useState(
        storedData?.activeWorkspaceId || 1
    );

    // Show welcome modal (true by default)
    const [showWelcomeModal, setShowWelcomeModal] = useState(
        storedData?.showWelcomeModal !== false
    );

    useEffect(() => {
        const dataToStore = {
            workspaces,
            activeWorkspaceId,
            showWelcomeModal,
        };
        saveToLocalStorage(dataToStore);
    }, [workspaces, activeWorkspaceId, showWelcomeModal]);

    /** Create a new workspace and return it */
    function addWorkspace(name) {
        const newId =
            workspaces.length > 0 ? Math.max(...workspaces.map((w) => w.id)) + 1 : 1;
        const newWs = {
            id: newId,
            name,
            part1Answers: {
                companyName: "",
                foundingTeamSize: 0,
                founderNames: [],
                reservedPools: [],
                foundersCashInvested: {},
                foundersTime: {},
                foundersAssets: {},
                ratingFinancialImpact: 3,
                ratingTimeImportance: 3,
                ratingAssetImportance: 3,
            },
            part2Answers: {
                equityDistributionAdjustment: {},
                coreFactors: [],
                preFormation: [],
                roleResponsibility: [],
                experienceNetworks: [],
            },
            visitedQuestionsPart1: {},
            visitedQuestionsPart2: {},
            isFullQuestionnaireComplete: false,
        };
        setWorkspaces((prev) => [...prev, newWs]);
        return newWs;
    }

    /** Look up a workspace by id */
    function getWorkspaceById(id) {
        return workspaces.find((w) => w.id === id);
    }

    /** Overwrite the workspace data (e.g. after changes) */
    function updateWorkspaceData(wsId, updatedWs) {
        setWorkspaces((prev) =>
            prev.map((w) => (w.id === wsId ? { ...updatedWs } : w))
        );
    }

    /**
     * Calculate the final equity distribution for the active workspace.
     * It uses part1Answers and part2Answers.
     */
    function calculateFinalEquity() {
        const ws = getWorkspaceById(activeWorkspaceId);
        if (!ws) {
            return { finalEquityMap: {}, reservedEquityTotal: 0, leftoverForFounders: 0 };
        }
        const p1 = ws.part1Answers;
        const p2 = ws.part2Answers;

        // Sum reserved pools from Q3.
        let reservedEquityTotal = 0;
        (p1.reservedPools || []).forEach((rp) => {
            reservedEquityTotal += rp.weight || 0;
        });
        const leftoverForFounders = Math.max(100 - reservedEquityTotal, 0);

        // Ratings (from Q7–Q9)
        const R_FI = p1.ratingFinancialImpact || 3;
        const R_TC = p1.ratingTimeImportance || 3;
        const R_AI = p1.ratingAssetImportance || 3;
        const sumRat = R_FI + R_TC + R_AI;
        let wFI = 0, wTC = 0, wAI = 0;
        if (sumRat > 0) {
            wFI = R_FI / sumRat;
            wTC = R_TC / sumRat;
            wAI = R_AI / sumRat;
        }

        // Founders from Q2
        const founderNames = p1.founderNames || [];
        const totalCash = Object.values(p1.foundersCashInvested || {}).reduce(
            (a, b) => a + (b || 0),
            0
        );
        const totalTime = Object.values(p1.foundersTime || {}).reduce(
            (a, b) => a + (b || 0),
            0
        );
        const totalAssets = Object.values(p1.foundersAssets || {}).reduce(
            (a, b) => a + (b || 0),
            0
        );

        const founderTentMap = {};
        founderNames.forEach((fn) => {
            let fi = 0, tc = 0, ai = 0;
            if (totalCash > 0) {
                fi = ((p1.foundersCashInvested[fn] || 0) / totalCash) * wFI;
            }
            if (totalTime > 0) {
                tc = ((p1.foundersTime[fn] || 0) / totalTime) * wTC;
            }
            if (totalAssets > 0) {
                ai = ((p1.foundersAssets[fn] || 0) / totalAssets) * wAI;
            }
            founderTentMap[fn] = fi + tc + ai;
        });
        const sumTent = Object.values(founderTentMap).reduce((a, b) => a + b, 0);
        const founderTentPerc = {};
        founderNames.forEach((fn) => {
            if (sumTent > 0) {
                founderTentPerc[fn] = (founderTentMap[fn] / sumTent) * leftoverForFounders;
            } else {
                founderTentPerc[fn] = 0;
            }
        });

        // Advanced allocations from Part2
        const extraAlloc = {};
        founderNames.forEach((fn) => (extraAlloc[fn] = 0));
        function accumFactor(arr) {
            arr.forEach((f) => {
                if (!f.allocations) return;
                founderNames.forEach((fn) => {
                    const val = parseFloat(f.allocations[fn] || 0);
                    if (!isNaN(val)) extraAlloc[fn] += val;
                });
            });
        }
        accumFactor(p2.coreFactors);
        accumFactor(p2.preFormation);
        accumFactor(p2.roleResponsibility);
        accumFactor(p2.experienceNetworks);

        let sumAll = 0;
        founderNames.forEach((fn) => {
            sumAll += founderTentPerc[fn] + extraAlloc[fn];
        });

        const finalEquityMap = {};
        if (sumAll > 0) {
            founderNames.forEach((fn) => {
                finalEquityMap[fn] = ((founderTentPerc[fn] + extraAlloc[fn]) / sumAll) * 100;
            });
        } else {
            founderNames.forEach((fn) => (finalEquityMap[fn] = 0));
        }

        // Re-map so that the sum of founders’ equity plus reserved pools is ~100%
        const finalOfAll = {};
        let sumCheck = 0;
        founderNames.forEach((fn) => {
            const absolutePct = (finalEquityMap[fn] / 100) * leftoverForFounders;
            finalOfAll[fn] = absolutePct;
            sumCheck += absolutePct;
        });
        const diff = 100 - (sumCheck + reservedEquityTotal);
        if (founderNames.length > 0) {
            finalOfAll[founderNames[0]] += diff;
        }

        return {
            finalEquityMap: finalOfAll,
            reservedEquityTotal,
            leftoverForFounders,
        };
    }

    return (
        <TeamContext.Provider
            value={{
                workspaces,
                setWorkspaces,
                activeWorkspaceId,
                setActiveWorkspaceId,
                showWelcomeModal,
                setShowWelcomeModal,
                addWorkspace,
                getWorkspaceById,
                updateWorkspaceData,
                calculateFinalEquity,
            }}
        >
            {children}
        </TeamContext.Provider>
    );
}

export function useTeamContext() {
    return useContext(TeamContext);
}
