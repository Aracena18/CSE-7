-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 01, 2025 at 02:52 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `farm_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `employee_id` int(10) NOT NULL,
  `date` date NOT NULL,
  `time_in` time DEFAULT NULL,
  `time_out` time DEFAULT NULL,
  `status` varchar(20) DEFAULT 'present',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `overtime_hours` decimal(5,2) DEFAULT 0.00,
  `regular_hours` decimal(5,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `employee_id`, `date`, `time_in`, `time_out`, `status`, `created_at`, `overtime_hours`, `regular_hours`) VALUES
(1, 26, '2025-03-01', '19:53:53', '21:22:29', 'present', '2025-03-01 09:22:29', 0.00, 1.48),
(2, 27, '2025-03-01', '17:41:34', '21:22:33', 'late', '2025-03-01 09:41:39', 0.00, 3.68),
(3, 32, '2025-03-01', '20:16:29', '21:22:22', 'present', '2025-03-01 10:52:15', 0.00, 1.10),
(4, 32, '1970-01-01', '20:16:07', NULL, 'present', '2025-03-01 10:52:38', 0.00, 0.00),
(5, 26, '1970-01-01', '18:52:55', '18:52:55', 'present', '2025-03-01 10:52:56', 0.00, 0.00),
(6, 33, '2025-03-01', '20:15:38', '21:22:42', 'present', '2025-03-01 11:43:19', 0.00, 1.12),
(7, 33, '1970-01-01', '19:43:38', NULL, 'present', '2025-03-01 11:43:39', 0.00, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `crops`
--

CREATE TABLE `crops` (
  `id` int(11) NOT NULL,
  `crop_name` varchar(100) NOT NULL,
  `crop_type` varchar(50) NOT NULL,
  `planting_date` date NOT NULL,
  `location` varchar(255) NOT NULL,
  `expected_harvest_date` date NOT NULL,
  `variety` varchar(100) NOT NULL,
  `quantity` int(11) NOT NULL,
  `auto_task` tinyint(1) DEFAULT 0,
  `user_id` int(10) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `crops`
--

INSERT INTO `crops` (`id`, `crop_name`, `crop_type`, `planting_date`, `location`, `expected_harvest_date`, `variety`, `quantity`, `auto_task`, `user_id`, `created_at`, `updated_at`) VALUES
(14, 'mmnnn,,', 'Fruits/Vegetable', '2025-02-11', 'asfsf', '2025-02-05', 'sfsdfsd', 8990, 1, 31, '2025-02-28 03:46:15', '2025-02-28 18:42:16'),
(19, 'Robert', 'Fruits/Vegetable', '2025-01-29', 'asfsf', '2025-02-12', 'sdfassadfssaf', 78, 1, 31, '2025-02-28 15:55:14', '2025-02-28 15:55:14'),
(20, 'ambut lang', 'sfsaffsd', '2025-03-04', 'asdfsd', '2025-03-04', 'as;ldfjsdl', 78, 1, 31, '2025-02-28 16:55:57', '2025-02-28 16:55:57'),
(21, 'mmnnn,,', 'sfsaffsd', '2025-02-26', 'asdfsd', '2025-03-06', 'asfsa', 78, 1, 31, '2025-02-28 18:42:33', '2025-02-28 18:42:33');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `emp_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `position` varchar(50) NOT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `daily_rate` decimal(10,2) NOT NULL,
  `days_worked` int(11) DEFAULT 0,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`emp_id`, `name`, `position`, `contact`, `daily_rate`, `days_worked`, `status`, `user_id`, `created_at`, `email`, `password`) VALUES
(26, 'Robert Jhon Aracena', 'Fruit Picker', '456565465', 5465.00, 456, 'onleave', 31, '2025-02-28 18:35:43', 'r.aracena26@arcriculture.com', '$2y$10$Zyhf18cgPl4vaLOceZ5YE.HdMjVNo4oEeVQLFLy2xr0Tf.VD.9W1.'),
(27, 'ljkhhhjk bkbnnmbn', 'Farm Worker', '888790987890', 9899.00, 88, 'onleave', 31, '2025-02-28 18:44:32', 'l.bkbnnmbn27@arcriculture.com', '$2y$10$rqAiJ52UVGUkb4ydpPPjYu0yv5RYO4kAT3PBWN3KtQvH8CHuu2OEa'),
(32, 'Jhon Jhon', 'Fruit Picker', '3452345325', 346346.00, 23, 'active', 31, '2025-03-01 09:43:03', 'j.jhon32@arcriculture.com', '$2y$10$lgWS.CLe4HLsuHFdrlI6c.Miw1tBwjep4adrFiZJamJedssqAfepy'),
(33, 'Test Test', 'Fruit Picker', '235235353', 235.00, 23, 'active', 31, '2025-03-01 11:42:48', 't.test33@arcriculture.com', '$2y$10$7XnE3Mx7N2o4TRHljS/6OOXJOliCDP7Jod3IMaov3s9AWX7rmarrO'),
(34, 'tes1 tes1', 'Farm Supervisor', '34', 32.00, 32, 'onleave', 31, '2025-03-01 13:37:04', 't.tes134@arcriculture.com', '$2y$10$rs49Lzim1udd16/YSBIageW.YVSQN1CXbgptfYmKpQB1zK.tyjwRK');

-- --------------------------------------------------------

--
-- Table structure for table `employee_tasks`
--

CREATE TABLE `employee_tasks` (
  `id` int(11) NOT NULL,
  `emp_id` int(11) DEFAULT NULL,
  `task_id` int(11) DEFAULT NULL,
  `assigned_date` date DEFAULT NULL,
  `completion_date` date DEFAULT NULL,
  `status` enum('Pending','In Progress','Completed') DEFAULT NULL,
  `crops_id` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payroll_periods`
--

CREATE TABLE `payroll_periods` (
  `id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('open','closed') DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salary_records`
--

CREATE TABLE `salary_records` (
  `id` int(11) NOT NULL,
  `emp_id` int(11) DEFAULT NULL,
  `month` int(11) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `days_worked` int(11) DEFAULT NULL,
  `base_salary` decimal(10,2) DEFAULT NULL,
  `overtime_pay` decimal(10,2) DEFAULT NULL,
  `bonuses` decimal(10,2) DEFAULT NULL,
  `deductions` decimal(10,2) DEFAULT NULL,
  `net_salary` decimal(10,2) DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `payroll_period_id` int(11) DEFAULT NULL,
  `regular_hours` decimal(7,2) DEFAULT 0.00,
  `overtime_hours` decimal(7,2) DEFAULT 0.00,
  `overtime_rate` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(10) NOT NULL,
  `description` varchar(255) NOT NULL,
  `assigned_to` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `priority` enum('high','medium','low') NOT NULL,
  `status` enum('todo','inprogress','completed','onhold') NOT NULL,
  `location` varchar(255) NOT NULL,
  `completed` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_id` int(10) DEFAULT NULL,
  `crops` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `description`, `assigned_to`, `start_date`, `end_date`, `priority`, `status`, `location`, `completed`, `created_at`, `updated_at`, `user_id`, `crops`) VALUES
(49, 'sdfsaff', 27, '2025-04-01', '2025-03-13', 'medium', 'completed', '8900yu', 1, '2025-03-01 03:37:39', '2025-03-01 09:46:25', 31, 19);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `google_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `remember_token`, `created_at`, `updated_at`, `google_id`) VALUES
(25, 'admin', 'admin@example.com', '$2y$10$65SzcemrePDFw1FUqFA3TehQu5abGsiO8G3chHLDlJUlbPxg027iK', NULL, '2025-02-09 05:05:55', '2025-02-09 05:05:55', ''),
(26, 'Robert Jhon Aracena', 'robertjhonaracena18@gmail.com', NULL, NULL, '2025-02-09 05:25:19', '2025-02-09 05:25:19', '112776746413572269626'),
(27, 'Robert jhon Aracena', 'robertjhonaracenab@gmail.com', NULL, NULL, '2025-02-09 05:29:16', '2025-02-09 05:29:16', '115138085781051473982'),
(31, 'ROBERT JHON ARACENA', 'r.aracena.545985@umindanao.edu.ph', NULL, NULL, '2025-02-09 05:45:50', '2025-02-09 05:45:50', '105613048778575743509'),
(32, 'Rumelyn Bolasito', 'rumelyn_bolasito@sjp2cd.edu.ph', NULL, NULL, '2025-02-09 06:14:00', '2025-02-09 06:14:00', '111001009973893820477');

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_tasks_with_employees`
-- (See below for the actual view)
--
CREATE TABLE `v_tasks_with_employees` (
`id` int(10)
,`description` varchar(255)
,`assigned_to` int(11)
,`start_date` date
,`end_date` date
,`priority` enum('high','medium','low')
,`status` enum('todo','inprogress','completed','onhold')
,`location` varchar(255)
,`completed` tinyint(1)
,`created_at` timestamp
,`updated_at` timestamp
,`user_id` int(10)
,`employee_name` varchar(100)
,`employee_position` varchar(50)
);

-- --------------------------------------------------------

--
-- Structure for view `v_tasks_with_employees`
--
DROP TABLE IF EXISTS `v_tasks_with_employees`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_tasks_with_employees`  AS SELECT `t`.`id` AS `id`, `t`.`description` AS `description`, `t`.`assigned_to` AS `assigned_to`, `t`.`start_date` AS `start_date`, `t`.`end_date` AS `end_date`, `t`.`priority` AS `priority`, `t`.`status` AS `status`, `t`.`location` AS `location`, `t`.`completed` AS `completed`, `t`.`created_at` AS `created_at`, `t`.`updated_at` AS `updated_at`, `t`.`user_id` AS `user_id`, `e`.`name` AS `employee_name`, `e`.`position` AS `employee_position` FROM (`tasks` `t` join `employees` `e` on(`t`.`assigned_to` = `e`.`emp_id`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `crops`
--
ALTER TABLE `crops`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_crops_user` (`user_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`emp_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_employee_name` (`name`);

--
-- Indexes for table `employee_tasks`
--
ALTER TABLE `employee_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `emp_id` (`emp_id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `employee_taskfk3` (`crops_id`);

--
-- Indexes for table `payroll_periods`
--
ALTER TABLE `payroll_periods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `salary_records`
--
ALTER TABLE `salary_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `emp_id` (`emp_id`),
  ADD KEY `payroll_period_id` (`payroll_period_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_task_user` (`user_id`),
  ADD KEY `assigned_to` (`assigned_to`),
  ADD KEY `CROPSFK1` (`crops`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `google_id` (`google_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `crops`
--
ALTER TABLE `crops`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `emp_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `employee_tasks`
--
ALTER TABLE `employee_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payroll_periods`
--
ALTER TABLE `payroll_periods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `salary_records`
--
ALTER TABLE `salary_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`emp_id`);

--
-- Constraints for table `crops`
--
ALTER TABLE `crops`
  ADD CONSTRAINT `fk_crops_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `employee_tasks`
--
ALTER TABLE `employee_tasks`
  ADD CONSTRAINT `employee_taskfk3` FOREIGN KEY (`crops_id`) REFERENCES `crops` (`id`),
  ADD CONSTRAINT `employee_tasks_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`emp_id`),
  ADD CONSTRAINT `employee_tasks_ibfk_2` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`);

--
-- Constraints for table `salary_records`
--
ALTER TABLE `salary_records`
  ADD CONSTRAINT `salary_records_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`emp_id`),
  ADD CONSTRAINT `salary_records_ibfk_2` FOREIGN KEY (`payroll_period_id`) REFERENCES `payroll_periods` (`id`);

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `CROPSFK1` FOREIGN KEY (`crops`) REFERENCES `crops` (`id`),
  ADD CONSTRAINT `fk_task_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`assigned_to`) REFERENCES `employees` (`emp_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
