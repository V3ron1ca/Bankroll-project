import { Fragment, useState, useEffect } from 'react';
import React from 'react';
import Table from 'react-bootstrap/Table';
import {getAuthorized} from '../authorization/AuthRequests';
import '../components/reportsCashTable.css'

function ReportsCash(){
    const [reportsCash, setReportsCash] = useState([])

    const getTotals = async () => {
      
      const onSucces = async (data) => {
        setReportsCash(data)
      }
      await getAuthorized("/api/reports/total", onSucces)
  }
  useEffect(() => {
    getTotals()
  }, [])

    return (
        <Fragment>
           <div class="p-3">
           <Table striped bordered hover variant="dark" className='tablecash'>
          <thead>
            <tr>
              <th className='appellation'>Month</th>
              <th className='appellation'>Year</th>
              <th className='appellation'>Total Price</th>
              <th className='appellation'>Taxes</th>
              <th className='appellation'>Diff</th>
            </tr>
          </thead>
          <tbody>
          {reportsCash.map((reportcash, index) => (
            <tr key={index}>
              <td>{reportcash.month}</td>
              <td>{reportcash.year}</td>
              <td>{reportcash.total_price}</td>
              <td>{reportcash.total_tax}</td>
              <td>{reportcash.diff}</td>
            </tr>
            ))}
          </tbody>
          </Table>
          </div>
        </Fragment>
  )};

export default ReportsCash;