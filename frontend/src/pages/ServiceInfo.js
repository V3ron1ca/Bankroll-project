import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router";
import Table from "react-bootstrap/Table";
import "../components/clientData.css";
import { getAuthorized } from "../authorization/AuthRequests";
import { Link } from "react-router-dom";
import UserPaymentData from "./UserPaymentData";
import AddPaymentForm from "./AddPaymentForm";
import { deleteAuthorized } from "../authorization/AuthRequests";
import { toast } from "react-hot-toast";

function ServiceInfo() {
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
  const getServiceDetails = async () => {
    const onSuccess = (data) => {
      setDetails(data);
    };

    await getAuthorized("/api/service/" + id, onSuccess);
  };
  const getServicePayment = async () => {
    const onSuccess = (data) => {
      setServicePayment(data);
    };

    await getAuthorized("/api/service/" + id + "/payments", onSuccess);
  };

  useEffect(() => {
    getServiceDetails();
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
      {details != null ? (
        <span>
          <div className="row">
            <div className="col-6">
              <UserPaymentData details={details} />
            </div>
            <div className="col-6">
              <h1 className="name2" style={styles}>
                PAY SERVICE
              </h1>
              <AddPaymentForm details={details} onSuccessAdd={onSuccessAdd} />
            </div>
          </div>
        </span>
      ) : null}
      <h1 className="name1" style={styles}>
        {" "}
        PAID SERVICES
      </h1>
      <div class="p-3">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th className="appellation">Payment</th>
              <th className="appellation">Amount</th>
              <th className="appellation">Payment Details</th>
              <th className="appellation">Delete</th>
            </tr>
          </thead>
          <tbody>
            {servicePayment.map((x, index) => (
              <tr key={index}>
                {console.log(x)}
                <td>
                  {x["payment.date_income"]} ({x["payment.amount"]})
                </td>
                <td>{x.amount}</td>
                <td>
                  <Link to={"/payment/" + x["payment_id"]}>
                    <button className="button-tax"> Details</button>
                  </Link>
                </td>
                <td>
                  <button className="button-tax" onClick={() => onDelete(x.id)}>
                    {" "}
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
export default ServiceInfo;
