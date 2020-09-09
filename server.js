// 'use strict';
// Dependencies
const inquirer = require('inquirer');
const logo = require('asciiart-logo');
const prompts = require('./prompts');
const db = require('./db');
const connection = require('./db/connection');
require('console.table');


// Init function with asciiart-logo and mainPrompt() call
init();

function init() {
  const logoText = logo({ name: 'Employee Tracker' }).render();
  console.log(logoText);
  mainPrompt();
}

// --------------------------------------------------------------
// Method 1: Async function mainPrompt() / bringing inquirer and
// destructuring its response, using { choice } as the variable to
// pull out choice from the promise object returned, so no need to
// use choice.choice before switch case / See prompts.js / CRUD:

async function mainPrompt() {
    const { choice } = await inquirer.prompt(prompts.mainPrompt);

    switch (choice) {
        case 'View all employees':
            viewAllEmployees(); // Read from db
            break;
        case 'View all roles':
            viewAllRoles();
            break;
        case 'View all departments':
            viewAllDepartments();
            break;
        case 'View employees by department':
            viewEmployeesByDepartment();
            break;
        case 'View employees by manager':
            viewEmployeesByManager();
            break;
        case 'Add a new employee':
            addEmployee();
            break;
        case 'Add a new role':
            addNewRole();
            break;
        case 'Add a new department':
            addDepartment();
            break;
        case 'Update employee':
            updateEmployeeDetails();
            break;        
        case 'Exit':
            exit(); // Function to exit the app
            break;
    };
};

// --------------------------------------------------------------
// Async functions / db calls / print tables to console.log

async function viewAllEmployees() {
    const employees = await db.viewAllEmployees();
    console.log('\n');
    console.table(employees);
    console.log('====================================================================================');
    mainPrompt();
};

async function viewAllRoles() {
    const roles = await db.viewAllRoles();
    console.log('\n');
    console.table(roles);
    console.log('===========================================');
    mainPrompt();
};

async function viewAllDepartments() {
    const departments = await db.viewAllDepartments();
    console.log('\n');
    console.table(departments);
    console.log('================');
    mainPrompt();
};

//
async function viewEmployeesByDepartment() {
    const empByDep = await db.viewEmployeesByDepartment();
    console.log('\n');
    console.table(empByDep);
    console.log('=======================================================================');
    mainPrompt();
};
//
async function viewEmployeesByManager() {
    const empByMan = await db.viewEmployeesByManager();
    console.log('\n');
    console.table(empByMan);
    console.log('=======================================================================');
    mainPrompt();
};

// Add a new employee
// function addEmployee() {
//     inquirer.prompt([
//         {
//             type: 'input',
//             message: 'New employee\'s first name?',
//             name: 'first_name',
//         },
//         {
//             type: 'input',
//             message: 'New employee\'s last name?',
//             name: 'last_name',
//         },
//         {
//             type: 'list',
//             message: 'New employee\'s job title?',
//             choices: (async() => {
//                 const arr = [];
//                 const roles = await db.viewAllRoles();
//                 roles.forEach(role => {
//                     // arr.push(role.id+" "+role.Role)
//                     arr.push(role.Role)
//                 });
//                 return arr;
//             }),
//             name: 'role',
//         },
//         {
//             type: 'list',
//             message: 'New employee\'s department?',
//             choices: (async() => {
//                 const arr = [];
//                 const deps = await db.viewAllDepartments();
//                 deps.forEach(deps => {
//                     arr.push(deps.Department)
//                 });
//                 return arr;
//             }),
//             name: 'department',
//         },
//     ])
//     .then(async function (answer) {
//         const addEmp = await db.createEmployee(answer);
//         const showEmp = await db.viewAllEmployees();
//         console.table(showEmp);
//         mainPrompt();
//     });
// };

// Add a new role
async function addNewRole() { 
    inquirer.prompt(prompts.addNewRolePrompt).then((response) => {
        connection.query(
        `
        INSERT INTO roles
            (department_id, title, salary)
        VALUES 
            ('${response.department}', '${response.title}', '${response.salary}');
        `
        );
    })
    .then(async function () {
        const showRoles = await db.viewAllRoles();
        console.log('\n');
        console.log("The new role has been added!");
        console.log('\n');
        console.table(showRoles);
        console.log('===========================================');
        mainPrompt();
      });
};

// add a new department
function addDepartment() {
    inquirer.prompt({
        type: 'input',
        message: 'Name of the new department?',
        name: 'department',
      })
      .then(async function (answer) {
        const addDepart = await db.createDepartment(answer);
        const showDept = await db.viewAllDepartments();
        console.log('\n');
        console.log("The new department has been added!");
        console.log('\n');
        console.table(showDept);
        console.log('================');
        mainPrompt();
      });
};

// Update and employee


// exit the app
function exit() {
    process.exit();
};

// --------------------------------------------------------------
// Method 2: Async function mainPrompt() / not using inquirer and
// without destructuring its response, but using choice.choice as
// the variable as choice will be returned with the promise object
// before the switch case / See what changes in prompts.js / CRUD

// async function mainPrompt() {
//     const choice = await prompts();

//     switch (choice.choice) {
//         case 'View all employees':
//             viewAllEmployees(); // Read from db
//             break;
//         case 'View all roles':
//             viewAllRoles();
//             break;
//         case 'View all departments':
//             viewAllDepartments();
//             break;
//         case 'Quit':
//             quit(); // Function to exit the app
//             break;
//     };
// };