CREATE TABLE coins_table (
    id INT KEY NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    short_description TEXT NOT NULL,
    `description` TEXT NOT NULL,
    issuing_country VARCHAR(255) NOT NULL,
    composition VARCHAR(255) NOT NULL,
	quality VARCHAR(255) NOT NULL,
    denomination  VARCHAR(255) NOT NULL,
	`year` INT NOT NULL,
    weight  DOUBLE NOT NULL,
    price  DOUBLE NOT NULL,
    avers_img VARCHAR(255) NOT NULL,
    revers_img VARCHAR(255) NOT NULL,
    coin_type VARCHAR(255) NOT NULL,
    show_coin INT DEFAULT 1
);

CREATE TABLE users (
id INT KEY NOT NULL AUTO_INCREMENT,
login VARCHAR(255) NOT NULL,
salt VARCHAR(255) NOT NULL,
`hash` VARCHAR(255) NOT NULL,
`status`  INT DEFAULT 1
);


CREATE TABLE users_token (
user_id INT  KEY NOT NULL,
token VARCHAR(255)  NOT NULL,
`status` INT NOT NULL
);

CREATE TABLE users_history (
id BIGINT KEY NOT NULL AUTO_INCREMENT,
user_id INT NOT NULL,
coin_id INT NOT NULL,
`name` varchar(255) not null,
short_description varchar(255) not null,
avers_img varchar(255) not null
);
