 import React, { useEffect, useState, } from "react";
import { listReservations,listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "../reservation/ReservationList";
import TablesList from "../tables/TablesList";
import NavigationButtons from "../Navigation/NavigationButtons";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [tables, setTables] = useState([]);



  useEffect(()=>{
    loadDashboard();
  }, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError)

      listTables( abortController.signal)
      .then(setTables)
      .catch(setTablesError)
    return () => abortController.abort();
  }

  return (
    <main>
      <h1 className="ml-4 text-white">Dashboard</h1>
      <div className="text-white d-md-flex mb-3">
        <h4 className="ml-4 mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <ReservationList reservations={reservations} />
      <NavigationButtons/>
      <TablesList  date={date} setReservations={setReservations} setTables={setTables} tables={tables} />
 
    </main>
  );
}

export default Dashboard;
