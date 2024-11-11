 // Function to extract the event ID from the URL
 function getEventIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('event');
}

// Function to load the event details from the backend
async function loadEventDetails() {
    const eventId = getEventIdFromUrl();

    if (eventId) {
        try {
            // Fetch the event details from the backend
            const response = await fetch(`http://localhost:8080/api/events/${eventId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch event details');
            }
            const eventDetails = await response.json();

            // Display the event details on the page
            document.getElementById('eventTitle').innerText = eventDetails.title;
            document.getElementById('eventDate').innerText = `Date: ${eventDetails.date}`;
            document.getElementById('eventTime').innerText = `Time: ${eventDetails.time || 'N/A'}`;
            document.getElementById('eventLocation').innerText = `Location: ${eventDetails.location}`;
            document.getElementById('eventDescription').innerText = eventDetails.description;
            document.getElementById('regularPrice').innerText = ` $${eventDetails.ticketPrice}`;
            document.getElementById('premiumPrice').innerText = ` $${eventDetails.ticketPrice + 99}`;
            document.getElementById('eventImage').src = eventDetails.imageUrl;
        } catch (error) {
            console.error('Error fetching event details:', error);
        }
    } else {
        console.error('Event ID not found in the URL');
    }
}

// Load event details when the page is loaded
window.onload = loadEventDetails;

// Handle feedback submission
document.getElementById('feedbackForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const userId = sessionStorage.getItem('userId');
    const eventId = getEventIdFromUrl();
    const content = document.getElementById('feedbackContent').value;
    const rating = document.getElementById('feedbackRating').value;
    const submissionDate = new Date().toISOString(); // Get the current date and time in ISO format

    if (userId && eventId) {
        try {
            const feedbackData = {
                user: { id: userId},
                event: { id: eventId},
                content: content,
                rating: rating,
                submissionDate: submissionDate // Add submission date to the feedback data
            };

            const response = await fetch('http://localhost:8080/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feedbackData)
            });

            if (response.ok) {
                alert('Feedback submitted successfully');
                $('#feedbackModal').modal('hide');
            } else {
                throw new Error('Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    } else {
        console.error('User ID or Event ID is missing');
    }
});

// Redirect to payment page
document.getElementById('proceedToPayment').addEventListener('click', function () {
    const eventId = getEventIdFromUrl();
    if (eventId) {
        window.location.href = `payment.html?event=${eventId}`;
    } else {
        console.error('Event ID not found in the URL');
    }
});