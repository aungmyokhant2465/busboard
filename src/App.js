import React, { useEffect, useState } from "react";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import Clock from "react-live-clock";
import moment from "moment";
import GIF from "./images/GIF.gif";
import Slider2 from "./Slider2";
import Announce from "./Announce";
// import Image1 from "./images/image1.png";

import { SwitchTransition, CSSTransition } from "react-transition-group";

const TRIPS = gql`
  query MyQuery($id: Int!, $nowDate: timestamptz) {
    ptp_trips(
      where: {
        _and: {
          depart_time: { _gt: $nowDate }
          ptp_route: { fk_start_terminal: { _eq: $id } }
        }
      }
      limit: 10
    ) {
      depart_time
      vehicle_account {
        vehicle_plate_number
        fk_vehicle_type
      }
      ptp_route {
        end_terminal {
          transport_terminal_name
        }
        start_terminal {
          transport_terminal_name
        }
      }
    }
  }
`;

const TRANSPORTTERMINALSNAME = gql`
  query MyQuery {
    transport_terminal_information {
      transport_terminal_id
      transport_terminal_name
    }
  }
`;

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

const App = () => {
  const [loadTrips, resultTrips] = useLazyQuery(TRIPS, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    // pollInterval: 5000
  });
  const result = useQuery(TRANSPORTTERMINALSNAME);

  const [trips, setTrips] = useState([]);
  const [terminal, setTerminal] = useState(null);
  const [selected, setSelected] = useState(false);
  // const [vehicle, setVehicle] = useState("BUS");

  useEffect(() => {
    if (resultTrips.data) {
      setTrips(resultTrips.data.ptp_trips);
      setSelected(true);
      // if (trips?.length > 0) {
      //   setSelected(true);
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultTrips]);

  // useEffect(() => {
  //   if (selected) {
  //     let counter = 1;
  //     setInterval(() => {
  //       if (counter === 1) {
  //         let date = new Date();
  //         // loadTrips({ variables: { id: terminal.transport_terminal_id, nowDate: new Date('2022-02-19T03:24:00') }})
  //         resultTrips
  //           .refetch({
  //             id: terminal.transport_terminal_id,
  //             nowDate: date,
  //             vehicle: "UV",
  //           })
  //           .then((res) => {
  //             console.log(res);
  //             setVehicle("UV");
  //           });
  //         counter = 2;
  //       } else if (counter === 2) {
  //         let date = new Date();
  //         resultTrips
  //           .refetch({
  //             id: terminal.transport_terminal_id,
  //             nowDate: date,
  //             vehicle: "JITNEY",
  //           })
  //           .then((res) => {
  //             console.log(res);
  //             setVehicle("JEEPNEY");
  //           });
  //         counter = 3;
  //       } else if (counter === 3) {
  //         let date = new Date();
  //         resultTrips
  //           .refetch({
  //             id: terminal.transport_terminal_id,
  //             nowDate: date,
  //             vehicle: "BUS",
  //           })
  //           .then((res) => {
  //             console.log(res);
  //             setVehicle("BUS");
  //           });
  //         counter = 1;
  //       }
  //     }, 1000 * 5 * 60);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selected]);

  useEffect(() => {
    if (selected) {
      setInterval(() => {
        let date = new Date();
        // loadTrips({ variables: { id: terminal.transport_terminal_id, nowDate: new Date('2022-02-19T03:24:00') }})
        resultTrips
          .refetch({
            id: terminal.transport_terminal_id,
            nowDate: date,
          })
          .then((res) => {
            console.log(res);
          });
      }, 1000 * 5 * 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  if (result.loading) {
    return <div>Loading...</div>;
  }

  const handleChange = (e) => {
    let id = e.target.value;
    let ter = result.data.transport_terminal_information.find(
      (t) => t.transport_terminal_id === Number(id)
    );
    setTerminal(ter);
    if (ter.transport_terminal_id) {
      loadTrips({
        variables: {
          id: ter.transport_terminal_id,
          nowDate: new Date(),
        },
      });
    }
  };

  const handleBack = () => {
    setTrips(null);
    setTerminal(null);
  };

  return (
    <div className="container">
      {!terminal && (
        <div className="form-group">
          <label htmlFor="terminal">Select Start Terminal</label>
          <select id="terminal" name="terminal" onChange={handleChange}>
            <option></option>
            {result.data.transport_terminal_information.map((t, index) => (
              <option value={t.transport_terminal_id} key={index}>
                {t.transport_terminal_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {terminal && selected && (
        <>
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
                    {moment().format("LL")} <br />
                    <Clock format={"HH:mm:ss"} ticking={true} />
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="2"
                    className="header"
                    style={{ color: "#FFD700" }}
                  >
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
                          <th>DESTINATION</th>
                          <th>DEPARTURE</th>
                          <th>BAY</th>
                          <th>PLATE NUMBER</th>
                        </tr>
                      </thead>
                      {/* {
                      ( trips && trips.length > 0) ? (
                          <tbody>
                            {
                              trips.map((t, index) => (
                                  <tr
                                  key={index}
                                  >
                                    <td>{t.ptp_route.end_terminal?.transport_terminal_name}</td>
                                    <td>{moment(t.depart_time).format('LT')}</td>
                                    <td></td>
                                    <td>{t.vehicle_account?.vehicle_plate_number}</td>
                                  </tr>
                              ))
                            }
                          </tbody>
                      ) : (
                        <tbody id='demo'>
                        </tbody>
                      )
                      } */}
                      {/* <div className="info">
                          <p>
                            There is no trips with{" "}
                            {terminal.transport_terminal_name}
                          </p>
                          <div tabIndex="1" onClick={handleBack}>
                            Reselect terminal
                          </div>
                        </div> */}

                      <SwitchTransition mode={"out-in"}>
                        <CSSTransition
                          key={trips && trips.length > 0}
                          addEndListener={(node, done) => {
                            node.addEventListener(
                              "transitionend",
                              () => {
                                resultTrips.loading && done();
                              },
                              false
                            );
                          }}
                          classNames="fade"
                        >
                          {resultTrips.loading ? (
                            <tbody>
                              <tr>
                                <td colSpan="4" className="info">
                                  Loading...
                                </td>
                              </tr>
                            </tbody>
                          ) : terminal && trips && trips.length === 0 ? (
                            <tbody>
                              <tr>
                                <td colSpan="4" className="info">
                                  <p>
                                    There is no trips with{" "}
                                    {terminal.transport_terminal_name}
                                  </p>
                                  <div tabIndex="1" onClick={handleBack}>
                                    Reselect terminal
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          ) : (
                            <tbody>
                              {trips &&
                                trips.map((t, index) => (
                                  <tr key={index}>
                                    <td>
                                      {
                                        t.ptp_route.end_terminal
                                          ?.transport_terminal_name
                                      }
                                    </td>
                                    <td>
                                      {moment(t.depart_time).format("LT")}
                                    </td>
                                    <td></td>
                                    <td>
                                      {t.vehicle_account?.vehicle_plate_number}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          )}
                        </CSSTransition>
                      </SwitchTransition>
                    </table>
                  </td>
                  <td>
                    {/* <img src={Image1} style={{ width: "80%" }} alt="" /> */}
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
        </>
      )}
    </div>
  );
};

export default App;
