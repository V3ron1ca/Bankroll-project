import { Fragment, useEffect, useState } from 'react';
import React from 'react';
import Table from 'react-bootstrap/Table';
import {getAuthorized} from '../authorization/AuthRequests';
import '../components/searchBarPayments.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

function ViewPayments(){
    const [payments, setPayments] = useState([])
    const [filteredPayments, setFilteredPayments] = useState([])

    useEffect(() => {
        getPayments()
      }, [])

      const getPayments = async () => {
        
        const onSucces = async (data) => {
          setPayments(data)
          setFilteredPayments(data)
        }
        await getAuthorized("/api/payments", onSucces)
  }
  const onChange = (text) => {
    if(text === null || text === "")
    {
      setFilteredPayments(payments)
    }
    else{
      text = text.toLowerCase();
      setFilteredPayments(payments.filter(c => c["client.full_name"] != null && c["client.full_name"].toLowerCase().includes(text)))
    }
  }
    return (
        <Fragment>
          <form className='search-bar-payments'>
          <input onChange={e => onChange(e.target.value)}></input>
          <button type="submit"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
          </form>
          <div class="p-3">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th className='appellation'>Client </th>
              <th className='appellation'>Amount</th>
              <th className='appellation'>Source</th>
              <th className='appellation'>Date Income</th>
              <th className='appellation'>Date Book</th>
              <th className='appellation'>Tax</th>
              <th className='appellation'>Details</th>
            </tr>
          </thead>
          <tbody>
          {filteredPayments.map((payment, index) => (
            <tr key={index}>
              <td>{payment["client.full_name"]}</td>
              <td>{payment.amount}</td>
              <td>{payment.source}</td>
              <td>{payment.date_income}</td>
              <td>{payment.date_book}</td>
              <td>{payment.tax}</td>
              <td><Link className='click-go' to={"/payment/" + payment.id} color="green">Details</Link></td>
            </tr>
            ))}
          </tbody>
          </Table>
          </div>
        </Fragment>
  );
}
export default ViewPayments;