async function fetchLiveStreamData() {
  try {
      const response = await fetch('/live-classes-data');
      const data = await response.json();
      return data || { names: [], images: [] };
  } catch (error) {
      console.error('Error fetching live stream data:', error);
      return { names: [], images: [] };
  }
}

function createLiveStreamCard(name, image) {
  const card = document.createElement("div");
  card.className = "live-stream-card";

  const img = document.createElement("img");
  img.src = image ? `static/images/live-classes-thumbnails/${image}` : "path/to/default/image.jpg";
  img.alt = "Stream Thumbnail";

  const title = document.createElement("h3");
  title.textContent = name;

  card.appendChild(img);
  card.appendChild(title);

  return card;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function populateLiveStreams(categoryId) {
  const categoryList = document.getElementById(categoryId);
  const { names, images } = await fetchLiveStreamData();
  const cardsData = names.map((name, index) => ({ name, image: images[index] }));
  const shuffledCardsData = shuffleArray(cardsData);
  shuffledCardsData.forEach(data => {
      const li = document.createElement("li");
      const card = createLiveStreamCard(data.name, data.image);

      li.appendChild(card);
      categoryList.appendChild(li);
  });
}


populateLiveStreams("category-one-list");
populateLiveStreams("category-two-list");
populateLiveStreams("category-three-list");
