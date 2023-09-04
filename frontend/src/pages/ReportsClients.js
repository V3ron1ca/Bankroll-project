import { Fragment, useEffect, useState } from "react";
import React from "react";
import Table from "react-bootstrap/Table";
import { getAuthorized } from "../authorization/AuthRequests";
import "../components/reportsClientsButtonCalendar.css";

function dateToString(date) {
  let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  let mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
  return `${ye}-${mo}`;
}

function ReportsInfo() {
  const now = new Date();
  const currentMonthDate = new Date(now.getFullYear(), now.getMonth());
  const [reports, setReports] = useState([]);
  const [reportsClients, setReportsClients] = useState([]);
  const [dateIn, setDateIn] = useState(dateToString(currentMonthDate));
  const [selectedAll, setSelectedAll] = useState(true);

  useEffect(() => {
    getReportsClients();
  }, []);

  const getTotalClients = async () => {
    const onSucces = async (data) => {
      setReports(data);
      setSelectedAll(true);
    };
    await getAuthorized("/api/reports/clients", onSucces);
  };

  const getReportsClients = async () => {
    const onSucces = async (data) => {
      setReportsClients(data);
      setSelectedAll(false);
    };
    await getAuthorized("/api/reports/clients/" + dateIn, onSucces);
  };

  const handleForm = (e) => {
    e.preventDefault();
    getReportsClients();
  };

  return (
    <Fragment>
      <form id="calendar-buttons" onSubmit={handleForm}>
        <input
          class="calendar-report"
          type="month"
          onChange={(e) => setDateIn(e.target.value)}
          value={dateIn}
        ></input>
        <button class="filter-button" onClick={getReportsClients} type="submit">
          Filter
        </button>
      </form>

      <button class="total-button" onClick={getTotalClients} type="submit">
        Get Total
      </button>

      <div class="p-3">
        {!selectedAll ? (
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th className="appellation">Full Name</th>
                <th className="appellation">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {reportsClients.map((reportClient, index) => (
                <tr key={index}>
                  <td>{reportClient.full_name}</td>
                  <td>{reportClient.total_price}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th className="appellation">Full Name</th>
                <th className="appellation">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index}>
                  <td>{report.full_name}</td>
                  <td>{report.total_price}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </Fragment>
  );
}

export default ReportsInfo;
