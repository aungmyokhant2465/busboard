import React, { useEffect, useState } from "react";
import Clock from "react-live-clock";
import moment from "moment";
import GIF from "./images/GIF.gif";
import Slider2 from "./Slider2";
import Announce from "./Announce";

import { SwitchTransition, CSSTransition } from "react-transition-group";

const style1 = {
  position: "relative",
  paddingBottom: "56.25%",
  height: 0,
  overflow: "hidden",
};

const style2 = {
  width: "100%",
  height: "100%",
  position: "absolute",
  left: 0,
  top: 0,
  overflow: "hidden",
};

const busAndUV = [
  { name: "BNHS (Arellano)", gate: 1, bay: "1 - 2" },
  { name: "Olongapo (Hi-way)", gate: 2, bay: "3" },
  { name: "Olongapo (Loob)", gate: 2, bay: "4" },
  { name: "Bagac", gate: 3, bay: "5" },
  { name: "San Fernando", gate: 4, bay: "6" },
  { name: "Mariveles", gate: 4, bay: "7 - 8" },
  { name: "Orani (Modernized)", gate: 5, bay: "9" },
  { name: "Morong", gate: 6, bay: "10" },
  { name: "Dau", gate: 7, bay: "12 - 13" },
];

const puj = [
  { name: "Bagac", gate: 7, bay: "14" },
  { name: "BNAS", gate: 7, bay: "15" },
  { name: "Parang", gate: 8, bay: "16" },
  { name: "Cabog-Cabog", gate: 8, bay: "17" },
  { name: "Lamao", gate: 9, bay: "18 - 19" },
  { name: "Dinalupihan", gate: 9, bay: "20" },
  { name: "Orani", gate: 10, bay: "21 - 23" },
  { name: "Abucay", gate: 11, bay: "24" },
];

let l = 8;

const App = () => {
  const [trips, setTrips] = useState(busAndUV);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("BUS & UV EXPRESS");

  useEffect(() => {
    setInterval(() => {
      setLoading(true);
      if (l === 9) {
        l = 8;
        setTrips(puj);
        setType("PUJ");
      } else if (l === 8) {
        setTrips(busAndUV);
        setType("BUS & UV EXPRESS");
        l = 9;
      }
      setLoading(false);
    }, 1000 * 10);
  }, []);

  return (
    <div className="container">
      <main>
        <table id="conta">
          <thead>
            <tr>
              <th id="imgContainer" rowSpan="2">
                <img src={GIF} id="logoGIF" alt="oro logo" />
              </th>
              <th colSpan="2" className="header">
                BATAAN TERMINAL COMPLEX
              </th>
              <th rowSpan="2" id="clock-container">
                {moment().format("LL")}
                <br />
                <Clock format={"HH:mm:ss"} ticking={true} />
              </th>
            </tr>
            <tr>
              <th colSpan="2" className="header" style={{ color: "#FFD700" }}>
                BTC Vehicle Schedules
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="3" rowSpan="2">
                <table id="inner">
                  <thead>
                    <tr>
                      <th>{type}</th>
                      <th>GATE</th>
                      <th>BAY</th>
                    </tr>
                  </thead>
                  <SwitchTransition mode={"out-in"}>
                    <CSSTransition
                      key={trips}
                      addEndListener={(node, done) => {
                        node.addEventListener(
                          "transitionend",
                          () => {
                            loading && done();
                          },
                          false
                        );
                      }}
                      classNames="fade"
                    >
                      <tbody>
                        {trips &&
                          trips.map((t, index) => (
                            <tr key={index}>
                              <td>{t.name}</td>
                              <td>{t.gate}</td>
                              <td>{t.bay}</td>
                            </tr>
                          ))}
                      </tbody>
                    </CSSTransition>
                  </SwitchTransition>
                </table>
              </td>
              <td>
                <Slider2 />
              </td>
            </tr>
            <tr>
              <td>
                <div style={style1}>
                  <iframe
                    style={style2}
                    frameBorder="0"
                    type="text/html"
                    src="https://geo.dailymotion.com/player/x5poh.html?video=x5cr6b9&mute=true"
                    width="100%"
                    height="100%"
                    allow="autoplay"
                    title="livestream"
                  ></iframe>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4">
                <Announce />
              </td>
            </tr>
          </tfoot>
        </table>
      </main>
    </div>
  );
};

export default App;
