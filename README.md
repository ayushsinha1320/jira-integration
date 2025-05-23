# Jira Integration with Playwright

This project creates a Jira ticket automatically whenever a Playwright test fails.

## Setup

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Configure Jira credentials:**
   Create a `.env` file in the root directory with the following content:
   ```env
   JIRA_URL=https://your-domain.atlassian.net
   JIRA_EMAIL=your-email@example.com
   JIRA_API_TOKEN=your-api-token
   ```
   Replace the values with your Jira details.

3. **Set your Jira project key:**
   In `createJiraTicket.js`, replace `<jira_project_id>` with your actual Jira project key.

## Running the Test

Run the following command:
```sh
npx playwright test
```

The test in `tests/jira-fail.spec.js` is designed to fail and will trigger the creation of a Jira ticket. 