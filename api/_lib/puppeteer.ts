import { launch, Page } from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';
let _page: Page | null;

async function getPage() {
    if (_page) return _page;
    const options = { 
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless
    };
    const browser = await launch(options);
    _page = await browser.newPage();
    return _page;
}

export async function getScreenshot(url, width, height, dontAddStyle, waitFor) {
    const page = await getPage();
    await page.goto(url);
    await page.setViewport({ width: Number(width) || 1280, height: Number(height) || 720 });
    if (!dontAddStyle) await page.addStyleTag({ content: `
@import url('https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
body, div {
    font-family: 'Albert Sans', sans-serif;
}
html, body {
    background-image: none!important;
    background-color: none!important;
    background: none!important;
}
.graph_instruction, .check, #check_answer_button, #sharing_box, #feedback_box, .footer_desktop, .footer_div, #inline_choices, div.push, .oops_title, .footer_inner_table, #native_ad_div {
    display: none!important;
}
#steps_div {
    border-radius: 12px;
    box-shadow: none;
    border: 3px solid #2ecc71;
}
.banner_ad {
  filter: opacity(0%);
}
div.done::after {
    content: '!';
}
    ` });
    if (waitFor) await page.waitForFunction('window.AssembleScrapbookCardView__Ready == true');
    const file = await page.screenshot({ fullPage: true, omitBackground: true });
    return file;
}
