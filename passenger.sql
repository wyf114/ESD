CREATE DATABASE IF NOT EXISTS `passenger` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `passenger`;

DROP TABLE IF EXISTS `passenger`;
CREATE TABLE IF NOT EXISTS `passenger` (
`passport` varchar(50) NOT NULL,
`lastname` varchar(100) NOT NULL,
`firstname` varchar(100) NOT NULL,
`dob` varchar(20) NOT NULL,
`gender` varchar(10) NOT NULL,
`nationality` varchar(100) NOT NULL,
`email` varchar(50) NOT NULL,
`phone` varchar(20) NOT NULL,
PRIMARY KEY (`passport`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `passenger` (`passport`, `lastname`, `firstname`, `dob`, `gender`,`nationality`,`email`,`phone`) VALUES
('Y12345678', 'Yifan', 'Wei', '02/10/1984', 'Female','Chinese','wyf102@gmail.com','+6512345678'),
('L12353567', 'Leonardo', 'Da Vinci', '15/04/1452', 'Male', 'Italian', 'ldv0415@gmail.com', '+658765432');
COMMIT;