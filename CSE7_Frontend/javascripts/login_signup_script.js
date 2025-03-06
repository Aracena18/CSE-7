window.onload = function() {
    console.log("Page fully loaded!");

    // Initialize Google API (if not ready, try again after a short delay)
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        initializeGoogle();
    } else {
        // Fallback: wait 1 second and check again
        setTimeout(() => {
            if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
                initializeGoogle();
            } else {
                console.error("Google API not loaded yet!");
            }
        }, 1000);
    }

    
   
};


document.addEventListener('loginLoaded', function(){
    // Login Form Handling
const loginUserForm = document.getElementById("loginUserForm");

if (loginUserForm) {
    console.log("Login Form found:"+ loginUserForm);
    loginUserForm.addEventListener("submit", async function(event) {
       event.preventDefault();
       console.log("Login form submitted!");

       const email = document.getElementById("userEmail").value;
       const password = document.getElementById("userPassword").value;

       const formData = new FormData();
       formData.append("email", email);
       formData.append("password", password);

       try {
           const response = await fetch("/CSE-7/CSE7_Frontend/login_cred.php", {
               method: "POST",
               body: formData
           });
           const data = await response.json();
           console.log("Server Response:", data);

           if (data.success) {
               const name = data.user.name;
               alert("Welcome " + name);
               setTimeout(() => {
                 // Check if an employee object exists. If so, redirect to dashboard; otherwise, homepage.
                 if (data.employee) {
                   console.log("Redirecting to dashboard...");
                   window.location.href = "/CSE-7/CSE7_Frontend/dashboard.php";
                 } else {
                   window.location.href = "/CSE-7/CSE7_Frontend/homepage.php";
                 }
               }, 500);
           } else {
               alert("Login failed: " + (data.message || "Invalid credentials"));
           }
       } catch (error) {
           console.error("Error:", error);
           alert("An error occurred while logging in. Please try again.");
       }
   });
} else {
   console.error("Error: loginUserForm not found in the DOM!");
}
});


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
            setTimeout(() => {
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

function toggleLogin(url) {
    const container = document.querySelector('.login_container');
    const loginForm = document.getElementById('loginForm');
    
    if (!container.classList.contains('active')) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                
                loginForm.innerHTML = data;
                container.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
    } else {
        container.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function toggleSignup(url) {
    const container = document.querySelector('.Sign-up-container');
    const signupForm = document.getElementById('SignUpForm');
    
    if (!container.classList.contains('active')) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                signupForm.innerHTML = data;
                container.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
    } else {
        container.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const loginContainer = document.querySelector('.login_container');
    const signupContainer = document.querySelector('.Sign-up-container');
    
    if (e.target === loginContainer) {
        toggleLogin();
    }
    if (e.target === signupContainer) {
        toggleSignup();
    }
});
