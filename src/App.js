import React, { useState } from 'react';

const UI = {
  layout: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    minHeight: '100vh',
    margin: 0,
    padding: '0 0 40px 0',
    boxSizing: 'border-box',
    display: 'block'
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: '16px 24px',
    borderBottom: '1px solid #334155'
  },
  logo: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: '-0.5px'
  },
  statusBadge: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  navWrapper: {
    backgroundColor: '#1e293b',
    padding: '4px 16px',
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    borderBottom: '1px solid #334155'
  },
  tabButton: (isActive) => ({
    padding: '12px 16px',
    backgroundColor: isActive ? '#38bdf8' : 'transparent',
    color: isActive ? '#0f172a' : '#94a3b8',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    margin: '4px 0',
    transition: 'all 0.2s ease'
  }),
  contentBody: {
    maxWidth: '1000px',
    margin: '32px auto',
    padding: '0 24px'
  },
  mainCard: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '32px',
    border: '1px solid #334155',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    textAlign: 'left'
  },
  heading: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: '#ffffff'
  },
  subtext: {
    color: '#94a3b8',
    fontSize: '15px',
    margin: '0 0 24px 0'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  metricBlock: {
    backgroundColor: '#0f172a',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #334155',
    textAlign: 'left'
  },
  metricLabel: {
    fontSize: '12px',
    color: '#64748b',
    textTransform: 'uppercase',
    fontWeight: '700'
  },
  metricVal: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#f1f5f9',
    marginTop: '4px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '16px',
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  th: {
    backgroundColor: '#334155',
    color: '#cbd5e1',
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: '13px',
    fontWeight: '600'
  },
  td: {
    padding: '14px 16px',
    borderBottom: '1px solid #334155',
    color: '#e2e8f0',
    textAlign: 'left'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    backgroundColor: '#1e293b',
    border: '1px solid #475569',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  select: (status) => ({
    width: '100%',
    padding: '8px 12px',
    backgroundColor: status === 'Low Warning Alert' ? '#7f1d1d' : '#064e3b',
    border: '1px solid #475569',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600'
  }),
  actionBtn: {
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '16px'
  },
  deleteBtn: {
    backgroundColor: 'transparent',
    color: '#f87171',
    border: '1px solid #f87171',
    borderRadius: '4px',
    padding: '4px 8px',
    cursor: 'pointer',
    fontWeight: '600'
  }
};

export default function App() {
  const [currentTab, setCurrentTab] = useState('Dashboard');
  const [items, setItems] = useState([
    { id: 1, name: 'White Rice', category: 'Grains', status: 'High Stock Capacity', limit: 2 },
    { id: 2, name: 'Olive Oil', category: 'Condiments', status: 'Low Warning Alert', limit: 1 }
  ]);

  return (
    <div style={UI.layout}>
      {/* Top Header Navigation */}
      <div style={UI.topBar}>
        <div style={UI.logo}>GroceryOS v2.0</div>
        <div style={UI.statusBadge}>👤 Account ID: banana</div>
      </div>

      {/* Tabs */}
      <div style={UI.navWrapper}>
        {['Dashboard', 'Meal Plan', 'Grocery List', 'Pantry Inventory', 'Budget & Expenses'].map(tab => (
          <button 
            key={tab} 
            style={UI.tabButton(currentTab === tab)} 
            onClick={() => setCurrentTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic Render Window */}
      <div style={UI.contentBody}>
        {currentTab === 'Dashboard' && (
          <div style={UI.mainCard}>
            <h1 style={UI.heading}>Operations Dashboard</h1>
            <p style={UI.subtext}>Integrated multi-box navigation system dashboard view.</p>
            
            <div style={UI.grid}>
              <div style={UI.metricBlock}>
                <div style={UI.metricLabel}>Wallet Thresholds</div>
                <div style={UI.metricVal}> must be filled out</div>
              </div>
              <div style={UI.metricBlock}>
                <div style={UI.metricLabel}>Total Stored Items</div>
                <div style={UI.metricVal}>{items.length} Elements</div>
              </div>
              <div style={UI.metricBlock}>
                <div style={UI.metricLabel}>Pantry Low Status</div>
                <div style={UI.metricVal}>1 Critical Alert</div>
              </div>
            </div>
          </div>
        )}

        {(currentTab === 'Grocery List' || currentTab === 'Pantry Inventory') && (
          <div style={UI.mainCard}>
            <h1 style={UI.heading}>Stockpile Ledger &amp; Vault</h1>
            <p style={UI.subtext}>Main stock ledger index synced to end-of-day automation checks.</p>
            
            <button style={UI.actionBtn} onClick={() => setItems([...items, { id: Date.now(), name: '', category: '', status: 'High Stock Capacity', limit: 1 }])}>
              + Provision Stock Item
            </button>

            <table style={UI.table}>
              <thead>
                <tr>
                  <th style={UI.th}>Stored Inventory Title Name</th>
                  <th style={UI.th}>Category Segment</th>
                  <th style={UI.th}>Stock Status Level</th>
                  <th style={UI.th}>Min Limit</th>
                  <th style={UI.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={UI.td}>
                      <input 
                        style={UI.input} 
                        type="text" 
                        value={item.name} 
                        onChange={e => setItems(items.map(i => i.id === item.id ? {...i, name: e.target.value} : i))}
                      />
                    </td>
                    <td style={UI.td}>
                      <input 
                        style={UI.input} 
                        type="text" 
                        value={item.category} 
                        onChange={e => setItems(items.map(i => i.id === item.id ? {...i, category: e.target.value} : i))}
                      />
                    </td>
                    <td style={UI.td}>
                      <select 
                        style={UI.select(item.status)} 
                        value={item.status}
                        onChange={e => setItems(items.map(i => i.id === item.id ? {...i, status: e.target.value} : i))}
                      >
                        <option value="High Stock Capacity">🟩 High Stock Capacity</option>
                        <option value="Low Warning Alert">🟥 Low Warning Alert</option>
                      </select>
                    </td>
                    <td style={UI.td}>
                      <input 
                        style={{...UI.input, width: '70px'}} 
                        type="number" 
                        value={item.limit}
                        onChange={e => setItems(items.map(i => i.id === item.id ? {...i, limit: parseInt(e.target.value) || 0} : i))}
                      />
                    </td>
                    <td style={UI.td}>
                      <button 
                        style={UI.deleteBtn}
                        onClick={() => setItems(items.filter(i => i.id !== item.id))}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {['Meal Plan', 'Budget & Expenses'].includes(currentTab) && (
          <div style={UI.mainCard}>
            <h1 style={UI.heading}>{currentTab}</h1>
            <p style={UI.subtext}>Section matrix dashboard module interface.</p>
          </div>
        )}
      </div>
    </div>
  );
}