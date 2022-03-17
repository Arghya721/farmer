import checkData from "./requirements.json";
import { React, useState, useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

var axios = require('axios');


const Apple = (props) => {
  const [open, setOpen] = useState(false);
  const [uniq, setuniq] = useState(false);

  const [notif, setnotif] = useState(false);

  const handleClickOpen = (event) => {
  
   setuniq(event.target.id);
    setOpen(true);
  };
  const handleSubmitNotification = (event)=>{

    var msg = notif;
    var uuid = uniq;
    var data = JSON.stringify({
      "messages": msg
    });
    
    var config = {
      method: 'post',
      url: 'http://localhost:8900/getNotified/'+uuid,
      headers: { 
        'Content-Type': 'application/json', 
      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
    
  }
  
  const handleClose = () => {
    setOpen(false);
  };
  const [jsondatax, setJsonData] = useState([]);
  const [cropidfetch, setcropidfetch] = useState("");
  const [croporiginaldata, setcroporiginaldata] = useState([]);
  useEffect(() => {
    
    var config = {
      method: 'GET',
      url: 'http://localhost:8900/getstats',
      headers: { 
       
      }
    };
    axios(config)
  .then(function (response) {
    setJsonData(response.data);
    console.log(jsondatax);
  })
  .catch(function (error) {
    console.log(error);

    
  });
 
  }, []);


  console.log(jsondatax);
  let cropnmm = props.cropname;
  console.log(cropnmm);
  







  

  var datx = checkData[0][cropnmm][0];
  console.log(datx.moisture[0].max);

  const DisplayData = jsondatax.map((info) => {
    var score = 0;
  
    return (
      <>
        {info.cropname == props.cropname ? (
          
          <tr>
            <td>{info.cropid} </td>

            {info.days > datx.harvest[0].max ? (
              <td className="danger">{info.days}days </td>
            ) : info.days < datx.harvest[0].min ? (
              <td className="danger">{info.days} days</td>
            ) : (
              ((score = score + 1), (<td className="success">{info.days} days</td>))
            )}

            {info.ph > datx.ph[0].max ? (
              <td className="danger">{info.ph}</td>
            ) : info.ph < datx.ph[0].min ? (
              <td className="danger">{info.ph}</td>
            ) : (
              ((score = score + 1), (<td className="success">{info.ph}</td>))
            )}
            {info.height > datx.height[0].max ? (
              <td className="danger">{info.height}</td>
            ) : info.height < datx.height[0].min ? (
              <td className="danger">{info.height}</td>
            ) : (
              ((score = score + 1),
              (<td className="success">{info.height}</td>))
            )}

            {info.moisture > datx.moisture[0].max ? (
              <td className="danger">{info.moisture}</td>
            ) : info.moisture < datx.moisture[0].min ? (
              <td className="danger">{info.moisture}</td>
            ) : (
              <td className="success">{info.moisture}</td>
            )}



            {info.temperature > datx.temperature[0].max ? (
              <td className="danger">{info.temperature}</td>
            ) : info.temperature < datx.temperature[0].min ? (
              <td className="danger">{info.temperature}</td>
            ) : (
              ((score = score + 1),
              (<td className="success">{info.temperature}</td>))
            )}



            {datx.location.includes(info.location) ? (
              ((score = score + 1),
              (<td className="success">{info.location}</td>))
            ) : (
              <td className="danger">{info.location}</td>
            )}
          
            {score >= 5 ? (
              (console.log(score),
              (
                <td>
                   <Button variant="outlined" id={info.uuid} onClick={(event) => {
                handleClickOpen(event);
                }}>
              Send Harvest Request
      </Button>
 
                </td>
              ))
            ) : (
              <td>
                <Button variant="contained" id={info.uuid} onClick={(event) => {
                handleClickOpen(event);
                }}>
               Send Recommendation
      </Button>
      <form onSubmit={handleSubmitNotification} method="POST">
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Post Your Suggestion</DialogTitle>
        <DialogContent>
          <DialogContentText>
         
        Click here to post your suggestion to the same customer [{uniq}].
          </DialogContentText>
          
          <TextField
          id="outlined-multiline-flexible"
          name="msg"
          onChange={(e)=>{
            setnotif(e.target.value)
          }}
          label="Suggestion"
          multiline
          maxRows={4}
        fullWidth
        />
        
          <TextField
           name="cusid"
          id="outlined-multiline-flexible"
          label="Customer ID"
          value={uniq}
         
          maxRows={4}
        fullWidth
        hidden
        />
       
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmitNotification}>Subscribe</Button>
        </DialogActions>
      </Dialog>
      </form>
              </td>
            )}
          </tr>
        ) : (
          ""
        )}
         <div>
         <div>
      
    </div>
    </div>
      </>
    );
  });
  return (
    <>
      <div className="area1x" style={{ width: "max-content" }}>
        <div className="dashboard-box">
          <div className="boxheader">
            <div className="boxvalue">Overall {props.cropname} Data</div>
            <div className="boxname">This is a list of latest Crop data</div>
            <div className="refresh-anonpe">
              <button className="btnx">Refresh</button>
            </div>
            <table class="table-anonpe-purchases">
              <thead>
                <tr>
                  <th>Crop Id</th>
                  <th>Sapling LifeSpan</th>
                  <th>pH of Soil</th>
                  <th>Height (in cm)</th>

                  <th>Moisture</th>
                  <th>Temperature</th>
                  <th>Location</th>
                  <th>Recommendation</th>
                </tr>
              </thead>
              <tbody>{DisplayData}</tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Apple;
