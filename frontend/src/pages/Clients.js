import { useState } from "react";
import React from "react";
import "../components/clients.css";
import toast from "react-hot-toast";
import { postAuthorized } from "../authorization/AuthRequests";
import "../components/Form.css";
import { Wrapper } from "../components/Wrapper";

function Clients() {
  const [fullName, setFullName] = useState("");
  const [Discord, setDiscord] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [Anydesk, setAnydesk] = useState("");
  const [City, setCity] = useState("");
  const [DefaultPrice, setDefaultPrice] = useState("");
  const [Email, setEmail] = useState("");
  const styles = {
    color: "white",
    fontSize: "45px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: "900",
    marginTop: "30px",
    marginBottom: "5px",
  };
  const addClient = async (e) => {
    e.preventDefault();
    var data = {
      full_name: fullName,
    };
    if (DefaultPrice !== "" && DefaultPrice !== null) {
      data.default_price = parseFloat(DefaultPrice);
    }

    if (Email !== "" && Email !== null) {
      data.email = Email;
    }

    if (PhoneNumber !== "" && PhoneNumber !== null) {
      data.phone_number = PhoneNumber;
    }
    if (Discord !== "" && Discord !== null) {
      data.discord = Discord;
    }
    if (Anydesk !== "" && Anydesk !== null) {
      data.anydesk = Anydesk;
    }
    if (City !== "" && City !== null) {
      data.city = City;
    }

    const onSuccess = (response) => {
      e.target.reset();
      toast.success("Successfully added!");
    };

    const onFail = (response) => {
      console.log(response);
      toast.error("Error: " + response.message);
    };

    await postAuthorized("/api/clients", data, onSuccess, onFail);
  };

  return (
    <div class="row">
      <div id="add-client-form" class="col">
        <div class="d-flex justify-content-center flex-column align-items-sm-center">
          <h1 style={styles}>ADD CLIENT</h1>
          <form onSubmit={addClient} id="formularz">
            <legend>
              <i class="fa fa-empire fa-4x"></i>
            </legend>
            <Wrapper>
              <label for="tbFull_name" class="lbl-tb">
                <i class="fa fa-user fa-fw"></i> full name
              </label>
              <br />
              <input
                id="tbFull_name"
                name="full_name"
                type="text"
                class="frm-ctrl tb"
                spellcheck="false"
                autocomplete="off"
                onChange={(e) => setFullName(e.target.value)}
              />
            </Wrapper>

            <div class="row">
              <div class="col">
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
                    onChange={(e) => setEmail(e.target.value)}
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
                    onChange={(e) => setDiscord(e.target.value)}
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
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Wrapper>
              </div>
              <div class="col">
                <Wrapper>
                  <label for="tbPhone" class="lbl-tb">
                    <i class="fa fa-unlock fa-fw"></i> Phone number
                  </label>
                  <br />
                  <input
                    id="tbPhone"
                    type="tel"
                    class="frm-ctrl tb"
                    onChange={(e) => setPhoneNumber(e.target.value)}
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
                    onChange={(e) => setAnydesk(e.target.value)}
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
                    class="frm-ctrl tb"
                    onChange={(e) => setDefaultPrice(e.target.value)}
                  />
                </Wrapper>
              </div>
            </div>

            <Wrapper>
              <button id="addClient" class="frm-ctrl button-style ">
                Add client
              </button>
            </Wrapper>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Clients;
