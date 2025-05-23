import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import { createJiraTicket } from './createJiraTicket.js';

/**
 * Notify a Jira user by email for a specific issue
 * @param {string} issueId - The Jira issue ID
 * @param {string} accountId - The Jira user account ID
 * @param {string} subject - The email subject
 * @param {string} textBody - The email body
 */
export async function notifyUser(issueId, accountId, subject, textBody) {
  const jiraUrl = process.env.JIRA_URL;
  const auth = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');

  const data = {
    subject,
    textBody,
    to: {
      users: [
        { accountId }
      ]
    }
  };

  try {
    const response = await axios.post(
      `${jiraUrl}/rest/api/3/issue/${issueId}/notify`,
      data,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Notification sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to send notification:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Create a Jira ticket and notify a user by email about the created issue
 * @param {string} summary - The summary/title of the issue
 * @param {string} description - The description of the issue
 * @param {string} [accountId] - The Jira user account ID to notify (optional, will use env if not provided)
 * @param {string} [issueType='Task'] - The type of the issue
 */
export async function createTicketAndNotify(summary, description, accountId, issueType = 'Task') {
  try {
    const notifyAccountId = accountId || process.env.JIRA_ACCOUNT_ID;
    if (!notifyAccountId) {
      throw new Error('No accountId provided and JIRA_ACCOUNT_ID is not set in .env');
    }
    const issue = await createJiraTicket(summary, description, issueType);
    const issueId = issue.id;
    await notifyUser(issueId, notifyAccountId, `Notification for Issue ${issue.key}`, `A new Jira issue (${issue.key}) has been created: ${summary}\n\n${description}`);
    console.log('Ticket created and notification sent.');
  } catch (error) {
    console.error('Failed to create ticket and notify:', error);
  }
}

// Example usage (uncomment and fill in values to use directly):
// createTicketAndNotify('Test Summary', 'Test Description'); 