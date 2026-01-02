/**
 * Playwright Script to interact with Neno Technology AI Chatbot
 * This script navigates to the website, sends prompts to the chatbot,
 * collects responses, and exports everything to a CSV file.
 * 
 * Usage:
 *   1. Install dependencies: npm install playwright csv-writer
 *   2. Run: node nenotechnology-chatbot-scraper.js
 */

const { chromium } = require('playwright');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    websiteUrl: 'https://www.nenotechnology.com',
    outputCsvPath: './nenotechnology_chatbot_results.csv',
    waitTimeForResponse: 10000, // 10 seconds max wait for AI response
    delayBetweenPrompts: 2000, // 2 seconds between prompts
};

// List of prompts to send to the chatbot
// Modify this array with your desired prompts
const PROMPTS = [
    "What services does Neno Technology offer?",
    "Tell me about your AI solutions",
    "What industries do you work with?",
    "How can I contact Neno Technology?",
    "What is your pricing model?",
];

// Selectors for the chatbot elements
const SELECTORS = {
    chatbotToggleButton: 'button.fixed.bottom-6.right-6',
    inputField: 'input[placeholder*="Ask me anything"]',
    sendButton: 'button.bg-gradient-to-r.from-blue-600.to-purple-600',
    messagesContainer: 'div.flex-1.overflow-y-auto.p-4.space-y-4',
    botMessageContainer: 'div.flex.justify-start',
    botMessageText: 'div.bg-gray-800.text-gray-100',
    userMessageContainer: 'div.flex.justify-end',
};

/**
 * Wait for a new bot response after sending a message
 * @param {Object} page - Playwright page object
 * @param {number} previousMessageCount - Count of bot messages before sending
 * @returns {Promise<string>} - The bot's response text
 */
async function waitForBotResponse(page, previousMessageCount) {
    const startTime = Date.now();

    while (Date.now() - startTime < CONFIG.waitTimeForResponse) {
        // Get all bot messages
        const botMessages = await page.$$eval(
            `${SELECTORS.botMessageContainer} ${SELECTORS.botMessageText}`,
            (elements) => elements.map(el => el.textContent.trim())
        ).catch(() => []);

        // Check if a new message appeared
        if (botMessages.length > previousMessageCount) {
            // Return the latest message
            return botMessages[botMessages.length - 1];
        }

        // Check for error messages
        const errorMessage = await page.evaluate(() => {
            const errorEl = document.querySelector('[class*="error"], [class*="Error"]');
            return errorEl ? errorEl.textContent : null;
        }).catch(() => null);

        if (errorMessage) {
            return `Error: ${errorMessage}`;
        }

        // Wait a bit before checking again
        await page.waitForTimeout(500);
    }

    return 'No response received (timeout)';
}

/**
 * Get the current count of bot messages
 * @param {Object} page - Playwright page object
 * @returns {Promise<number>} - Count of bot messages
 */
async function getBotMessageCount(page) {
    try {
        const count = await page.$$eval(
            `${SELECTORS.botMessageContainer} ${SELECTORS.botMessageText}`,
            (elements) => elements.length
        );
        return count;
    } catch {
        return 0;
    }
}

/**
 * Send a prompt to the chatbot and get the response
 * @param {Object} page - Playwright page object
 * @param {string} prompt - The prompt to send
 * @returns {Promise<Object>} - Object containing prompt and response
 */
async function sendPromptAndGetResponse(page, prompt) {
    console.log(`\n📤 Sending prompt: "${prompt}"`);

    // Get current message count before sending
    const previousCount = await getBotMessageCount(page);

    // Clear input field and type the prompt
    const inputField = await page.$(SELECTORS.inputField);
    if (!inputField) {
        console.error('❌ Input field not found!');
        return { prompt, response: 'Error: Input field not found' };
    }

    await inputField.fill('');
    await inputField.fill(prompt);

    // Send the message (try clicking button, fallback to Enter key)
    try {
        const sendButton = await page.$(SELECTORS.sendButton);
        if (sendButton) {
            await sendButton.click();
        } else {
            await inputField.press('Enter');
        }
    } catch {
        await inputField.press('Enter');
    }

    // Wait for the response
    const response = await waitForBotResponse(page, previousCount);
    console.log(`📥 Response: "${response.substring(0, 100)}${response.length > 100 ? '...' : ''}"`);

    return {
        prompt,
        response,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Get page content/metadata
 * @param {Object} page - Playwright page object
 * @returns {Promise<Object>} - Page metadata
 */
async function getPageContent(page) {
    return await page.evaluate(() => {
        return {
            title: document.title,
            url: window.location.href,
            description: document.querySelector('meta[name="description"]')?.content || '',
            h1: Array.from(document.querySelectorAll('h1')).map(el => el.textContent.trim()).join('; '),
            h2: Array.from(document.querySelectorAll('h2')).map(el => el.textContent.trim()).join('; '),
        };
    });
}

/**
 * Main function to run the scraper
 */
async function main() {
    console.log('🚀 Starting Neno Technology Chatbot Scraper...\n');

    const browser = await chromium.launch({
        headless: false, // Set to true for production
        slowMo: 100, // Slow down actions for visibility
    });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
    });

    const page = await context.newPage();

    const results = [];

    try {
        // Navigate to the website
        console.log(`🌐 Navigating to ${CONFIG.websiteUrl}...`);
        await page.goto(CONFIG.websiteUrl, { waitUntil: 'networkidle' });

        // Get page content
        const pageContent = await getPageContent(page);
        console.log(`📄 Page Title: ${pageContent.title}`);

        // Wait for the page to fully load
        await page.waitForTimeout(2000);

        // Open the chatbot
        console.log('💬 Opening chatbot...');
        const chatButton = await page.$(SELECTORS.chatbotToggleButton);
        if (chatButton) {
            await chatButton.click();
            await page.waitForTimeout(1000); // Wait for chat to open
        } else {
            console.error('❌ Chatbot toggle button not found!');
            throw new Error('Chatbot button not found');
        }

        // Verify chatbot is open
        const inputField = await page.$(SELECTORS.inputField);
        if (!inputField) {
            console.error('❌ Chatbot input field not found!');
            throw new Error('Chatbot did not open properly');
        }

        console.log('✅ Chatbot opened successfully!\n');

        // Send each prompt and collect responses
        for (let i = 0; i < PROMPTS.length; i++) {
            const prompt = PROMPTS[i];
            console.log(`\n[${i + 1}/${PROMPTS.length}] Processing...`);

            const result = await sendPromptAndGetResponse(page, prompt);
            result.pageTitle = pageContent.title;
            result.pageUrl = pageContent.url;
            result.pageDescription = pageContent.description;

            results.push(result);

            // Wait between prompts
            if (i < PROMPTS.length - 1) {
                await page.waitForTimeout(CONFIG.delayBetweenPrompts);
            }
        }

        // Create CSV writer
        const csvWriter = createObjectCsvWriter({
            path: CONFIG.outputCsvPath,
            header: [
                { id: 'timestamp', title: 'Timestamp' },
                { id: 'pageTitle', title: 'Page Title' },
                { id: 'pageUrl', title: 'Page URL' },
                { id: 'pageDescription', title: 'Page Description' },
                { id: 'prompt', title: 'Prompt' },
                { id: 'response', title: 'Response' },
            ],
        });

        // Write results to CSV
        await csvWriter.writeRecords(results);
        console.log(`\n✅ Results saved to: ${path.resolve(CONFIG.outputCsvPath)}`);

        // Also save as JSON for reference
        const jsonPath = CONFIG.outputCsvPath.replace('.csv', '.json');
        fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
        console.log(`📁 JSON backup saved to: ${path.resolve(jsonPath)}`);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        // Close browser
        await browser.close();
        console.log('\n🏁 Script completed!');
    }

    return results;
}

// Run the script
main().catch(console.error);
