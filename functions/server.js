const fs = require('fs'); // Importing the 'fs' module
const cheerio = require('cheerio');



exports.handler = async (event) => {
    const { role } = event.queryStringParameters; // Get role from query
    if (!role) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Role is required' }),
        };
    }

    const localFilePath = './public/mock_profiles.html'; // Change this path as needed
    const profiles = scrapeProfiles(role, localFilePath); // Pass the file path to the function
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

        // Scraping logic to find profiles based on the title
        $('.simple-card').each((i, element) => {
            const title = $(element).find('.simple-text').text().trim(); // Get the title directly
            if (title.toLowerCase().includes(role.toLowerCase())) { // Check if title matches the role
                const name = $(element).find('.simple-heading').text().trim(); // Get the name directly

                profiles.push({ name, title }); // Push the extracted name and title to the profiles array
            }
        });

        return profiles;
    } catch (error) {
        console.error('Error scraping:', error);
        return [];
    }
};

// API endpoint to trigger profile scraping
app.get('/api/scrape', async (req, res) => {
    const { role } = req.query; // Get role from query
    if (!role) {
        return res.status(400).json({ error: 'Role is required' });
    }

    const profiles = scrapeProfiles(role); // Call the modified function
    if (profiles.length > 0) {
        res.json(profiles);
    } else {
        res.status(404).json({ error: 'No profiles found for the specified role' });
    }
});

app.listen(5001, () => {
    console.log('Server is running on http://localhost:5001');
});
