import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import './Alerts.css';
import { AiOutlineExclamationCircle, AiOutlineWarning, AiOutlineInfoCircle } from 'react-icons/ai';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const {products} = useOutletContext()

  useEffect(() => {
    async function fetchAlerts() {
      try {

        const allAlerts = products.flatMap(product =>
          (product.alerts || []).map(alert => ({
            ...alert,
            product_name: product.name,
            status: alert.status || 'unread'
          }))
        );

        setAlerts(allAlerts);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchAlerts();
  }, []);

  const acknowledgeAlert = (id) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'read' } : a))
    );
  };

  const sortedAlerts = [...alerts].sort((a, b) => (a.status === 'read') - (b.status === 'read'));

  const filteredAlerts = sortedAlerts.filter(alert => {
    const matchFilter = filter === 'all' || alert.type === filter;
    const matchSearch =
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.product_name && alert.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchFilter && matchSearch;
  });

  const getIcon = (type) => {
    if (type === 'critical') return <AiOutlineExclamationCircle color="#cc0000" size={22} />;
    if (type === 'warning') return <AiOutlineWarning color="#ff9900" size={22} />;
    if (type === 'info') return <AiOutlineInfoCircle color="#0077cc" size={22} />;
    return null;
  };

  if (loading) return <p>Loading alerts...</p>;

  return (
    <div className="alerts-container">
      <h2 className="alerts-header">System Alerts & Notifications</h2>

      <input
        type="text"
        placeholder="Search alerts..."
        className="alerts-search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="alert-filters">
        {['all', 'critical', 'warning', 'info'].map(f => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="alerts-grid">
        {filteredAlerts.length === 0 && <p>No alerts found.</p>}
        {filteredAlerts.map(alert => (
          <div
            key={alert.id} 
            className={`alert-card ${alert.type} ${alert.status === 'read' ? 'acknowledged fade-out' : ''}`}
          >
            <div className="alert-top">
              <h3>
                <span className="alert-icon">{getIcon(alert.type)}</span>
                {alert.message}
              </h3>
              {alert.product_name && <span className="product-name">({alert.product_name})</span>}
            </div>
            <p className="time">{alert.created_at ? new Date(alert.created_at).toLocaleString() : ''}</p>
            {alert.status !== 'read' && (
              <div className="alert-actions">
                <button onClick={() => acknowledgeAlert(alert.id)}>Acknowledge</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alerts;
