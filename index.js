// Import the required libraries
import { createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { load } from 'cheerio';
import request from 'request';

// Define the URL to scrape
const url = 'https://memegen-link-examples-upleveled.netlify.app/';

// Define the directory to save the images
const dir = './memes';

// Check if the directory exists, and create it if it doesn't
if (!existsSync(dir)) {
  mkdirSync(dir);
}

// Make a request to the URL
request(url, function (error, response, body) {
  // Check for errors and status code 200
  if (!error && response.statusCode === 200) {
    // Load the HTML into Cheerio
    const $ = load(body);
    // Find all image tags
    $('img').each(function (i, element) {
      // Only download the first 10 images
      if (i < 10) {
        // Get the image URL and filename
        const imageUrl = $(element).attr('src');
        const filename = ('0' + (i + 1)).slice(-2) + '.jpg';
        const filepath = `${dir}/${filename}`;
        // Download and save the image
        request(imageUrl).pipe(createWriteStream(filepath));
      }
    });
  } else {
    console.error(`Error requesting ${url}: ${error}`);
  }
});
