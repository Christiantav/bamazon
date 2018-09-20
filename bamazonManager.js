var Table = require('cli-table');
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Columbia_code123",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
    }
    loadManagerMenu();
    });

    function loadManagerMenu() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        loadManagerOptions(res);
    });
}


function loadManagerOptions(products) {
    inquirer
        .prompt({
        type: "list",
        name: "choice",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
        message: "What would you like to do?"
        })
        .then(function(val) {
        switch (val.choice) {
        case "View Products for Sale":
            console.table(products);
            loadManagerMenu();
            break;
        case "View Low Inventory":
            loadLowInventory();
            break;
        case "Add to Inventory":
            addToInventory(products);
            break;
        case "Add New Product":
            promptManagerForNewProduct(products);
            break;
        default:
            console.log("Goodbye!");
            process.exit(0);
            break;
        }
        });
}


function loadLowInventory() {
    
    connection.query("SELECT * FROM products WHERE stock_count <= 5", function(err, res) {
        if (err) throw err;
        
        console.table(res);
        loadManagerMenu();
    });
}


function addToInventory(inventory) {

    console.table(inventory);

    inquirer
        .prompt([
        {
            type: "input",
            name: "choice",
            message: "What is the ID of the item you would you like add to?",
            validate: function(val) {
            return !isNaN(val);
            }
        }
        ])
        .then(function(val) {
        var choiceId = parseInt(val.choice);
        var product = checkInventory(choiceId, inventory);

        
        if (product) {
            
            promptManagerForQuantity(product);
        }
        else {
            
            console.log("\nThat item is not in the inventory.");
            loadManagerMenu();
        }
        });
}


function promptManagerForQuantity(product) {
    inquirer
        .prompt([
        {
            type: "input",
            name: "quantity",
            message: "How many would you like to add?",
            validate: function(val) {
            return val > 0;
            }
        }
        ])
        .then(function(val) {
        var quantity = parseInt(val.quantity);
        addQuantity(product, quantity);
        });
    }

    
    function addQuantity(product, quantity) {
    connection.query(
        "UPDATE products SET stock_count = ? WHERE item_id = ?",
        [product.stock_count + quantity, product.item_id],
        function(err, res) {
        
        console.log("\nSuccessfully added " + quantity + " " + product.item_name + "'s!\n");
        loadManagerMenu();
        }
    );
}



function promptManagerForNewProduct(products) {
    inquirer
        .prompt([
        {
            type: "input",
            name: "item_name",
            message: "What is the name of the product you would like to add?",

        },
        {
            type: "list",
            name: "category_name",
            choices: getCategories(products),
            message: "Which department does this product fall into?"
        },
        {
            type: "input",
            name: "price",
            message: "How much does it cost?",
            validate: function(val) {
            return val > 0;
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "How many do we have?",
            validate: function(val) {
            return !isNaN(val);
            }
        }
        ])
    .then(function(val) {
        addNewProduct(val);
        });}


function addNewProduct(val) {
    connection.query(
        "INSERT INTO products (item_name, category_name, price, stock_count) VALUES (?, ?, ?, ?)",
        [val.item_name, val.category_name, val.price, val.quantity],
        function(err, res) {
        if (err) throw err;
        console.log(val.item_name + " ADDED TO BAMAZON!\n");
        
        loadManagerMenu();
        }
    );
}


function getCategories(products) {
    var categories = [];
    for (var i = 0; i < products.length; i++) {
        if (categories.indexOf(products[i].category_name) === -1) {
        categories.push(products[i].category_name);
        }
    }
    return categories;
}


function checkInventory(choiceId, inventory) {
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].item_id === choiceId) {
        
        return inventory[i];
        }
    }
    
    return null;
}
