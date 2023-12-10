module.exports = function(app) {

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs')
    });

    app.get('/register', function (req,res) {
        res.render('register.ejs');                                                                     
    });                                                                                                 
    app.post('/registered', function (req,res) {
        // saving data in database
        res.send(' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email);                                                                              
    }); 

    app.get('/login', function (req,res) {
        res.render('login.ejs', shopData);                                                                     
    });  
    
    app.post('/loggedin', function (req,res) {
        const username = req.body.username;
        const password = req.body.password;    
        
        //Query the database to retrieve the hashed password for the provided username
        db.query('SELECT hashedPassword FROM users WHERE username = ?' , [username], (err, results) => {
            if (err) {
                console.error('Error querying the database:', err);
                res.send('Error occured during login.');
            }
            else {
                if (results.length === 0) {
                    res.send('Login failed: User not found.');
                }
                else {
                    //accesses the first (and in this case, the only) element in the results array. Since we are querying the database for a specific username, we expect only one row of data to be returned.
                    const hashedPassword = results[0].hashedPassword;

                    //Compare the provided password with the hashed password from the database
                    bycrypt.compare(password, hashedPassword, function (err, result) {
                        if (err) {
                            console.log('Error comparing passwords:', err);
                            res.send('Error occured during login.');
                        }
                        else if (result === true) {
                            // Save user session here, when login is successful
                            req.session.userId = req.body.username;
                            //Successful login
                            res.send('Login successful!');
                        }
                        else {
                            //Incorrect password
                            res.send('Login failed: Incorrect password.');
                        }
                    });
                }
            }
        })
    }); 

    app.get('/logout', redirectLogin, (req,res) => {
        req.session.destroy(err => {
        if (err) {
          return res.redirect('./')
        }
        res.send('you are now logged out. <a href='+'./'+'>Home</a>');
        })
    })
}
