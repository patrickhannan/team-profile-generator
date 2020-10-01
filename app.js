const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employeeArray = [];
const managerList = [];
const engineerList = [];
const internList = [];
const questions = [
    {
        type: "input",
        name: "name",
        message: "Enter the employee's name."
    },
    {
        type: "input",
        name: "id",
        message: "Enter the employee's id."
    },
    {
        type: "input",
        name: "email",
        message: "Enter the employee's email."
    },
    {
        type: "list",
        name: "role",
        message: "What role is the employee?",
        choices: ["Manager", "Engineer", "Intern"]
    },
    {
        type: "input",
        name: "officeNumber",
        message: "Enter the manager's office number.",
        when: function (response) {
            return response.role == "Manager";
          },
    },
    {
        type: "input",
        name: "github",
        message: "Enter this engineer's github profile.",
        when: function (response) {
            return response.role == "Engineer";
          },
    },
    {
        type: "input",
        name: "school",
        message: "Enter this intern's school.",
        when: function (response) {
            return response.role == "Intern";
          },
    },
    {
        type: "list",
        name: "addNewMember",
        message: "Would you like to add another employee?",
        choices: ["Yes", "No"]
    },
]

function promptQuestion() {
    inquirer.
    prompt(questions)
    .then(function(answers) {
        employeeArray.push(answers);

        if (answers.addNewMember == "Yes") {
            promptQuestion();
        } else {
            const newManager = employeeArray.filter(({ role }) => {
                return role == "Manager";
            });
            
            newManager.forEach((manager) => {
                const member = new Manager(
                  manager.name,
                  manager.id,
                  manager.email,
                  manager.officeNumber
                );
                managerList.push(member);
              });

            const newEngineer = employeeArray.filter(({ role }) => {
                return role == "Engineer";
            });
            
            newEngineer.forEach((engineer) => {
                const member = new Engineer(
                  engineer.name,
                  engineer.id,
                  engineer.email,
                  engineer.github
                );
                engineerList.push(member);
              });

            const newIntern = employeeArray.filter(({ role }) => {
                return role == "Intern";
            });
            
            newIntern.forEach((intern) => {
                const member = new Intern(
                  intern.name,
                  intern.id,
                  intern.email,
                  intern.school
                );
                internList.push(member);
              });
            const allEmployees = [
                ...managerList,
                ...engineerList,
                ...internList,
              ];

            fs.writeFile(outputPath, render(allEmployees), function (err) {
                if (err) throw err;
                console.log("Generated new team file.");
              });
        }
    }).catch((err) => {
        if(err) {
          return err;
        };
      });
}

promptQuestion(questions);