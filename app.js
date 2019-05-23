'use strict'
const express = require('express');
const sessions = require('client-sessions');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
var app = express();
const mysql = require('mysql2');

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true}));

const db = mysql.createConnection({
	host: 'localhost',
	user: 'appaccount',
	password: 'apppass',
	database: 'users'
});

db.connect((err) => {
	if (err) throw err;
	console.log('Connected!');
});


app.use(sessions({
	cookieName: 'session',
	secret: 'random_string_goes_here',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
}));

// This is the Welcom page
app.get('/', (req, res) =>{

	// Is this user logged in?
	if(req.session.username)
	{
		// Yes!
		res.redirect('/dashboard');
	}
	else
	{
		// No!
		res.render('welcom');
	}
});



// Dashboard
app.get('/dashboard', (req, res) => {
	if(req.session.username)
	{
		res.render('dashboard', {username:req.session.username});
	}
	else
	{
		res.redirect('/login');

	}
});


app.get('/login', (req, res) => res.render('login'));


app.get('/withdraw', (req, res) => res.render('withdraw'{balance:req.session.balance}));
app.get('/deposit', (req, res) => res.render('deposit'));
app.get('/balance', (req, res) => res.render('balance'));
app.get('/statements', (req, res) => res.render('statements'));


// Login Handle
// Login
app.post('/login', (req, res) => {
	
	var userName = req.body.username
        var password = req.body.password

        var query = "Use users; SELECT username, password from appusers where username='" + userName + "'AND password='" + password + "'";
        console.log(query);

        // Query the DB for the user
	db.query('SELECT username, password FROM appusers where `username`= ? AND `password` = ?' ,[userName, password], (err, results) => {
		if(err) throw err;

		 var match = false;

                console.log(results[1]);
		if(results.length>0) {
			if( results[0]. password == password) {
				match = true;
			}
		}






                // Does the password match?
               // var match = false;

                // Go through the results of the seconf query
                //results[1].forEach(function(account){

                  //      if(account['username'] == UserName && account['password'] == password)
                    //    {
                      //         console.log("Match!");

                                // We have a match;
                        //        match = true;

                       // }
               // });


                // Login succeeded! Set the session variable 
                // and go to the dashboard
                if(match)
                {
                        req.session.username = userName;
                        res.redirect('/dashboard');
                }
                else
                {
                        // If no matches have been found, we are done
                        res.send("Wrong");
                }
	});
});


app.post('/dashboard', (req, res) => {
	var query = "SELECT balance from appusers where username='" + userName +'";
        console.log(query);

        // Query the DB for the user
        db.query('SELECT username, password FROM appusers where `username`= ? AND `password` = ?' ,[userName, password], (err, results) => {
                if(err) throw err;




// Logout
app.get('/logout', (req, res) => {


	// Kill the session
	req.session.reset();
	res.redirect('/');
});
//db.query('SELECT * FROM appusers', (err, rows) => {
//	if(err) throw err;

//	console.log('Data received from Db:\n');
//	console.log(rows);
//});

//db.query('UPDATE Transaction SET `deposit` = ?  WHERE `username` = ?,
// [100, 'lidel'],
 
//	(err, result) => {
//		if(err) throw err;

//		console.log(`Changed ${result.changedRows} row(s)`);
//	}
//);
	
//var port = proccess.env.PORT || 50000;

//app.set('view engine', 'ejs');
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
