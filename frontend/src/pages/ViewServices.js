import { Fragment, useEffect, useState } from "react";
import React from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import { getAuthorized } from "../authorization/AuthRequests";
import "../components/searchBarCalendarService.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function dateToString(date) {
  let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  let mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
  let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
  return `${ye}-${mo}-${da}`;
}

function ViewServices() {
  const now = new Date();
  const currentMonthDateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthDateTo = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [dateFrom, setDateFrom] = useState(dateToString(currentMonthDateFrom));
  const [dateTo, setDateTo] = useState(dateToString(currentMonthDateTo));

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    const onSucces = async (data) => {
      setServices(data);
      setFilteredServices(data);
    };
    await getAuthorized(
      "/api/services/range/" + dateFrom + "/" + dateTo,
      onSucces
    );
  };

  const onChange = (text) => {
    if (text === null || text === "") {
      setFilteredServices(services);
    } else {
      text = text.toLowerCase();
      setFilteredServices(
        services.filter((c) =>
          c["client.full_name"].toLowerCase().includes(text)
        )
      );
    }
  };

  const handleForm = (e) => {
    e.preventDefault();
    getServices();
  };

  return (
    <Fragment>
      <div class="row" id="k23">
        <div class="col">
          <form className="search-bar2">
            <input onChange={(e) => onChange(e.target.value)}></input>
            <button disabled="true" type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form>
        </div>
        <div class="col">
          <form label="dates" class="date-picker" onSubmit={handleForm}>
            <input
              class="selected-date1"
              type="date"
              onChange={(e) => setDateFrom(e.target.value)}
              value={dateFrom}
            ></input>
            <input
              class="selected-date2"
              type="date"
              onChange={(e) => setDateTo(e.target.value)}
              value={dateTo}
            ></input>
            <button class="search-button" type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form>
        </div>
      </div>
      <div class="p-3">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th className="appellation">Client</th>
              <th className="appellation">Time</th>
              <th className="appellation">Price</th>
              <th className="appellation">Date of Work</th>
              <th className="appellation">Service Type</th>
              <th className="appellation">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service, index) => (
              <tr key={index}>
                <td>{service["client.full_name"]}</td>
                <td>{service.time}</td>
                <td>{service.price}</td>
                <td>{service.date_of_work}</td>
                <td>{service.service_type}</td>
                <td>
                  <Link
                    className="click-go"
                    to={"/service/" + service.id}
                    color="green"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Fragment>
  );
}

export default ViewServices;
