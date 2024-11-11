let events = []; // Declare a global variable to store the events

// Function to fetch events from the backend
async function fetchEvents() {
    try {
        const response = await fetch('http://localhost:8080/api/events');
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        events = await response.json(); // Store the fetched events in the global variable
        displayEvents(events);
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

// Function to display events
function displayEvents(eventsToDisplay) {
    const eventCardsContainer = document.getElementById('eventCardsContainer');
    eventCardsContainer.innerHTML = ''; // Clear existing event cards

    eventsToDisplay.forEach(event => {
        const eventCard = `
            <div class="col-md-4 mb-4">
                <div class="card event-card">
                    <img src="${event.imageUrl}" class="card-img-top" alt="${event.title}">
                    <div class="card-body">
                        <h5 class="card-title text-warning">${event.title}</h5>
                        <p class="card-text">Date: ${event.date}<br>Location: ${event.location}</p>
                        ${isUserLoggedIn() ? `
                        <a href="event-details.html?event=${event.id}" class="btn btn-warning">View Details</a>
                        <a href="payment.html?event=${event.id}" class="btn btn-warning">Buy Ticket</a>` : ''}
                    </div>
                </div>
            </div>
        `;
        eventCardsContainer.innerHTML += eventCard;
    });
}

// Function to filter events based on user input
function filterEvents() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const location = document.getElementById('locationFilter').value.toLowerCase();
    const selectedDate = document.getElementById('dateFilter').value;

    // Filter events based on keyword, location, and date
    const filteredEvents = events.filter(event => {
        const matchesKeyword = event.title.toLowerCase().includes(keyword);
        const matchesLocation = location ? event.location.toLowerCase().includes(location) : true;
        const matchesDate = selectedDate ? event.date === selectedDate : true;

        return matchesKeyword && matchesLocation && matchesDate;
    });

    displayEvents(filteredEvents);
}

// Function to check if the user is logged in
function isUserLoggedIn() {
    return sessionStorage.getItem('userId') !== null;
}

// Function to update the navigation bar based on the user's login status
function updateNavbar() {
    const dashboardLink = document.querySelector('a[href="dashboard.html"]');
    const createEventLink = document.querySelector('a[href="create-event.html"]');
    const loginLink = document.querySelector('a[href="login.html"]');

    if (isUserLoggedIn()) {
        loginLink.textContent = 'Logout';
        dashboardLink.style.display = 'block';
        createEventLink.style.display = 'block';
    } else {
        loginLink.textContent = 'Login';
        dashboardLink.style.display = 'none';
        createEventLink.style.display = 'none';
    }
}

// Event listeners for filters
document.getElementById('searchInput').addEventListener('input', filterEvents);
document.getElementById('locationFilter').addEventListener('input', filterEvents);
document.getElementById('dateFilter').addEventListener('change', filterEvents);

// Update the navigation bar when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    fetchEvents();
});

// Event listener for login/logout click
document.querySelector('a[href="login.html"]').addEventListener('click', (event) => {
    if (isUserLoggedIn()) {
        event.preventDefault();
        sessionStorage.removeItem('userId');
        updateNavbar();
        displayEvents(events);
    }
});
