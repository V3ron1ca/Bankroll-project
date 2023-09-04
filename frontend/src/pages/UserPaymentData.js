import { Fragment, useEffect, useState } from "react";
import { useParams } from 'react-router';
import Table from 'react-bootstrap/Table';
import "../components/clientData.css";
import { Link } from "react-router-dom";
import {getAuthorized} from "../authorization/AuthRequests";

function UserPaymentData({details}) {
    const { id } = useParams();
    const [service, setService] = useState([])
    const styles = {
      color: "white",
      fontSize: "45px",
      fontFamily: "Roboto, sans-serif",
      fontWeight: "900",
      marginTop: "30px"
    };
    const getInfo = async () => {
        
        const onSucces = async (data) => {
          setService(data)
        }
        await getAuthorized("/api/service/" + id, onSucces)
  }


    useEffect(() => {
        getInfo()
    }, [])

    return (
        <Fragment>
        <h1 className='name1' style={styles}>SERVICE DATA</h1>
        <div class="p-3">
        <Table striped bordered hover variant="dark" className="little-left">
          <tbody >
            <tr>
              <td className='appellation'>Full Name</td>
              <td><Link class='click-go' to={"/client/" + service.client_id} color="green">{service["client.full_name"]}</Link></td>
            </tr>

            <tr>
              <td className='appellation'>Date of Work</td>
              <td>{service.date_of_work}</td>
            </tr>

            <tr>
              <td className='appellation'>Amount</td>
              <td>{service.price}</td>
            </tr>
            <tr>
              <td className='appellation'>Note</td>
              <td>{service.note}</td>
            </tr>
            <tr>
              <td className='appellation'>Service Type</td>
              <td>{service.service_type}</td>
            </tr>
            <tr>
              <td className='appellation'>Time</td>
              <td>{service.time}</td>
            </tr>
          </tbody>
          </Table>
          </div>
          </Fragment>
    )
}
export default UserPaymentData 