// Handle the form submission for user registration
document.getElementById('registration-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    alert('User registered successfully!');
    // You can add form submission logic here
});

// Handle the form submission for user login
document.getElementById('login-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    alert('User logged in successfully!');
    // You can add login validation here
});

// Handle the form submission for creating a new event
document.getElementById('create-event-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Event created successfully!');
    // You can add event creation logic here
});


//  Discover the Events

// Sample data for events (this would normally come from your backend)
const events = [
    {
        title: "Music Concert",
        date: "2024-12-01",
        location: "New York",
        image: "images/music-concert.jpg"
    },
    {
        title: "Technology Expo",
        date: "2024-11-15",
        location: "San Francisco",
        image: "images/tech-expo.jpg"
    },
    {
        title: "Art Exhibition",
        date: "2024-10-25",
        location: "Los Angeles",
        image: "images/art-exhibition.jpg"
    },
    {
        title: "Food Festival",
        date: "2024-11-10",
        location: "New York",
        image: "images/food-festival.jpg"
    }
    // Add more events as needed
];

// Function to display events
function displayEvents(eventsToDisplay) {
    const eventCardsContainer = document.getElementById('eventCardsContainer');
    eventCardsContainer.innerHTML = ''; // Clear previous content

    eventsToDisplay.forEach(event => {
        const card = `
            <div class="col-md-4 mb-4">
                <div class="card event-card">
                    <img src="${event.image}" class="card-img-top" alt="${event.title}">
                    <div class="card-body">
                        <h5 class="card-title text-warning">${event.title}</h5>
                        <p class="card-text">Date: ${event.date}<br>Location: ${event.location}</p>
                        <a href="#" class="btn btn-warning">View Details</a>
                        <a href="event-details.html?event=tech-expo" class="btn btn-warning">Buy Ticket</a>
                    </div>
                </div>
            </div>
        `;
        eventCardsContainer.innerHTML += card; // Append new card
    });
}

// Function to filter events based on user input
function filterEvents() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const location = document.getElementById('locationFilter').value;
    const selectedDate = document.getElementById('dateFilter').value;

    // Filter events based on keyword, location, and date
    const filteredEvents = events.filter(event => {
        const matchesKeyword = event.title.toLowerCase().includes(keyword);
        const matchesLocation = location ? event.location === location : true;
        const matchesDate = selectedDate ? event.date === selectedDate : true; // Filter by selected date

        return matchesKeyword && matchesLocation && matchesDate;
    });

    displayEvents(filteredEvents);
}

// Event listeners for filters
document.getElementById('searchInput').addEventListener('input', filterEvents);
document.getElementById('locationFilter').addEventListener('change', filterEvents);
document.getElementById('dateFilter').addEventListener('change', filterEvents);

// Initial display of all events
displayEvents(events);
