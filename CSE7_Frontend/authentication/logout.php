<?php
session_start();
session_destroy();
header("Location: /CSE-7/CSE7_Frontend/index.php");
exit();
?>