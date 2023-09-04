import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAuthorized } from "../authorization/AuthRequests";
import { postAuthorized } from "../authorization/AuthRequests";
import "../components/payForService.css";
import DarkSelect from "../components/DarkSelect";

function AddPaymentForm({ details, onSuccessAdd }) {
  const [Amount, setAmount] = useState("");
  const [payments, setPayments] = useState([]);
  const [payment, setPayment] = useState(null);

  const getPayments = async () => {
    await getAuthorized(
      "/api/client/" + details.client_id + "/payments",
      (data) =>
        setPayments(
          data.map((x) => ({
            value: x.id,
            label: (
              <span>
                {x.date_income} ({x.amount})
              </span>
            ),
          }))
        )
    );
  };

  const addPayment = async (e) => {
    e.preventDefault();
    var data = {
      service_id: details.id,
      payment_id: payment.value,
      amount: parseFloat(Amount),
    };

    const onSuccess = (responseData) => {
      e.target.reset();
      setAmount(null);
      toast.success("Successfully added!");
      onSuccessAdd();
    };

    const onFail = (responseData) => {
      toast.error(responseData.error);
    };
    await postAuthorized("/api/servicepayment", data, onSuccess, onFail);
  };

  useEffect(() => {
    getPayments();
  }, []);

  return (
    <div className="add-payment-row">
      <form onSubmit={addPayment} className="formularz3" class="container-pay">
        <legend>
          <i className="fa fa-empire fa-4x"></i>
        </legend>
        <div className="wrapper3">
          <label htmlFor="tbamount" className="lbl-tb">
            <i className="fa fa-user fa-fw"></i> Client{" "}
          </label>
          <DarkSelect
            className="tb"
            options={payments}
            onChange={(e) => setPayment(e)}
            value={payment}
          />
        </div>
        <div className="wrapper3">
          <label htmlFor="tbamount" className="lbl-tb">
            <i className="fa fa-user fa-fw"></i> Amount
          </label>
          <br />
          <input
            id="tbamount"
            name="amount"
            type="text"
            className="frm-ctrl tb"
            spellCheck="false"
            autoComplete="off"
            onChange={(e) => setAmount(e.target.value)}
            value={Amount}
          />
        </div>
        <div className="wrapper3">
          <button
            id="addPayment3"
            type="submit"
            className="frm-ctrl addPayment3"
          >
            Add Payment
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPaymentForm;
