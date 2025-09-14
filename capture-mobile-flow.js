const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function captureMobileFlow() {
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 375,
      height: 812,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 3
    }
  });

  const page = await browser.newPage();

  // Set mobile user agent
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1');

  try {
    // Navigate to the app
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    // 1. Login screen
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '01-mobile-login.png') });

    // Login
    await page.type('input[type="email"]', 'test@example.com');
    await page.type('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    // 2. Dashboard
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '02-mobile-dashboard.png') });

    // Go to study mode
    await page.click('button:has-text("Study")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '03-mobile-study-nav.png') });

    // 3. Topic selector
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '04-mobile-topic-selector.png') });

    // Select topics
    await page.click('input[value="entrepreneurship"]');
    await page.click('input[value="hospitality-tourism"]');
    await page.click('button:has-text("Start Study Session")');

    // 4. Study session - initial question
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '05-mobile-study-question.png') });

    // Answer a question
    await page.click('button:nth-child(1)'); // Click first answer
    await page.waitForTimeout(1000);

    // 5. Study session - after answering
    await page.screenshot({ path: path.join(screenshotsDir, '06-mobile-study-answered.png') });

    // 6. Study session - with explanation
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '07-mobile-study-explanation.png') });

    // 7. Try to quit to see quit modal
    await page.click('button:has-text("Quit")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '08-mobile-quit-modal.png') });

    console.log('Screenshots captured successfully!');

  } catch (error) {
    console.error('Error capturing screenshots:', error);
  } finally {
    await browser.close();
  }
}

captureMobileFlow();