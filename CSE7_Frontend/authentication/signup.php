<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="../CSE7_Frontend\css\styles.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <link rel="stylesheet" href="../CSE7_Frontend\css\index.css" />
    <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
<body>
    <div class="glass-parent">
        <div class="glass">
          <div class="glass1">
    <div class="card"></div>
</div>
</div>
<div class="frame-parent">
<div class="frame-group">
  <div class="login-parent">
    <div class="login">Sign up</div>
    <div class="welcome-onboard-with">Welcome onboard with us!</div>
  </div>
  <!-- Added id="signupForm" to the sign-up form -->
  <form id="signupForm" class="frame-container">
    <div class="frame-div">
      <div class="username-parent">
        <div class="username">Name</div>
        <input type="text" name="name" class="enter-your-email-wrapper" placeholder="Enter your name" required>
      </div>
      <div class="username-parent">
        <div class="email">Email</div>
        <input type="email" name="email" class="enter-your-email-wrapper" placeholder="Enter your email" required>
      </div>
      <div class="password-parent">
        <div class="password">Password</div>
        <input type="password" name="password" class="enter-your-password-wrapper" placeholder="Enter your password" required>
      </div>
    </div>
    <button type="submit" class="sign-up-wrapper">
      <div class="sign-up">Sign up</div>
    </button>
  </form>
</div>
<div class="line-parent">
  <div class="frame-child"></div>
  <div class="or">or</div>
  <div class="frame-child"></div>
</div>
<div class="social-media-parent">
  <div class="social-media">
    <div class="google-container">
      <!-- Your custom button overlay for Google -->
      <button class="google" id="googleCustomButton_signUp">
        <div class="phgoogle-logo-bold-wrapper">
          <img class="phgoogle-logo-bold-icon" alt="" src="../CSE7_Frontend/Assets/ph_google-logo-bold.svg">
        </div>
      </button>
      <!-- The official Google button will be rendered here (invisible overlay) -->
      <div id="gsi_button_signUp"></div>
    </div>
    <button class="google" onclick="socialLogin('facebook')">
      <div class="phgoogle-logo-bold-wrapper">
        <img class="phgoogle-logo-bold-icon" alt="" src="../CSE7_Frontend/Assets/ic_sharp-facebook.svg">
      </div>
    </button>
    <button class="google" onclick="socialLogin('apple')">
      <div class="phgoogle-logo-bold-wrapper">
        <img class="phgoogle-logo-bold-icon" alt="" src="../CSE7_Frontend/Assets/ic_baseline-apple.svg">
      </div>
    </button>
  </div>
  <div class="already-have-an-container">
    <span class="already-have-an">Already have an account? </span>
    <a href="login.php" class="login1">Login</a>
    <span class="already-have-an"> here</span>
  </div>
</div>
</div>
</div>


<script src="https://accounts.google.com/gsi/client" async defer onload="initializeGoogle()"></script>
<script src="../CSE7_Frontend\javascripts\login_signup_script.js"></script>
</body>
</html>