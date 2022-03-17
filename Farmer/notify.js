const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host               : "192.46.211.70",
    user               : "anonpein_adminx",
    password           : "26NpA119q8it",
    database           : "anonpein_fm",
    multipleStatements : true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.post("/getNotified/:uid",(req,res)=>{
    try{
        connection.query("INSERT INTO notification (`uuid`,`messages`) values("+req.params.uid+",'"+req.body.messages+"');", function (err, result, fields) {
            if(err)
                console.log(err);
            res.send("Success");
          });
    
        }
        catch(e){
            console.log(e);
        }   
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});