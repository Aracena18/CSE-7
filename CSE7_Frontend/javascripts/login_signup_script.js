window.onload = function() {
    console.log("Page fully loaded!");

    // Ensure Google API is loaded before initializing
    setTimeout(() => {
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
            initializeGoogle();
        } else {
            console.error("Google API not loaded yet!");
        }
    }, 1000);

    // Login Form Handling
    const loginForm = document.getElementById("loginUserForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            console.log("Login form submitted!");

            let email = document.getElementById("userEmail").value;
            let password = document.getElementById("userPassword").value;

            let formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);

            fetch("/CSE-7/CSE7_Frontend/login_pro.php", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log("Server Response:", data);

                if (data.success) { // Changed from data.login to match PHP response
                    const name = data.user.name; // Access name from user object
                    const message = "Welcome " + name;
                    alert(message);
                    setTimeout(() => {
                        window.location.href = "/CSE-7/CSE7_Frontend/homepage.php"; // Use URL from response
                    }, 500); // Small delay to ensure alert is seen
                } 
                else {
                    alert("Login failed: " + (data.message || "Invalid credentials"));
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An error occurred while logging in. Please try again.");
            });
        });
    } else {
        console.error("Error: loginUserForm not found in the DOM!");
    }
};

// Google Sign-In Initialization
function initializeGoogle() {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
            client_id: '1052567040007-ji9inkp7s35stbg8pljaeil49i3clvu0.apps.googleusercontent.com',
            callback: handleCredentialResponse,
            ux_mode: 'popup'
        });

        const signUpButton = document.getElementById("gsi_button_signUp");
        const loginButton = document.getElementById("gsi_button_login");

        if (signUpButton) {
            google.accounts.id.renderButton(signUpButton, { theme: "outline", size: "large", type: "standard", text: "signup_with" });
        }

        if (loginButton) {
            google.accounts.id.renderButton(loginButton, { theme: "outline", size: "large", type: "standard", text: "signin_with" });
        }
    } else {
        console.error('Google Identity Services not loaded');
    }
}

// Handle Google Sign-In response
function handleCredentialResponse(response) {
    if (!response.credential) {
        console.error("Login failed: No credential received");
        return;
    }

    console.log("Encoded JWT ID token: " + response.credential);
    const payload = JSON.parse(atob(response.credential.split(".")[1]));
    
    fetch('/CSE-7/CSE7_Frontend/login_pro.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: payload.email,
            name: payload.name,
            google_id: payload.sub
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Server Response (Google):", data);
        if (data.success) {
            const name = data.user.name;
            alert("Welcome " + name);
            // Allow alert to be shown before redirect
            setTimeout(() => {
                // Use the redirect URL from server response
                window.location.href = data.redirect_url;
            }, 500);
        } else {
            alert(data.error || "Authentication failed");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred during authentication");
    });
}
