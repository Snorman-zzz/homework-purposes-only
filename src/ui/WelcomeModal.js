import React from "react";
import "../styles.css";

function WelcomeModal({ onClose }) {
    return (
        <div className="modal-backdrop">
            <div className="welcome-modal">
                <button className="modal-close-btn" onClick={onClose}>
                    &times;
                </button>

                <h2 style={{ marginTop: 0 }}>Welcome to Our Equity Calculator</h2>

                {/*
                  The scrollable content area.
                  We'll apply a fixed height + overflow in CSS so it can scroll if text is long.
                */}
                <div className="welcome-modal-content">
                    <p>
                        <strong>Welcome to our Equity Calculator – a tool crafted by co-founders for co-founders.
                            Here's how it works:</strong>
                    </p>

                    <p><strong>Expert-Driven Insights:</strong> Our calculator is the result of insights from seasoned cofounders
                        and experts in partnership dynamics. We've distilled their experiences into a tool that helps you
                        navigate the complex world of equity distribution.</p>

                    <p><strong>Guiding Principles:</strong></p>
                    <ul>
                        <li><em>Industry Standards:</em> We incorporate factors that are universally recognized in equity
                            negotiations.</li>
                        <li><em>Additional Considerations:</em> Beyond the basics, we highlight variables that might influence
                            your specific situation, encouraging a comprehensive approach to equity allocation.</li>
                    </ul>

                    <p><strong>More Than Just Numbers:</strong></p>
                    <ul>
                        <li><em>Conversation Starter:</em> Rather than dictating terms, our calculator initiates a dialogue.
                            It's designed to foster discussions where equity isn't just calculated but negotiated with understanding.</li>
                        <li><em>Customization for Every Team:</em> Understanding that no two startups are the same, our tool
                            helps tailor equity splits to reflect the unique contributions, risks, and visions of your team.</li>
                    </ul>

                    <p><strong>Building Foundations:</strong></p>
                    <ul>
                        <li><em>Trust and Transparency:</em> By guiding you through these discussions, we aim to lay down a
                            bedrock of trust and openness among co-founders.</li>
                        <li><em>Accountability:</em> The process of deciding equity sets a precedent for how future decisions
                            will be made, promoting accountability from the start.</li>
                    </ul>

                    <p><strong>A Trial for Future Collaboration:</strong></p>
                    <p>
                        Determining equity is akin to an art form, serving as a trial run to reveal how each co-founder
                        envisions their role in the company's journey. This initial conversation is crucial:
                    </p>
                    <ul>
                        <li><strong>Learning Lessons:</strong> You’ll learn about each other’s expectations and values.</li>
                        <li><strong>Navigating Challenges:</strong> Potential issues might surface, allowing you to address
                            them proactively.</li>
                        <li><strong>Honest Dialogue:</strong> Open and honest communication is encouraged to ensure everyone
                            is on the same page.</li>
                    </ul>

                    <p><strong>How It Helps You:</strong></p>
                    <p>
                        Our calculator doesn't just calculate; it helps you:
                    </p>
                    <ul>
                        <li><strong>Understand Contributions:</strong> Assess how each co-founder's input, time, and resources
                            shape the company's success.</li>
                        <li><strong>Reward Fairly:</strong> Determine how to reward each partner based on their role in the
                            company's growth.</li>
                    </ul>

                    <p>
                        In summary, our Equity Calculator is here to assist you in having those pivotal discussions about
                        equity, ensuring that your startup is built on a foundation of clarity, collaboration, and shared
                        vision. Let's start the conversation towards equitable success.
                    </p>
                </div>

                <div className="welcome-modal-footer">
                    <button className="try-calculator-btn" onClick={onClose}>
                        Try the Calculator
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WelcomeModal;
