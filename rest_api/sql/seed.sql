INSERT INTO users
    (first_name, last_name, mail, pass, language, picture, username)
VALUES ('jojo', 'bojo', 'bb@mail.com', 'pass', 'en', 'pic.com', 'jojobo');



INSERT INTO movies
    (name, score, year, lenth, language)
VALUES ('marvel', 3, 2017, 1.7, 'en');

INSERT INTO movies
    (name, score, year, lenth, language)
VALUES ('thor', 5, 2020, 0.8, 'en');


INSERT INTO comments
    (text, author_id, movie_id)
VALUES ('It suuucks', 1, 1);

INSERT INTO comments
    (text, author_id, movie_id)
VALUES ('I loved it', 1, 1);

INSERT INTO subtitles
    (movie_id, language, name)
VALUES (2, 'en', 'ensub-movie-lol');

INSERT INTO subtitles
    (movie_id, language, name)
VALUES (2, 'fr', 'frsub-submax thor');
