// TeamContext.js
import React, { createContext, useContext, useState } from "react";

const TeamContext = createContext();

export function TeamProvider({ children }) {
    // 1) Plan + category usage
    const [plan, setPlan] = useState("Build");
    const [customCategoriesUsed, setCustomCategoriesUsed] = useState(0);

    function canAddMoreCustomCategories() {
        if (plan === "Build" && customCategoriesUsed >= 3) {
            return false;
        }
        return true;
    }
    function incrementCustomCategories() {
        setCustomCategoriesUsed((prev) => prev + 1);
    }

    // 2) Store “workspaces”: now each has { reservedPools:[], areas:[], intangibleFactors:[], members:[] }
    const [workspaces, setWorkspaces] = useState([
        {
            id: 1,
            name: "Default Workspace",
            format: "",
            // NEW: reservedPools array
            reservedPools: [],
            areas: [],
            intangibleFactors: [],
            members: [],
        },
    ]);

    // 3) Returns one workspace by ID
    function getWorkspaceById(wsId) {
        return workspaces.find((ws) => ws.id === Number(wsId));
    }

    // 4) Add a brand new workspace
    function addWorkspace(name) {
        const newId = workspaces.length + 1;
        const newWs = {
            id: newId,
            name,
            format: "",
            reservedPools: [],
            areas: [],
            intangibleFactors: [],
            members: [],
        };
        setWorkspaces((prev) => [...prev, newWs]);
        return newWs;
    }

    // 5) Update an existing workspace in place
    function updateWorkspace(wsId, updatedWs) {
        setWorkspaces((prev) =>
            prev.map((ws) => (ws.id === Number(wsId) ? updatedWs : ws))
        );
    }

    // 6) Calculate total equity for a single member’s contributions
    function calculateTotalEquity(contributions) {
        return Object.values(contributions).reduce((sum, val) => sum + val, 0);
    }

    /**
     * getRemainingForArea:
     * - Summation of all members’ contributions in “areaName” across this workspace
     * - We skip “reservedPools” because members *cannot* allocate from them
     * - If we exclude a certain member’s ID, skip that member’s portion
     */
    function getRemainingForArea(workspace, areaName, excludeMemberId) {
        // First see if areaName is in .areas or .intangibleFactors
        // (We do NOT include .reservedPools since those are not assignable to members)
        const foundArea =
            workspace.areas.find((a) => a.name === areaName) ||
            workspace.intangibleFactors.find((f) => f.name === areaName);

        const poolTotal = foundArea ? foundArea.weight : 0;

        // Summation of all members’ contributions
        const sumContributions = workspace.members.reduce((acc, mem) => {
            if (excludeMemberId && mem.id === excludeMemberId) {
                return acc;
            }
            return acc + (mem.contributions[areaName] || 0);
        }, 0);

        return Math.max(0, poolTotal - sumContributions);
    }

    return (
        <TeamContext.Provider
            value={{
                // Plan info
                plan,
                setPlan,
                customCategoriesUsed,
                canAddMoreCustomCategories,
                incrementCustomCategories,

                // Workspaces
                workspaces,
                getWorkspaceById,
                addWorkspace,
                updateWorkspace,

                // Equity logic
                calculateTotalEquity,
                getRemainingForArea,
            }}
        >
            {children}
        </TeamContext.Provider>
    );
}

export function useTeamContext() {
    return useContext(TeamContext);
}
