const organizerId = sessionStorage.getItem("userId");
document.addEventListener("DOMContentLoaded", function () {
    // Fetch the organizerId from session storage
    

    if (organizerId) {
        fetchEventsByOrganizer(organizerId);
    } else {
        console.error("Organizer ID is not available in session storage.");
    }
});

// Helper function to format the countdown time
function formatCountdown(timeInMs) {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
}

// Function to update the status of an event based on its date and time
function updateEventStatus(event) {
    const now = new Date();
    const eventDate = new Date(event.date);
    const eventTime = event.time.split(":");
    eventDate.setHours(eventTime[0], eventTime[1], 0, 0); // Set the event time

    const timeDifference = eventDate - now;
    let status = "";

    if (event.status === "Cancelled") {
        status = "Cancelled";
    } else if (timeDifference > 0) {
        // Event is in the future
        status = "Coming Soon";

        // If the event is today and has not started yet, display a countdown
        if (eventDate.toDateString() === now.toDateString()) {
            const countdown = formatCountdown(timeDifference);
            status = `Starting in ${countdown}`;
        }
    } else if (timeDifference <= 0 && timeDifference >= -2 * 60 * 60 * 1000) {
        // Event is currently ongoing (within the 2-hour window)
        status = "Ongoing";
    } else {
        // Event has already ended
        status = "Completed";
    }

    return status;
}

// Function to fetch events by organizerId
function fetchEventsByOrganizer(organizerId) {
    fetch(`http://localhost:8080/api/events/organizer/${organizerId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(events => {
            displayEvents(events);
        })
        .catch(error => {
            console.error("There was a problem fetching the events:", error);
        });
}

// Function to display events dynamically
function displayEvents(events) {
    const eventTableBody = document.querySelector("table tbody");
    eventTableBody.innerHTML = ""; // Clear any existing content

    if (events.length === 0) {
        eventTableBody.innerHTML = "<tr><td colspan='4'>No events found.</td></tr>";
        return;
    }

    events.forEach(event => {
        const row = document.createElement("tr");

        // Update event status before displaying
        const status = updateEventStatus(event);
        event.status = status;

        row.innerHTML = `
            <td>${event.title}</td>
            <td>${event.date}</td>
            <td>${event.location}</td>
            <td>${status}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="openEditModal(${event.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteEvent(${event.id})">Delete</button>
            </td>
        `;

        eventTableBody.appendChild(row);
    });
}

// Function to open the edit modal and populate fields with event data
function openEditModal(eventId) {
    console.log(eventId);
    fetch(`http://localhost:8080/api/events/${eventId}`)
        .then(response => response.json())
        .then(event => {
            // Populate modal fields with event details

            console.log(event.location);
            document.getElementById("eventId").value = event.id;
            document.getElementById("eventTitle").value = event.title;
            document.getElementById("eventDescription").value = event.description;
            document.getElementById("eventDate").value = event.date;
            document.getElementById("eventTime").value = event.time;
            document.getElementById("eventLocation").value = event.location;
            document.getElementById("ticketPrice").value = event.ticketPrice;
            document.getElementById("eventImageUrl").value = event.imageUrl;

            // Show the modal
            new bootstrap.Modal(document.getElementById("editEventModal")).show();
        })
        .catch(error => console.error("Error fetching event details:", error));
}

// Handle form submission for editing an event
document.getElementById("editEventForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const eventId = document.getElementById("eventId").value;
    const updatedEvent = {
        title: document.getElementById('eventTitle').value, // Get event title from input field
        description: document.getElementById('eventDescription').value, // Get event description from input field
        date: document.getElementById('eventDate').value, // Get event date from input field (YYYY-MM-DD)
        time: document.getElementById('eventTime').value, // Get event time from input field (HH:MM:SS)
        location: document.getElementById('eventLocation').value, // Get event location from input field
        ticketPrice: parseFloat(document.getElementById('ticketPrice').value), // Get ticket price and convert to float
        imageUrl: document.getElementById('eventImageUrl').value, // Get image URL from input field
        organizer: {
            id: parseInt(organizerId) // Set the organizer ID from session storage
        }
    };

    fetch(`http://localhost:8080/api/events/${eventId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedEvent)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update event");
            }
            return response.json();
        })
        .then(() => {
            // Close the modal and refresh the events
            bootstrap.Modal.getInstance(document.getElementById("editEventModal")).hide();
            fetchEventsByOrganizer(sessionStorage.getItem("userId"));
        })
        .catch(error => console.error("Error updating event:", error));
});

// Function to delete an event
function deleteEvent(eventId) {
    fetch(`http://localhost:8080/api/events/${eventId}/cascade`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to delete event");
        }
        // Refresh the events list after deletion
        fetchEventsByOrganizer(sessionStorage.getItem("userId"));
    })
    .catch(error => console.error("Error deleting event:", error));
}
