import "./styles.css";

import Apple from "./components/crop";
import Defx from "./components/default";
import Payments from "./components/payments";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="header">
          <nav>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdDTjV-Ipvi-XhshQmBcCyd0fiE_FP3HPDXDDtYOJJW-dVOB1JdP3b6IRJGVe4l_12eDc&usqp=CAU" />
            <div>Kishan Mitra</div>
          </nav>
        </div>
        <div className="main-container">
          <div className="areamain1">
            <div className="sidebar">
              <div id="tools">
                <div className="section-name">Crop Name</div>
                <div className="topoptions">
                  <Link to="/apples">
                    <li>Apple</li>
                  </Link>
                  <Link to="/litchi">
                    <li>Litchi</li>
                  </Link>
                    <Link to="/maize">
                    <li>Maize</li>
                  </Link>
                  <Link to="/plum">
                    <li>Plum</li>
                  </Link>
                  <Link to="/rice">
                    <li>Rice</li>
                  </Link>
                  <Link to="/soyabean">
                    <li>SoyaBean</li>
                  </Link>
                  <Link to="/sugarcane">    
                    <li>SugarCane</li>
                 </Link>
                  <Link to="/wheat">
                   <li>Wheat</li>
                   </Link>
                </div>
              </div>
              <div id="utilites">
                <div className="section-name">DASHBOARD</div>
                <div className="topoptions">
                <Link to="/payments">
                   <li>Payments</li>
                   </Link>
                </div>
              </div>

              <div id="connectto">
                <div className="section-name">PROFILE</div>
                <div className="topoptions">
                  <li>Log Out</li>
                </div>
              </div>
            </div>
          </div>
          <div class="areamain2">
            <div class="dashboard-container">
              <Routes>
                <Route path="/" element={<Defx />} />
                <Route path="/apples" element={<Apple cropname="Apple"/>} />
                <Route path="/litchi" element={<Apple cropname="Litchi"/>} />
                <Route path="/maize" element={<Apple cropname="Maize"/>} />
                <Route path="/plum" element={<Apple cropname="Plum"/>} />
                <Route path="/rice" element={<Apple cropname="Rice"/>} />
                <Route path="/soyabean" element={<Apple cropname="Soya Bean"/>} />
                <Route path="/sugarcane" element={<Apple cropname="Sugar Cane"/>} />
                <Route path="/wheat" element={<Apple cropname="Wheat"/>} />
                <Route path="/payments" element={<Payments/>} />

              </Routes>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
