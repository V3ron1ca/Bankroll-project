import { Fragment } from "react";
import Navbar from "./components/navbar";
import Clients from "./pages/Clients";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AddService from "./pages/AddService";
import ClientDetails from "./pages/ClientDetails";
import ViewServices from "./pages/ViewServices";
import ViewClients from "./pages/ViewClients";
import Login from "./pages/Login";
import AddPayment from "./pages/AddPayment";
import ViewPayments from "./pages/ViewPayments";
import { Toaster } from "react-hot-toast";
import ServiceInfo from "./pages/ServiceInfo";
import PaymentInfo from "./pages/PaymentInfo"
import ReportsInfo from "./pages/ReportsClients";
import ReportsCash from "./pages/ReportsCash";
import TaxInfo from "./pages/FormTableTax";
import UpdateClients from "./pages/UpdateClient";
import { AuthView } from "./components/AuthView";
import { AuthProvider } from "./components/AuthContext";


function App() {
 return (
  <Fragment>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"></link>
      <AuthProvider>
      <BrowserRouter>
      <Navbar/>
      <Routes>
      <Route path="/" element={<Login></Login>}/>
        <Route path="/add-client" element={<AuthView><Clients/></AuthView>}/>
        <Route path="/client/:id" element={<AuthView><ClientDetails/></AuthView>}/>
        <Route path="/add-service" element={<AuthView><AddService/></AuthView>}/>
        <Route path="/add-service/:id" element={<AuthView><AddService/></AuthView>}/>
        <Route path="/view-service" element={<AuthView><ViewServices/></AuthView>}/>
        <Route path="/view-clients" element={<AuthView><ViewClients/></AuthView>}/>
        <Route path="/service/:id" element={<AuthView><ServiceInfo/></AuthView>}/>
        <Route path="/payment/:id" element={<AuthView><PaymentInfo/></AuthView>}/>
        <Route path="/add-payment" element={<AuthView><AddPayment/></AuthView>}/>
        <Route path="/view-payments" element={<AuthView><ViewPayments/></AuthView>}/>
        <Route path="/view-reports-clients" element={<AuthView><ReportsInfo/></AuthView>}/>
        <Route path="/view-reports-cash" element={<AuthView><ReportsCash/></AuthView>}/>
        <Route path="/view-add-taxes" element={<AuthView><TaxInfo/></AuthView>}/>
        <Route path="/client-update/:id" element={<AuthView><UpdateClients/></AuthView>}/>
      </Routes>
      </BrowserRouter>
      <Toaster/>
      </AuthProvider>
  </Fragment>
 )
}

export default App;