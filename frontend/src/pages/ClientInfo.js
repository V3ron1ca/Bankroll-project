import { Fragment, useEffect, useState } from "react";
import { useParams } from 'react-router';
import Table from 'react-bootstrap/Table';
import "../components/clientData.css";
import {getAuthorized} from "../authorization/AuthRequests";



function Info() {
    const { id } = useParams();
    const [client, setClient] = useState([])

    const getInfo = async () => {
        
        const onSucces = async (data) => {
          setClient(data)
        }
        await getAuthorized("/api/client/" + id, onSucces)
  }

    useEffect(() => {
        getInfo()
    }, [])

    return (
        <Fragment>
          <div class="p-3">
        <Table striped bordered hover variant="dark">
          <tbody>
            <tr>
              <td className='appellation' >Full Name</td>
              <td>{client.full_name}</td>
            </tr>

            <tr>
              <td className='appellation'>Email</td>
              <td>{client.email}</td>
            </tr>

            <tr>
              <td className='appellation'>Discord</td>
              <td>{client.discord}</td>
            </tr>

            <tr>
              <td className='appellation'>Phone Number</td>
              <td>{client.phone_number}</td>
            </tr>

            <tr>
              <td className='appellation'>Anydesk</td>
              <td>{client.anydesk}</td>
            </tr>

            <tr>
              <td className='appellation'>Date Added</td>
              <td>{client.date_added}</td>
            </tr>

            <tr>
              <td className='appellation'>Default price</td>
              <td>{client.default_price}</td>
            </tr>

            <tr >
            </tr>
            
          </tbody>
          </Table>
          </div>
          </Fragment>
    )
}
export default Info 