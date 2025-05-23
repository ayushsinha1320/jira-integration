import { test, expect } from '@playwright/test';
import { createJiraTicket } from '../createJiraTicket.js';

// Helper to strip ANSI color codes
function stripAnsi(str) {
  return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}

// Helper to remove '// Object.is equality' from the error message
function removeObjectIsEquality(str) {
  return str.replace(/ *\/\/ Object\.is equality/g, '');
}

// This test will intentionally fail

test('Intentional failure to trigger Jira ticket', async () => {
  try {
    expect(1).toBe(2);
  } catch (error) {
    // Create a Jira ticket on failure
    let cleanMessage = stripAnsi(error.message);
    cleanMessage = removeObjectIsEquality(cleanMessage);
    await createJiraTicket(
      'Playwright Test Failure',
      cleanMessage,
      'Task',
      './image.png'
    );
    // throw error; 
  }
});