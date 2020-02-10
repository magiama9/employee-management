const inquirer = require("inquirer");
const mysql = require("mysql");
const table = require("console.table");

// Connection to Employee DB
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "admin",
  database: "employee_db"
});

// Initial Question to User
const initialQuestion = [
  {
    type: "list",
    name: "initialize",
    message: "What would you like to do?",
    choices: ["View Records", "Update a Record", "Add a Record"]
  }
];

// Asks what they would like to view
const viewQuestion = [
  {
    type: "list",
    name: "view",
    message: "Which records would you like to view?",
    choices: ["Departments", "Roles", "Employees"]
  }
];

// Asks what they would like to update
const updateQuestion = [
  {
    type: "input",
    name: "update",
    message: "Which employee would you like to update?"
  }
];

// Asks what they would like to add
const addQuestion = [
  {
    type: "list",
    name: "add",
    message: "Which type of record would you like to add?",
    choices: ["Departments", "Roles", "Employees"]
  }
];

// Asks for the input to make a new department
const depQuestions = [
  {
    type: "input",
    name: "depName",
    message: "What is the name of the department you would like to add?"
  },
  {
    type: "input",
    name: "managerName",
    message: "What is the name of the department's manager?"
  }
];

// Asks for the input to make a new role
const roleQuestions = [
  {
    type: "input",
    name: "title",
    message: "What is the title you would like to add?"
  },
  {
    type: "input",
    name: "salary",
    message: "What is the salary for this role?"
  },
  {
    type: "input",
    name: "department",
    message: "Which department is this role in?"
  }
];

// Asks for the input to make a new employee
const empQuestions = [
  {
    type: "input",
    name: "firstName",
    message: "What is the first name of the employee you would like to add?"
  },
  {
    type: "input",
    name: "lastName",
    message: "What is their last name?"
  },
  {
    type: "input",
    name: "roleID",
    message: "What role does this employee perform?"
  }
];

const continueQuestion = [
  {
    type: "confirm",
    name: "continue",
    message: "Would you like to do anything else?"
  }
];

const loginQ = [
  {
    type: "input",
    name: "username",
    message: "What is your username?"
  },
  {
    type: "password",
    name: "password",
    message: "Enter your password"
  }
];

// Handles login logic
// If user exists, compares password
// If user doesn't exist, creates new user
const login = () => {
  inquirer.prompt(loginQ).then(answers => {
    connection.query(
      "SELECT EXISTS(SELECT * FROM users WHERE username=?)",
      answers.username,
      function(err, res) {
        if (err) throw err;
        for (const prop in res[0]) {
          if (res[0][prop] === 1) {
            connection.query(
              `SELECT username FROM users WHERE password="${answers.password}"`,
              function(err, res) {
                if (err) throw err;
                if (res[0].username === answers.username) {
                  initialize();
                } else {
                  console.log("Your password is incorrect.");
                  connection.end();
                }
              }
            );
          } else {
            connection.query(
              "INSERT INTO users SET ?",
              {
                username: answers.username,
                password: answers.password
              },
              function(err, res) {
                if (err) throw err;

                initialize();
              }
            );
          }
        }
      }
    );
  });
};

// Initialize w/ first user question
// Runs different inquirer prompts based on user input
const initialize = () => {
  inquirer.prompt(initialQuestion).then(answers => {
    switch (answers.initialize) {
      case "View Records":
        viewWhat();
        break;
      case "Update a Record":
        updateWhat();
        break;
      case "Add a Record":
        addWhat();
        break;
    }
  });
};

// Asks user if they would like to continue.
// ANSWERS.CONFIRM IS A TRUTHY
// Reruns initial question or ends connection
const keepGoing = () => {
  inquirer.prompt(continueQuestion).then(answers => {
    answers.continue ? initialize() : connection.end();
  });
};

// Asks user what they would like to view
// Runs corresponding display function
const viewWhat = () => {
  inquirer.prompt(viewQuestion).then(answers => {
    switch (answers.view) {
      case "Departments":
        displayDepartments();
        break;
      case "Roles":
        displayRoles();
        break;
      case "Employees":
        displayEmployees();
        break;
    }
    connection.end();
  });
};

// N.B. CURRENTLY ONLY ALLOWS UPDATING OF EMPLOYEE ROLE
// TODO - ALLOW DYNAMIC UPDATING DEPENDING ON USER SELECTION

const updateWhat = () => {
  inquirer.prompt(updateQuestion).then(answers => {
    switch (answers.add) {
      case "Departments":
        addDepartment();
        break;
      case "Roles":
        addRole();
        break;
      case "Employees":
        addEmployee();
        break;
    }
    connection.end();
  });
};

// Asks user what they would like to add
// Runs corresponding add function
const addWhat = () => {
  inquirer.prompt(addQuestion).then(answers => {
    switch (answers.add) {
      case "Departments":
        inquirer.prompt(depQuestions).then(answers => {
          addDepartment(answers.depName, answers.managerName);
        });
        break;
      case "Roles":
        inquirer.prompt(roleQuestions).then(answers => {
          addRole(answers.title, answers.salary, answers.department);
        });
        break;
      case "Employees":
        inquirer.prompt(empQuestions).then(answers => {
          let id = getRole(answers.roleID);
          addEmployee(answers.firstName, answers.lastName, id);
        });
        break;
    }
  });
};

// Display Departments
const displayDepartments = () => {
  // Creates table to store objects for display
  let table = [];
  connection.query("SELECT * FROM departments", (err, res) => {
    if (err) throw err;
    // Loops through each department and adds a representative object to the table
    res.forEach(idx => {
      let obj = {
        ID: idx.id,
        Department: idx.department_name,
        Manager: idx.manager_name
      };
      table.push(obj);
    });
    console.table(table);
  });
};

// Display Roles
const displayRoles = () => {
  // Creates table to store objects for display
  let table = [];
  connection.query("SELECT * FROM roles", (err, res) => {
    if (err) throw err;
    // Loops through each role and adds a representative object to the table
    res.forEach(idx => {
      let obj = {
        ID: idx.id,
        Title: idx.title,
        Salary: idx.salary,
        Department_ID: idx.department_id
      };
      table.push(obj);
    });
    console.table(table);
  });
};

// Display Employees
const displayEmployees = () => {
  // Creates table to store objects for display
  let table = [];
  connection.query("SELECT * FROM employees", (err, res) => {
    if (err) throw err;
    // Loops through each employee and adds a representative object to the table
    res.forEach(idx => {
      let obj = {
        ID: idx.id,
        First_Name: idx.first_name,
        Last_Name: idx.last_name,
        Role_ID: idx.role_id,
        Manager_ID: idx.manager_id
      };
      table.push(obj);
    });
    console.table(table);
  });
};

// Fetches role ID and department ID
// Expects role to be a string
// Role comes from user input, so the value is escaped from the query
const getRole = role => {
  connection.query(
    "SELECT id, department_id FROM roles WHERE title = ?",
    role,
    (err, res) => {
      return res[0].id;
    }
  );
};

// Adds Department to the Department Table
// Expects Name1 and Name2 to be strings
// (department_name, manager_name)
const addDepartment = (name1, name2) => {
  connection.query("INSERT INTO departments SET ?", {
    department_name: name1,
    manager_name: name2
  });
};

// Adds Role to the Role Table
// Expects Role to be string, salary to be number, depID to be integer matching a department ID
const addRole = (role, salary, depID) => {
  connection.query("INSERT INTO roles SET ?", {
    title: role,
    salary: salary,
    department_id: depID
  });
};

// Adds Employee to Employee Table
// Expects name1, name2 to be strings
// Expects roleID, managerID to be integers matching a value in the role/manager tables
const addEmployee = (name1, name2, roleID, managerID) => {
  connection.query("INSERT INTO employees SET ?", {
    first_name: name1,
    last_name: name2,
    role_id: roleID,
    manager_id: managerID
  });
};

// Updates Employee Role
// Expects id to be employeeID, role_id to match an id in roles table
const updateEmployee = (id, role_id) => {
  connection.query(
    "UPDATE employees SET ? WHERE ?",
    [
      {
        role_id: role_id
      },
      {
        id: id
      }
    ],
    function(err, res) {
      if (err) throw err;

      // Displays how many items were updated
      console.log(res.affectedRows + " item updated!\n");
    }
  );
};

// Begins logic flow for bidding
const bid = () => {
  // Asks necessary questions of bidder
  inquirer.prompt(bidQuestions).then(answers => {
    // Selects the item they would like to bid on
    connection.query(
      "SELECT * FROM items WHERE id=?",
      answers.bidItem,
      function(err, res) {
        if (err) throw err;

        // Compares item's price with user's bid
        testBid(answers.bidPrice, res[0].highbid, res[0].id);
      }
    );
  });
};

// Tests bid against high bid.
const testBid = (num, num2, id) => {
  if (num > num2) {
    // Updates the high bid if the user bid is higher
    updateBid(num, id);
    return;
  }

  // If user bid is lower it kills the connection and tells them.
  console.log("Your bid was not accepted.");
  connection.end();
};

// Runs only if user bid is higher than stored bid
const updateBid = (num, id) => {
  // Tell the user their bid was accepted
  console.log("Your bid was accepted!");

  // Updates the high bid of the item
  connection.query(
    "UPDATE items SET ? WHERE ?",
    [
      {
        highbid: num
      },
      {
        id: id
      }
    ],
    function(err, res) {
      if (err) throw err;

      // Displays how many items were updated
      console.log(res.affectedRows + " item updated!\n");
    }
  );

  // Kills the connection
  connection.end();
  initialize();
};

const postAsk = () => {
  inquirer.prompt(postQuestions).then(answers => {
    post(answers.postItem, answers.itemMin);
  });
};
// Posts a new item into the DB
const post = (item, bid) => {
  connection.query(
    "INSERT INTO items SET ?",
    {
      itemname: item,
      highbid: bid
    },
    function(err, res) {
      if (err) throw err;
      console.log("\n" + res.affectedRows + " item was posted!\n");
      connection.end();
    }
  );
  initialize();
};

//initialize();
keepGoing();
// addEmployee("Sam", "Randels", 1, 2);
// updateEmployee(1, 3);
// addRole("Smokin' Dope", 33333, 3);
// addDepartment("Whining", "Dan Rosenbaum");
// displayDepartments();
// displayRoles();
// displayEmployees();
// getRole("Smokin' Dope");
// login();
// Begins running the program
// initialize();
