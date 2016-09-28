drop table article;
drop table notice;
drop table option;
drop table report;
drop table user;
create table user (
	id integer primary key autoincrement,
	name varchar(32),
	email varchar(32),
	phone varchar(16),
	password char(32),
	wx varchar(32),
	role int default 0,
	created timestamp default CURRENT_TIMESTAMP
);

insert into user(email, password, role) values("moevery@gmail.com", "670b14728ad9902aecba32e22fa4f6bd", 1);
insert into user(email, password, role) values("moevery@163.com", "670b14728ad9902aecba32e22fa4f6bd", 0);

create table report (
	id integer primary key autoincrement,
	schoolName varchar(64),
	teamName varchar(64),
	entry integer,
	topic varchar(64),
	address varchar(255),
	userId integer,
	teachers varchar(1024) default "[]",
	students varchar(1024) default "[]",
	status integer default 0,
	created timestamp default CURRENT_TIMESTAMP
);

create table notice (
	id integer primary key autoincrement,
	userId integer,
	content varchar(500),
	status integer default 0,
	created timestamp default CURRENT_TIMESTAMP
);

create table article (
	id integer primary key autoincrement,
	title varchar(128),
	content text,
	created timestamp default CURRENT_TIMESTAMP
);

create table option (
	key varchar(32) primary key,
	value varchar(128) 
);

insert into option(key, value) values('START_DATE', '2012-12-12 22:22:22');
insert into option(key, value) values('END_DATE', '2023-12-12 22:22:22');

insert into article(id, title, content) values(0, 'title', 'content');
insert into article(id, title, content) values(1, 'title', 'content');
insert into article(id, title, content) values(2, 'title', 'content');