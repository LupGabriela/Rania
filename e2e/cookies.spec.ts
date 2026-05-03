import { test, expect } from '@playwright/test';

test.describe('User Activity & Cookie Monitoring System', () => {

  test('should track session start, page visits, and view count', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    let cookies = await context.cookies();

    // Session start cookie
    const sessionStartCookie = cookies.find(c => c.name === 'rania_session_start');
    expect(sessionStartCookie, 'Session cookie should exist').toBeDefined();

    // Last page cookie — decode it before comparing
    const lastPageCookie = cookies.find(c => c.name === 'rania_last_page');
    expect(lastPageCookie).toBeDefined();
    expect(decodeURIComponent(lastPageCookie!.value)).toBe('/');

    // Navigate to another page
    await page.goto('/catalogue');
    await page.waitForLoadState('networkidle');

    cookies = await context.cookies();

    // View count should be at least 2
    const viewCountCookie = cookies.find(c => c.name === 'rania_page_view_count');
    expect(Number(viewCountCookie?.value)).toBeGreaterThanOrEqual(2);

    // Last page should now be /catalogue
    const lastPageAfter = cookies.find(c => c.name === 'rania_last_page');
    expect(decodeURIComponent(lastPageAfter!.value)).toBe('/catalogue');
  });

  test('should update last_dress_id when visiting a dress detail', async ({ page, context }) => {
    await page.goto('/dress-manager/1');
    await page.waitForLoadState('networkidle');

    const cookies = await context.cookies();
    const lastDress = cookies.find(c => c.name === 'rania_last_dress_id');
    expect(lastDress).toBeDefined();
    expect(lastDress!.value).toBe('1');
  });

  test('should store visited pages history as valid JSON', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.goto('/dress-manager');
    await page.waitForLoadState('networkidle');

    const cookies = await context.cookies();
    const visitedRaw = cookies.find(c => c.name === 'rania_visited_pages');
    expect(visitedRaw).toBeDefined();

    const visited = JSON.parse(decodeURIComponent(visitedRaw!.value));
    expect(Array.isArray(visited)).toBe(true);
    expect(visited.length).toBeGreaterThanOrEqual(2);
    expect(visited.some((v: any) => v.path === '/')).toBe(true);
    expect(visited.some((v: any) => v.path === '/dress-manager')).toBe(true);
  });

  test('should clear cookies successfully', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    let cookies = await context.cookies();
    expect(cookies.length).toBeGreaterThan(0);

    // Clear all RANIA cookies via browser
    await page.evaluate(() => {
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, 
          "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    });

    cookies = await context.cookies();
    const raniaCookies = cookies.filter(c => c.name.startsWith('rania_'));
    expect(raniaCookies.length).toBe(0);
  });
});