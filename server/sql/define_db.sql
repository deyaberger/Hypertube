create table hyperdb.movies
(
    id             mediumint auto_increment
        primary key,
    yts_id         int                                         not null,
    imdb_code      varchar(20)                                 not null,
    title          varchar(500)                                not null,
    imdb_rating    float         default 0                     not null,
    year           int                                         null,
    length_minutes int                                         null,
    language       varchar(20)                                 null,
    summary        varchar(1500) default 'No summary provided' not null,
    constraint id
        unique (id),
    constraint imdb_code
        unique (imdb_code),
    constraint yts_id
        unique (yts_id)
);

create table hyperdb.genres
(
    id       mediumint auto_increment
        primary key,
    movie_id mediumint    not null,
    name     varchar(100) not null,
    constraint id
        unique (id),
    constraint genres_movies_id_fk
        foreign key (movie_id) references hyperdb.movies (id)
            on update cascade on delete cascade
);

create table hyperdb.images
(
    id       mediumint auto_increment
        primary key,
    movie_id mediumint     not null,
    size     int default 0 not null,
    url      varchar(500)  not null,
    constraint id
        unique (id),
    constraint images_movies_id_fk
        foreign key (movie_id) references hyperdb.movies (id)
            on update cascade on delete cascade
);

create table hyperdb.torrents
(
    id         mediumint auto_increment
        primary key,
    movie_id   mediumint     not null,
    url        varchar(400)  not null,
    hash       varchar(100)  not null,
    quality    int default 0 not null,
    seeds      int default 0 not null,
    peers      int default 0 not null,
    size       varchar(40)   not null,
    size_bytes mediumint     not null,
    constraint hash
        unique (hash),
    constraint id
        unique (id),
    constraint url
        unique (url),
    constraint torrents_movies_id_fk
        foreign key (movie_id) references hyperdb.movies (id)
            on update cascade on delete cascade
);

create table hyperdb.users
(
    id         mediumint auto_increment
        primary key,
    first_name varchar(100)                                not null,
    last_name  varchar(100)                                not null,
    mail       varchar(100)                                not null,
    pass       varchar(300)                                not null,
    language   varchar(100) default 'en'                   not null,
    picture    varchar(300)                                null,
    username   varchar(100)                                not null,
    bio        varchar(500)                                null,
    city       varchar(100) default 'Citizen of the world' null,
    constraint users_id_uindex
        unique (id),
    constraint users_mail_uindex
        unique (mail),
    constraint users_name_uindex
        unique (username)
);

create table hyperdb.comments
(
    id       int auto_increment
        primary key,
    content  varchar(400)                        not null,
    user_id  mediumint                           not null,
    movie_id mediumint                           not null,
    date     timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint comments_id_uindex
        unique (id),
    constraint comments_movie_fk
        foreign key (movie_id) references hyperdb.movies (id)
            on update cascade on delete cascade,
    constraint comments_user_fk
        foreign key (user_id) references hyperdb.users (id)
            on update cascade on delete cascade
);

create table hyperdb.favorite_movies
(
    id       mediumint auto_increment
        primary key,
    movie_id mediumint not null,
    user_id  mediumint not null,
    constraint id
        unique (id),
    constraint no_duplicate_favorites
        unique (movie_id, user_id),
    constraint favorite_movies_movies_id_fk
        foreign key (movie_id) references hyperdb.movies (id)
            on update cascade on delete cascade,
    constraint favorite_movies_users_id_fk
        foreign key (user_id) references hyperdb.users (id)
            on update cascade on delete cascade
);

create table hyperdb.follows
(
    id          mediumint auto_increment
        primary key,
    follower_id mediumint not null,
    followed_id mediumint not null,
    constraint id
        unique (id),
    constraint no_duplicate_follows
        unique (followed_id, follower_id),
    constraint follows_followed_fk
        foreign key (followed_id) references hyperdb.users (id)
            on update cascade on delete cascade,
    constraint follows_follower_fk
        foreign key (follower_id) references hyperdb.users (id)
            on update cascade on delete cascade
);

create table hyperdb.reset_pass
(
    user_id      mediumint                           null,
    id_hash      varchar(300)                        null,
    last_updated timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint user_reset___fk
        foreign key (user_id) references hyperdb.users (id)
            on delete cascade
);

create table hyperdb.watched_movies
(
    id       mediumint auto_increment
        primary key,
    movie_id mediumint not null,
    user_id  mediumint not null,
    constraint id
        unique (id),
    constraint no_duplicate_watches
        unique (movie_id, user_id),
    constraint watched_movies_movies_id_fk
        foreign key (movie_id) references hyperdb.movies (id)
            on update cascade on delete cascade,
    constraint watched_movies_users_id_fk
        foreign key (user_id) references hyperdb.users (id)
            on update cascade on delete cascade
);

