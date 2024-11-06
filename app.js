// Celebrity data
const celebrityData = {
    name: "Sayyed Muzammil Thangal",
    title: "Frontend Lead & Flutter king",
    images: [
        {
            url: "images/1.JPG",
            caption: "Thangal"
        },
        {
            url: "images/3.jpeg",
            caption: "Thangal"
        },
         {
            url: "images/2.JPG",
            caption: "Thangal"
        },


    ]
};

// DOM Elements
const modal = document.getElementById('modal');
const joinButton = document.getElementById('joinButton');
const closeModal = document.getElementById('closeModal');
const joinForm = document.getElementById('joinForm');
const submitButton = document.getElementById('submitButton');
const fansGrid = document.getElementById('fansGrid');
const imageCollage = document.getElementById('imageCollage');
const celebrityName = document.getElementById('celebrityName');
const celebrityTitle = document.getElementById('celebrityTitle');

// Initialize the page
function initializePage() {
    celebrityName.textContent = celebrityData.name;
    celebrityTitle.textContent = celebrityData.title;
    loadImageCollage();
    loadFans();
}

// Load image collage
function loadImageCollage() {
    celebrityData.images.forEach(image => {
        const div = document.createElement('div');
        div.className = 'relative group overflow-hidden rounded-lg image-hover';
        div.innerHTML = `
            <img src="${image.url}" alt="${image.caption}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p class="text-white text-lg font-bold">${image.caption}</p>
            </div>
        `;
        imageCollage.appendChild(div);
    });
}

// Modal handlers
joinButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
});

closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
});

// Handle form submission
joinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('githubUsername').value;
    submitButton.disabled = true;
    submitButton.innerHTML = '<svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Joining...';

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();

        if (response.ok) {
            const fan = {
                // id: Date.now(),
                username: data.login,
                name: data.name || data.login,
                avatar_url: data.avatar_url,
                joined_at: new Date().toISOString()
            };
            // check fan already in the fan card list
            let fanCard = document.querySelectorAll('.fan-card');
            let fanCardList = [];
            fanCard.forEach((card) => {
                fanCardList.push(card.dataset.username);
            });
            console.log(fanCardList);
            if (fanCardList.includes(fan.username)) {
                showToast('Already joined the fan club', 'error');
                modal.classList.add('hidden');
                 submitButton.disabled = false;
                 submitButton.innerHTML = '<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>Join with GitHub';

                modal.classList.remove('flex');
                joinForm.reset();
                return;
            }
            fetch('https://app.nocodb.com/api/v2/tables/m6hpxhgguce2oxe/records', {
                  method: 'POST',
                  headers: {
                    'accept': 'application/json',
                    'xc-token': 'pgPHg3SVUupZ8NdP6NC3OAS9Zm_vzjOh8YzFdPmp',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(fan)
                })
              .then(response => response.json())
              .then(data => console.log(data))
              .catch(error => console.error('Error:', error));

            // Here you would typically send this data to your database
            // For demo, we'll just add it to the DOM
            addFanToGrid(fan);
            showToast('Successfully joined the fan club!', 'success');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            joinForm.reset();
        } else {
            showToast('GitHub user not found', 'error');
        }
    } catch (error) {
        showToast('Failed to join fan club', 'error');
    }

    submitButton.disabled = false;
    submitButton.innerHTML = '<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>Join with GitHub';
});

// Add fan to grid
function addFanToGrid(fan) {
    const fanCard = document.createElement('div');
    fanCard.className = 'fan-card bg-gray-900 rounded-xl p-6 flex items-center space-x-4';
    fanCard.dataset.username = fan.username;
    fanCard.innerHTML = `
        <img src="${fan.avatar_url}" alt="${fan.name}" class="w-16 h-16 rounded-full">
        <div>
            <h3 class="text-xl font-semibold">${fan.name}</h3>
            <p class="text-gray-400">@${fan.username}</p>
            <p class="text-sm text-gray-500">Joined ${new Date(fan.joined_at).toLocaleDateString()}</p>
        </div>
    `;
    fansGrid.insertBefore(fanCard, fansGrid.firstChild);
}

// Simple toast notification
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } animate-fade-in`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Load existing fans (mock data for demo)
function loadFans() {
   fetch('https://app.nocodb.com/api/v2/tables/m6hpxhgguce2oxe/records?viewId=vwy8wfgv46qf3fvp&limit=25&shuffle=0&offset=0', {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'xc-token': 'pgPHg3SVUupZ8NdP6NC3OAS9Zm_vzjOh8YzFdPmp'
  }
})
  .then(response => response.json())
  .then(data => {
    data.list.forEach(fan => {
        if(fan.username) { addFanToGrid(fan);}
    });
  })
  .catch(error => console.error('Error:', error));
}

// Initialize the page
initializePage();
