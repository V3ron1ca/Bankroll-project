import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "../components/clientData.css";
import toast from "react-hot-toast";
import { getAuthorized } from "../authorization/AuthRequests";
import { postAuthorized } from "../authorization/AuthRequests";
import axios from "axios";
import "../components/taxesForm.css";

function dateToString(date) {
  let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  let mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
  return `${ye}-${mo}`;
}
function TaxInfo() {
  const now = new Date();
  const currentMonthDateFrom = new Date(now.getFullYear(), now.getMonth());
  const [DateInputTax, setDateInputTax] = useState(
    dateToString(currentMonthDateFrom)
  );
  const [Nfz, setNfz] = useState("");
  const [Pit, setPit] = useState("");
  const [Zus, setZus] = useState("");
  const [Percent, setPercent] = useState("");
  const [taxes, setTaxes] = useState([]);
  const styles = {
    color: "white",
    fontSize: "45px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: "900",
    marginTop: "30px",
  };

  const TaxInfo = async (e) => {
    e.preventDefault();
    var data = {
      pit: parseFloat(Pit),
      date_input_tax: DateInputTax + "-01",
      nfz: parseFloat(Nfz),
      zus: parseFloat(Zus),
      percent: parseFloat(Percent),
    };

    const onSuccess = (response) => {
      e.target.reset();
      toast.success("Successfully added!");
      getTaxes();
    };
    const onFail = (response) => {
      console.log(response);
      toast.error("Error: " + response.message);
    };

    await postAuthorized("/api/taxes", data, onSuccess, onFail);
  };

  useEffect(() => {
    getTaxes();
  }, []);

  const onDelete = (id) => {
    axios.delete(`/api/tax/${id}`).then(() => {
      getTaxes();
    });
  };

  const getTaxes = async () => {
    const onSucces = async (data) => {
      setTaxes(data);
    };
    await getAuthorized("/api/taxes", onSucces);
  };

  return (
    <div>
      <div class="row" className="">
        <div className="">
          <div class="d-flex justify-content-center flex-column align-items-center w-100">
            <h1 style={styles}>ADD TAX</h1>
            <form
              onSubmit={TaxInfo}
              class="formularz2"
              className="tax-container-form"
            >
              <legend>
                <i className="fa fa-empire fa-4x"></i>
              </legend>
              <div className="wrapper">
                <label htmlFor="tbdate_input_tax" className="lbl-tb">
                  <i className="fa fa-user fa-fw"></i>Date Input Tax
                </label>
                <br />
                <input
                  id="tbdate_input_tax"
                  name="date_input_tax"
                  type="month"
                  className="frm-ctrl tb"
                  onChange={(e) => setDateInputTax(e.target.value)}
                  value={DateInputTax}
                />
              </div>
              <div className="wrapper">
                <label htmlFor="tbZus" className="lbl-tb">
                  <i className="fa fa-envelope-o fa-fw"></i> ZUS
                </label>
                <br />
                <input
                  id="tbZus"
                  name="zus"
                  type="text"
                  className="frm-ctrl tb"
                  onChange={(e) => setZus(e.target.value)}
                  value={Zus}
                />
              </div>
              <div className="wrapper">
                <label htmlFor="tbnfz" className="lbl-tb">
                  <i className="fa fa-unlock fa-fw"></i> NFZ
                </label>
                <br />
                <input
                  id="tbnfz"
                  name="nfz"
                  type="text"
                  className="frm-ctrl tb"
                  onChange={(e) => setNfz(e.target.value)}
                  value={Nfz}
                />
              </div>
              <div className="wrapper">
                <label htmlFor="tbpit" className="lbl-tb">
                  <i className="fa fa-unlock fa-fw"></i> PIT
                </label>
                <br />
                <input
                  id="tbpit"
                  name="pit"
                  type="text"
                  className="frm-ctrl tb"
                  onChange={(e) => setPit(e.target.value)}
                  value={Pit}
                />
              </div>
              <div className="wrapper">
                <label htmlFor="tbPercent" className="lbl-tb">
                  <i className="fa fa-unlock fa-fw"></i> Percent
                </label>
                <br />
                <input
                  id="tbPercent"
                  name="percent"
                  type="text"
                  className="frm-ctrl tb"
                  onChange={(e) => setPercent(e.target.value)}
                  value={Percent}
                />
              </div>
              <div className="wrapper">
                <button id="addTAX" type="submit" className="frm-ctrl addTAX">
                  Add Tax
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="p-3">
        <Table striped bordered hover variant="dark" className="row2">
          <thead>
            <tr>
              <th className="appellation">Date Input Tax</th>
              <th className="appellation">ZUS</th>
              <th className="appellation">NFZ</th>
              <th className="appellation">PIT</th>
              <th className="appellation">Percent</th>
              <th className="appellation">Delete</th>
            </tr>
          </thead>
          <tbody>
            {taxes.map((tax, index) => (
              <tr key={index}>
                <td>{tax.date_input_tax}</td>
                <td>{tax.zus}</td>
                <td>{tax.nfz}</td>
                <td>{tax.pit}</td>
                <td>{tax.percent}</td>
                <td>
                  <button
                    className="button-tax"
                    onClick={() => onDelete(tax.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
export default TaxInfo;
