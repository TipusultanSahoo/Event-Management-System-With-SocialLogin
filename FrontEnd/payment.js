 // Get the user ID from session storage
 const userId = sessionStorage.getItem('userId');
 // Get event ID from the URL
 const urlParams = new URLSearchParams(window.location.search);
 const eventId = urlParams.get('event');

 if (!userId || !eventId) {
     alert('User or event information is missing.');
     window.location.href = 'discover-events.html';
 }

 async function fetchEventData() {
     try {
         const response = await fetch(`http://localhost:8080/api/events/${eventId}`);
         const event = await response.json();
         console.log(event);

         // Set base ticket price from event data
         let baseTicketPrice = event.ticketPrice;
         console.log(`event.ticketPrice`,event.ticketPrice); // Undefind ??

         // Payment form submission event
         document.getElementById('paymentForm').addEventListener('submit', async function(event) {
             event.preventDefault();

             try {
                 // Retrieve selected ticket type
                 const ticketType = document.querySelector('input[name="ticketType"]:checked').value;
                 let ticketPrice = baseTicketPrice;
                 console.log('Initial ticket price:', ticketPrice); //Undefind ??

                 // Add extra cost for premium ticket type
                 if (ticketType === 'premium') {
                     ticketPrice += 99; // Premium tickets cost $99 extra
                 }

                 // Prepare registration data
                 const registrationData = {
                     user: {
                           id: userId
                          },
                     event: { 
                          id: eventId
                          },
                     registrationDate: new Date().toISOString(),
                     status: 'Confirmed',
                     numberOfTickets: 1 // Default to 1 ticket for this example
                 };

                 // Register the user for the event
                 const registrationResponse = await fetch('http://localhost:8080/api/registrations', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify(registrationData)
                 });

                 if (!registrationResponse.ok) {
                     throw new Error('Registration failed.');
                 }

                 const registration = await registrationResponse.json();

                 // Prepare payment data
                 const paymentData = {
                     registration:{ id: registration.id },
                     amount: ticketPrice,
                     paymentDate: new Date().toISOString(),
                     paymentStatus: 'Completed',
                     paymentMethod: 'Credit Card' // Assuming credit card payment for this example
                 };

                 // Process the payment
                 const paymentResponse = await fetch('http://localhost:8080/api/payments', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify(paymentData)
                 });

                 if (paymentResponse.ok) {
                     alert('Payment successful! You are now registered for the event.');
                     window.location.href = 'dashboard.html';
                 } else {
                     alert('Payment processing failed. Please try again.');
                 }
             } catch (error) {
                 console.error('Error:', error);
                 alert('An error occurred while processing the payment.');
             }
         });
     } catch (error) {
         console.error('Error fetching event data:', error);
     }
 }

 // Fetch event data on page load
 fetchEventData();