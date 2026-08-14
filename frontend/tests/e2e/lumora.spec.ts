import { test, expect } from '@playwright/test';

test.describe('Lumora E2E Browser Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept all API calls by matching URL path suffixes and filtering by resourceType ('fetch'/'xhr')
    
    // Workspaces List & Create
    await page.route(url => url.pathname.endsWith('/workspaces'), async (route, request) => {
      if (request.resourceType() === 'fetch' || request.resourceType() === 'xhr') {
        if (request.method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
              {
                id: 'ws-123',
                name: 'Playwright Workspace',
                description: 'Created by E2E browser tests',
                owner_id: 'mock-user-id',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ])
          });
        } else if (request.method() === 'POST') {
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({
              id: 'ws-new-456',
              name: 'Newly Created Workspace',
              description: 'E2E created',
              owner_id: 'mock-user-id',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          });
        }
      } else {
        await route.continue();
      }
    });

    // Workspace Details & Delete
    await page.route(url => url.pathname.endsWith('/workspaces/ws-123'), async (route, request) => {
      if (request.resourceType() === 'fetch' || request.resourceType() === 'xhr') {
        if (request.method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              id: 'ws-123',
              name: 'Playwright Workspace',
              description: 'Created by E2E browser tests',
              owner_id: 'mock-user-id',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          });
        } else if (request.method() === 'DELETE') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Deleted' })
          });
        }
      } else {
        await route.continue();
      }
    });

    // Members list
    await page.route(url => url.pathname.endsWith('/workspaces/ws-123/members'), async (route, request) => {
      if (request.resourceType() === 'fetch' || request.resourceType() === 'xhr') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'm-1',
              workspace_id: 'ws-123',
              user_id: 'mock-user-id',
              role: 'owner',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
        });
      } else {
        await route.continue();
      }
    });

    // Member invite
    await page.route(url => url.pathname.endsWith('/workspaces/ws-123/invite'), async (route, request) => {
      if (request.resourceType() === 'fetch' || request.resourceType() === 'xhr') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'inv-123',
            workspace_id: 'ws-123',
            email: 'colleague@example.com',
            token: 'tok-invite',
            expires_at: new Date().toISOString(),
            accepted: false,
            created_at: new Date().toISOString()
          })
        });
      } else {
        await route.continue();
      }
    });

    // Resources list
    await page.route(url => url.pathname.endsWith('/workspaces/ws-123/resources'), async (route, request) => {
      if (request.resourceType() === 'fetch' || request.resourceType() === 'xhr') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'r-123',
              workspace_id: 'ws-123',
              title: 'Manual.pdf',
              resource_type: 'file',
              file_path: 'uploads/manual.pdf',
              source_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
        });
      } else {
        await route.continue();
      }
    });

    // Resource Delete
    await page.route(url => url.pathname.endsWith('/resources/r-123'), async (route, request) => {
      if (request.resourceType() === 'fetch' || request.resourceType() === 'xhr') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Deleted successfully' })
        });
      } else {
        await route.continue();
      }
    });

    // Chats List & Create
    await page.route(url => url.pathname.endsWith('/chats/workspaces/ws-123'), async (route, request) => {
      if (request.resourceType() === 'fetch' || request.resourceType() === 'xhr') {
        if (request.method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
              {
                id: 'chat-123',
                workspace_id: 'ws-123',
                title: 'Welcome Chat',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ])
          });
        } else if (request.method() === 'POST') {
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({
              id: 'chat-new-456',
              workspace_id: 'ws-123',
              title: 'New Chat Session',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          });
        }
      } else {
        await route.continue();
      }
    });

    // Chat messages List & Create
    await page.route(url => url.pathname.endsWith('/chats/chat-123/messages'), async (route, request) => {
      if (request.resourceType() === 'fetch' || request.resourceType() === 'xhr') {
        if (request.method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
              { id: 'msg-1', chat_session_id: 'chat-123', role: 'user', content: 'Hello AI', created_at: '', updated_at: '' },
              { id: 'msg-2', chat_session_id: 'chat-123', role: 'assistant', content: 'Hello! How can I assist you?', created_at: '', updated_at: '' }
            ])
          });
        } else if (request.method() === 'POST') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              user_message: { id: 'msg-user-999', chat_session_id: 'chat-123', role: 'user', content: 'Explain algorithms', created_at: '', updated_at: '' },
              assistant_message: { id: 'msg-assistant-999', chat_session_id: 'chat-123', role: 'assistant', content: 'This is a simulated browser E2E reply.', created_at: '', updated_at: '' },
              sources: [{ chunk_index: 0, content: 'E2E chunk content', resource_title: 'Manual.pdf' }]
            })
          });
        }
      } else {
        await route.continue();
      }
    });
  });

  test('performs user auth, workspace details navigation, resource deletion, and AI chat flow', async ({ page }) => {
    // 1. Authentication Login
    await page.goto('/auth/login');
    
    // Fill credentials matching frontend mock auth logic
    await page.fill('input[type="email"]', 'demo@lumora.dev');
    await page.fill('input[type="password"]', 'LumoraDemo123!');
    await page.click('button[type="submit"]');

    // 2. Validate Redirect to Dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText('Welcome back, Nihar Patil');
    
    // 3. Workspace details navigation
    await expect(page.locator('text=Playwright Workspace')).toBeVisible();
    await page.click('text=Playwright Workspace');
    
    // Validate Workspace Overview page
    await expect(page).toHaveURL(/\/workspaces\/ws-123/);
    await expect(page.locator('h1')).toContainText('Playwright Workspace');

    // 4. Resource interaction: Confirm list and trigger delete dialog cancel
    await expect(page.locator('h3:has-text("Manual.pdf")')).toBeVisible();
    await page.click('button[aria-label="Delete resource"]');
    await expect(page.getByRole('heading', { name: 'Delete Resource' })).toBeVisible();
    await page.click('button:has-text("Cancel")');
    await expect(page.getByRole('heading', { name: 'Delete Resource' })).not.toBeVisible();

    // 5. Member / Invitation: Open Dialog and verify submission
    await page.click('button:has-text("Invite")');
    await page.fill('input[type="email"]', 'colleague@example.com');
    await page.click('button:has-text("Generate Link")');
    await expect(page.locator('text=The invitation has been created')).toBeVisible();
    await page.click('button:has-text("Done")');

    // 6. AI chat: Navigate to Chat section and send a message
    await page.click('a[href$="/chat"]');
    await expect(page).toHaveURL(/\/workspaces\/ws-123\/chat/);
    await expect(page.locator('text=Welcome Chat')).toBeVisible();
    await page.click('text=Welcome Chat');
    
    // Type and send message
    await page.fill('input[placeholder="Ask anything about your resources..."]', 'Explain algorithms');
    await page.click('button[aria-label="Send message"]');
    
    // Validate sources card and message reply
    await expect(page.locator('text=This is a simulated browser E2E reply.')).toBeVisible();
    await expect(page.locator('span:has-text("Manual.pdf")')).toBeVisible();
  });
});
