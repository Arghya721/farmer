const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
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
app.use(express.static("public"));


connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


app.get("/harvestupdate/",(req,res)=>{
    try{
        connection.query("SELECT *, datediff(last_update,planted_on) as days FROM stats INNER JOIN cropids  ON cropids.cropid = stats.cropid", function (err, result, fields) {
           
            var resultx = Object.values(JSON.parse(JSON.stringify(result)));
            const list = [];
            var harvest = 0;
            var totalharvest = 0;
            resultx.forEach(function(element) {
                if(element.isharvested == 1){
                    harvest = harvest + 1;
                }
                totalharvest = totalharvest + 1;
            });
            var percentage = (harvest/totalharvest)*100;
            const data = {
                harvest:harvest,
                percentage:percentage
            }
            res.json(data);
          });
    
        }
        catch(e){
            console.log(e);
        }   
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});