-- CREATE DATABASE itinerary_share
--     WITH OWNER 'postgres'
--     ENCODING 'UTF8'
--     LC_COLLATE = 'en_US.UTF-8'
--     LC_CTYPE = 'en_US.UTF-8'
--     TEMPLATE template0;
    
-- // for mac to initialize database
    


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);
--ALTER TABLE users ALTER COLUMN email SET NOT NULL;
--ALTER TABLE users ALTER COLUMN username DROP NOT NULL;
insert into users (username,email,password, created_at, updated_at) values ('user1','test@gmail.com','12345', now(), now()); 
insert into users (username,email,password, created_at, updated_at) values ('user2','test2@gmail.com','12345', now(), now());
insert into users (username,email,password, created_at, updated_at) values ('user0','test0@gmail.com','$2a$10$15cCJ2hgctNzL/6dE66p9.sxvEa0z/oLLB6tAAOrC1/3Am8/M/q6y', now(), now());


CREATE TABLE itinerary (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    love INTEGER DEFAULT 0, --Since like is SQL Operator, we should use love instead of like for the column name.
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    users_id INTEGER,
    FOREIGN KEY (users_id) REFERENCES users(id)
);

insert into itinerary (title,love, created_at, updated_at, users_id) values ('itineraryA',15, now(), now(), '1'); 
insert into itinerary (title,love, created_at, updated_at, users_id) values ('itineraryB',117, now(), now(), '2'); 
insert into itinerary (title,love, created_at, updated_at, users_id) values ('itineraryC',99, now(), now(), '1'); 
insert into itinerary (title,love, created_at, updated_at, users_id) values ('itineraryD',122, now(), now(), '4'); 
insert into itinerary (title,love, created_at, updated_at, users_id) values ('itineraryE',324, now(), now(), '4'); 
insert into itinerary (title,love, created_at, updated_at, users_id) values ('itineraryF',21, now(), now(), '4'); 

--https://developers.google.com/maps/documentation/directions/overview#TransitDetails
CREATE TABLE transport (
    id SERIAL PRIMARY KEY,
    transit_line_name VARCHAR(255),
    vehicle_type VARCHAR(255),
    arrival_stop VARCHAR(255),
    departure_stop VARCHAR(255),
    arrival_time TIMESTAMP,
    departure_time TIMESTAMP
);


CREATE TABLE place (
    id SERIAL PRIMARY KEY,
    google_place_id VARCHAR(255), --Google place ID is a textual identifier that uniquely identifies a place. The length of the identifier may vary.
    name VARCHAR(255),
    address VARCHAR(255),
    description TEXT,
    love INTEGER DEFAULT 0
);
--ALTER TABLE place ADD COLUMN address VARCHAR(255);
insert into place (google_place_id,name,DESCRIPTION, love) values ('123321','Universal Studios Japan','good place',12);
insert into place (google_place_id,name,DESCRIPTION, love) values ('123456','Osaka Castle','It is a Japanese castle in chuo_ku, Osaka, Japan. The castle is one of Japan s most famous landmarks and it played a major role in the unification of Japan during the sixteenth century of the Azuchi-Momoyama period.',992);
insert into place (google_place_id,name,DESCRIPTION, love) values ('020301','東京晴空塔',' bad place',77);
insert into place (google_place_id,name,DESCRIPTION, love) values ('446601 ','DisneyLand','V bad place',2);
insert into place (google_place_id,name,DESCRIPTION, love) values ('522222','富士山','normal place',37);

CREATE TABLE place_img (
    id SERIAL PRIMARY KEY,
    img_path VARCHAR(255),
    created_at TIMESTAMP  DEFAULT NOW(),
    place_id INTEGER,
    FOREIGN KEY (place_id) REFERENCES place(id)
);
--ALTER TABLE place_img drop column name;
insert into place_img (img_path, place_id) values ('img/usj.jpg', '1');
insert into place_img (img_path, place_id) values ('img/tyokoskytree.jpg', '2');
insert into place_img (img_path, place_id) values ('img/disneyland.jpg', '3');
insert into place_img (img_path, place_id) values ('img/fujimount.jpg', '4');
insert into place_img (img_path, place_id) values ('img/osakacastle.jpg', '5');


--Which data type for latitude and longitude?
--https://stackoverflow.com/questions/8150721/which-data-type-for-latitude-and-longitude
CREATE TABLE visit (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    latitude NUMERIC,
    longitude NUMERIC,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    memo_title VARCHAR(255),
    memo_content TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    itinerary_id INTEGER,
    transport_id INTEGER,
    place_id INTEGER,
    FOREIGN KEY (itinerary_id) REFERENCES itinerary(id),
    FOREIGN KEY (transport_id) REFERENCES transport(id),
    FOREIGN KEY (place_id) REFERENCES place(id)
);

insert into visit (name,latitude,longitude,start_time,end_time, memo_title,memo_content, itinerary_id,transport_id, place_id) values ('visit1',100,200,'now()','now()' ,'memo1','memoC1', '1',null, '1'); 
insert into visit (name,latitude,longitude,start_time,end_time, memo_title,memo_content, itinerary_id,transport_id, place_id) values ('visit2',300,250,'now()','now()' ,'memo2','memoC3', '2',null, '2'); 
insert into visit (name,latitude,longitude,start_time,end_time, memo_title,memo_content, itinerary_id,transport_id, place_id) values ('visit3',305,257,'now()','now()' ,'memo2','memoC3', '3',null, '3'); 

CREATE TABLE memo_img (
    id SERIAL PRIMARY KEY,
    img_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    visit_id INTEGER,
    FOREIGN KEY (visit_id) REFERENCES visit(id)
);

--ALTER TABLE memo_img drop column name;

/*
ALTER TABLE memo_img DROP CONSTRAINT memo_img_memo_id_fkey;
ALTER TABLE memo_img RENAME COLUMN memo_id TO visit_id;
ALTER TABLE memo_img ADD FOREIGN KEY (visit_id) REFERENCES visit(id);
DROP TABLE memo;
ALTER TABLE visit ADD COLUMN memo_title VARCHAR(255);
ALTER TABLE visit ADD COLUMN memo_content TEXT;
*/

--drop img name.
/*
ALTER TABLE memo_img DROP COLUMN name;
ALTER TABLE place_img DROP COLUMN name;
*/

--new data for demo
--0. CREATE TABLE   users, place,itinerary, place_img, visit
--1. sign up 2acc / user01 user01@gmail.com Pw111111/ user02 user02@gmail.com Pw222222
--2. insert 3 itinerary
insert into itinerary (title,love, created_at, updated_at, users_id) values ('itineraryA',15, now(), now(), '1'); 
insert into itinerary (title,love, created_at, updated_at, users_id) values ('itineraryB',117, now(), now(), '2'); 
insert into itinerary (title,love, created_at, updated_at, users_id) values ('itineraryC',99, now(), now(), '1');
--3  insert 6 places
insert into place (google_place_id,name,DESCRIPTION, love) values ('123321','Universal Studios Japan','good place',12);
insert into place (google_place_id,name,DESCRIPTION, love) values ('123456','Osaka Castle','It is a Japanese castle in chuo_ku, Osaka, Japan. The castle is one of Japan s most famous landmarks and it played a major role in the unification of Japan during the sixteenth century of the Azuchi-Momoyama period.',992);
insert into place (google_place_id,name,DESCRIPTION, love) values ('020301','東京晴空塔',' bad place',77);
insert into place (google_place_id,name,DESCRIPTION, love) values ('446601 ','DisneyLand','V bad place',2);
insert into place (google_place_id,name,DESCRIPTION, love) values ('522222','富士山','normal place',37);
insert into place (google_place_id,name,DESCRIPTION, love) values ('512345','明治神宮','new place for test',0);
--4 insert 6 place_img
insert into place_img (img_path, place_id) values ('img/usj.jpg', '1');
insert into place_img (img_path, place_id) values ('img/osakacastle.jpg', '2');
insert into place_img (img_path, place_id) values ('img/tyokoskytree.jpg', '3');
insert into place_img (img_path, place_id) values ('img/disneyland.jpg', '4');
insert into place_img (img_path, place_id) values ('img/fujimount.jpg', '5');
insert into place_img (img_path, place_id) values ('img/meijishrine.jpg', '6');
--4 insert 5 visit
insert into visit (name,latitude,longitude,start_time,end_time, memo_title,memo_content, itinerary_id,transport_id, place_id) values ('大阪城',100,200,'now()','now()' ,'memo1','memoC1', '1',null, '2'); 
insert into visit (name,latitude,longitude,start_time,end_time, memo_title,memo_content, itinerary_id,transport_id, place_id) values ('東京晴空塔',300,250,'now()','now()' ,'memo2','memoC3', '1',null, '3'); 
insert into visit (name,latitude,longitude,start_time,end_time, memo_title,memo_content, itinerary_id,transport_id, place_id) values ('日本環球影城',305,257,'now()','now()' ,'memo2','memoC3', '1',null, '1'); 
insert into visit (name,latitude,longitude,start_time,end_time, memo_title,memo_content, itinerary_id,transport_id, place_id) values ('明治神宮',-90,257,'now()','now()' ,'memo2','memoC3', '2',null, '6'); 
insert into visit (name,latitude,longitude,start_time,end_time, memo_title,memo_content, itinerary_id,transport_id, place_id) values ('Fuji Mount',305,-8,'now()','now()' ,'memo2','memoC3', '3',null, '5'); 
