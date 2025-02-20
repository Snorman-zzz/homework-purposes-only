import React from "react";
import "../styles.css";

/**
 * Renders a modal to show or edit a single questionnaire response.
 * Props:
 *  - visible: boolean - whether modal is shown
 *  - onClose(): closes the modal
 *  - mode: "view" or "edit"
 *  - questionTitle: string
 *  - value: string (the existing detail or summary)
 *  - onSave(newValue: string): callback when user changes the text in edit mode
 */
function QuestionResponseModal({
                                   visible,
                                   onClose,
                                   mode,
                                   questionTitle,
                                   value,
                                   onSave
                               }) {
    if (!visible) return null;

    return (
        <div className="modal-backdrop">
            <div
                className="question-modal"
                style={{
                    backgroundColor: "#fff",
                    position: "relative",
                    padding: "16px",
                    borderRadius: "8px",
                    maxWidth: "600px",
                    margin: "0 16px"
                }}
            >
                <button
                    className="modal-close-btn"
                    style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background: "none",
                        border: "none",
                        fontSize: "24px",
                        cursor: "pointer"
                    }}
                    onClick={onClose}
                >
                    &times;
                </button>

                <h3>{questionTitle}</h3>

                {mode === "view" && (
                    <div style={{ marginTop: "16px" }}>
                        <p>{value}</p>
                        <div style={{ marginTop: "24px", textAlign: "right" }}>
                            <button
                                style={{
                                    backgroundColor: "#ddd",
                                    color: "#333",
                                    border: "none",
                                    padding: "8px 16px",
                                    borderRadius: "4px",
                                    marginRight: "8px"
                                }}
                                onClick={onClose}
                            >
                                Close
                            </button>
                            <button
                                style={{
                                    backgroundColor: "#0F66CC",
                                    color: "#fff",
                                    border: "none",
                                    padding: "8px 16px",
                                    borderRadius: "4px"
                                }}
                                onClick={() => onSave(value, "edit")}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                )}

                {mode === "edit" && (
                    <div style={{ marginTop: "16px" }}>
            <textarea
                style={{ width: "100%", height: "80px" }}
                value={value}
                onChange={(e) => onSave(e.target.value, "draft")}
            />
                        <div style={{ marginTop: "24px", textAlign: "right" }}>
                            <button
                                style={{
                                    backgroundColor: "#ddd",
                                    color: "#333",
                                    border: "none",
                                    padding: "8px 16px",
                                    borderRadius: "4px",
                                    marginRight: "8px"
                                }}
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                style={{
                                    backgroundColor: "#0F66CC",
                                    color: "#fff",
                                    border: "none",
                                    padding: "8px 16px",
                                    borderRadius: "4px"
                                }}
                                onClick={onClose}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuestionResponseModal;
