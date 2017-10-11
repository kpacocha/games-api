
//    port    = parseInt(process.env.PORT, 10) || 8080;


var bodyParser = require('body-parser')
var express   =    require("express");
var mysql     =    require('mysql');
var app       =    express();
var    expressValidator = require('express-validator');
var    path     = require('path')


var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'gamesdb',
    debug    :  false
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyParser.json());
app.use(expressValidator());

function getGames(req,res) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id  ' + connection.threadId);
        
        connection.query("select * from games",function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}

function getPlays(req,res) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id  ' + connection.threadId);
        
        // connection.query(" \
        //   SELECT `plays`.`playId`, date, GROUP_CONCAT(login, ':', result) as results, gameName FROM `plays`\
        //   LEFT OUTER JOIN `userplays`\
        //   on `userplays`.`playId` = `plays`.`playId`\
        //   inner join `users`\
        //   on `userplays`.`userId` = `users`.`userId`\
        //   inner join `games`\
        //   on `plays`.`gameId` = `games`.`gameId`\
        //   GROUP BY `playId`\
        //   ",function(err,rows){
        //     connection.release();
        //     if(!err) {
        //         res.json(rows);
        //     }           
        // });

        connection.query("SELECT * FROM plays",function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}

function getUsers(req,res) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id  ' + connection.threadId);
        
        connection.query("select * from users",function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}

function addGame(req,res) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id  ' + connection.threadId);

        connection.query(`INSERT INTO games (gameName) VALUES ('${req.body.gameName}')`,function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}

function addPlay(req,res) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id  ' + connection.threadId);
      // INSERT INTO `plays` (`playId`, `date`, `gameId`) VALUES (NULL, CURRENT_TIMESTAMP, '24');

          connection.query(`INSERT INTO plays (date, gameId) VALUES ('${req.body.date}','${req.body.gameId}')`,function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}

function addUserPlay(req,res) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id  ' + connection.threadId);
      // INSERT INTO `plays` (`playId`, `date`, `gameId`) VALUES (NULL, CURRENT_TIMESTAMP, '24');

          connection.query(`INSERT INTO userplays (playId ,result, userId) VALUES ('${req.body.playId}','${req.body.result}','${req.body.userId}')`,function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    res.setHeader('Content-Type', 'application/json');

    // Pass to next layer of middleware
    next();
});

app.get("/games",function(req,res){-
        getGames(req,res);
});
app.get("/plays",function(req,res){-
        getPlays(req,res);
});
app.get("/users",function(req,res){-
        getUsers(req,res);
});

app.post('/addGame',function(req, res){
  addGame(req, res);
  console.log('you posted: gameName: ' + req.body.gameName);
});

app.post('/addPlay',function(req, res){
  addPlay(req, res);
  console.log('you posted play, gameId: ' + req.body.gameId);
});

app.post('/addUserPlay',function(req, res){
  addUserPlay(req, res);
  console.log('you posted userPlay');
  console.log(req.body);
});

app.listen(3001,function(){

   console.log("Listening on 3001...");

});