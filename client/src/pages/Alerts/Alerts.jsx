import React, { useState, useEffect } from 'react';
import { AiOutlineExclamationCircle, AiOutlineWarning, AiOutlineInfoCircle } from 'react-icons/ai';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch('/alerts');
        if (!res.ok) throw new Error('Failed to fetch alerts');
        const data = await res.json();

        const mappedAlerts = data.data.map(alert => ({
          ...alert,
          type: alert.message.toLowerCase().includes('critical') ? 'critical' :
                alert.message.toLowerCase().includes('warn') ? 'warning' :
                'info'
        }));

        setAlerts(mappedAlerts);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchAlerts();
  }, []);

  const acknowledgeAlert = async (id) => {
    try {
      const res = await fetch(`/alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' })
      });
      if (!res.ok) throw new Error('Failed to acknowledge alert');
      const updated = await res.json();
      setAlerts(prev => prev.map(a => (a.id === updated.data.id ? updated.data : a)));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAlerts = alerts
    .filter(alert => (filter === 'all' || alert.type === filter))
    .filter(alert =>
      alert.message.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (a.status === 'read') - (b.status === 'read'));

  if (loading) return <p>Loading alerts...</p>;

  const getIcon = (type) => {
    if (type === 'critical') return <AiOutlineExclamationCircle color="#cc0000" size={22} />;
    if (type === 'warning') return <AiOutlineWarning color="#ff9900" size={22} />;
    if (type === 'info') return <AiOutlineInfoCircle color="#0077cc" size={22} />;
    return null;
  };

  return (
    <div className="alerts-container">
      <h2 className="alerts-header">System Alerts & Notifications</h2>

      <input
        type="text"
        placeholder="Search alerts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="alert-filters">
        {['all', 'critical', 'warning', 'info'].map(f => (
          <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="alerts-grid">
        {filteredAlerts.length === 0 && <p>No alerts found.</p>}
        {filteredAlerts.map(alert => (
          <div key={alert.id} className={`alert-card ${alert.type} ${alert.status === 'read' ? 'acknowledged fade-out' : ''}`}>
            <div className="alert-top">
              <h3>
                <span className="alert-icon">{getIcon(alert.type)}</span>
                {alert.message}
              </h3>
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