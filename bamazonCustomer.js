var Table = require('cli-table');
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

// initialize the connection w/ mysql
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: 'Columbia_code123',
    database: "bamazon"
});


connection.connect(function(err) {
    if (err) {
        console.error('connection error:' + err.message)
        return;
    }
    console.log("connected to SQL");

    loadItems();
});


function loadItems() {
    console.log("loading items from DB");
    
    //query all of the items and put them in a table
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) {
            console.error('query error: ' + err.message);
            return;
          }
        console.table(res);
        promptCustomerForItem(res);
    });
}


function promptCustomerForItem(inventory) {

    //use the npm inquirer module to prompt user, parse input, and validate answers
    //type is mode of prompt, name is used to title answers in storage, message is question to print
    inquirer
        .prompt([
        {
            type: "input",
            name: "itemSelected",
            message: "What is the ID of the item you would you like to purchase? (exit with 'done')",
            validate: function(val) {
            return !isNaN(val) || val.toLowerCase() === "done";
            }
        }
        ])
        .then(function(val) {
            checkIfShouldExit(val.itemSelected);
            var choiceId = parseInt(val.itemSelected);
            var product = checkInventory(choiceId, inventory);

            
            if (product) {
                //if the product exists the customer will be asked about quantity
                promptCustomerForQuantity(product);
            }
            else {
                //if the product does not exist the user will leave and the table will reload
                console.log("\nThat item is not in the inventory.");
                loadProducts();
            }
        });
}


function promptCustomerForQuantity(product) {
    inquirer
        .prompt([
        {
            type: "input",
            name: "quantity",
            message: "How many would you like? (exit with 'done')",
            validate: function(val) {
            return val > 0 || val.toLowerCase() === "done";
            }
        }
    ])
    .then(function(val) {
    
    checkIfShouldExit(val.quantity);
    var quantity = parseInt(val.quantity);

    
    if (quantity > product.stock_count) {
        console.log("\nWe aint got nuff' o' that!!");
        loadItems();
    }
    else {
        
        makePurchase(product, quantity);
    }
    });
}


function makePurchase(product, quantity) {
    connection.query(
        "UPDATE products SET stock_count = stock_count - ? WHERE item_id = ?",
        [quantity, product.item_id],
        function(err, res) {
        
        console.log("\nSuccessfully purchased " + quantity + " " + product.item_name + "'s!");
        loadItems();
        }
    );
}


function checkInventory(choiceId, inventory) {
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].item_id === choiceId) {
        
        return inventory[i];
        }
    }
    
    return null;
}


function checkIfShouldExit(choice) {
    if (choice.toLowerCase() === "done") {
        
        console.log("Later Gator!");
        process.exit(0);
    }
}
