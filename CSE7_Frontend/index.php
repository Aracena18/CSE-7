<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Arciculture</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
  <link rel="stylesheet" href="/CSE-7/CSE7_Frontend/styles.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap" />
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <link rel="stylesheet" href="/CSE7_Frontend/css/index.css" />
  <script src="https://accounts.google.com/gsi/client" async defer></script>
  <meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin-allow-popups">
  <meta name="google-signin-client_id" content="1052567040007-ji9inkp7s35stbg8pljaeil49i3clvu0.apps.googleusercontent.com">
  <meta name="google-signin-scope" content="profile email">
  <meta http-equiv="Cross-Origin-Embedder-Policy" content="require-corp">
</head>
<body>

<header>
  <nav class="navigation_bar">
    <!-- Logo -->
    <div class="logo_container">
      <img src="/CSE-7/CSE7_Frontend/Assets/logo.png" alt="logo">
    </div>
    <!-- Hamburger Menu Icon -->
    <div class="menu-toggle" onclick="toggleMenu()">☰</div>
    <!-- Navigation Links -->
    <ul class="nav_links">
      <li>Home</li>
      <li>About Us</li>
      <li>Contact Us</li>
      <div class="mobile_auth_buttons">
        <button class="login_button">Log in</button>
        <button class="sign_up_button">Sign up</button>
      </div>
    </ul>
    <!-- Desktop Authentication Buttons -->
    <div class="auth_buttons">
      <button class="login_button" onclick="toggleLogin('/CSE-7/CSE7_Frontend/authentication/login.php')">Log in</button>
      <button class="sign_up_button" onclick="toggleSignup('/CSE-7/CSE7_Frontend/authentication/signup.php')">Sign up</button>
    </div>
  </nav>
</header>

<section class="hero_sect">
  <div class="background-container">
    <img src="/CSE-7/CSE7_Frontend/Assets/Polygon 1.png" alt="Img">
  </div>

  <div class="header-container">
    <div class="text-container">
      <b class="lets-grow-your-container">
        <h4 class="lets-grow-your">Let’s Grow Your Farm Together</h4>
      </b>
      <p class="body_text">You don’t have to be a digital marketing pro to know how important a website is to modern business. As both a digital interface for delivering products and services and a vehicle for generating leads, your website needs to look good. If you want to deliver a smooth customer experience and look good while doing it, a web designer can help.</p>
      <button class="buttonmore" onclick="toggleSignup('./authentication/signup.php')">Get Started</button>
    </div>

    <div class="login_container">
      <!-- SIGN-UP FORM -->
      <div id="SignUpForm" class="login_form" style="display: none;"> </div>
      
      <!-- LOGIN FORM -->
      <div class="Sign-up-container">
        <div id="loginForm" class="login_form" style="display: none;">
        </div>
      </div>
    </div>
  </div>
</section>


    <!-- Update Modal Structure -->
    <div id="addCropModal" class="modal">
      <div class="modal-content">
          <button class="close">&times;</button>
          <div class="modal-header">
              <img src="/CSE-7/CSE7_Frontend/Assets/logo.png" alt="Logo" width="243" height="44">
             <h2>Add New Crop</h2>
          </div>
          <form id="addCropForm">
              <div class="form-group">
                  <label for="cropName">Crop Name</label>
                  <input type="text" id="cropName" name="cropName" required>
              </div>
              <div class="form-group">
                  <label for="cropType">Crop Type</label>
                  <input type="text" id="cropType" name="cropType" required>
              </div>
              <div class="form-group">
                  <label for="plantingDate">Planting Date</label>
                  <input type="date" id="plantingDate" name="plantingDate" required>
              </div>
              <div class="form-group">
                  <label for="location">Location</label>
                  <input type="text" id="location" name="location" required>
              </div>
              <div class="form-group">
                  <label for="expectedHarvestDate">Expected Harvest Date</label>
                  <input type="date" id="expectedHarvestDate" name="expectedHarvestDate" required>
              </div>
              <!-- Add this new checkbox group -->
              <div class="checkbox-group">
                  <input type="checkbox" id="autoTask" name="autoTask">
                  <label for="autoTask">Generate Tasks Automatically</label>
              </div>
              <div class="form-buttons">
                  <button type="submit" class="submit-btn">Add Crop</button>
                  <button type="button" class="cancel">Cancel</button>
              </div>
          </form>
      </div>
  </div>



<script src="https://accounts.google.com/gsi/client" async defer onload="initializeGoogle()"></script>


<script src="/CSE-7/CSE7_Frontend/javascripts/login_signup_script.js"></script>
<script src="/CSE-7/CSE7_Frontend/javascripts/authentication.js"></script>

</body>
</html>
