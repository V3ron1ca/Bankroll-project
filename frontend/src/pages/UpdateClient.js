import {  useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import "../components/clients.css";
import { getAuthorized, putAuthorized } from "../authorization/AuthRequests";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Wrapper } from "../components/Wrapper";
import "../components/Form.css";

function UpdateClients() {
  const [client, setClient] = useState({
    full_name: "",
    default_price: "",
    email: "",
    phone_number: "",
    discord: "",
    anydesk: "",
    city: "",
  });
  const styles = {
    color: "white",
    fontSize: "45px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: "900",
    marginTop: "5px"
  };
  const { id } = useParams();
  const navigate = useNavigate();

  const getClientData = async () => {
    const onSuccess = (data) => {
      setClient(data);
      console.log(data);
    };
    getAuthorized(`/api/client/${id}`, onSuccess);
  };

  useEffect(() => {
    getClientData();
  }, []);

  const handleEdit = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleUserupdate = async (e) => {
    e.preventDefault();

    const onSuccess = (data) => {
      toast.success("Client updated!");
      navigate("/client/" + id);
    };

    client.default_price = parseInt(client.default_price)
    putAuthorized(
      `/api/client/${id}`,
      client,
      onSuccess
    );
  };

  return (
    <div id="add-client-form" class="col">
      <div class="d-flex justify-content-center flex-column align-items-sm-center">
        <h1 style={styles}>UPDATE CLIENT</h1>
        <div class="row">
          <div class="col">
            <form onSubmit={handleUserupdate} id="formularz" class="container">
              <legend>
                <i class="fa fa-empire fa-4x"></i>
              </legend>
              <Wrapper>
                <label for="tbFull_name" class="lbl-tb">
                  <i class="fa fa-user fa-fw"></i> Full name
                </label>
                <br />
                <input
                  id="tbFull_name"
                  name="full_name"
                  type="text"
                  class="frm-ctrl tb"
                  spellcheck="false"
                  autocomplete="off"
                  value={client.full_name}
                  onChange={(e) => handleEdit(e)}
                />
              </Wrapper>
              <Wrapper>
                <label for="tbEmail" class="lbl-tb">
                  <i class="fa fa-envelope-o fa-fw"></i> Email
                </label>
                <br />
                <input
                  id="tbEmail"
                  name="email"
                  type="text"
                  class="frm-ctrl tb"
                  spellcheck="false"
                  autocomplete="off"
                  value={client.email}
                  onChange={(e) => handleEdit(e)}
                />
              </Wrapper>
              <Wrapper>
                <label for="tbDiscord" class="lbl-tb">
                  <i class="fa fa-unlock fa-fw"></i> Discord
                </label>
                <br />
                <input
                  id="tbDiscord"
                  name="discord"
                  type="text"
                  class="frm-ctrl tb"
                  value={client.discord}
                  onChange={(e) => handleEdit(e)}
                />
              </Wrapper>
              <Wrapper>
                <label for="tbCity" class="lbl-tb">
                  <i class="fa fa-unlock fa-fw"></i> City
                </label>
                <br />
                <input
                  id="tbCity"
                  name="city"
                  type="text"
                  class="frm-ctrl tb"
                  value={client.city}
                  onChange={(e) => handleEdit(e)}
                />
              </Wrapper>
              <Wrapper>
                <label for="tbPhone" class="lbl-tb">
                  <i class="fa fa-unlock fa-fw"></i> Phone number
                </label>
                <br />
                <input
                  id="tbPhone"
                  name="phone_number"
                  class="frm-ctrl tb"
                  value={client.phone_number}
                  onChange={(e) => handleEdit(e)}
                />
              </Wrapper>
              <Wrapper>
                <label for="tbAnydesk" class="lbl-tb">
                  <i class="fa fa-unlock fa-fw"></i> Anydesk
                </label>
                <br />
                <input
                  id="tbAnydesk"
                  type="text"
                  class="frm-ctrl tb"
                  name="anydesk"
                  value={client.anydesk}
                  onChange={(e) => handleEdit(e)}
                />
              </Wrapper>
              <Wrapper>
                <label for="tbPrice" class="lbl-tb">
                  <i class="fa fa-unlock fa-fw"></i> Price
                </label>
                <br />
                <input
                  id="tbPrice"
                  type="number"
                  step="any"
                  name="default_price"
                  class="frm-ctrl tb"
                  value={client.default_price}
                  onChange={(e) => handleEdit(e)}
                />
              </Wrapper>
              <Wrapper>
                <button id="updateClientButton" type="submit" className="frm-ctrl button-style">
                  Update
                </button>
              </Wrapper>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateClients;
