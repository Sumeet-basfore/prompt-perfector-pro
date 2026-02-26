import { chromium } from 'playwright';
(async () => {
try {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:8082');
  
  // Clear local storage
  await page.evaluate(() => localStorage.removeItem('vibe_prompt_onboarding'));
  await page.reload();
  
  await page.waitForTimeout(1000);
  
  // Type in textarea
  await page.fill('textarea#prompt-input', 'Testing tooltips');
  await page.waitForTimeout(500); 

  // Look for tooltip
  let tooltipHtml = await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll('div'));
    const possible = allDivs.find(d => d.textContent && d.textContent.includes('Ready to perfect it'));
    if (possible) return possible.outerHTML;
    
    const byClass = document.querySelector('.bg-primary\\/95');
    if (byClass) return byClass.outerHTML;

    return 'Not found T1';
  });
  
  console.log("TOOLTIP 1 HTML:", tooltipHtml.slice(0, 500));
  
  // Dispatch event for second tooltip
  await page.evaluate(() => window.dispatchEvent(new Event('vibe-prompt:success')));
  await page.waitForTimeout(600);
  
  let tooltip2Html = await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll('div'));
    const possible = allDivs.find(d => d.textContent && d.textContent.includes('Saved Automatically'));
    if (possible) return possible.outerHTML;
    return 'Not found T2';
  });
  
  console.log("TOOLTIP 2 HTML:", tooltip2Html.slice(0, 500));

  await browser.close();
} catch (e) {
  console.error("SCRIPT ERROR:", e);
}
})();
