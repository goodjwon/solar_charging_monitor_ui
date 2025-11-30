import { Line, Bar } from 'react-chartjs-2';
import { MdArrowBack, MdEco } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';

const EcoDetail = () => {
  const navigate = useNavigate();

  const co2Data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'CO2 Saved (kg)',
      data: [12, 18, 25, 32, 38, 42],
      backgroundColor: '#4caf50',
      borderRadius: 4
    }]
  };

  const savingsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Money Saved (₩)',
      data: [1200, 1800, 2500, 3200, 3800, 4200],
      borderColor: '#ff9800',
      backgroundColor: 'rgba(255, 152, 0, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const selfSufficiencyData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Self-Sufficiency (%)',
      data: [75, 82, 88, 85],
      borderColor: '#00bcd4',
      backgroundColor: 'rgba(0, 188, 212, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, labels: { color: '#b0bec5' } } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#b0bec5' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#b0bec5' } }
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <header>
        <div className="header-content">
          <div className="header-title">
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
              <MdArrowBack /> Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MdEco style={{ color: 'var(--success-color)' }} />
              Environmental Impact & Savings
            </h2>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="glass-card widget-metric">
          <div className="card-header"><span className="card-title">Trees Equivalent</span></div>
          <div style={{ fontSize: '48px', margin: '20px 0' }}>🌲</div>
          <div className="metric-value" style={{ color: 'var(--success-color)' }}>
            0.5
          </div>
          <div className="metric-sub">Trees planted equivalent</div>
        </div>

        <div className="glass-card widget-metric">
          <div className="card-header"><span className="card-title">CO2 Reduction</span></div>
          <div style={{ fontSize: '48px', margin: '20px 0' }}>☁️</div>
          <div className="metric-value" style={{ color: 'var(--success-color)' }}>
            4.2<span className="metric-unit"> kg</span>
          </div>
          <div className="metric-sub">Total CO2 saved</div>
        </div>

        <div className="glass-card widget-metric">
          <div className="card-header"><span className="card-title">Money Saved</span></div>
          <div style={{ fontSize: '48px', margin: '20px 0' }}>💰</div>
          <div className="metric-value" style={{ color: 'var(--warning-color)' }}>
            ₩ 350
          </div>
          <div className="metric-sub">Electricity cost saved</div>
        </div>

        <div className="glass-card widget-metric">
          <div className="card-header"><span className="card-title">Self-Sufficiency</span></div>
          <div style={{ fontSize: '48px', margin: '20px 0' }}>🔋</div>
          <div className="metric-value" style={{ color: 'var(--primary-color)' }}>
            85<span className="metric-unit"> %</span>
          </div>
          <div className="metric-sub">Energy independence</div>
        </div>

        {/* CO2 Savings Trend */}
        <div className="glass-card widget-chart">
          <div className="card-header">
            <span className="card-title">CO2 Savings Trend (6 Months)</span>
          </div>
          <div style={{ height: '100%', width: '100%' }}>
            <Bar data={co2Data} options={chartOptions} />
          </div>
        </div>

        {/* Money Savings */}
        <div className="glass-card widget-small-chart">
          <div className="card-header">
            <span className="card-title">Money Saved (6 Months)</span>
          </div>
          <div style={{ height: '100%', width: '100%' }}>
            <Line data={savingsData} options={chartOptions} />
          </div>
        </div>

        {/* Self-Sufficiency Rate */}
        <div className="glass-card" style={{ gridColumn: 'span 8', height: '350px' }}>
          <div className="card-header">
            <span className="card-title">Energy Self-Sufficiency Rate (Monthly)</span>
          </div>
          <div style={{ height: '100%', width: '100%' }}>
            <Line data={selfSufficiencyData} options={chartOptions} />
          </div>
        </div>

        {/* Impact Summary */}
        <div className="glass-card" style={{ gridColumn: 'span 4', height: '350px' }}>
          <div className="card-header"><span className="card-title">Impact Summary</span></div>
          <div style={{ padding: '20px 0' }}>
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Equivalent to</div>
              <div style={{ fontSize: '18px', color: 'var(--text-primary)' }}>🚗 50km not driven</div>
            </div>
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Equivalent to</div>
              <div style={{ fontSize: '18px', color: 'var(--text-primary)' }}>💡 200 LED bulbs for 1hr</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Grid Independence</div>
              <div style={{ fontSize: '18px', color: 'var(--success-color)' }}>85% self-powered</div>
            </div>
          </div>
        </div>
      </div>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>© 2025 Solar Monitor. Licensed by <a href="https://electrowave.kr/" target="_blank" rel="noopener noreferrer">electrowave.kr</a></p>
          <p>Developed by <strong>goodjwon</strong></p>
        </div>
      </footer>
    </div>
  );
};

export default EcoDetail;
