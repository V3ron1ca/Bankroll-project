import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router";
import Table from "react-bootstrap/Table";
import { getAuthorized } from "../authorization/AuthRequests";
import ClientInfo from "./ClientInfo";
import { Link } from "react-router-dom";
import "../components/clientData.css";

function ClientDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [services, setServices] = useState([]);
  const styles = {
    color: "white",
    fontSize: "45px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: "900",
    marginTop: "30px",
  };
  const getClientDetails = async () => {
    const onSuccess = (data) => {
      setDetails(data);
      getAuthorized("/api/client/" + id + "/services", (data) =>
        setServices(data)
      );
    };

    await getAuthorized("/api/client/" + id, onSuccess);
  };
  useEffect(() => {
    getClientDetails();
  }, []);

  return (
    <Fragment>
      {details != null ? (
        <div className="name">
          <h1 style={styles}> CLIENT DATA</h1>
        </div>
      ) : (
        <div class="spinner-border text-warning" role="status"></div>
      )}
      {<ClientInfo />}
      <h1 className="name1" style={styles}>
        {" "}
        CLIENT SERVICES
      </h1>
      <div class="p-3">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th className="appellation">Time</th>
              <th className="appellation">Date of Work</th>
              <th className="appellation">Note</th>
              <th className="appellation">Price</th>
              <th className="appellation">Service Type</th>
              <th className="appellation"></th>
            </tr>
          </thead>
          <tbody>
            {services.map((x, index) => (
              <tr key={index}>
                <td>{x.time}</td>
                <td>{x.date_of_work}</td>
                <td>{x.note}</td>
                <td>{x.price}</td>
                <td>{x.service_type}</td>
                <td>
                  <Link
                    className="click-go"
                    to={"/service/" + x.id}
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

export default ClientDetails;
