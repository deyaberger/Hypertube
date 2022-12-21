create table movies
(
    id       int auto_increment
        primary key,
    name     varchar(300) not null,
    score    float        null,
    year     int          null,
    lenth    float        null,
    language varchar(100) null,
    constraint movies_id_uindex
        unique (id)
);

create table subtitles
(
    id       int auto_increment
        primary key,
    movie_id int          not null,
    language varchar(100) null,
    name     varchar(300) not null,
    constraint subtitles_id_uindex
        unique (id)
);

create table users
(
    id         int auto_increment
        primary key,
    first_name varchar(100)               not null,
    last_name  varchar(100)               not null,
    mail       varchar(100)               not null,
    pass       varchar(300)               not null,
    language   varchar(100) default 'eng' not null,
    picture    varchar(300)               null,
    username   varchar(100)               not null,
    constraint users_id_uindex
        unique (id)
);


create table comments
(
    id        int auto_increment
        primary key,
    text      varchar(400) not null,
    author_id int          not null,
    movie_id  int          not null,
    date      timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint comments_id_uindex
        unique (id),
    constraint comments_movies_id_fk
        foreign key (movie_id) references movies (id)
            on update cascade on delete cascade,
    constraint comments_users_id_fk
        foreign key (author_id) references users (id)
            on update cascade on delete cascade
);

