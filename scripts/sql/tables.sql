CREATE TABLE `currency` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `crypto_currency` varchar(20) NOT NULL,
  `currency` varchar(20) NOT NULL,
  `type` varchar(20) NOT NULL,
  `data` JSON NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
