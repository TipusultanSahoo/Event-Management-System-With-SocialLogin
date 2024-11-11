document.getElementById('registration-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from submitting normally

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    
        
    

    // Create user object to send to the server
    const user = {
        name: username,
        email: email,
        password: password,
        organizer: null // Explicitly set organizer as null (optional)
    };

    // Make a POST request to the backend API
    fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        // Check if the response is in JSON format
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json(); // Parse JSON response
        } else {
            return response.text(); // Handle plain text response
        }
    })
    .then(data => {
        console.log('User registered:', data);
        alert('Registration successful! Redirecting to login page.');
        window.location.href = 'login.html'; // Redirect to login page
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Registration failed. Please try again.');
    });
});

// const eye=document.getElementById('eye');
//         const pss=document.getElementById('password');
//         const pssvalue=document.getElementById('password').value;
//        const submit=document.getElementById('submit');

//        submit.addEventListener("click",function()
//     {
//         event.preventDefault();
//         if(pssvalue.length>6)
//         {
//             alert("psw should be 6 or less!");
//             return;
//         }
//         else{

//         }
//     })

//         eye.addEventListener("click",function(){
//             event.preventDefault();

//             if(pss.type==="password")
//             {
//                pss.type="text";
//             }else{
//                  pss.type="password";
//             }

//         });