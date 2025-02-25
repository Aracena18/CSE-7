<?php
session_start();
?>

<div class="profile-container">
    <div class="profile-header">
        <div class="profile-cover"></div>
        <div class="profile-info">
            <div class="profile-avatar">
                <img src="/CSE-7/CSE7_Frontend/Assets/default-avatar.png" alt="Profile Picture">
            </div>
            <div class="profile-details">
                <h1><?php echo htmlspecialchars($_SESSION['user_name'] ?? 'User Name'); ?></h1>
                <p class="profile-email"><?php echo htmlspecialchars($_SESSION['user_email'] ?? 'email@example.com'); ?></p>
            </div>
        </div>
    </div>

    <div class="profile-content">
        <div class="profile-section">
            <h2>Personal Information</h2>
            <form id="profileForm" class="profile-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="fullName">Full Name</label>
                        <input type="text" id="fullName" name="fullName" value="<?php echo htmlspecialchars($_SESSION['user_name'] ?? ''); ?>">
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($_SESSION['user_email'] ?? ''); ?>" readonly>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="phone">Phone Number</label>
                        <input type="tel" id="phone" name="phone" placeholder="Enter your phone number">
                    </div>
                    <div class="form-group">
                        <label for="location">Location</label>
                        <input type="text" id="location" name="location" placeholder="Enter your location">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group full-width">
                        <label for="bio">Bio</label>
                        <textarea id="bio" name="bio" rows="4" placeholder="Tell us about yourself"></textarea>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="save-btn">Save Changes</button>
                </div>
            </form>
        </div>

        <div class="profile-section">
            <h2>Account Settings</h2>
            <div class="settings-options">
                <div class="setting-item">
                    <div class="setting-info">
                        <h3>Change Password</h3>
                        <p>Update your password to keep your account secure</p>
                    </div>
                    <button class="change-password-btn">Change Password</button>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <h3>Two-Factor Authentication</h3>
                        <p>Add an extra layer of security to your account</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox">
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>
        </div>
    </div>
</div>
