CREATE TABLE req_time
(
	id int,
    exec_time time,
    PRIMARY KEY(id)
);


ALTER TABLE req_time
MODIFY id int not null AUTO_INCREMENT;

CREATE TRIGGER user_trig AFTER INSERT on movies for EACH row 
INSERT INTO req_time(exec_time)values(Now());