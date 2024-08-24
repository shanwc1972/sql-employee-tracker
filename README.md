# SQL Employee Tracker
  
## Description
 This is an application that will make changes to an Employee Tracker Postgres database, using a series of Inquirer prompts. The application includes the methods of adding a new employee, creating a new department, creating new roles and assigning an employee to a new role.

## Table of contents
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [Tests](#tests)
  - [License](#license)
  
## Installation
This program requires the the use of Node.js. Node.js will need to be installed, along with the both the inquirer 8.2.4 and PG packages.
Installation of the inquirer package requires that the following be entered: npm i inquirer@8.2.4

Installation of the PG package requires that the following be entered: npm install pg

Alternately both can be included as dependencies within the package.json file 

## Usage
Application can be started by opening a terminal session within the application's installed folder and running: node index.js. You will be presented with a main menu where you can select to:
1. View all employees
2. Add a new employee
3. Update an employee's role
4. View all departments
5. Create a new department
6. View all roles
7. Create a new role

On selecting a menu item, the selection will be executed and upon completion you will be returned to the main menu. If selecting any item to add or update the details of an employee, department or role, you will prompted with further questions. Upon answering all questions, a text notice will advise whether the action was successful or not.

All data is stored within a Postgres database called employee_db. Which can queried directly through the PSQL command line as well as PG Admin. 

A video showing a demonstration of the application can be found below:
  
## Contributing
All code either written or refactored by Warren Shan.
  
## Tests
The following steps can be performed to assess   
  
## License
None