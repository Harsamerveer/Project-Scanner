const fs = require('fs');
const cheerio = require('cheerio');

// Handler function for Netlify
exports.handler = async (event) => {
    console.log('Function triggered');
    const { role } = event.queryStringParameters; // Get role from query
    if (!role) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Role is required' }),
        };
    }

    const localFilePath = '../public/mock_profiles.html';    
    const profiles = scrapeProfiles(role, localFilePath); // Call the scraping function

    console.log(profiles.length);

    if (profiles.length > 0) {
        return {
            statusCode: 200,
            body: JSON.stringify(profiles),
        };
    } else {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'No profiles found for the specified role' }),
        };
    }
};

const scrapeProfiles = (role, localFilePath) => {
    try {
        const data = fs.readFileSync(localFilePath, 'utf-8'); // Read the local HTML file
        const $ = cheerio.load(data);
        const profiles = [];

        // Scraping logic
        $('.simple-card').each((i, element) => {
            const title = $(element).find('.simple-text').text().trim();
            if (title.toLowerCase().includes(role.toLowerCase())) {
                const name = $(element).find('.simple-heading').text().trim();
                profiles.push({ name, title });
            }
        });

        return profiles;
    } catch (error) {
        console.error('Error scraping:', error);
        return [];
    }
};
