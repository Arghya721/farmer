require('dotenv').config();
const express = require('express');
var mysql = require('mysql');
const cors = require('cors');
const app = express();
app.use(express.json())
app.use(cors())
// var corsOptions = {
//     origin: 'http://localhost:3000',
//     methods: "GET, POST",
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204

//   }

  var con = mysql.createConnection({
    host               :  process.env.HOST,
    user               : process.env.USER,
    password           : process.env.PASSWORD,
    database           : process.env.DATABASE,
    multipleStatements : true
});
var resultx = "";
con.connect(function(err) {
    if (err) throw err;
 
  });

app.get('/getstats',   (req, res)  =>{
   
    con.query("SELECT *, datediff(last_update,planted_on) as days FROM stats INNER JOIN cropids  ON cropids.cropid = stats.cropid;", function (err, result, fields) {
        if (err) throw err;
        resultx = Object.values(JSON.parse(JSON.stringify(result)));
        res.json(resultx) 
        console.log(resultx)
        
      });
    
});
app.get('/getcropid',  (req, res)  =>{

    if(req.query.cropid){

    try{


    con.query("SELECT * FROM cropids where cropid="+req.query.cropid, function (err, result, fields) {
       
        resultx = Object.values(JSON.parse(JSON.stringify(result)));
        res.json(resultx) 
        console.log(resultx)
        
      });

    }
    catch(e){
        console.log(e);
    }

}
else{
    // res.send(200, 'asdas'); 
    res.status(500).send("Parameter undefined");
    console.log("Parameter not defined");
}
    
});


app.post("/getNotified/:uid", (req,res)=>{
    try{
        con.query("INSERT INTO notification (`uuid`,`messages`) values("+req.params.uid+",'"+req.body.messages+"');", function (err, result, fields) {
            if(err)
                console.log(err);
            res.send("Success");
          });
    
        }
        catch(e){
            console.log(e);
        }   
});

app.get("/harvestupdate/",(req,res)=>{
    try{
        con.query("SELECT *, datediff(last_update,planted_on) as days FROM stats INNER JOIN cropids  ON cropids.cropid = stats.cropid", function (err, result, fields) {
           
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

app.listen(8900, ()=>{
    console.log("backend running");
  })
