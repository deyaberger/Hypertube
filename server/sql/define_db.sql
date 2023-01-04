create table users
(
    id         int auto_increment primary key,
    first_name varchar(100)               not null,
    last_name  varchar(100)               not null,
    mail       varchar(100)               not null,
    pass       varchar(300)               not null,
    language   varchar(100) default 'en'  not null,
    picture    varchar(300)               null,
    username   varchar(100)               not null,

    constraint users_id_uindex     unique (id),
    constraint users_name_uindex   unique (username),
    constraint users_mail_uindex   unique (mail)
);


create table comments
(
    id             int auto_increment primary key,
    content        varchar(400) not null,
    author_id      int          not null,
    movie_imdb_id  varchar(100)          not null,
    date           timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,

    constraint comments_id_uindex
        unique (id),
    constraint comments_users_id_fk
        foreign key (author_id) references users (id)
            on update cascade on delete cascade
);

create table watched_movies
(
    user_id        int          not null,
    movie_imdb_id  varchar(100)          not null,
    date           timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    
    constraint no_duplicate_watches
        unique (user_id, movie_imdb_id),
    constraint watched_users_id_fk
        foreign key (user_id) references users (id)
            on update cascade on delete cascade
);

create table downloaded_movies
(
    id            int auto_increment  primary key,
    movie_imdb_id varchar(100)          not null,
    file_path     varchar(500)          not null,
    file_size     bigint                not null,
    date          timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
);

create table movies_info
(
    id                 int auto_increment primary key,
    movie_imdb_id      varchar(100)			 not null,
	title              varchar(500)			 not null,
	imbd_rate		   float				 not null,
	release_year	   int					 not null,
	genre			   varchar(100)			 not null,
	cover_image		   varchar(500)			 not null
);


create table reset_pass
(
    user_id      int                                 null,
    id_hash      varchar(300)                        null,
    last_updated timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,

    constraint user_reset___fk
        foreign key (user_id) references users (id)
            on delete cascade
);
