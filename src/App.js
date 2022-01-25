import React, { useEffect, useState } from 'react'
import { gql, useQuery, useLazyQuery } from '@apollo/client'
import Clock from 'react-live-clock';

const TRIPS = gql`
query MyQuery ($id: Int!, $nowDate: timestamptz) {
  ptp_trips(where: {depart_time: {_gt: $nowDate}, ptp_route: {fk_start_terminal: {_eq: $id}}}, limit: 7) {
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

  useEffect(() => {
    if(resultTrips.data) {
      setTrips(resultTrips.data.ptp_trips)
    }
  }, [resultTrips.data])

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
    <>
      <main>
          <header>
              <h2>Bus Line Board</h2>
              <h3 tabIndex='1' onClick={handleBack} > {'<<'} Back</h3>
          </header>
          <article>
            {
              (!trips) && (
                <div>
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
                </div>
              )
            }
            {
              (trips && trips.length === 0) && (
                <div className='info' >
                  <p>There is no trips with {terminal.transport_terminal_name}</p>
                  <h3 tabIndex='1' onClick={handleBack} >Reselect terminal</h3>
                </div>
              )
            }
            {
              ( trips && trips.length > 0) && (
                <>
                  <table>
                    <caption>Showing bus depart time</caption>
                    <thead>
                        <tr>
                            <th>Depart Time</th>
                            <th>Start Terminal Name</th>
                            <th>End Terminal Name</th>
                            <th>Plate Number</th>
                        </tr>
                    </thead>
                    <tbody>
                      {
                        trips.map((t, index) => (
                          <tr key={index} >
                            <td>{t.depart_time}</td>
                            <td>{t.ptp_route.start_terminal?.transport_terminal_name}</td>
                            <td>{t.ptp_route.end_terminal?.transport_terminal_name}</td>
                            <td>{t.vehicle_account?.vehicle_plate_number}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                  <section className='time-container'>
                    <span>Current Time - </span>
                    <Clock format={'HH:mm:ss'} ticking={true} />
                  </section>
                </>
              )
            }
          </article>
      </main>
      <footer>
      </footer>
    </>
  )
}

export default App