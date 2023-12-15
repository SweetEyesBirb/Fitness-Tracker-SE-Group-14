/**
 * The function `updateToURLCode` fetches data from a specific URL and updates the image source and
 * name on the webpage based on the fetched data.
 */
async function updateToURLCode() {
    try {
        const urlParams = new URL(window.location.href);
        const uniqueCode = urlParams.pathname.split('/').pop();

        const response = await fetch(`/live-classes/live-class-data/${uniqueCode}`);

        if (!response.ok) {
            throw new Error(`Error Status: ${response.status}`);
        }

        const data = await response.json();

        document.getElementById('image').src = `../../static/images/live-classes-thumbnails/${data.image}`;
        document.getElementById('name').innerText = data.name;
    } catch (error) {
        console.error('Error fetching exercise data:', error);
    }
}

/**
 * The function `updateChat` fetches chat data from a server and updates the chat UI with the received
 * data.
 */
async function updateChat() {
    try {
        const response = await fetch('/live-classes/live-class-chat');
        const data = await response.json();
        const ulElement = document.getElementById('live-class-chat-ul');
        ulElement.innerHTML = '';
        data.chat.forEach(chatEntry => {
            const liElement = document.createElement('li');
            liElement.textContent = chatEntry;
            ulElement.appendChild(liElement);
        });
    } catch (error) {
        console.error('Error updating chat:', error);
    }
}

/**
 * The function updates the chat by sending a new chat entry to the server and then updating the chat
 * display.
 */
async function updateChatWithInput() {
    try {
        const chatInput = document.querySelector('#live-class-chat-box input');
        const newChatEntry = chatInput.value;

        await fetch('/live-classes/add-chat-entry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chatEntry: newChatEntry }),
        });

        await updateChat();

        chatInput.value = '';
    } catch (error) {
        console.error('Error updating chat with input:', error);
    }
}

document.querySelector('#live-class-chat-box input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        updateChatWithInput();
    }
});



updateChat();
updateToURLCode()