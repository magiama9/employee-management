# employee-management-tool

## About This Tool

This is a command line tool allowing management of business hierarchy using a MySQL database. Users are able to view, add, and update departments, roles, and employees. Output is displayed and formatted in an easy-to-read table.

### Installation & Operation

1. Run `npm i` in your working directory after cloning this repository to install the necessary dependencies.

2. Begin a MySQL server instance and change the settings in `\employee-controls.js` to reflect your database settings and password.

3. If you do not already have an established database, please run `\db\schema.sql` and `\db\seed.sql` in your preferred MySQL interface to initialize and seed the database for demonstration functionality.

4. Run `node employee-controls.js` in your working directory to initialize the tool.

## Technical

### DB Organization

Database is split into three tables with associated foreign keys. See schema below for a visual representation. Queries are made aynchronously and independently to the MySQL Database.

NOTE: No joins are required to implement basic functionality as described in `\instructions\instructions.md`. I probably still should have used some. Whoops.

### DB Schema

![Database Schema](https://github.com/magiama9/fuzzy-cuyahoga/blob/master/Assets/schema.png)

### Node Dependencies

* Inquirer --- Used for prompting the user and accepting input

* MySQL --- Used to connect to a MySQL database via Node

* Console.Table --- Replaces default Node console.table functionality for improved display of table content
