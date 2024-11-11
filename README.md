Event Management System
The Event Management System is a full-stack web application for organizing and managing events. With features for user registration, event creation, discovery, and ticketing, the system provides a platform for event organizers and attendees alike.

🚀 Features
User Registration/Login: Secure user registration and login, with dynamic Login or Logout options in the navbar.
Social Login: Allows users to log in with their Google account for a faster, hassle-free login experience.
Forgot Password: Users can reset their password if forgotten, enhancing account security and ease of access.
Event Creation & Management: Organizers can create, edit, or cancel events and view status updates like "Coming Soon," "Ongoing," or "Completed."
Discover Events: Explore upcoming events by keyword, location, or date. Users can view event details and buy tickets.
Dynamic Navbar: Logged-in users see options like Dashboard and Create Event, while others only see event listings.
Responsive Design: Built with Bootstrap for a responsive, mobile-friendly layout.
🛠️ Tech Stack
Frontend: HTML, CSS, JavaScript, Bootstrap
Backend: Java, Spring Framework, Hibernate
Database: PostgreSQL
⚙️ Setup
Clone the repository:

bash
Copy code
git clone https://github.com/TipusultanSahoo/Event-Management-System-Final.git
Set up the backend (Spring Boot):

Import the backend folder into Spring Tool Suite (STS) or another IDE.
Configure PostgreSQL settings in application.properties.
Configure Google OAuth credentials in your environment variables:
bash
Copy code
export GOOGLE_CLIENT_ID=your_client_id
export GOOGLE_CLIENT_SECRET=your_client_secret
Alternatively, set these in your .env file if you're using one and make sure .env is included in .gitignore.
Launch the frontend:

Open the frontend folder in VS Code.
Run the application.
📖 Usage
Login: Access the system as an organizer or attendee using email/password or Google login.
Forgot Password: If you forget your password, you can reset it via the Forgot Password option on the login page.
Event Discovery: Search and explore events without logging in.
Event Management: Create, view, edit, and cancel events as an organizer.
