-- userProfile schema

create table userProfileAuth(
    "userId" varchar primary key not null,
    "userName" varchar not null,
    "userEmail" varchar not null,
    "password" varchar not null,
    "userRole" varchar not null,
    "createdTS" varchar not null,
    "updatedTS" varchar not null
);


create table questions(
    "questionId" varchar primary key not null,
    "questionText" varchar not null,
    "teacherId" varchar not null,
    "isActive" varchar not null,
    "ttl" varchar,
    "createdTS" varchar not null,
    "updatedTS" varchar not null
);


-- Answer schema--------------
create table answer(
    "answerId" varchar primary key not null,
    "questionId" varchar not null,
    "userId" varchar not null,
    "answer" varchar not null,
    "createdTS" varchar not null,
    "updatedTS" varchar not null
);



