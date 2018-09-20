var Table = require('cli-table');
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// Configuring our connection to our database; make sure it matches your local instance
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Columbia_code123",
    database: "bamazon"
});

// Connecting to our database, running makeTable which will start the app
connection.connect(function(err) {
    if (err) throw err;
    console.log("connection successful!");
    makeTable();
});

function makeTable() {
    // Displaying an initial list of products for the user, calling promptSupervisor
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        promptSupervisor();
    });
}

function promptSupervisor() {
// Giving the user some options for what to do next
    inquirer
        .prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: ["View Product Sales by Category", "Create New Category", "Quit"]
        }
        ])
        .then(function(val) {
            // Checking to see what option the user chose and running the appropriate function
            switch (val.choice) {
                case "View Product Sales by Category":
                    viewSales();
                    break;
                case "Create New Category":
                    addCategory();
                    break;
                default:
                    console.log("Goodbye!");
                    process.exit(0);
                    break;
            }            
        });
}

function addCategory() {
    // Asking the user about the Category they would like to add
    inquirer
        .prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the category?"
        },
        {
            type: "input",
            name: "overhead",
            message: "What is the overhead cost of the category?",
            validate: function(val) {
            return val > 0;
            }
        }
        ])
        .then(function(val) {
            // Using the information the user provided to create a new Category
            connection.query(
                "INSERT INTO Categories (category_name, over_head_costs) VALUES (?, ?)",
                [val.name, val.overhead],
                function(err) {
                if (err) throw err;
                // If successful, alert the user, run makeTable again
                console.log("Category Created!");
                makeTable();
                }
            );
        });
}

function viewSales() {
    // Selects a few columns from the Categorys table, calculates a total_profit column
    connection.query(
        "SELECT categories.category_id, categories.category_name, categories.over_head_costs, SUM(categories.product_sales) as product_sales, (SUM(categories.product_sales) - categories.over_head_costs) as total_profit FROM (SELECT categories.Category_id, categories.Category_name, categories.over_head_costs, IFNULL(products.item_sales, 0) as item_sales FROM products RIGHT JOIN categories ON products.category_name = categories.category_name) as categories GROUP BY category_id",
        function(err, res) {
        console.table(res);
        promptSupervisor();
        }
    );
}
