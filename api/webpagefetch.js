const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');

async function fetchAndAnalyzeWebpage(url, userQuery) {
    let browser;
    try {
        // Launch the browser
        browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Navigate to the URL
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Get the HTML content
        const htmlContent = await page.content();

        // Take a screenshot
        const screenshot = await page.screenshot({ encoding: 'base64' });

        // Save the HTML content and screenshot to files
        fs.writeFileSync('page.html', htmlContent);
        fs.writeFileSync('screenshot.png', screenshot, 'base64');

        // Prepare data for the API request
        const data = {
            URL: url,
            UserQuery: userQuery,
            htmlContent: htmlContent,
            base64Capture: screenshot
        };

        // Send data to the API
        const response = await axios.post('https://maximagpt.vercel.app/api/analyze', data);

        return response.data;
    } catch (error) {
        console.error('Error fetching and analyzing the webpage:', error);
        throw new Error('Failed to fetch and analyze the webpage.');
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = fetchAndAnalyzeWebpage;
