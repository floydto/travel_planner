# PostgreSQL
## Authentication Methods
[Authentication Methods](https://www.postgresql.org/docs/9.1/auth-methods.html)  
[What is the Default Password for PostgreSQL?](https://www.liquidweb.com/kb/what-is-the-default-password-for-postgresql)  
By default, when PostgreSQL is installed, a postgres user is also added, there isn’t a default password. The default authentication mode for PostgreSQL is set to ident.  
What is the ident authentication method? Well, it works by taking the OS username you’re operating as and comparing it with the allowed database username(s). There is optional username mapping.  
[Postgresql: password authentication failed for user “postgres”](https://stackoverflow.com/questions/7695962/postgresql-password-authentication-failed-for-user-postgres)  
## insert column with order
[Is there any reason to worry about the column order in a table?](https://stackoverflow.com/questions/894522/is-there-any-reason-to-worry-about-the-column-order-in-a-table)  
## about naming databases and tables
We should use lowercase and _ for naming database and table, as SQL will change all command to lowercase. If uppercase is used, you have to use "" to enclose the name.  
" for database and table name, ' for string.
# Commands
## start
[Psql could not connect to server: No such file or directory, 5432 error?](https://stackoverflow.com/questions/42653690/psql-could-not-connect-to-server-no-such-file-or-directory-5432-error)  
```bash
sudo service postgresql start
```  
### login to psql shell
Because PostgreSQL comes a user called postgres which is the admin user of your server. The account postgres can perform all tasks on the database. We can run the following to switch to that user,  
```bash
sudo su postgres
```  
Using the Peer authentication, we don't need a password to login to the DB if you are using postgres user. We can then login to the DB by running the following in your terminal.  
```bash
psql
```  
You should see something similar in your terminal.  
```
postgres=#
```  
We are now using the PostgreSQL Shell . Previously we are using the Bash shell. You can easily distinguish these two shells by the following rule:  
- Bash Shell ends with $ the dollar sign. You can only run bash command like mv,cp here.  
- PostgreSQL shell ends with # the hash sign. You can only run SQL statements here.  

In the PostgreSQL Shell, run the following to create the DB.  
```SQL
CREATE Database your-username;
```  
This step is important, since by default , psql connect to the DB name with your username, when db name is omitted.  
PLEASE note that the colon is necessary for this SQL statement to work properly! Every SQL statement MUST end with a colon. We are going to run the following to create your own user for the DB.  
```
CREATE USER your-username-here WITH PASSWORD 'your-password-here' SUPERUSER;
```  
We advise you to use the same username as your system user since it allows a mechanism called peer authentication which allows you to login directly without providing password.  
After that, you can exit from the PostgreSQL Shell by running \q.  
Now you should able to login to PostgreSQL shell using psql alone.  
psql is actually a shorthand of a full-version command. Here is the full format:  
`psql -U <user_name> -W -h <hostname> <db_name>`  
- -U requires user_name which is the username of PostgreSQL Server. -U provides the username to the command psql. If you omit this flag, then the default username is your bash's username.
- -W requires you to login with password. Please note that you have to log in with password if you are logging in remotely.
- -h provides the hostname of the database server. The default value is localhost. Please omit this flag if you want the peer authentication to be effective.
- The last parameter is the database name. The default value is your username in bash.  

### show connection information
[How to check connected user on psql](https://stackoverflow.com/questions/39735141/how-to-check-connected-user-on-psql)  
```\conninfo```  
### show version
[Which version of PostgreSQL am I running?](https://stackoverflow.com/questions/13733719/which-version-of-postgresql-am-i-running)  
```SQL
SELECT version();
```  
## user
### change user
[How to Disconnect from a database and go back to the default database in PostgreSQL?](https://stackoverflow.com/questions/17963348/how-to-disconnect-from-a-database-and-go-back-to-the-default-database-in-postgre)  
swith to db postgres as role postgres:  
```\c postgres postgres```  
### list users
[PostgreSQL List Users](https://www.postgresqltutorial.com/postgresql-list-users/)  
```
postgres=# \du
postgres=#\du+
```  
### change user password
[PostgreSQL: How to change PostgreSQL user password?](https://stackoverflow.com/questions/12720967/postgresql-how-to-change-postgresql-user-password)  
```
ALTER USER user_name WITH PASSWORD 'new_password';
```  
## Database
### list database
[PostgreSQL Show Databases](https://www.postgresqltutorial.com/postgresql-show-databases/)  
If you are using the psql tool to connect to PostgreSQL database server, you can issue the ```\l``` command to shows all databases in the current server.  
```
postgres=# \l
```  
If you want to get more information, you can use the ```\l+``` command.  
Listing databases in PostgreSQL using SELECT statement:  
```SQL
SELECT datname FROM pg_database;
```  
### change database
```
\c <db_name>
```  
## Table
### list table
[PostgreSQL Show Tables](https://www.postgresqltutorial.com/postgresql-show-tables/)  
```
\d #show all relation
\dt #show table
\dt+ #more info
```  
[How to check if a table exists in a given schema](https://stackoverflow.com/questions/20582500/how-to-check-if-a-table-exists-in-a-given-schema)  
```SQL
SELECT EXISTS (
   SELECT FROM pg_tables
   WHERE  schemaname = 'schema_name'
   AND    tablename  = 'table_name'
   );
```  
or `to_regclass(rel_name)` in Postgres 9.4+  
```
SELECT to_regclass('schema_name.table_name');
```  
### find schema_name
[Connect to PostgreSQL and Show the Table Schema](https://kb.objectrocket.com/postgresql/connect-to-postgresql-and-show-the-table-schema-967)  
You can also use a SELECT statement to show the pg_catalog schema for all tables in the current database:  
```SQL
SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';
```  
In this query, we used a condition in the WHERE clause to filter system tables.  
### details for a table
```\d+ <table_name>```  
### show all rows in a table
```SQL
SELECT * FROM <table_name>
```  
# Connect to PostgreSQL with different programming language
## Node.js javascript
```bash
npm install pg
```  
[pg.Client](https://node-postgres.com/api/client)  
# Constraints
[5.3.5. Foreign Keys](https://www.postgresql.org/docs/9.2/ddl-constraints.html)  
A foreign key constraint specifies that the values in a column (or a group of columns) must match the values appearing in some row of another table. We say this maintains the referential integrity between two related tables.  
# Postgre supported SQL
## RETURNING clause
[6.4. Returning Data From Modified Rows](https://www.postgresql.org/docs/9.5/dml-returning.html)  
The INSERT, UPDATE, and DELETE commands all have an optional RETURNING clause. Use of RETURNING avoids performing an extra database query to collect the data, and is especially valuable when it would otherwise be difficult to identify the modified rows reliably.  
The allowed contents of a RETURNING clause are the same as a SELECT command's output list.  
[RETURNING in PostgreSQL](https://dzone.com/articles/the-returning-keyword-in-postgresql)  
returning clause is used to obtain the values of columns or calculated value from modified rows while they are being manipulated.  
[RETURNING INTO Clause in Oracle database](https://docs.oracle.com/cd/B19306_01/appdev.102/b14261/returninginto_clause.htm)  