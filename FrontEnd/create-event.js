document.getElementById("create-event-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const eventTitle = document.getElementById("event-title").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const location = document.getElementById("location").value;
    const ticketPrice = parseFloat(document.getElementById("ticket-price").value);
    const eventImageUrl = document.getElementById("eventImageUrl").value;
    const organizerId = sessionStorage.getItem("userId");

    const eventData = {
        title: eventTitle,
        description: description,
        date: date,
        time: time,
        location: location,
        ticketPrice: ticketPrice,
        imageUrl: eventImageUrl,
        organizer: {
            id: organizerId
        }
    };

    try {
        // Step 1: Create the Event
        const response = await fetch("http://localhost:8080/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(eventData)
        });

        if (response.ok) {
            const createdEvent = await response.json();
            alert("Event created successfully!");

            // Step 2: Create a Ticket associated with the new event
            const ticketData = {
                ticketType: "standard", // Assuming a default ticket type for now
                price: ticketPrice,
                isAvailable: true,
                event: { id: createdEvent.id } // Linking the ticket to the created event
            };

            const ticketResponse = await fetch("http://localhost:8080/api/tickets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(ticketData)
            });

            if (ticketResponse.ok) {
                alert("Ticket created successfully!");
                window.location.href = "dashboard.html";
            } else {
                alert("Event created, but ticket creation failed. Please try again.");
            }
        } else {
            alert("Failed to create event. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while creating the event.");
    }
});
