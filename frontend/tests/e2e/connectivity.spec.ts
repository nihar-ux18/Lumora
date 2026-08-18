import { test, expect } from '@playwright/test';

test.describe('Lumora E2E Real Backend Connectivity Test', () => {
  // Use a unique email for every test run to avoid database collisions
  const uniqueId = Date.now();
  const testEmail = `conn-${uniqueId}@lumora.dev`;
  const testPassword = 'Password123!';

  test('registers, logs in, creates workspace, creates resource, chats, deletes workspace, and signs out with real backend', async ({ page }) => {
    // 1. Open register page
    await page.goto('/auth/register');
    await expect(page).toHaveURL(/\/auth\/register/);

    // 2. Fill registration details
    await page.fill('input[placeholder="Alex Morgan"]', 'Connectivity Tester');
    await page.fill('input[placeholder="you@example.com"]', testEmail);
    await page.fill('input[placeholder="Create a password"]', testPassword);
    await page.fill('input[placeholder="Confirm your password"]', testPassword);
    await page.click('label:has-text("I agree to the")');
    await page.click('button[type="submit"]');

    // 3. Verify auto-redirect to login
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });

    // 4. Fill login credentials
    await page.fill('input[placeholder="you@example.com"]', testEmail);
    await page.fill('input[placeholder="••••••••"]', testPassword);
    await page.click('button[type="submit"]');

    // 5. Verify successful redirect to Dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Welcome back, Connectivity Tester');

    // 6. Navigate to Workspaces and create a new workspace
    await page.goto('/workspaces');
    await expect(page).toHaveURL(/\/workspaces/);

    // Click "New Workspace"
    await page.click('button:has-text("New Workspace")');

    // Fill workspace details
    await page.fill('input[placeholder="e.g. Q3 Marketing Strategy"]', 'E2E Connectivity Workspace');
    await page.fill('textarea[placeholder="Briefly describe the purpose of this workspace..."]', 'Created by E2E connectivity tests using real backend.');
    await page.click('form button[type="submit"]');

    // 7. Verify we are navigated to the workspace page
    await expect(page).toHaveURL(/\/workspaces\/[0-9a-fA-F-]{36}/, { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('E2E Connectivity Workspace');

    // 8. Create a Text (Note) Resource
    await page.click('button:has-text("Upload")');
    await page.click('button:has-text("Note")');
    await page.fill('input[placeholder="e.g. Physics Chapter 4"]', 'Connectivity Test Note');
    await page.fill('textarea[placeholder="Write your note here..."]', 'This is a test resource created via real browser connectivity verification.');
    await page.click('button[type="submit"]:has-text("Add Resource")');

    // Verify Note resource card appears
    await expect(page.locator('h3:has-text("Connectivity Test Note")')).toBeVisible({ timeout: 10000 });

    // 9. Navigate to Chat and send an AI query
    await page.click('a:has-text("Chat")');
    await expect(page).toHaveURL(/\/workspaces\/[0-9a-fA-F-]{36}\/chat/);

    // Click Plus button inside Conversations sidebar to create chat session
    await page.click('div.border-b:has-text("Conversations") button');

    // Fill chat message and send
    await page.fill('input[placeholder="Ask anything about your resources..."]', 'Say hello and summarize what a connectivity test is.');
    await page.click('button[aria-label="Send message"]');

    // 10. Verify that a real backend assistant message response is rendered
    // Wait for the typing skeleton (bouncing dots) to disappear, indicating response is complete
    await expect(page.locator('span.animate-bounce')).toHaveCount(0, { timeout: 25000 });

    // Now retrieve and verify the assistant's message content
    const assistantMessage = page.locator('div.rounded-tl-none').first();
    await expect(assistantMessage).toBeVisible();
    const content = await assistantMessage.textContent();
    expect(content?.trim().length).toBeGreaterThan(0);
    console.log('Real AI assistant reply received:', content);

    // 11. Navigate back to Workspace overview and clean up (Delete Workspace)
    await page.click('a:has-text("Overview")');
    await expect(page).toHaveURL(/\/workspaces\/[0-9a-fA-F-]{36}/);

    await page.click('button:has-text("Delete")');
    await page.click('button:has-text("Delete Workspace")');

    // Verify redirected back to workspaces list page
    await expect(page).toHaveURL(/\/workspaces/, { timeout: 10000 });
    await expect(page.locator('h3:has-text("E2E Connectivity Workspace")')).toHaveCount(0);

    // 12. Sign out
    await page.click('button[aria-label="User menu"]');
    await page.click('text=Sign Out');

    // Verify session is cleared and back to login
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
