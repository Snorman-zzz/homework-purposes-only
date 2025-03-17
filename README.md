# Equity Calculator & Analysis Tool

A React-based application for calculating founder equity distribution and generating AI-powered analysis reports.

## Key Features

🎯 **Multi-Step Questionnaire**  
- Context-aware forms with conditional logic
- Local storage persistence for continuous work
- Input validation and error handling

📊 **Equity Breakdown Visualization**  
- Interactive pie charts for founder/pool distributions
- Detailed tabular summaries 
- Responsive design across devices

🤖 **AI-Powered Analysis**  
- GPT-4 generated equity recommendations
- Contribution-based scenario suggestions
- Founder-specific commitment analysis

⚙️ **Advanced Configuration**
- Multiple workspaces support
- Reserved equity pool management
- Custom weighting for financial/time/asset contributions

## Built With

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)

**Tech Stack:**
- React 18 + Hooks
- React Router 6
- Chart.js + react-chartjs-2
- OpenAI API (GPT-4)
- LocalStorage persistence

## Getting Started

### Prerequisites

- Node.js v16+
- OpenAI API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/equity-calculator.git
   cd equity-calculator
   
2. Install dependencies
  npm install
  
3. Configure OpenAI API key
Replace the placeholder in ReportPage.js:
"Authorization": `Bearer YOUR_OPENAI_API_KEY`

4. Start the development server
Environment Setup
EQUITY_CALC/
├── AI_API_KEY=sk-your-key-here           # OpenAI API key
├── AI_MODEL=gpt-4                        # GPT model version
└── AI_TEMPERATURE=0.7                    # Creativity vs precision

Warning

The current implementation contains client-side API key usage for demonstration purposes only. For production environments:

Move API communication to a backend server
Implement proper authentication
Use environment variables for secrets
Add rate limiting
Usage
Core Workflow
Start questionnaire ➔ /calculator
Complete basic parameters (Q1-Q9)
Configure advanced factors (Q10-Q14)
Review summary ➔ /report
Generate AI analysis (⚡ GPT-4 powered)
Example AI Analysis
"For Sarah (32% equity): This mid-range stake suggests you're balancing decision-making authority with shared responsibility. Consider implementing vesting schedules to align long-term commitment..."

Available Scripts
npm start

Contributing
Fork the repository
Create feature branch: git checkout -b feat/new-analysis
Commit changes: git commit -am 'Add equity threshold alerts'
Push to branch: git push origin feat/new-analysis
Open pull request
