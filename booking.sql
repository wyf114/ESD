CREATE DATABASE IF NOT EXISTS `booking` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `booking`;

DROP TABLE IF EXISTS `booking`;
CREATE TABLE IF NOT EXISTS `booking` (
passport varchar(50) NOT NULL,
lastname varchar(100) NOT NULL,
firstname varchar(100) NOT NULL,
dob Date NOT NULL,
gender varchar(10) NOT NULL,
nationality varchar(100) NOT NULL,
email varchar(50) NOT NULL,
phone varchar(20) NOT NULL,
flightNumber varchar(50) NOT NULL,
departureDate Date NOT NULL,
departureCity varchar(100) NOT NULL,
arrivalCity varchar(100) NOT NULL,
departureTime varchar(50) NOT NULL,
arrivalTime varchar(50) NOT NULL,
flightNumber2 varchar(50) NOT NULL,
departureDate2 Date NOT NULL,
departureCity2 varchar(100) NOT NULL,
arrivalCity2 varchar(100) NOT NULL,
departureTime2 varchar(50) NOT NULL,
arrivalTime2 varchar(50) NOT NULL,
price Float NOT NULL,
bookingStatus varchar(50) NOT NULL,
bookingId varchar(100) NOT NULL,

PRIMARY KEY (`bookingId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `booking` (`passport`, `lastname`, `firstname`, `dob`, `gender`,`nationality`,`email`,`phone`,
`flightNumber`, `departureDate`, `departureCity`, `arrivalCity`, `departureTime`, `arrivalTime`, `flightNumber2`, `departureDate2`, `departureCity2`, `arrivalCity2`, `departureTime2`, `arrivalTime2`,`price`, `bookingStatus`, `bookingId`) VALUES
('Y12345678', 'Yifan', 'Wei', '14-01-1999', 'Female','Chinese','wyf102@gmail.com','+6512345678',
'MF5045', '2022-10-02', 'Singapore', 'Beijing', '20:15', '23:20', 'MF5055', '2022-10-06', 'Beijing', 'Singapore', '10:15', '13:20', '500.00', 'Pending', 'MF5045Y12345678'),
('Y12345678', 'Yifan', 'Wei', '14-01-1992', 'Female','Chinese','wyf102@gmail.com','+6512345678',
'MF5976', '2022-12-03', 'Singapore', 'Beijing', '18:15', '20:05','MF5966', '2022-12-09', 'Beijing', 'Singapore', '08:15', '10:05', '500.00', 'Pending', 'MF5976Y12345678');

-- ('L12353567', 'Leonardo', 'Da Vinci', '15/04/1452', 'Male', 'Italian', 'ldv0415@gmail.com', '+658765432');
COMMIT;