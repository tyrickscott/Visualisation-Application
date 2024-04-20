module.exports = function(app) {

    //handle routes
    app.get('/', function(req, res) {
        //SQL query to fetch alerts for items running low
        const sql = `
            SELECT sc.name, 
                COUNT(CASE WHEN sc.status = 'inStorage' THEN 1 ELSE NULL END) AS inStorageCount,
                a.threshold
            FROM storage_components sc
            JOIN alerts a ON sc.name = a.item_name
            GROUP BY sc.name, a.threshold
            HAVING inStorageCount <= a.threshold;
        `;

        //execute the query and handle the results
        db.query(sql, function(err, results) {
            if (err) {
                console.error("Error checking alerts:", err);
                //render the index.ejs file with an empty alerts array in case of error
                res.render('index', { alerts: [] });
            } else {
                //render the index.ejs file and pass the alerts array to the template
                res.render('index', { alerts: results });
            }
        });
    });

    app.get('/viewStatistics', function (req, res) {
        res.render('viewStatistics.ejs');
    });

    app.get('/recordInformation', function(req, res) {
        //fetch existing items from the manager's list
        const sql = "SELECT name FROM managers_list";
        db.query(sql, function(err, results) {
            if (err) {
                console.error("Error fetching items from database:", err);
                res.send("Error fetching items. Please try again.");
            } else {
                //render the recordInformation.ejs file and pass the items array
                res.render('recordInformation', { items: results });
            }
        });
    });

    //route for managing the manager's list
    app.get('/manageList', function(req, res) {
        //fetch existing items from the manager's list
        const sql = "SELECT * FROM managers_list";
        db.query(sql, function(err, results) {
            if (err) {
                console.error("Error fetching items from database:", err);
                res.send("Error fetching items. Please try again.");
            } else {
                res.render('manageList', { items: results });
            }
        });
    });

    //route for adding an item to the manager's list
    app.post('/addItem', function(req, res) {
        const itemName = req.body.itemName;

        //insert the new item into the database
        const sql = "INSERT INTO managers_list (name) VALUES (?)";
        db.query(sql, [itemName], function(err, result) {
            if (err) {
                console.error("Error inserting item into database:", err);
                res.send("Error adding item. Please try again.");
            } else {
                console.log("Item inserted into database successfully.");
                res.redirect('/manageList');
            }
        });
    });

    //route for deleting an item from the manager's list
    app.get('/deleteItem/:id', function(req, res) {
        const itemId = req.params.id;

        //delete the item from the database
        const sql = "DELETE FROM managers_list WHERE id = ?";
        db.query(sql, [itemId], function(err, result) {
            if (err) {
                console.error("Error deleting item from database:", err);
                res.send("Error deleting item. Please try again.");
            } else {
                console.log("Item deleted from database successfully.");
                res.redirect('/manageList');
            }
        });
    });

    //handle the form submission
    app.post('/submitInformation', function(req, res) {
        // Retrieve the submitted data from the form
        const componentName = req.body.componentName;
        const status = req.body.status;

        //Insert the submitted data into the database
        const sql = "INSERT INTO storage_components (name, status) VALUES (?, ?)";
        db.query(sql, [componentName, status], function(err, result) {
            if (err) {
                console.error("Error inserting data into database:", err);
                //handle the error, such as displaying an error message to the user
                res.send("Error submitting information. Please try again.");
            } else {
                console.log("Data inserted into database successfully.");
                // redirect the user to a confirmation page or any other appropriate page
                res.redirect('/');
            }
        });
    });

    
    //fetch data from the storage_components table and return the data in JSON format
    app.get('/api/getStorageComponentsItems', function(req, res) {
        const sql = "SELECT DISTINCT name FROM storage_components";
        
        db.query(sql, function(err, results) {
            if (err) {
                console.error("Error fetching items from database:", err);
                res.status(500).json({ error: "Error fetching items" });
            } else {
                // Send data as JSON
                res.json(results);
            }
        });
    });

    app.get('/api/getStorageComponentsStats/:itemName', function(req, res) {
        const itemName = req.params.itemName;
        const sql = `
            SELECT 
                COUNT(CASE WHEN status = 'inUse' THEN 1 ELSE NULL END) AS inUse,
                COUNT(CASE WHEN status = 'inStorage' THEN 1 ELSE NULL END) AS inStorage,
                COUNT(CASE WHEN status = 'underMaintenance' THEN 1 ELSE NULL END) AS underMaintenance
            FROM storage_components
            WHERE name = ?;
        `;
    
        db.query(sql, [itemName], function(err, results) {
            if (err) {
                console.error("Error fetching data from database:", err);
                res.status(500).json({ error: "Error fetching data" });
            } else {
                //Send data as JSON
                res.json(results[0]);
            }
        });
    });
    
    
}
