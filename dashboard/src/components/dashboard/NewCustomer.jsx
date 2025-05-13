import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../api';


const NewCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cashcollection/cashcollections/`, {
        headers: {
          "Authorization": `Bearer ${Cookies.get("access_token")}`,
        },
      });

      const data = response.data;

      // Create a mapping of customer IDs to their schemes
      const customerSchemeMap = {};
      data.forEach(entry => {
        const customerId = entry.customer;
        if (!customerSchemeMap[customerId]) {
          customerSchemeMap[customerId] = {
            details: entry.customer_details,
            schemes: new Set(),
            updatedAt: entry.updated_at
          };
        }
        customerSchemeMap[customerId].schemes.add(entry.scheme);
        customerSchemeMap[customerId].updatedAt = entry.updated_at;
      });

      // Filter customers with multiple schemes & sort by latest update
      const filteredCustomers = Object.values(customerSchemeMap)
        .filter(customer => customer.schemes.size > 1)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5);

      setCustomers(filteredCustomers);
    } catch (error) {
      setError("Error fetching transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="col-xxl-4 col-md-6">
      <div className="panel">
        <div className="panel-header">
          <h5>New Customers (Multiple Schemes)</h5>
        </div>
        <div className="panel-body">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <table className="table table-borderless new-customer-table">
              <tbody>
                {customers.length > 0 ? (
                  customers.map((customer, index) => (
                    <tr key={index}>
                      <td>
                        <div className="new-customer">
                          <div className="part-txt">
                            <p className="customer-name">
                              {customer.details.first_name} {customer.details.last_name}
                            </p>
                            <span>{customer.details.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>{customer.schemes.size} Schemes</td>
                      <td>📅 {new Date(customer.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No customers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewCustomer;
