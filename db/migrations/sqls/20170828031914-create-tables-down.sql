ALTER TABLE `currencyDay`
  DROP FOREIGN KEY `currencyDay_ibfk_1`;
ALTER TABLE `currencyDay`
  DROP FOREIGN KEY `currencyDay_ibfk_2`;

DROP TABLE `currencyDay`;
DROP TABLE `currency`;
DROP TABLE `day`;