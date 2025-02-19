window.onload = function() {
    initializeGoogle();
};

// Initialize Google API for Google Sign-In
function initializeGoogle() {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
            client_id: '1052567040007-ji9inkp7s35stbg8pljaeil49i3clvu0.apps.googleusercontent.com',
            callback: handleCredentialResponse,
            ux_mode: 'popup'
        });

        // Try to render buttons if elements exist
        const signUpButton = document.getElementById("gsi_button_signUp");
        const loginButton = document.getElementById("gsi_button_login");

        if (signUpButton) {
            google.accounts.id.renderButton(signUpButton, {
                theme: "outline",
                size: "large",
                type: "standard",
                text: "signup_with"
            });
        }

        if (loginButton) {
            google.accounts.id.renderButton(loginButton, {
                theme: "outline",
                size: "large",
                type: "standard",
                text: "signin_with"
            });
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

    // Decode the Google JWT token (this is for debugging; in production, verify it server-side)
    const payload = JSON.parse(atob(response.credential.split(".")[1]));
    const email = payload.email;
    const name = payload.name;
    const google_id = payload.sub; // Unique Google user ID

    console.log("Decoded Google User:", payload);

    // Send the Google user data to your backend for registration/login
    fetch('http://127.0.0.1/CSE7_Final_Project/CSE7_Frontend/login_pro.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            name: name,
            google_id: google_id
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Server Response (Google):", data);
        if(data.login === "success"){
            window.location.href = "/CSE7_Frontend/homepage.html";
        }
    })
    .catch(error => console.error("Error:", error));
}

// Manual Sign-Up Form Submission
document.getElementById("signupForm").addEventListener("submit", function(e) {
    e.preventDefault();
    // Get form values
    const form = e.target;
    const email = form.querySelector("input[name='email']").value;
    const password = form.querySelector("input[name='password']").value;
    const name = form.querySelector("input[name='name']").value || email.split("@")[0];

    // Send data to backend
    fetch('http://127.0.0.1/CSE7_Final_Project/CSE7_Frontend/login_pro.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
            name: name
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Server Response (Sign-Up):", data);
        if(data.login === "success"){
            window.location.href = "/CSE7_Frontend/homepage.html";
        }
    })
    .catch(error => console.error("Error:", error));
});

// Manual Log-In Form Submission
document.getElementById("loginUserForm").addEventListener("submit", function(e) {
    e.preventDefault();
    // Get form values
    const form = e.target;
    const email = form.querySelector("input[name='email']").value;
    const password = form.querySelector("input[name='password']").value;

    // Send data to backend
    fetch('http://127.0.0.1/CSE7_Final_Project/CSE7_Frontend/login_pro.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Server Response (Log-In):", data);
        if(data.login === "success"){
            window.location.href = "/CSE7_Frontend/homepage.html";
        }
    })
    .catch(error => console.error("Error:", error));
});

function socialLogin(provider) {
    if (provider === 'google') {
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
            google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed()) {
                    console.error('Google Sign In error:', notification.getNotDisplayedReason());
                } else if (notification.isSkippedMoment()) {
                    console.log('User skipped Google Sign In');
                }
            });
        } else {
            console.error('Google Identity Services not loaded');
        }
    } else if (provider === 'facebook') {
        console.log('Facebook login clicked');
    } else if (provider === 'apple') {
        console.log('Apple login clicked');
    }
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav_links');
    navLinks.classList.toggle('active');
}