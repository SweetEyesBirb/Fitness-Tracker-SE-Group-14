/**
 * The function `pageLoadCards` fetches exercise data from the server and dynamically creates HTML
 * elements to display the exercise information on a web page.
 */
async function pageLoadCards(){
  fetch('/exercise-data')
      .then(response => response.json())
      .then(data => {
          const container = document.getElementById('exercise-main-card-container');

          for (let i = 0; i < data.names.length; i++) {
              const exerciseCard = document.createElement('a');
              exerciseCard.style = "text-decoration: none; color: black;";
              exerciseCard.href = "/exercise/exercise-specific/" + data.codes[i];                
              exerciseCard.className = 'exercise-card';

              const exerciseCardImage = document.createElement('div');
              exerciseCardImage.className = 'exercise-card-image';
              const image = document.createElement('img');
              image.src = "static/images/exercise-images/" + data.images[i];
              image.alt = 'Exercise Image';
              exerciseCardImage.appendChild(image);

              const exerciseCardInfo = document.createElement('div');
              exerciseCardInfo.className = 'exercise-card-info';

              const exerciseCardInfoBoxes = document.createElement('div');
              exerciseCardInfoBoxes.className = 'exercise-card-info-boxes';

              const infoBox1 = document.createElement('h3');
              infoBox1.textContent = data.durations[i] + " Minutes";

              const infoBox2 = document.createElement('h3');
              infoBox2.textContent = "Intensity: " + data.intensities[i];

              exerciseCardInfoBoxes.appendChild(infoBox1);
              exerciseCardInfoBoxes.appendChild(infoBox2);

              const exerciseCardDescription = document.createElement('p');
              exerciseCardDescription.className = 'exercise-card-info-description';
              exerciseCardDescription.textContent = data.descriptions[i];

              exerciseCardInfo.appendChild(exerciseCardInfoBoxes);
              exerciseCardInfo.appendChild(exerciseCardDescription);

              exerciseCard.appendChild(exerciseCardImage);
              exerciseCard.appendChild(exerciseCardInfo);

              container.appendChild(exerciseCard);
          }
      })
      .catch(error => console.error('Error fetching exercise data:', error));
}

pageLoadCards();