const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');

const MAX_CONTENT_SIZE = 10485760; // 10MB

async function fetchAndAnalyzeWebpage(url, userQuery) {
    let browser;
    try {
        // Validate URL format
        if (!url.match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)) {
            throw new Error('The URL provided is invalid. Please provide a valid URL starting with http:// or https://');
        }

        // Launch the browser
        browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Navigate to the URL
        try {
            await page.goto(url, { waitUntil: 'networkidle2' });
        } catch (error) {
            throw new Error('The URL provided is either non-existent or inaccessible. Please check the URL and try again.');
        }

        // Get the HTML content
        const htmlContent = await page.content();

        // Check for large content
        if (htmlContent.length > MAX_CONTENT_SIZE) {
            throw new Error('The page content is too large to process. Please choose a smaller webpage.');
        }

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

        // Validate API request body
        if (!data.URL || !data.UserQuery || !data.htmlContent || !data.base64Capture) {
            throw new Error('Invalid API request body. Ensure all fields are included.');
        }

        // Send data to the API
        try {
            const response = await axios.post('https://maximagpt.vercel.app/api/analyze', data);
            return response.data;
        } catch (error) {
            throw new Error('The analysis API service is currently unavailable. Please try again later.');
        }
    } catch (error) {
        console.error('Error fetching and analyzing the webpage:', error.message);
        throw new Error('Failed to fetch and analyze the webpage.');
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = fetchAndAnalyzeWebpage;
