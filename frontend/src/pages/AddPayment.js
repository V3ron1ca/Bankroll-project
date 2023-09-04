import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAuthorized } from "../authorization/AuthRequests";
import { postAuthorized } from "../authorization/AuthRequests";
import { useNavigate } from "react-router-dom";
import "../components/addPaymentForm.css";
import DarkSelect from "../components/DarkSelect";

function AddPayment() {
  const [DateBook, setDateBook] = useState("");
  const [DateIncome, setDateIncome] = useState("");
  const [Amount, setAmount] = useState("");
  const [Source, setSource] = useState("");
  const [Tax, setTax] = useState("");
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState(null);
  const navigate = useNavigate();
  const styles = {
    color: "white",
    fontSize: "45px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: "900",
    marginTop: "30px",
  };
  const getClients = async () => {
    await getAuthorized("/api/clients", (data) =>
      setClients(data.map((x) => ({ value: x.id, label: x.full_name })))
    );
  };

  const getClientDetails = async (id) => {
    await getAuthorized("/api/client/" + id, (data) =>
      setAmount(data.default_price)
    );
  };

  const AddPayment = async (e) => {
    e.preventDefault();
    var data = {
      client_id: client.value,
      date_book: DateBook,
      date_income: DateIncome,
      amount: parseFloat(Amount),
      source: Source,
      tax: parseFloat(Tax),
    };

    const onSuccess = (responseData) => {
      e.target.reset();
      setClient(null);
      setAmount(null);
      toast.success("Successfully added!");
      navigate("/view-payments");
    };

    await postAuthorized("/api/payments", data, onSuccess);
  };

  useEffect(() => {
    getClients();
  }, []);

  useEffect(() => {
    if (client != null) {
      let value = client.value == null ? "" : client.value;
      getClientDetails(value);
    }
  }, [client]);

  return (
    <div class="d-flex justify-content-center flex-column align-items-center w-100">
      <h1 style={styles}>ADD PAYMENT</h1>
      <form onSubmit={AddPayment} id="formularz1" className="container-form">
        <legend>
          <i className="fa fa-empire fa-4x"></i>
        </legend>
        <div className="wrapper">
          <label htmlFor="tbamount" className="lbl-tb">
            <i className="fa fa-user fa-fw"></i> Client{" "}
          </label>
          <DarkSelect
            className="tb"
            options={clients}
            onChange={(e) => setClient(e)}
            value={client}
          />
        </div>
        <div className="wrapper">
          <label htmlFor="tbtime" className="lbl-tb">
            <i className="fa fa-user fa-fw"></i> Date Book
          </label>
          <br />
          <input
            id="tbtime"
            name="date_book"
            type="date"
            className="frm-ctrl tb"
            spellCheck="false"
            autoComplete="off"
            onChange={(e) => setDateBook(e.target.value)}
            value={DateBook}
          />
        </div>
        <div className="wrapper">
          <label htmlFor="tbnote" className="lbl-tb">
            <i className="fa fa-envelope-o fa-fw"></i> Date Income
          </label>
          <br />
          <input
            id="tbnote"
            name="date_income"
            type="date"
            className="frm-ctrl tb"
            spellCheck="false"
            autoComplete="off"
            onChange={(e) => setDateIncome(e.target.value)}
          />
        </div>
        <div className="wrapper">
          <label htmlFor="tbprice" className="lbl-tb">
            <i className="fa fa-unlock fa-fw"></i> Amount
          </label>
          <br />
          <input
            id="tbprice"
            name="amount"
            type="text"
            className="frm-ctrl tb"
            onChange={(e) => setAmount(e.target.value)}
            value={Amount}
          />
        </div>
        <div className="wrapper">
          <label htmlFor="tbdatework" className="lbl-tb">
            <i className="fa fa-unlock fa-fw"></i> Source
          </label>
          <br />
          <input
            id="tbdatework"
            name="source"
            type="text"
            className="frm-ctrl tb"
            onChange={(e) => setSource(e.target.value)}
            value={Source}
          />
        </div>
        <div className="wrapper">
          <label htmlFor="tbtype" className="lbl-tb">
            <i className="fa fa-unlock fa-fw"></i> Tax
          </label>
          <br />
          <input
            id="tbtype"
            name="tax"
            type="text"
            className="frm-ctrl tb"
            onChange={(e) => setTax(e.target.value)}
            value={Tax}
          />
        </div>
        <div className="wrapper">
          <button
            id="addPayment1"
            type="submit"
            className="frm-ctrl addPayment1"
          >
            Add Payment
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPayment;
