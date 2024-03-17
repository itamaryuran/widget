// We're working on a widget that displays recommendations from Taboola's API, 
// within a larger application. However, fetching data directly from this 
// service while developing locally poses a challenge due to CORS restrictions, which prevent 
// cross-origin requests. To overcome this, we utilize CORS Anywhere, 
// a tool that acts as a proxy server. By running a local instance of CORS Anywhere, 
// we can bypass CORS restrictions during development. This proxy server fetches data from the 
// external service on behalf of our widget, allowing it to retrieve recommendations without encountering CORS errors. 
// We start the local server by running the CORS Anywhere script in our terminal,  using the command node server.js 
// inside the cors-anywhere dir. Once the server is up and running, our widget can communicate 
// with it via http://localhost:8080, or the specified host and port, to fetch recommendations seamlessly.




const API_BASE_URL = 'http://api.taboola.com/1.0/json/taboola-templates/recommendations.get';
const PUBLISHER_ID = 'taboola-templates';
const APP_TYPE = 'desktop';
const API_KEY = 'f9040ab1b9c802857aa783c469d0e0ff7e7366e4';
const SOURCE_ID = '214321562187'; 
const RECOMMENDATION_COUNT = 30; // Number of recommendations to fetch

const PROXY_SERVER_URL = 'http://localhost:8080'; // local proxy server 

async function fetchRecommendations() {
    const apiUrl = `${PROXY_SERVER_URL}/${API_BASE_URL}?publisher=${PUBLISHER_ID}&app.type=${APP_TYPE}&app.apikey=${API_KEY}&source.id=${SOURCE_ID}&source.type=video&rec.count=${RECOMMENDATION_COUNT}`;

    console.log('Fetching recommendations from:', apiUrl);

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch recommendations: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Recommendations JSON:', data);
        return data;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return null; // Return null or handle the error in another way
    }
}


function renderRecommendations(recommendations) {
    const widgetContainer = document.getElementById('widget-container');

    for (const recommendation of recommendations) {
        // Check if the recommendation has a valid thumbnail array with at least one URL
        if (recommendation.thumbnail && recommendation.thumbnail.length > 0 && recommendation.thumbnail[0].url) {
            const thumbnailUrl = recommendation.thumbnail[0].url;
            // Check if the thumbnail URL is valid by making a request to it
            fetch(thumbnailUrl, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        // If the response is successful, create the widget
                        const widget = createWidget(recommendation);
                        widgetContainer.appendChild(widget);
                    } else {
                        console.log(`Skipping recommendation "${recommendation.name}": Invalid or missing thumbnail URL`);
                    }
                })
                .catch(error => {
                    console.error(`Error fetching thumbnail for recommendation "${recommendation.name}":`, error);
                });
        } else {
            console.log(`Skipping recommendation "${recommendation.name}": Invalid or missing thumbnail URL`);
        }
    }
}



// Function to create a widget for each recommendation
function createWidget(recommendation) {
    const widgetContainer = document.createElement('div');
    widgetContainer.classList.add('widget');

    const image = document.createElement('img');
    image.src = recommendation.thumbnail[0].url;
    image.alt = recommendation.name;
    widgetContainer.appendChild(image);

    const description = document.createElement('p');
    description.textContent = recommendation.description;
    widgetContainer.appendChild(description);

    const readMoreButton = document.createElement('button');
    readMoreButton.textContent = 'Read More';
    readMoreButton.addEventListener('click', () => {
        openArticle(recommendation.url, recommendation.origin);
    });
    widgetContainer.appendChild(readMoreButton);

    return widgetContainer;
}

function openArticle(url, origin) {
    if (origin === 'organic') {
        window.location.href = url; // Open organic articles in the same tab
    } else if (origin === 'sponsored') {
        window.open(url, '_blank'); // Open sponsored articles in a new tab
    }
}

async function main() {
    try {
        const recommendations = await fetchRecommendations();
        if (recommendations) {
            renderRecommendations(recommendations.list);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

document.addEventListener('DOMContentLoaded', main);

module.exports = { fetchRecommendations, createWidget };
