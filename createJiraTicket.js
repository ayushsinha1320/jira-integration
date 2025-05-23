import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import FormData from 'form-data';
dotenv.config();

/**
 * Creates a Jira ticket and optionally attaches a file
 * @param {string} summary - The summary/title of the issue
 * @param {string} descriptionText - The plain text description of the issue
 * @param {string} [issueType='Task'] - The type of the issue (e.g., 'Bug', 'Epic')
 * @param {string} [attachmentPath] - Path to the file to attach
 */
export async function createJiraTicket(summary, descriptionText, issueType = 'Task', attachmentPath) {
  const jiraUrl = process.env.JIRA_URL;
  const auth = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');
  const projectId = 'ECS'; // Replace with your actual project key

  const data = {
    fields: {
      project: { key: projectId },
      summary,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: descriptionText }
            ]
          }
        ]
      },
      issuetype: { name: issueType }
    }
  };

  try {
    // 1. Create the issue
    const response = await axios.post(
      `${jiraUrl}/rest/api/3/issue`,
      data,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Jira ticket created:', response.data);

    // 2. Attach file if provided
    if (attachmentPath) {
      const issueKey = response.data.key;
      const form = new FormData();
      form.append('file', fs.createReadStream(attachmentPath));

      await axios.post(
        `${jiraUrl}/rest/api/3/issue/${issueKey}/attachments`,
        form,
        {
          headers: {
            ...form.getHeaders(),
            'Authorization': `Basic ${auth}`,
            'X-Atlassian-Token': 'no-check'
          }
        }
      );
      console.log('Attachment uploaded to issue:', issueKey);
    }

    return response.data;
  } catch (error) {
    console.error('Failed to create Jira ticket:', error.response?.data || error.message);
    throw error;
  }
}