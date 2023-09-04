import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAuthorized } from "../authorization/AuthRequests";
import { postAuthorized } from "../authorization/AuthRequests";
import { useNavigate, useParams } from "react-router-dom";
import "../components/Form.css";
import Dropdown from "../components/Dropdown";
import DarkSelect from "../components/DarkSelect";

const styles = {
  color: "white",
  fontSize: "45px",
  fontFamily: "Roboto, sans-serif",
  fontWeight: "900",
  marginTop: "30px"
};
function dateToString(date) {
  let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  let mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
  let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
  return `${ye}-${mo}-${da}`;
}
function AddService() {
  const now = new Date();

  const prices = [80, 90, 100, 110, 120, 130, 140];
  const times = [30, 60, 90, 120];

  const currentMonthDateFrom = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const [Time, setTime] = useState("");
  const [Note, setNote] = useState("");
  const [Price, setPrice] = useState("");
  const [ServiceType, setServiceType] = useState("Lekcja");
  const [DateOfWork, setDateOfWork] = useState(
    dateToString(currentMonthDateFrom)
  );
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState({ label: "", value: "" });
  const navigate = useNavigate();
  const id = useParams();

  const getClients = async () => {
    let onSuccess = (data) => {
      let clientsList = data.map((x) => ({ value: x.id, label: x.full_name }));
      setClients(clientsList);
      setClient(clientsList.find((x) => x.value === id.id));
    };
    await getAuthorized("/api/clients", onSuccess);
  };


  const getClientDetails = async (id) => {
    await getAuthorized("/api/client/" + id, (data) =>
      setPrice(data.default_price)
    );
  };

  const addService = async (e) => {
    e.preventDefault();
    var data = {
      client_id: client.value,
      time: parseInt(Time),
      note: Note,
      price: parseFloat(Price),
      service_type: ServiceType,
      date_of_work: DateOfWork,
    };

    const onSuccess = (responseData) => {
      e.target.reset();
      setClient(null);
      setTime(null);
      toast.success("Successfully added!");
      navigate("/service/" + responseData.service_id);
    };

    await postAuthorized("/api/services", data, onSuccess);
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
    <div className="row">
      <div class="d-flex justify-content-center flex-column align-items-center w-100">
        <h1 style={styles}>ADD SERVICE</h1>
        <form
          onSubmit={addService}
          id="formularz"
          className="service-container-form"
        >
          <div class="grid-form">
            <div className="wrapper">
              <label htmlFor="tbclient" className="lbl-tb">
                <i className="fa fa-user fa-fw"></i> Set Client
              </label>

              <DarkSelect
                options={clients}
                onChange={(e) => setClient(e)}
                value={client}
              />

            </div>
            <div className="wrapper">
              <label htmlFor="tbdatework" className="lbl-tb">
                <i className="fa fa-unlock fa-fw"></i> Date of Work
              </label>
              <br />
              <input
                id="tbdatework"
                name="datework"
                type="date"
                className="frm-ctrl tb"
                onChange={(e) => setDateOfWork(e.target.value)}
                value={DateOfWork}
              />
            </div>

            <div className="wrapper">
              <label htmlFor="tbnote" className="lbl-tb">
                <i className="fa fa-envelope-o fa-fw"></i> Note
              </label>
              <br />
              <textarea
                id="tbnote"
                name="note"
                type="text"
                className="frm-ctrl tb"
                spellCheck="false"
                autoComplete="off"
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="wrapper">
              <label htmlFor="tbtype" className="lbl-tb">
                <i className="fa fa-unlock fa-fw"></i> Service Type
              </label>
              <br />
              <textarea
                id="tbtype"
                name="type"
                type="text"
                className="frm-ctrl tb"
                onChange={(e) => setServiceType(e.target.value)}
                value={ServiceType}
              />
            </div>

            <div className="wrapper">
              <label htmlFor="tbtime" className="lbl-tb">
                <i className="fa fa-user fa-fw"></i> Time
              </label>

              <div class="input-container">
                <Dropdown
                  onClick={(v) => setTime(v)}
                  suffix={"min"}
                  elements={times}
                />

                <input
                  id="tbtime"
                  name="time"
                  type="text"
                  className="frm-ctrl tb"
                  spellCheck="false"
                  autoComplete="off"
                  onChange={(e) => setTime(e.target.value)}
                  value={Time}
                />
              </div>
            </div>

            <div className="wrapper">
              <label htmlFor="tbprice" className="lbl-tb">
                <i className="fa fa-unlock fa-fw"></i> Price
              </label>

              <div class="input-container">
              <Dropdown
                onClick={(v) => setPrice(v)}
                suffix={"zł"}
                elements={prices}
              />

              <input
                id="tbprice"
                name="price"
                type="text"
                className="frm-ctrl tb"
                onChange={(e) => setPrice(e.target.value)}
                value={Price}
              />
              </div>
           
            </div>
          </div>
          <div className="wrapper1">
            <button
              id="addService"
              type="submit"
              className="frm-ctrl button-style"
            >
              Add service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddService;
