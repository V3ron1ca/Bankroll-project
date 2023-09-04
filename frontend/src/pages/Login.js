import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import toast from "react-hot-toast"
import {setToken }from  "../authorization/Token"
import {useAuth} from '../components/AuthContext'
import { BaseUrl } from "../authorization/AuthRequests";
import '../components/userLogin.css'

 function Login() {

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const { setIsLoggedIn } = useAuth();
  const logColor = {
    backgroundColor: "#2ceef0",
    border: "1px solid white",
  }

  const validateForm =() => {

    return name.length > 0 && password.length > 0;

  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    var data = JSON.stringify({
      username: name,
      password: password
    });

    var response = await fetch(BaseUrl + '/api/login',  { method: "POST", body: data, mode: 'cors', headers: {'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'}});
    if(response.ok)
    {
        let data = await response.json()
        console.log(data.token)
        setToken(data.token)
        toast.success("Logged in!")
        setIsLoggedIn(true);
        navigate('/view-clients')
    }
    else
    {
      toast.error("Bad credentials!")
    }
  }


  return (
  
    <div className="login-container" >
    <div id="first">

      <Form className="loginFormstyle" onSubmit={handleSubmit}>

        <Form.Group  size="lg" controlId="name">

          <Form.Label>Name</Form.Label>

          <Form.Control
            

            autoFocus

            type="name"

            value={name}

            onChange={(e) => setName(e.target.value)}

          />

        </Form.Group>

        <Form.Group  size="lg"  controlId="password">

          <Form.Label>Password</Form.Label>

          <Form.Control 

            type="password"

            value={password}

            onChange={(e) => setPassword(e.target.value)}

          />

        </Form.Group>

        <Button style={logColor} className="frm-ctrl Button2"  type="submit" disabled={!validateForm()}>

          Login

        </Button>

      </Form>

    </div>
    </div>
  );

}
export default Login;