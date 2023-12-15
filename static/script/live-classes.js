/**
 * The function fetches live stream data from a server and returns it as an object with names, images,
 * and codes properties, or an empty object if there is an error.
 * @returns The function fetchLiveStreamData() returns a promise that resolves to an object with three
 * properties: names, images, and codes. If there is an error during the fetch request or parsing the
 * response, it returns an object with empty arrays for names, images, and codes.
 */
async function fetchLiveStreamData() {
  try {
      const response = await fetch('/live-classes-data');
      const data = await response.json();
      return data || { names: [], images: [], codes: [] };
  } catch (error) {
      console.error('Error fetching live stream data:', error);
      return { names: [], images: [], codes: []  };
  }
}

/**
 * The function creates a live stream card element with a name, image, and code.
 * @param name - The name of the live stream.
 * @param image - The `image` parameter is the name or path of the image file that will be displayed as
 * the thumbnail for the live stream.
 * @param code - The `code` parameter is a unique identifier for the live stream. It is used to
 * generate the URL for the live stream card.
 * @returns a dynamically created HTML anchor element (a) with a thumbnail image and a title.
 */
function createLiveStreamCard(name, image, code) {
  const card = document.createElement("a");
  card.style = "text-decoration: none; color: black;";
  card.className = "live-stream-card";
  card.href = "/live-classes/live-class/" + code;

  const img = document.createElement("img");
  img.src = image ? `static/images/live-classes-thumbnails/${image}` : "path/to/default/image.jpg";
  img.alt = "Stream Thumbnail";

  const title = document.createElement("h3");
  title.textContent = name;

  card.appendChild(img);
  card.appendChild(title);

  return card;
}

/**
 * The function shuffles the elements of an array randomly.
 * @param array - The `array` parameter is an array of elements that you want to shuffle.
 * @returns The function `shuffleArray` returns the shuffled array.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * The function `populateLiveStreams` asynchronously populates a list of live stream cards with data
 * fetched from an API.
 * @param categoryId - The `categoryId` parameter is the id of the HTML element where the live stream
 * cards will be populated.
 */
async function populateLiveStreams(categoryId) {
  const categoryList = document.getElementById(categoryId);
  const { names, images, codes } = await fetchLiveStreamData();
  const cardsData = names.map((name, index) => ({ name, image: images[index], code: codes[index] }));
  const shuffledCardsData = shuffleArray(cardsData);
  shuffledCardsData.forEach(data => {
      const li = document.createElement("li");
      const card = createLiveStreamCard(data.name, data.image, data.code);

      li.appendChild(card);
      categoryList.appendChild(li);
  });
}


populateLiveStreams("category-one-list");
populateLiveStreams("category-two-list");
populateLiveStreams("category-three-list");
