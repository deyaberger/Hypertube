create table movies
(
    id             mediumint auto_increment                 primary key,
    title          varchar(500)                                not null,
    imdb_rating    float         default 0                     not null,
    year           int                                         null,
    length_minutes int                                         null,
    language       varchar(20)                                 null,
    summary        varchar(4000)                               not null,
    director       varchar(300)                                null,
    actors         varchar(1000)                               null,
    yts_id         int                                         not null,
    imdb_code      varchar(20)                                 not null,
    tmdb_id        varchar(20)                                 null,
    max_seeds      int default 0                               null,

    constraint id        unique (id),
    constraint imdb_code unique (imdb_code),
    constraint yts_id    unique (yts_id)
);

create table genres
(
    id       mediumint auto_increment     primary key,
    movie_id mediumint                      not null,
    name     varchar(100)                   not null,

    constraint id unique (id),
    constraint genres_movies_id_fk
        foreign key (movie_id) references movies (id)
            on update cascade on delete cascade
);

create table images
(
    id       mediumint auto_increment primary key,
    movie_id mediumint                   not null,
    size     int default 0               not null,
    url      varchar(500)                not null,

    constraint id unique (id),
    constraint images_movies_id_fk
        foreign key (movie_id) references movies (id)
            on update cascade on delete cascade
);

create table torrents
(
    id         mediumint auto_increment  primary key,
    movie_id   mediumint                    not null,
    url        varchar(400)                 not null,
    hash       varchar(100)                 not null,
    quality    int default 0                not null,
    seeds      int default 0                not null,
    peers      int default 0                not null,
    size       varchar(40)                  not null,
    size_bytes varchar(40)                  not null,

    constraint hash unique (hash),
    constraint id   unique (id),
    constraint url  unique (url),
    constraint torrents_movies_id_fk
        foreign key (movie_id) references movies (id)
            on update cascade on delete cascade
);

create table users
(
    id         mediumint auto_increment                 primary key,
    username   varchar(50)                                not null,
    mail       varchar(100)                               null,
    first_name varchar(50)                                null,
    last_name  varchar(50)                                null,
    pass       varchar(300)                                not null,
    language   varchar(10) default 'en'                   not null,
    picture    varchar(300)                                null,
    bio        varchar(500)                                null,

    constraint users_id_uindex   unique (id),
    constraint users_name_uindex unique (username),
    constraint mail_uindex       unique (mail)
);

create table comments
(
    id       int auto_increment               primary key,
    user_id  mediumint                           not null,
    movie_id mediumint                           not null,
    content  varchar(500)                        not null,
    rating   float                               not null,
    date     timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,

    constraint comments_id_uindex unique (id),
    constraint number_range_check
        check(rating >= 0 and rating <= 10),
    constraint comments_movie_fk
        foreign key (movie_id) references movies (id)
            on update cascade on delete cascade,
    constraint comments_user_fk
        foreign key (user_id) references users (id)
            on update cascade on delete cascade
);

create table favorite_movies
(
    id       mediumint auto_increment primary key,
    movie_id mediumint                   not null,
    user_id  mediumint                   not null,

    constraint id                     unique (id),
    constraint no_duplicate_favorites unique (movie_id, user_id),
    constraint favorite_movies_movies_id_fk
        foreign key (movie_id) references movies (id)
            on update cascade on delete cascade,
    constraint favorite_movies_users_id_fk
        foreign key (user_id) references users (id)
            on update cascade on delete cascade
);

create table follows
(
    id          mediumint auto_increment primary key,
    follower_id mediumint                   not null,
    followed_id mediumint                   not null,

    constraint id unique (id),
    constraint no_duplicate_follows unique (followed_id, follower_id),
    constraint follows_followed_fk
        foreign key (followed_id) references users (id)
            on update cascade on delete cascade,
    constraint follows_follower_fk
        foreign key (follower_id) references users (id)
            on update cascade on delete cascade
);

create table reset_pass
(
    user_id      mediumint                           null,
    id_hash      varchar(300)                        null,
    last_updated timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,

    constraint user_reset___fk
        foreign key (user_id) references users (id)
            on delete cascade
);

create table watched_movies
(
    id       mediumint auto_increment primary key,
    movie_id mediumint                   not null,
    user_id  mediumint                   not null,
    last_updated timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,

    constraint id unique (id),
    constraint no_duplicate_watches unique (movie_id, user_id),
    constraint watched_movies_movies_id_fk
        foreign key (movie_id) references movies (id)
            on update cascade on delete cascade,
    constraint watched_movies_users_id_fk
        foreign key (user_id) references users (id)
            on update cascade on delete cascade
);

create table oauth
(
    user_id     mediumint    null,
    `42_id`     mediumint    null,
    `github_id` varchar(100) null,
    `google_id` varchar(100) null,
    `gitlab_id` varchar(100) null,
    constraint oauth_42_id_uindex
        unique (`42_id`),
    constraint oauth_github_id_uindex
        unique (`github_id`),
    constraint oauth_google_id_uindex
        unique (`google_id`),
    constraint oauth_gitlab_id_uindex
        unique (`gitlab_id`),
    constraint oauth_to_user_id
        foreign key (user_id) references users (id)
            on delete cascade
);

