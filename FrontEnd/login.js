document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:8080/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const userData = await response.json();
            sessionStorage.setItem("userId", userData.id);
            alert("Login successful!");
            window.location.href = "discover-events.html";
        } else {
            alert("Login failed. Please check your email and password.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during login.");
    }
});

// Google Login Flow
// Add click listener for Google login button
document.getElementById('google-login').addEventListener('click', () => {
    // Redirect to Google OAuth endpoint
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
});

// Function to handle user data after being redirected back to the frontend
async function handleGoogleLoginRedirect() {
    console.log("handleGoogleLoginRedirect() function is exicuted");
    try {
        // Make a request to your backend to get the authenticated user data
        // edge gpt - 
        //const response = await fetch('http://localhost:8080/loginSuccess');
        const response = await fetch('http://localhost:8080/api/users/current'); // Adjust the endpoint based on your backend setup
        
        if (response.ok) {
            const user = await response.json();
            // Store user ID in session storage
            sessionStorage.setItem("userId", user.id);
            alert("Google login successful!");
            // Redirect to the desired page after successful login
            window.location.href = "discover-events.html";
        } else {
            console.error("Failed to fetch user data.");
            alert("An error occurred while fetching user data.");
        }
    } catch (error) {
        console.error("Error during handling Google login:", error);
        alert("An error occurred during Google login.");
    }
}

// Check if the current page is a callback page for Google login (adjust condition as necessary)
if (window.location.pathname.includes('loginSuccess')) { // Replace '/some-callback-page' with your actual callback page route
    console.log(window.location.pathname);
    handleGoogleLoginRedirect();
}


