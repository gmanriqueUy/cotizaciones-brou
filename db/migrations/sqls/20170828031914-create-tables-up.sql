CREATE TABLE `currency` (
  `iso` varchar(3) NOT NULL,
  `name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `currencyDay` (
  `iso` varchar(3) NOT NULL,
  `date` date NOT NULL,
  `buy` float(5,2) DEFAULT NULL,
  `sell` float(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `currency`
  ADD PRIMARY KEY (`iso`);

ALTER TABLE `currencyDay`
  ADD PRIMARY KEY (`iso`,`date`),
  ADD KEY `day` (`date`);

ALTER TABLE `currencyDay`
  ADD CONSTRAINT `currencyDay_ibfk_1` FOREIGN KEY (`iso`) REFERENCES `currency` (`iso`);