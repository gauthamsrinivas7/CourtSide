# CourtSide Pulse

CourtSide Pulse is an AI-powered sports tracking dashboard that helps you stay up-to-date with your favorite teams.

## Features

- **Personalized Tracking**: Follow up to 10 teams from NBA, NFL, IPL, and International Cricket.
- **Morning Preview (6:00 AM)**: Receive a daily digest of upcoming games for your teams, converted to your local timezone.
- **Evening Summary (10:00 PM)**: Get a summary of final scores and highlights for games played that day.
- **Auto-Persist**: Your preferences are saved automatically so you never lose your configuration.
- **AI Integration**: Powered by Google Gemini to fetch and format real-time schedule and score information.

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- A Google Gemini API Key.

### Installation

1.  Clone the repository or download the source code.
2.  Install dependencies (assuming a standard React environment setup):

    ```bash
    npm install
    ```

### Configuration

You must provide your Google Gemini API Key via an environment variable.

1.  Create a `.env` file in the root directory (if using Vite/Create React App).
2.  Add your API Key:

    **For Vite:**
    ```env
    VITE_API_KEY=your_actual_api_key_here
    ```
    *Note: The current codebase uses `process.env.API_KEY`. If using Vite, you may need to update the `services/geminiService.ts` to use `import.meta.env.VITE_API_KEY` or configure your bundler to define `process.env`.*

    **For Webpack / CRA:**
    ```env
    REACT_APP_API_KEY=your_actual_api_key_here
    ```

### Running the App

Start the development server:

```bash
npm start
# or if using vite
npm run dev
```

Open your browser to `http://localhost:3000` (or the port specified by your bundler).

## Usage

1.  **Onboarding**: Enter your email, select your timezone, and search for up to 10 teams to follow.
2.  **Dashboard**: 
    - Click "Morning Preview" to generate a manual report.
    - Click "Evening Summary" to check results manually.
    - **Automated**: Keep the tab open. At 6:00 AM and 10:00 PM (in your selected timezone), the app will automatically generate the report and show a notification simulating an email send.
3.  **Manage**: Click the "Manage" button in the top right to update your teams or settings.
