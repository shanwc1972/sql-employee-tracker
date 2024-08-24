const inquirer = require('inquirer');
const dbhandler = require('./dbhandler');

function mainMenu() {
  inquirer.prompt([
    {
        type: 'list',
        name: 'mainchoice',
        message: 'What would you like to do?',
        choices: ['View all employees', 'Add an employee', 'Update an employee role', 'View all departments', 'Add a department', 'View all roles', 'Add a role', 'Quit']
    },
  ]).then(answers => {
    switch (answers.mainchoice) {
        case 'Add a department':
            addDepartment();
            break;
        case 'Add a role':
            addRole();
            break;
        case 'Add an employee':
            addEmployee();
            break;
        case 'Update an employee role':
            updateEmployeeRole();
            break;
        case 'View all departments':
            viewDepartments();
            break;
        case 'View all roles':
            viewRoles();
            break;
        case 'View all employees':
            viewEmployees();
            break; 
        case 'Quit':
            console.log('Thank you for using employee tracker');
            break;
    }
  });
}

async function viewDepartments() {
    let objDepartments = await dbhandler.employeedbQuery('SELECT * FROM department;');
    console.table(objDepartments);
    mainMenu();
}

async function viewRoles() {
  let objRoles = await dbhandler.employeedbQuery(`SELECT role.id, title, department.name AS department, salary FROM role
      JOIN department ON role.department = department.id;`);
  console.table(objRoles);
  mainMenu();
}

async function viewEmployees() {
  let objEmployees = await dbhandler.employeedbQuery(
      `SELECT e1.id, e1.first_name, e1.last_name, title AS title, department.name AS department, role.salary AS salary, CONCAT(e2.first_name, ' ',e2.last_name) AS manager
      FROM employee e1
      LEFT JOIN employee e2 on e1.manager_id = e2.id
      JOIN role on role.id = e1.role_id
      JOIN department ON role.department = department.id;`);
  console.table(objEmployees);
  mainMenu();
}

function addDepartment() {
  inquirer.prompt([
    {
        type: 'input',
        name: 'department',
        message: 'Enter your new department name:',
    },
  ]).then(answers => {
    dbhandler.addDepartment(answers.department);
    console.log(`Department ${answers.department} added`);
    mainMenu();
  });
}

async function addRole() {
  let objDepartments = await dbhandler.employeedbQuery('SELECT name FROM department;');
  const arrDepartments = objDepartments.map(department => department.name);

  inquirer.prompt([
    {
        type: 'input',
        name: 'title',
        message: 'Enter a new role:',
      },
      {
        type: 'input',
        name: 'salary',
        message: `Enter the role's salary:`,
      },
      {
        type: 'list',
        name: 'department',
        message: `Enter which department this role will belong to:`,
        choices: arrDepartments
      },
  ]).then(answers => {
    dbhandler.addRole(answers.title, answers.salary, answers.department);
    console.log(`New role: ${answers.title} added`);
    mainMenu();
  });
}

async function addEmployee() {
  //Create an array of roles
  let objRoles = await dbhandler.employeedbQuery('SELECT title FROM role;');
  const arrRoles = objRoles.map(role => role.title);

  //Create an array of managers
  let objManagers = await dbhandler.employeedbQuery(`SELECT CONCAT(first_name, ' ', last_name) AS manager FROM employee e1;`);
  const arrManagers = objManagers.map(manager => manager.manager);

  inquirer.prompt([
      {
        type: 'input',
        name: 'firstname',
        message: `Enter the new employee's firstname:`,
      },
      {
        type: 'input',
        name: 'lastname',
        message: `Enter the new employee's lastname:`,
      },
      {
        type: 'list',
        name: 'role',
        message: `Enter the role for this new employee:`,
        choices: arrRoles
      },
      {
        type: 'list',
        name: 'manager',
        message: `Select the manager for this new employee:`,
        choices: arrManagers
      },
    ]).then(answers => {
      dbhandler.addEmployee(answers.firstname, answers.lastname, answers.role, answers.manager);
      console.log(`New employee: ${answers.firstname} ${answers.lastname} added`)
      mainMenu();
    });
  }

async function updateEmployeeRole() {
    //Create an array of employees
    let objEmployees = await dbhandler.employeedbQuery(`SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee e1;`);
    const arrEmployees = objEmployees.map(employee => employee.name);
    //Create an array of roles
    let objRoles = await dbhandler.employeedbQuery('SELECT title FROM role;');
    const arrRoles = objRoles.map(role => role.title);

    inquirer.prompt([
        {
            type: 'list',
            name: 'employeename',
            message: `Select a name for the employee you wish to update:`,
            choices: arrEmployees
          },
          {
            type: 'list',
            name: 'employeerole',
            message: `Select which role that this employee will perform:`,
            choices: arrRoles
          },
    ]).then(answers => {
      dbhandler.updateEmployeeRole(answers.employeename, answers.employeerole);
      console.log(`Role for employee: ${answers.employeename} has been updated`);
      mainMenu();
    });
}

console.log('----------------');
console.log('Employee tracker')
console.log('----------------');
mainMenu();