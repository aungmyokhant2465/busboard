import React, { useEffect, useState } from 'react'
import { gql, useQuery, useLazyQuery } from '@apollo/client'
import Clock from 'react-live-clock';
import moment from 'moment';
import GIF from './images/GIF.gif';
import Slider2 from './Slider2';
import Announce from './Announce';

const TRIPS = gql`
query MyQuery ($id: Int!, $nowDate: timestamptz) {
  ptp_trips(where: {depart_time: {_gt: $nowDate}, ptp_route: {fk_start_terminal: {_eq: $id}}}, limit: 10) {
    depart_time
    vehicle_account {
      vehicle_plate_number
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
`

const TRANSPORTTERMINALSNAME = gql`
query MyQuery {
  transport_terminal_information {
    transport_terminal_id
    transport_terminal_name
  }
}
`

const App = () => {

  const [loadTrips , resultTrips] = useLazyQuery(TRIPS)
  const result = useQuery(TRANSPORTTERMINALSNAME)

  const [ trips, setTrips ] = useState(null)
  const [ terminal, setTerminal ] = useState({})
  const [ inter, setInter ] = useState(null)

  useEffect(() => {
    if(resultTrips.data) {
      setTrips(resultTrips.data.ptp_trips)
    }
  }, [resultTrips.data])

  // let inter
  useEffect(() => {
    if(trips && trips.length > 0) {
      const inte = setInterval(() => {
        loadTrips({ variables: { id: terminal.transport_terminal_id, nowDate: new Date() }})
      }, (1000 * 60 * 5));
      setInter(inte)
    } else {
      clearInterval(inter)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trips])

  if(result.loading || resultTrips.loading) {
    return <div>Loading...</div>
  }

  const handleChange = (e) => {
    let id = e.target.value
    let ter = result.data.transport_terminal_information.find(t => t.transport_terminal_id === Number(id))
    setTerminal(ter)
    if(ter.transport_terminal_id) {
      loadTrips({ variables: { id: ter.transport_terminal_id, nowDate: new Date() }})
    }
  }

  const handleBack = () => {
    setTrips(null)
  }

  return (
    <div className='container'>
      {
        (!trips) && (
          <div className='form-group' >
            <label htmlFor='terminal' >Select Start Terminal</label>
            <select id='terminal' name='terminal' onChange={handleChange}>
              <option></option>
              {
                result.data.transport_terminal_information.map((t, index) => 
                  <option value={t.transport_terminal_id} key={index}>{t.transport_terminal_name}</option>
                )
              }
            </select>
          </div>
        )
      }
      {
        (trips && trips.length === 0) && (
          <div className='info' >
            <p>There is no trips with {terminal.transport_terminal_name}</p>
            <div tabIndex='1' onClick={handleBack} >Reselect terminal</div>
          </div>
        )
      }
      {
        ( trips && trips.length > 0) && 
        <>
          <main>
            <table id="conta">
              <thead>
                <tr>
                  <th id="imgContainer" rowSpan='2' ><img src={GIF} id="logoGIF" alt='oro logo'/></th>
                  <th colSpan='2'>STA. ROSA INTEGRATED TERMINAL</th>
                  <th rowSpan='2' id='clock-container'><Clock format={'HH:mm:ss'} ticking={true} /></th>
                </tr>
                <tr>
                  <th colSpan='2'>SRIT BUS SCHEDULES</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan='3'>
                    <table id='inner'>
                      <thead>
                        <tr>
                          <th>DESTINATION</th>
                          <th>DEPARTURE</th>
                          <th>BAY</th>
                          <th>PLATE NUMBER</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          trips.map((t, index) => (
                            <tr key={index} >
                              <td>{t.ptp_route.end_terminal?.transport_terminal_name}</td>
                              <td>{moment(t.depart_time).format('LT')}</td>
                              <td></td>
                              <td>{t.vehicle_account?.vehicle_plate_number}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </td>
                  <td>
                    {/* <Slider /> */}
                    <Slider2 />
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan='4'>
                    <Announce />
                  </td>
                </tr>
              </tfoot>
            </table>
          </main>
        </>
      }
    </div>
  )
}

export default App