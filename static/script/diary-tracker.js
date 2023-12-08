// FUNCTIONS FOR THE EXERCISE FORM

/**
 * The `submitExerciseForm` function retrieves form data, sends it to the server using a POST request,
 * and logs the response data to the console.
 */
function submitExerciseForm() {
    // Get form data
    const exerciseFormData = {
        exerciseName: document.getElementById('exercise-name').value,
        sets: parseInt(document.getElementById('sets').value),
        repetitions: parseInt(document.getElementById('repetitions').value),
        weight: parseInt(document.getElementById('weight').value),
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        duration: parseInt(document.getElementById('duration').value)
    };

    // Send data to the server
    fetch('/submit_exercises_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(exerciseFormData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch((error) => {
        console.error(error);
    });
    event.preventDefault(); // if removed, the page reloads to url "srcdoc" (when using an action in the form). This causes issues when refreshing the page as it is not found.
    location.reload();
}

// Call the submitForm function when the form is submitted
document.getElementById('exercise-form').addEventListener('submit', submitExerciseForm);


/**
 * The function fetches exercise data from a server and displays it.
 */
async function fetchExercisesData() {
    try {
        const response = await fetch('/get_exercises_data');

        if (response.status !== 200) {
            console.error(`Failed to fetch data - Status: ${response.status}`);
        }

        const data = await response.json();

        displayExerciseData(data);
    } catch (error) {
        console.error(error);
    }
}


/**
 * The function `displayExerciseData` takes in an array of exercise data and dynamically creates HTML
 * elements to display the data, including a delete button for each entry.
 * @param data - The `data` parameter is an array of exercise objects. Each exercise object contains
 * properties such as `exerciseName`, `sets`, `repetitions`, `weight`, `date`, `time`, and `duration`.
 */
function displayExerciseData(data) {
    const exerciseListUl = document.getElementById('exercise-list');

    exerciseListUl.innerHTML = '';

    data.forEach(exercise => {
        const exerciseLi = document.createElement('li');
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerText = 'Delete Entry';

        // Associates each delete button with the corresponding entry's ID
        deleteButton.dataset.entryId = exercise.id;

        exerciseLi.innerHTML = `<h3>${exercise.exerciseName}</h3>
                                <p>Sets: ${exercise.sets}</p>
                                <p>Repetitions: ${exercise.repetitions}</p>
                                <p>Weight: ${exercise.weight || "no additional"} kg</p>
                                <p>Date: ${exercise.date}</p>
                                <p>Time: ${exercise.time}</p>
                                <p>Duration: ${exercise.duration} min</p>`;
        exerciseListUl.appendChild(exerciseLi);
        exerciseLi.appendChild(deleteButton);

        // Delete button eventlistener
        deleteButton.addEventListener('click', () => deleteEntry(exercise.id));
    });
}

// Loads the exercise data when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    await fetchExercisesData();
  });


/**
 * The `deleteEntry` function sends a request to the server to delete an exercise entry with the
 * specified `entryId`, and then fetches updated exercise data.
 * @param entryId - The entryId parameter is the unique identifier of the entry that needs to be
 * deleted. It is used to construct the URL for the delete request to the server.
 */
function deleteEntry(entryId) {
    // Sends a request to the server to delete the corresponding entry
    fetch(`/delete_exercise_entry/${entryId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        fetchExercisesData();
    })
    .catch((error) => {
        console.error(error);
    });
}



// FUNCTIONS FOR THE DIARY FORM

/**
 * The `submitDiaryForm` function sends a POST request to a server with data from a diary form, and
 * prevents the default form submission behavior.
 */
function submitDiaryForm() {
    const diaryFormData = {
        date: document.getElementById('diary-date').value,
        time: document.getElementById('diary-time').value,
        calories: parseInt(document.getElementById('diary-calories').value),
        entry: document.getElementById('diary-entry').value
    };

    fetch('/submit_diary_entries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(diaryFormData)
    })
/*     .then(response => response.json())
    .then(data => {
        console.log('Success: ', data);
    }) */
    .catch((error) => {
        console.error('Error: ', error);
    });
    event.preventDefault();
    location.reload();
}

// Call the submitForm function when the form is submitted
document.getElementById('diary-form').addEventListener('submit', submitDiaryForm);


/**
 * The function fetches diary entries from a server and displays them.
 */
async function fetchDiaryEntries() {
    try {
        const response = await fetch('/get_diary_entries');
              if (response.status !== 200) {
                console.error(`Failed to fetch data - Status: ${response.status}`);
            }
                  const data = await response.json();
                  displayDiaryEntries(data);
      } catch (error) {
      console.error('Error fetching data: ', error);
      }
  }


/**
 * The function `displayDiaryEntries` takes in an array of diary entries and dynamically creates HTML
 * elements to display each entry along with a delete button.
 * @param data - The `data` parameter is an array of objects representing diary entries. Each object in
 * the array should have the following properties: 'date', 'time', 'calories', 'entry'
 */
function displayDiaryEntries(data) {
    const diaryEntriesDiv = document.getElementById('diary-entries');

    diaryEntriesDiv.innerHTML = '';

    data.forEach(entry => {
        const diaryEntry = document.createElement('div');
        const entryPar = document.createElement('p');
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.id = 'delete-button-diary';
        deleteButton.innerText = 'Delete Entry';
        diaryEntry.className = 'diary-entry-container';

        deleteButton.dataset.entryId = entry.id;

        entryPar.innerHTML = `${entry.date} <br>
                              ${entry.time} <br>
                              Calories Burnt: ${entry.calories} <br><br>
                              ${entry.entry}`;
        
        diaryEntry.appendChild(entryPar);
        diaryEntry.appendChild(deleteButton);
        diaryEntriesDiv.appendChild(diaryEntry);

        deleteButton.addEventListener('click', () => deleteDiaryEntry(entry.id));
    });
}

    document.addEventListener('DOMContentLoaded', async () => {
      await fetchDiaryEntries();
    });


/**
 * The function `deleteDiaryEntry` sends a DELETE request to the server to delete a diary entry with
 * the specified entryId, and then fetches the updated list of diary entries.
 * @param entryId - The entryId parameter is the unique identifier of the diary entry that you want to delete.
 */
function deleteDiaryEntry(entryId) {

    fetch(`/delete_diary_entry/${entryId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success: ', data);
        fetchDiaryEntries();
    })
    .catch((error) => {
        console.error('Error: ', error);
    });
}
