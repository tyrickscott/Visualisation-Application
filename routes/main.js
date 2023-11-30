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
}
