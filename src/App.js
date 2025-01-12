// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
                    <Route path="/workspaces" element={<WorkspacesPage />} />
                    <Route path="/" element={<TeamDetailsPage />} />
                    <Route path="/billing" element={<BillingPage />} />
                    <Route path="/upgrade" element={<UpgradePage />} />

                    {/* Key route: We pass :workspaceId so we can open distinct workspaces */}
                    <Route path="/team-details/:workspaceId" element={<TeamDetailsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />

                    {/* Editing a member => /edit-member/:memberId => goes to NewMemberPage in "edit mode" */}
                    <Route path="/edit-member/:memberId" element={<NewMemberPage />} />

                    {/* Adding a new member => /new-member => also NewMemberPage in "add" mode */}
                    <Route path="/new-member" element={<NewMemberPage />} />
                </Routes>
            </Router>
        </TeamProvider>
    );
}

export default App;