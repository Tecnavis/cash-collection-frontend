import { BrowserRouter as Router,Routes,Route} from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import CrmDashboard from "./pages/CrmDashboard"
import HrmDashboard from "./pages/HrmDashboard"
import CustomerDashboard from "./pages/CustomerDashboard"
import SweetAlert from "./pages/SweetAlert"
import Charts from "./pages/Charts"
import EditProfile from "./pages/EditProfile"
import Return from "./pages/ReturnProduct"
import Company from "./pages/Supplier"
import Task from "./pages/Task"
import Leads from "./pages/Leads"
import Table from "./pages/Table"
import Customer from "./pages/purchaseditems"
import AddEmployee from "./pages/AddEmployee"
import AddPartner from "./pages/AddPartner"
import AddAdmin from "./pages/AddAdmin"
import AllEmployee from "./pages/AllEmployee"
import AllAdmin from "./pages/AllAdmin"
import Attendance from "./pages/Attendance"
import AllCustomer from "./pages/AllCustomer"
import AddNewProduct from "./pages/AddNewProduct"
import AddSales from "./pages/AddSales"
import AddPurchase from "./pages/AddPurchase"
import AllProduct from "./pages/AllProduct"
import AllSales from "./pages/AllSales"
import AllPurchase from "./pages/AllPurchase"
import Category from "./pages/Category"
import SchemeByCustomer from "./pages/SchemeByCustomer"
import Invoices from "./pages/Invoices"
import Login from "./pages/Login"
import Login2 from "./pages/Login2"
import Registration from "./pages/Registration"
import Profile from "./pages/Profile"
import Layout from "./components/layout/Layout"
import PublicLayout from "./components/layout/PublicLayout"
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import ProtectedRoute from '../src/protectedroute/ProtectedRoute';
import AddCollectionPlan from "./pages/AddCollectionPlan"
import AllCollections from "./pages/AllCollections"
import AllCollectionsProgress from "./pages/AllCollectionsProgress"
import AllCollectionCustomer from "./pages/AllCollectionCustomer"
import AllTransactions from "./pages/AllTransactions"
import AllCustomerTransaction from "./pages/AllCustomerTransactions"
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('access_token'));

  useEffect(() => {
    
    const checkAuth = () => {
      const hasToken = !!Cookies.get('access_token');
      setIsAuthenticated(hasToken);
    };
    
    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth-change', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  return (
    <Router>
      <Routes>
          <Route element={<PublicLayout />}>
              <Route path="/registration" element={<Registration />} />
              <Route path="/" element={<Login2 setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/login" element={<Login/>}/>
          </Route> 
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/customerdashboard" element={<CustomerDashboard/>}/>
          <Route element={<Layout />}>
            <Route path="/dash" element={<Dashboard/>}/>
            <Route path="/dashboard" element={<CrmDashboard />} />
            <Route path="/hrmDashboard" element={<HrmDashboard/>}/>
          
            <Route path="/table" element={<Table/>}/>
            <Route path="/sweetAlert" element={<SweetAlert/>}/>
            <Route path="/charts" element={<Charts/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/editProfile" element={<EditProfile/>}/>
            <Route path="/customerscheme" element={<SchemeByCustomer />} />
            
            {/*collection plan add,view*/}
            <Route path="/collectionplan" element={<AddCollectionPlan />} />
            <Route path="/collections" element={<AllCollections />} />
            <Route path="/collectionprogress" element={<AllCollectionsProgress />} />

            <Route path="/transactions" element={<AllTransactions/>} />
            <Route path="/customertransaction" element={<AllCustomerTransaction />} />
            <Route path="/allProduct" element={<AllProduct />} />   
            <Route path="/category" element={<Category />} />
            <Route path="/addNewProduct" element={<AddNewProduct />} />
            <Route path="/purchaseditem" element={<Customer />} />
            <Route path="/allSales" element={<AllSales />} />
            <Route path="/addSales" element={<AddSales />} />
            <Route path="/allpurchase" element={<AllPurchase />} />
            <Route path="/addPurchase" element={<AddPurchase />} />
            {/*agent*/}
            <Route path="/allCustomer" element={<AllCustomer />} />
            <Route path="/addPartner" element={<AddPartner />} />
             {/*customer  */}
            <Route path="/supplier" element={<Company />} />
            <Route path="/allCollectionCustomer" element={< AllCollectionCustomer />} />

            {/*main admin  */}
            <Route path="/addEmployee" element={<AddEmployee />} /> 
            <Route path="/allEmployee" element={<AllEmployee />} />

            {/* super admins */}
            <Route path="/addAdmin" element={<AddAdmin />} />
            <Route path="/allAdmin" element={<AllAdmin />} />

            <Route path="/invoice/:id" element={<Invoices />} />
            <Route path="/profile" element={<Profile/>}/>
          </Route>
        </Route>        
      </Routes>
    </Router>
  );
}
export default App;