/**
 * The function fetches news data from a server endpoint and returns the headlines as an array, or an
 * empty array if there is an error.
 * @returns an array of headlines from the fetched news data. If there is an error during the fetch
 * request or parsing the response, an empty array will be returned.
 */
async function fetchNewsData() {
    try {
        const response = await fetch('/news-data');
        const data = await response.json();
        return data.headlines || [];
    } catch (error) {
        console.error('Error fetching news data:', error);
        return [];
    }
}


/**
 * The function `displayNewsHeadlines` fetches news data, creates HTML elements for each news headline,
 * and appends them to a container element on the webpage.
 */
async function displayNewsHeadlines() {
    try {
        const newsData = await fetchNewsData();
        const newsContainer = document.getElementById('news-main-headings');

        newsContainer.innerHTML = '';

        newsData.forEach((headline, index) => {
            const container = document.createElement('div');
            container.classList.add('news-headline-container');

            const image = document.createElement('img');
            image.classList.add('headline-image');
            image.src = "static/images/news-images/" + headline.image;

            const textContainer = document.createElement('div');
            textContainer.classList.add('headline-text-container');

            const title = document.createElement('span');
            title.classList.add('headline-title');
            title.textContent = headline.headline;

            const preview = document.createElement('span');
            preview.classList.add('headline-preview');
            preview.textContent = headline.story;

            textContainer.appendChild(title);
            textContainer.appendChild(preview);

            container.appendChild(image);
            container.appendChild(textContainer);

            newsContainer.appendChild(container);
        });
    } catch (error) {
        console.error('Error displaying news headlines:', error);
    }
}


displayNewsHeadlines();
