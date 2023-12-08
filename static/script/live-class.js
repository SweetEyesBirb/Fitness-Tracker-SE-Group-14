
async function updateToURLCode(){
    const urlParams = new URL(window.location.href);
    const uniqueCode = urlParams.pathname.split('/').pop();

    fetch(`/live-classes/live-class-data/${uniqueCode}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('image').src = "../../static/images/live-classes-thumbnails/" + data.image;
            document.getElementById('name').innerText = data.name;
        })
        .catch(error => {
            console.error('Error fetching exercise data:', error);
        });
}

updateToURLCode()