// src/components/EquityReportReadyModal.js
import React from "react";
import "../styles.css";

function EquityReportReadyModal({ onClose, onViewReport }) {
    return (
        <div className="modal-backdrop">
            <div
                className="report-ready-modal"
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    width: "400px",
                    maxWidth: "90%",
                    position: "relative",
                    padding: "20px",
                }}
            >
                <button
                    className="modal-close-btn"
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background: "none",
                        border: "none",
                        fontSize: "24px",
                        cursor: "pointer",
                    }}
                >
                    &times;
                </button>
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            width: "80px",
                            height: "80px",
                            margin: "0 auto",
                            borderRadius: "50%",
                            backgroundColor: "#FFEA9F",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "32px",
                        }}
                    >
                        🎉
                    </div>
                    <h2 style={{ marginTop: "16px" }}>Your equity report is ready!</h2>
                    <div style={{ marginTop: "24px", display: "flex", justifyContent: "center", gap: "12px" }}>
                        <button
                            onClick={onClose}
                            style={{
                                backgroundColor: "#ddd",
                                color: "#333",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            OK
                        </button>
                        <button
                            onClick={onViewReport}
                            style={{
                                backgroundColor: "#0F66CC",
                                color: "#fff",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            View/Print Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EquityReportReadyModal;
