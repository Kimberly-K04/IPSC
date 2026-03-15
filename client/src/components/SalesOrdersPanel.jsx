import React, { useState } from "react";
// import { useOutletContext } from "react-router-dom";
import "./css/salesOrdersPanel.css";

export default function SalesOrdersPanel({ products, orders, sales }) {
  // const { products, orders, sales } = useOutletContext();
  const [showAddOrder, setShowAddOrder] = useState(false);

  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total_price), 0);

  return (
    <div className="sales-orders-panel">
      <h2>Sales & Orders</h2>

      <div className="kpi-summary-grid">
        <div className="order-card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>
        <div className="order-card">
          <h3>Total Sales</h3>
          <p>{sales.length}</p>
        </div>
        <div className="order-card">
          <h3>Total Revenue</h3>
          <p>${totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <button className="btn-add-order" onClick={() => setShowAddOrder(!showAddOrder)}>
        {showAddOrder ? "Cancel" : "Add New Order"}
      </button>

      {showAddOrder && (
        <div className="new-order-form">
          <div className="sale-row">
            <select>
              <option value="">Select Product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input type="number" placeholder="Quantity" min="1" />
          </div>
          <button className="btn-add">Save Order</button>
        </div>
      )}

      <div className="order-card">
        <h3>Recent Sales</h3>
        <table className="sales-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id}>
                <td>{sale.order_id}</td>
                <td>{products.find(p => p.id === sale.product_id)?.name || "Unknown"}</td>
                <td>{sale.quantity}</td>
                <td>${Number(sale.total_price).toLocaleString()}</td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr><td colSpan="4" style={{textAlign: "center"}}>No sales yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}