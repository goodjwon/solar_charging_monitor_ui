import { Line } from 'react-chartjs-2';
import { MdArrowBack, MdBatteryChargingFull } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';

const BatteryDetail = () => {
  const navigate = useNavigate();

  const voltageData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    datasets: [{
      label: 'Voltage (V)',
      data: [12.2, 12.4, 12.8, 13.2, 13.0, 12.6, 12.4],
      borderColor: '#4caf50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const currentData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    datasets: [{
      label: 'Current (A)',
      data: [0.1, 0.5, 1.2, 1.8, 1.5, 0.8, 0.2],
      borderColor: '#00bcd4',
      backgroundColor: 'rgba(0, 188, 212, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const temperatureData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    datasets: [{
      label: 'Temperature (°C)',
      data: [22, 24, 28, 32, 30, 26, 23],
      borderColor: '#ff4081',
      backgroundColor: 'rgba(255, 64, 129, 0.1)',
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
              <MdBatteryChargingFull style={{ color: 'var(--success-color)' }} />
              Battery Analytics
            </h2>
          </div>
        </div>

        {/* Current Status */}
        <div className="glass-card widget-metric">
          <div className="card-header"><span className="card-title">Current Status</span></div>
          <div className="metric-value" style={{ color: 'var(--success-color)' }}>
            75<span className="metric-unit"> %</span>
          </div>
          <div className="metric-sub">Voltage: 12.4 V | Current: 0.5 A</div>
        </div>

        <div className="glass-card widget-metric">
          <div className="card-header"><span className="card-title">Temperature</span></div>
          <div className="metric-value" style={{ color: 'var(--warning-color)' }}>
            27<span className="metric-unit"> °C</span>
          </div>
          <div className="metric-sub">Normal Range: 10-40°C</div>
        </div>

        <div className="glass-card widget-metric">
          <div className="card-header"><span className="card-title">Time to Full</span></div>
          <div className="metric-value" style={{ color: 'var(--primary-color)' }}>
            2h 15m
          </div>
          <div className="metric-sub">At current charge rate</div>
        </div>

        <div className="glass-card widget-metric">
          <div className="card-header"><span className="card-title">Health</span></div>
          <div className="metric-value" style={{ color: 'var(--success-color)' }}>
            95<span className="metric-unit"> %</span>
          </div>
          <div className="metric-sub">Excellent condition</div>
        </div>

        {/* Voltage Pattern */}
        <div className="glass-card widget-chart">
          <div className="card-header">
            <span className="card-title">Voltage Pattern (24h)</span>
          </div>
          <div style={{ height: '100%', width: '100%' }}>
            <Line data={voltageData} options={chartOptions} />
          </div>
        </div>

        {/* Current Pattern */}
        <div className="glass-card widget-small-chart">
          <div className="card-header">
            <span className="card-title">Current Pattern (24h)</span>
          </div>
          <div style={{ height: '100%', width: '100%' }}>
            <Line data={currentData} options={chartOptions} />
          </div>
        </div>

        {/* Temperature Monitoring */}
        <div className="glass-card" style={{ gridColumn: 'span 8', height: '350px' }}>
          <div className="card-header">
            <span className="card-title">Temperature Monitoring (24h)</span>
          </div>
          <div style={{ height: '100%', width: '100%' }}>
            <Line data={temperatureData} options={chartOptions} />
          </div>
        </div>

        {/* Charge/Discharge History */}
        <div className="glass-card" style={{ gridColumn: 'span 4', height: '350px' }}>
          <div className="card-header"><span className="card-title">Charge/Discharge Cycles</span></div>
          <div style={{ padding: '20px 0' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Today</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--success-color)' }}>3 cycles</div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>This Week</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary-color)' }}>18 cycles</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Lifetime</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)' }}>1,247 cycles</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatteryDetail;
