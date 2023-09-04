import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router";
import Table from "react-bootstrap/Table";
import "../components/clientData.css";
import { getAuthorized } from "../authorization/AuthRequests";
import { Link } from "react-router-dom";
import { deleteAuthorized } from "../authorization/AuthRequests";
import { toast } from "react-hot-toast";

function PaymentInfo() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [servicePayment, setServicePayment] = useState([]);
  const styles = {
    color: "white",
    fontSize: "45px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: "900",
    marginTop: "30px",
  };

  const getPaymentDetails = async () => {
    const onSuccess = (data) => {
      setDetails(data);
    };

    await getAuthorized("/api/payment/" + id, onSuccess);
  };
  const getServicePayment = async () => {
    const onSuccess = (data) => {
      setServicePayment(data);
    };

    await getAuthorized("/api/payment/" + id + "/services", onSuccess);
  };

  useEffect(() => {
    getPaymentDetails();
    getServicePayment();
  }, []);

  const onSuccessAdd = () => {
    getServicePayment();
  };
  const onDelete = (id) => {
    const onSuccess = (data) => {
      toast.success("Deleted!");
      getServicePayment();
    };
    deleteAuthorized(`/api/servicepayment/${id}`, onSuccess);
  };

  return (
    <Fragment>
      <h1 className="name1" style={styles}>
        PAYMENT DATA
      </h1>
      {details != null ? (
        <span>
          <div class="p-3">
            <Table striped bordered hover variant="dark">
              <tbody>
                <tr>
                  <td>Client</td>
                  <td>
                    <Link
                      className="click-go"
                      to={"/client/" + details.client_id}
                      color="green"
                    >
                      {details["client.full_name"]}
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>Date book</td>
                  <td>{details.date_book}</td>
                </tr>

                <tr>
                  <td>Date income</td>
                  <td>{details.date_income}</td>
                </tr>

                <tr>
                  <td>Amount</td>
                  <td>{details.amount}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </span>
      ) : null}
      <div class="p-3">
        <h1 className="name1" style={styles}>
          SERVICE DATA
        </h1>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Service Details</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {servicePayment.map((x, index) => (
              <tr key={index}>
                <td>{x.amount}</td>
                <td>
                  <Link to={"/service/" + x.service_id}>
                    <button className="button-tax"> Details</button>
                  </Link>
                </td>

                <td>
                  <button onClick={() => onDelete(x.id)} className="button-tax">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Fragment>
  );
}
export default PaymentInfo;
