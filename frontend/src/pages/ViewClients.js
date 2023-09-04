import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import React from "react";
import Table from "react-bootstrap/Table";
import { getAuthorized } from "../authorization/AuthRequests";
import "../components/searchBarClients.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function ViewClients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);

  useEffect(() => {
    getClients();
  }, []);

  const getClients = async () => {
    const onSucces = async (data) => {
      setClients(data);
      setFilteredClients(data);
    };
    await getAuthorized("/api/clients", onSucces);
  };

  const onChange = (text) => {
    if (text === null || text === "") {
      setFilteredClients(clients);
    } else {
      text = text.toLowerCase();
      setFilteredClients(
        clients.filter((c) => c.full_name.toLowerCase().includes(text))
      );
    }
  };

  return (
    <Fragment>
      <form className="search-bar">
        <input onChange={(e) => onChange(e.target.value)}></input>
        <button type="submit">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>
      <div class="p-3">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th className="appellation">Full Name</th>
              <th className="appellation">Details</th>
              <th className="appellation">Add Service</th>
              <th className="appellation">Update</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client, index) => (
              <tr key={index}>
                <td>{client.full_name}</td>
                <td>
                  <Link
                    className="click-go"
                    to={"/client/" + client.id}
                    color="green"
                  >
                    Details
                  </Link>
                </td>
                <td>
                  <Link
                    className="click-go"
                    to={"/add-service/" + client.id}
                    color="green"
                  >
                    Add Service
                  </Link>
                </td>
                <td>
                  <Link
                    className="click-go"
                    to={"/client-update/" + client.id}
                    color="green"
                  >
                    Update
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
export default ViewClients;
