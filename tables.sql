CREATE TABLE Users (
    username varchar(20) NOT NULL,
    email varchar(50) NOT NULL,
    hours int DEFAULT 0,
    admin boolean DEFAULT false,
    PRIMARY KEY (email)
);

CREATE TABLE Login (
    email varchar(50) NOT NULL,
    password varchar(20) NOT NULL,
    CONSTRAINT FK_UserLogin FOREIGN KEY (email) REFERENCES Users(email)
);


INSERT INTO Users (username, email)
VALUES ('css', 'css@gmail.com');

INSERT INTO Login (email, password)
VALUES ('css@gmail.com', 'cookies');


INSERT INTO Users (username, email)
VALUES ('sunny', 'sunny@gmail.com');

INSERT INTO Login (email, password)
VALUES ('sunny@gmail.com', 'flower');