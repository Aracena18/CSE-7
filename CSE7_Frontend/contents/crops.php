<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap" />
    <link rel="stylesheet" href="/CSE-7/CSE7_Frontend/css/content.css">
    <title>Schedule Content</title>

</head>
<body>
    <section class="schedule_content">
        <div class="contents">
            <div class="header_part">
                <div class="headercontainer">
                    <h2>Crops</h2>
                </div>
                <div class="menus">
                    <div class="navigation_schedule">
                        <div class="nav2">
                            <div class="li2"><a href="#">Lists</a></div>
                            <div class="li2"><a href="#">Calendar</a></div>
                        </div>
                    </div>

                    <div class="search_box_container">
                        <input type="text" class="search-box" placeholder="Search">
                    </div>

                    <div class="buttons">
                        <button class="button3">Filter</button>
                        <button class="button4">Sort</button>
                    </div>
                </div>
            </div>
            <button class="add_btn" style="cursor: pointer;" type="button" onclick="initializeModal()">Add Crops</button>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Category</th>
                            <th>Planted</th>
                            <th>Until</th>
                            <th>Variety</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="cropTableBody">
                        <tr>
                            <td>Tomato</td>
                            <td>Field 1</td>
                            <td>Vegetable</td>
                            <td>2025-02-15</td>
                            <td>2025-03-15</td>
                            <td>Roma</td>
                            <td>100</td>
                            <td>
                                <button class="edit-btn" style="cursor: pointer;" type="button">Edit</button>
                                <button class="delete_btn" style="cursor: pointer;" type="button">Delete</button>
                            </td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
        </div>
    </section>
    
    <script src="/CSE-7/CSE7_Frontend/javascripts/modal.js"></script>
    
</body>
</html>