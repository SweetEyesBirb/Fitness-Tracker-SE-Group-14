
// FUNCTIONS FOR THE EXERCISE FORM
function submitExerciseForm() {
    // Get form data
    const formData = {
        exerciseName: document.getElementById('exercise-name').value,
        sets: parseInt(document.getElementById('sets').value),
        repetitions: parseInt(document.getElementById('repetitions').value),
        weight: parseInt(document.getElementById('weight').value),
        date: document.getElementById('date').value,
        time: document.getElementById('time').value
    };

    // Send data to the server
    fetch('/submit_exercises_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // You can handle success actions here
    })
    .catch((error) => {
        console.error('Error:', error);
        // You can handle error actions here
    });
  event.preventDefault();
}

// Call the submitForm function when the form is submitted
document.getElementById('exercise-form').addEventListener('submit', submitExerciseForm);


// Function to fetch and display data
async function fetchExercisesData() {
    try {
        const response = await fetch('/get_exercises_data');

        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        const data = await response.json();

        // Call function to display data
        displayData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Updated displayData function
function displayData(data) {
    const exerciseListUl = document.getElementById('exercise-list');

    // Clear existing content
    exerciseListUl.innerHTML = '';

    // Iterate through the data and create list elements to display it
    data.forEach(exercise => {
        const exerciseLi = document.createElement('li');
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerText = 'Delete Entry';

        // Associate each delete button with the corresponding entry's ID
        deleteButton.dataset.entryId = exercise.id;

        exerciseLi.innerHTML = `<h3>${exercise.exerciseName}</h3>
                                <p>Sets: ${exercise.sets}</p>
                                <p>Repetitions: ${exercise.repetitions}</p>
                                <p>Weight: ${exercise.weight}kg</p>
                                <p>Date: ${exercise.date}</p>
                                <p>Time: ${exercise.time}</p>`;
        exerciseListUl.appendChild(exerciseLi);
        exerciseLi.appendChild(deleteButton);

        // Attach the delete function to the delete button
        deleteButton.addEventListener('click', () => deleteEntry(exercise.id));
    });
}


// Event listener with an anonymous async function
document.addEventListener('DOMContentLoaded', async () => {
    await fetchExercisesData();
  });

// New function to handle exercise entry deletion
function deleteEntry(entryId) {
    // Send a request to the server to delete the corresponding entry
    fetch(`/delete_exercise_entry/${entryId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Update the displayed data after deletion
        fetchExercisesData();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}



// FUNCTIONS FOR THE DIARY FORM
function submitDiaryForm() {
    // Get form data
    const diaryFormData = {
        entry: document.getElementById('diary-entry').value
    };
      // Send data to the server
    fetch('/submit_diary_entries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(diaryFormData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
  event.preventDefault();
}

// Call the submitForm function when the form is submitted
document.getElementById('diary-form').addEventListener('submit', submitDiaryForm);

// Function to fetch and display diary entries data
async function fetchDiaryEntries() {
    try {
        const response = await fetch('/get_diary_entries');
              if (!response.ok) {
                throw new Error(`Failed to fetch data. Status: ${response.status}`);
            }
                  const data = await response.json();
                  // Call function to display data
                  displayDiaryEntries(data);
      } catch (error) {
      console.error('Error fetching data:', error);
      }
  }

// Updated displayDiaryEntries function
function displayDiaryEntries(data) {
    const diaryEntriesDiv = document.getElementById('diary-entries');

    // Clear existing content
    diaryEntriesDiv.innerHTML = '';

    // Iterate through the data and create list elements to display it
    data.forEach(entry => {
        const entryPar = document.createElement('p');
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerText = 'Delete Entry';

        // Associate each delete button with the corresponding entry's ID
        deleteButton.dataset.entryId = entry.id;

        entryPar.innerHTML = `${entry.entry}`;
        diaryEntriesDiv.appendChild(entryPar);
        diaryEntriesDiv.appendChild(deleteButton);

        // Attach the delete function to the delete button
        deleteButton.addEventListener('click', () => deleteDiaryEntry(entry.id));
    });
}

    // Event listener with an anonymous async function
    document.addEventListener('DOMContentLoaded', async () => {
      await fetchDiaryEntries();
    });

// New function to handle diary entry deletion
function deleteDiaryEntry(entryId) {
    // Send a request to the server to delete the corresponding entry
    fetch(`/delete_diary_entry/${entryId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Update the displayed data after deletion
        fetchDiaryEntries();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
