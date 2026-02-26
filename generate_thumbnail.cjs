const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;600&display=swap');

    body, html {
      margin: 0;
      padding: 0;
      width: 1270px;
      height: 760px;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
      background: radial-gradient(circle at 50% 120%, rgba(124, 58, 237, 0.08) 0%, rgba(255, 255, 255, 1) 60%);
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      position: relative;
      z-index: 10;
    }

    h1 {
      font-size: 110px;
      font-weight: 800;
      letter-spacing: -4px;
      color: #111827;
      margin: 0 0 16px 0;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    h1 span.brand {
      background: linear-gradient(135deg, #7C3AED 0%, #F59E0B 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    h2 {
      font-size: 38px;
      font-weight: 400;
      color: #4B5563;
      margin: 0 0 80px 0;
      letter-spacing: -0.5px;
    }

    .metaphor {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 40px;
      width: 100%;
    }

    .box {
      width: 380px;
      height: 240px;
      border-radius: 24px;
      padding: 32px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05);
      position: relative;
    }

    .box-left {
      background: #F9FAFB;
      border: 2px dashed #D1D5DB;
      font-family: 'Caveat', cursive;
      font-size: 36px;
      color: #6B7280;
      line-height: 1.2;
      box-shadow: none;
    }

    .box-right {
      background: white;
      border: 2px solid rgba(124, 58, 237, 0.2);
      box-shadow: 0 24px 48px -12px rgba(124, 58, 237, 0.15);
      font-family: 'JetBrains Mono', monospace;
    }

    .magic-wand {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #FFFBEB;
      color: #F59E0B;
      box-shadow: 0 0 40px rgba(245, 158, 11, 0.3);
      position: relative;
    }

    .magic-wand svg {
      width: 40px;
      height: 40px;
    }

    /* Decoration inside right box */
    .struct-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #E5E7EB;
    }
    .dot { width: 12px; height: 12px; border-radius: 50%; }
    .dot.r { background: #FCA5A5; }
    .dot.y { background: #FDE047; }
    .dot.g { background: #86EFAC; }

    .struct-line {
      height: 12px;
      border-radius: 6px;
      background: #E5E7EB;
      margin-bottom: 16px;
    }
    .struct-line:nth-child(2) { width: 80%; background: rgba(124, 58, 237, 0.2); }
    .struct-line:nth-child(3) { width: 60%; }
    .struct-line:nth-child(4) { width: 90%; }
    .struct-line:nth-child(5) { width: 40%; background: rgba(245, 158, 11, 0.2); }

    /* Floating blobs for warmth */
    .blob {
      position: absolute;
      filter: blur(80px);
      z-index: 1;
      opacity: 0.15;
      border-radius: 50%;
    }
    .blob-1 {
      width: 600px;
      height: 600px;
      background: #7C3AED;
      top: -200px;
      left: -100px;
    }
    .blob-2 {
      width: 400px;
      height: 400px;
      background: #F59E0B;
      bottom: -100px;
      right: -50px;
    }
  </style>
</head>
<body>
  <div class="blob blob-1"></div>
  <div class="blob blob-2"></div>

  <div class="container">
    <h1>
      Vibe<span class="brand">Prompt</span>
    </h1>
    <h2>Plain English in. Perfect AI prompts out.</h2>

    <div class="metaphor">
      <div class="box box-left">
        <span style="margin-top:20px;">"make a dashboard with<br>some charts and a<br>sidebar pls..."</span>
      </div>

      <div class="magic-wand">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/>
          <path d="m14 7 3 3"/>
          <path d="M5 6v4"/>
          <path d="M19 14v4"/>
          <path d="M10 2v2"/>
          <path d="M7 8H3"/>
          <path d="M21 16h-4"/>
          <path d="M11 3H9"/>
        </svg>
      </div>

      <div class="box box-right">
        <div class="struct-header">
          <div class="dot r"></div><div class="dot y"></div><div class="dot g"></div>
          <span style="margin-left:8px;font-size:12px;color:#9CA3AF;">prompt.json</span>
        </div>
        <div class="struct-line"></div>
        <div class="struct-line"></div>
        <div class="struct-line"></div>
        <div class="struct-line"></div>
      </div>
    </div>
  </div>
</body>
</html>
`;

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: 'new'
  });
  const page = await browser.newPage();

  // Set viewport to Product Hunt standard
  await page.setViewport({ width: 1270, height: 760, deviceScaleFactor: 2 });

  // Set content and wait for web fonts to load
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Also explicitly wait a bit extra to ensure fonts are fully rendered
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 1000));

  // Define output path in the user's root dir
  const outputPath = path.resolve(process.cwd(), 'thumbnail.png');

  await page.screenshot({ path: outputPath });

  await browser.close();
  console.log('Thumbnail successfully saved to:', outputPath);
})();
