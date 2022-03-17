import Am from "./graph1";
import LatestPurchases from "./latest_purchases";
const Defx = () => {
  return (
    <>
      <div className="area1">
        <div className="dashboard-box">
          <div className="boxheader">
            <div className="boxvalue">
              Health Status:
              <span className="healthstatus" id="green">
                Good
              </span>
            </div>
            <div className="boxname">Current Balance</div>
          </div>
        </div>
        <Am />
      </div>
      <div className="area2">
        <div className="dashboard-box">
          <div className="boxheader">
            <div className="boxvalue">Overall Crop Data</div>
            <div className="boxname">This is a list of latest Crop data</div>
          </div>

          <div className="refresh-anonpe">
            <button className="">Refresh</button>
          </div>
        </div>
        <LatestPurchases />
      </div>
  
    </>
  );
};

export default Defx;
