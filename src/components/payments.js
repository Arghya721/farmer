var axios = require('axios');
import {useState, useEffect} from "react";


const Payments = () => {
    const [harvested, setharvested] = useState(false);
    const [percentharvested, setpercentharvested] = useState(false);
   
    useEffect(() => {
        var config = {
            method: 'get',
            url: 'http://localhost:8900/harvestupdate',
            headers: { 
              'Content-Type': 'application/json', 
              
            }
            
          };
          
          axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
            console.log(response.data);
            let hv  = response.data.percentage.toFixed(2);
            setharvested(response.data.harvest);
            setpercentharvested(hv);
          })
          .catch(function (error) {
            console.log(error);
          });
      },[]);

    
        

    return(

<>

        <div className="salesbox">
          <div className="salesboxheader">
            <div className="boxvalue">{harvested}</div>
            <div className="boxname">Total Harvested</div>
          </div>
        </div>
        <div className="salesbox">
          <div className="salesboxheader">
            <div className="boxvalue">{percentharvested}%</div>
            <div className="boxname">Total Unharvested</div>
          </div>
        </div>
        <div className="salesbox">
          <div className="salesboxheader">
            <div className="boxvalue">INR {harvested*100}</div>
            <div className="boxname">Profit Generated</div>
          </div>
        </div>
     
</>
    )

}

export default Payments;