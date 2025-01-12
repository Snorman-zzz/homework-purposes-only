// TeamContext.js
import React, { createContext, useContext, useState } from "react";

const TeamContext = createContext();

export function TeamProvider({ children }) {
    // Freemium plan
    const [plan, setPlan] = useState("Build");
    // Limit of 3 custom categories for Build
    const [customCategoriesUsed, setCustomCategoriesUsed] = useState(0);

    // Keep a list of Workspaces globally
    const [workspaces, setWorkspaces] = useState([
        { id: 1, name: "Default Workspace" }
    ]);
    function addWorkspace(name) {
        const newId = workspaces.length + 1;
        setWorkspaces([...workspaces, { id: newId, name }]);
    }
    function getWorkspaceById(wsId) {
        return workspaces.find((ws) => ws.id === Number(wsId));
    }

    // For the equity logic
    const [format, setFormat] = useState("");
    const [areas, setAreas] = useState([]);
    const [members, setMembers] = useState([]);

    function updateAreas(newAreas) {
        setAreas(newAreas);
    }

    function addMember(member) {
        setMembers((prev) => [...prev, member]);
    }

    function updateMember(memberId, updatedMember) {
        setMembers((prev) =>
            prev.map((m) => (m.id === memberId ? updatedMember : m))
        );
    }

    function removeMember(memberId) {
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
    }

    function clearMembers() {
        setMembers([]);
    }

    function getRemainingForArea(areaName, excludeMemberId) {
        const sumContributions = members.reduce((acc, mem) => {
            if (excludeMemberId && mem.id === excludeMemberId) {
                return acc;
            }
            return acc + (mem.contributions[areaName] || 0);
        }, 0);
        return Math.max(0, 100 - sumContributions);
    }

    function calculateTotalEquity(contributions) {
        return areas.reduce((sum, area) => {
            const shareOfArea = (contributions[area.name] || 0) / 100;
            return sum + area.weight * shareOfArea;
        }, 0);
    }

    // Plan logic: if on Build plan & 3 categories used => block
    function canAddMoreCustomCategories() {
        if (plan === "Build" && customCategoriesUsed >= 3) {
            return false;
        }
        return true;
    }

    function incrementCustomCategories() {
        setCustomCategoriesUsed((prev) => prev + 1);
    }

    return (
        <TeamContext.Provider
            value={{
                plan, setPlan,
                customCategoriesUsed,
                canAddMoreCustomCategories,
                incrementCustomCategories,

                workspaces, addWorkspace, getWorkspaceById,

                format, setFormat,
                areas, updateAreas,
                members, addMember,
                updateMember, removeMember,
                clearMembers,
                getRemainingForArea,
                calculateTotalEquity
            }}
        >
            {children}
        </TeamContext.Provider>
    );
}

export function useTeamContext() {
    return useContext(TeamContext);
}