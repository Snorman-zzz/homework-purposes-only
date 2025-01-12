import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css"; // Custom CSS with responsive + full-width changes

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
