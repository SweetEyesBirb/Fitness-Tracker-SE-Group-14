
async function updateToURLCode(){
    const urlParams = new URL(window.location.href);
    const uniqueCode = urlParams.pathname.split('/').pop();

    fetch(`/exercise/exercise-specific-data/${uniqueCode}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('image').src = "../../static/images/exercise-images/" + data.image;
            document.getElementById('name').innerText = data.name;
            document.getElementById('description').innerText = data.description;
            document.getElementById('intensity').innerText = data.intensity;
            document.getElementById('duration').innerText = data.duration;
        })
        .catch(error => {
            console.error('Error fetching exercise data:', error);
        });
}

updateToURLCode()