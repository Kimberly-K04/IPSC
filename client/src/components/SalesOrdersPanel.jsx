import React, { useState } from "react";
import "./css/salesOrdersPanel.css";

export default function SalesOrdersPanel({ products, orders, sales, onOrderAdded, user }) {
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("")
  const [quantity, setQuantity] = useState('')
  const [loading, setLoading] = useState(false)

  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total_price), 0);

  const handleAddOrder = async (e) => {
    e.preventDefault()
    if (!selectedProductId || parseInt(quantity)<5) {
      alert("Please select a product and enter a valid quantity.");
      return
    }

    const product = products.find(p => p.id === Number(selectedProductId))
    if (!product) return

    const totalAmount = product.price * quantity

    setLoading(true)
    try {
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'pending',
          total_amount: totalAmount,
          user_id:user.id
        })
      })

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.error || 'Failed to create order')
      }

      const orderData = await orderRes.json()
      const newOrder = orderData.data || orderData

      const saleRes = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: Number(selectedProductId),
          order_id: newOrder.id,
          quantity: quantity,
          total_price: totalAmount,
          user_id: user.id
        })
      })

      if (!saleRes.ok) {
        const err = await saleRes.json()
        throw new Error(err.error || 'Failed to create sale')
      }
      if (onOrderAdded) onOrderAdded()
      setShowAddOrder(false)
      setSelectedProductId("")
      setQuantity(1)
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

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
        <form onSubmit={handleAddOrder} className="new-order-form">
          <div className="sale-row">
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              required
            >
              <option value="">Select Product</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              required
            />
          </div>
          <button type="submit" className="btn-add" disabled={loading}>
            {loading ? "Saving..." : "Save Order"}
          </button>
        </form>
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