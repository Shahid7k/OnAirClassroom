  DROP DATABASE IF EXISTS onairclassroom;  
     CREATE DATABASE onairclassroom;  
     \c onairclassroom;
CREATE TABLE broadcasters (
    id SERIAL PRIMARY KEY,
    socket_id VARCHAR,
    username VARCHAR,
    broadcaster_active BOOLEAN DEFAULT TRUE
);
