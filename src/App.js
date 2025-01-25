// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { TeamProvider } from "./TeamContext";

import WorkspacesPage from "./WorkspacesPage";
import BillingPage from "./BillingPage";
import UpgradePage from "./UpgradePage";
import TeamDetailsPage from "./TeamDetailsPage";
import ReportsPage from "./ReportsPage";
import NewMemberPage from "./NewMemberPage";

function App() {
    return (
        <TeamProvider>
            <Router>
                <Routes>
                    {/* 1) List of all workspaces */}
                    <Route path="/workspaces" element={<WorkspacesPage />} />

                    {/* 2) Root path -> Could optionally go to a default workspace (#1) */}
                    <Route path="/" element={<Navigate to="/team-details/1" />} />

                    {/* 3) Billing & Upgrade (no workspace ID needed) */}
                    <Route path="/billing" element={<BillingPage />} />
                    <Route path="/upgrade" element={<UpgradePage />} />

                    {/* 4) Team Details per workspace: /team-details/:workspaceId */}
                    <Route path="/team-details/:workspaceId" element={<TeamDetailsPage />} />

                    {/* 5) Reports per workspace: /reports/:workspaceId */}
                    <Route path="/reports/:workspaceId" element={<ReportsPage />} />

                    {/* 6) Edit a member => /edit-member/:workspaceId/:memberId */}
                    <Route path="/edit-member/:workspaceId/:memberId" element={<NewMemberPage />} />

                    {/* 7) Add a new member => /new-member/:workspaceId */}
                    <Route path="/new-member/:workspaceId" element={<NewMemberPage />} />
                </Routes>
            </Router>
        </TeamProvider>
    );
}

export default App;
