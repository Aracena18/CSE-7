async function toggleLogin(content) {
    try {
        let response = await fetch(content);
        let data = await response.text();
        let loginForm = document.getElementById("loginForm");
        let SignUpForm = document.getElementById("SignUpForm");
        
        if (loginForm.style.display === 'none' || loginForm.style.display === '') {
            document.getElementById("loginForm").innerHTML = data;
            loginForm.style.display = 'block';
            loginForm.style.zIndex = 1;
            SignUpForm.style.display = 'none';
            SignUpForm.style.zIndex = -1;
            initializeGoogle(); // Initialize after content is loaded
            console.log("Log in loaded");
            document.dispatchEvent(new CustomEvent('loginLoaded'));
        } else {
            loginForm.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading the content:', error);
    }
}

async function toggleSignup(content) {
    try {
        let response = await fetch(content);
        let data = await response.text();
        let loginForm = document.getElementById("loginForm");
        let SignUpForm = document.getElementById("SignUpForm");

        if (SignUpForm.style.display === 'none' || SignUpForm.style.display === '') {
            document.getElementById("SignUpForm").innerHTML = data;
            SignUpForm.style.display = 'block';
            SignUpForm.style.zIndex = 1;
            loginForm.style.display = 'none';
            loginForm.style.zIndex = -1;
            initializeGoogle(); // Initialize after content is loaded
        } else {
            SignUpForm.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading the content:', error);
    }
}