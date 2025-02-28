-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 28, 2025 at 04:59 PM
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
(11, 'Robert', 'asdfdssadf', '2025-02-12', 'as;jf;klsdfljksf', '2025-02-05', 'as;ldfjsdl', 890, 1, 31, '2025-02-27 21:06:57', '2025-02-28 05:54:02'),
(12, 'Robert', 'adsfas', '2025-02-04', 'sdfdas', '2025-02-05', 'asdffsd', 456656, 1, 31, '2025-02-27 21:07:19', '2025-02-28 04:34:55'),
(13, 'Kamote', 'Fruits/Vegetable', '2025-02-24', 'sdfsf', '2025-01-30', 'as;ldfjsdl', 9000, 1, 31, '2025-02-28 03:44:09', '2025-02-28 15:55:23'),
(14, 'mmnnn,,', 'Fruits/Vegetable', '2025-02-11', 'asfsf', '2025-02-05', 'sfsdfsd', 78, 1, 31, '2025-02-28 03:46:15', '2025-02-28 03:46:15'),
(15, 'mmnnn,,', 'adsfas', '2025-02-03', 'asfsf', '2025-02-23', 'sdfas', 456, 1, 31, '2025-02-28 05:55:10', '2025-02-28 05:55:10'),
(16, 'mmnnn,,', 'adsfas', '2025-02-03', 'asfsf', '2025-02-23', 'sdfas', 456, 1, 31, '2025-02-28 05:55:10', '2025-02-28 05:55:10'),
(17, 'mmnnn,,', 'adsfas', '2025-02-03', 'asfsf', '2025-02-23', 'sdfas', 456, 1, 31, '2025-02-28 05:55:10', '2025-02-28 05:55:10'),
(18, 'mmnnn,,', 'Fruits/Vegetable', '2025-02-12', 'asdfsd', '2025-02-12', 'as;ldfjsdl', 456, 1, 31, '2025-02-28 05:58:06', '2025-02-28 05:58:06'),
(19, 'Robert', 'Fruits/Vegetable', '2025-01-29', 'asfsf', '2025-02-12', 'sdfassadfssaf', 78, 1, 31, '2025-02-28 15:55:14', '2025-02-28 15:55:14');

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
(17, 'Robert Jhon Aracena', 'Manager', '2453252323432', 7890.00, 789, 'onleave', 31, '2025-02-28 11:26:02', 'r.aracena17@arcriculture.com', '$2y$10$DQULtFMKpqJlQfgpYFqCUuYZ4K8woH.9LX.jDNeLHU1EGi28X2J6W'),
(18, 'Robert Jhon Aracena', 'Manager', '2453252323432', 7890.00, 789, 'onleave', 31, '2025-02-28 11:26:02', 'r.aracena18@arcriculture.com', '$2y$10$3PnvpBWiLcHzu/GBCARw4O9KS3ky3qAepSwA5N3DltnfKpnFDg5DO'),
(19, 'Test Now', 'Fruit Picker', '4324243223', 890.00, 89, 'onleave', 31, '2025-02-28 11:43:05', 't.now19@arcriculture.com', '$2y$10$73pC3cVEpLT2OmPdeo35HOUoSUiCS2mS8LvMNCC0vISIIut600wtu'),
(20, 'Test Now', 'Fruit Picker', '4324243223', 890.00, 89, 'onleave', 31, '2025-02-28 11:43:05', 't.now20@arcriculture.com', '$2y$10$tII6tPBqxzL7cfZVMAt9Y.JZp8x.TLr5xGi5yhtsCU/DhIElnIl62');

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
  `user_id` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `description`, `assigned_to`, `start_date`, `end_date`, `priority`, `status`, `location`, `completed`, `created_at`, `updated_at`, `user_id`) VALUES
(34, 'jhlhhhjhjklkjlhjhjljlklkjljhjhj', 17, '2025-02-26', '2025-02-17', 'low', 'completed', 'asdfdsa', 1, '2025-02-28 11:30:31', '2025-02-28 11:36:21', 31),
(36, 'aljsdfjlsdfjfds', 19, '2025-02-06', '2025-01-30', 'medium', 'inprogress', 'asdfdsa', 0, '2025-02-28 11:39:21', '2025-02-28 15:53:04', 31),
(37, 'asfsda', 17, '2025-01-30', '2025-02-18', 'medium', 'inprogress', 'safsdadsdffds', 0, '2025-02-28 15:54:35', '2025-02-28 15:54:35', 31);

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
  ADD KEY `assigned_to` (`assigned_to`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `crops`
--
ALTER TABLE `crops`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `emp_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

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
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

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
  ADD CONSTRAINT `fk_task_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`assigned_to`) REFERENCES `employees` (`emp_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
