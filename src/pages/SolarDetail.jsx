import { Line, Bar } from 'react-chartjs-2';
import { MdArrowBack, MdWbSunny } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';

const SolarDetail = () => {
  const navigate = useNavigate();

  const hourlyData = {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'],
    datasets: [{
      label: 'Power Generation (W)',
      data: [0, 0, 0.2, 0.8, 1.5, 1.2, 0.5, 0, 0],
      borderColor: '#f1c40f',
      backgroundColor: 'rgba(241, 196, 15, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const illuminanceData = {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'],
    datasets: [{
      label: 'Illuminance (lux)',
      data: [0, 0, 5000, 35000, 54715, 42000, 15000, 0, 0],
      borderColor: '#ff9800',
      backgroundColor: 'rgba(255, 152, 0, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const temperatureData = {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'],
    datasets: [{
      label: 'Panel Temperature (°C)',
      data: [18, 18, 22, 30, 38, 35, 28, 20, 18],
      borderColor: '#e74c3c',
      backgroundColor: 'rgba(231, 76, 60, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Daily Generation (Wh)',
      data: [15, 18, 12, 20, 22, 19, 16],
      backgroundColor: '#f1c40f',
      borderRadius: 4
    }]
  };

  const efficiencyData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Efficiency (%)',
      data: [88, 92, 90, 93],
      borderColor: '#2ecc71',
      backgroundColor: 'rgba(46, 204, 113, 0.1)',
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
              <MdWbSunny style={{ color: '#f1c40f' }} />
              Solar Power Analytics
            </h2>
          </div>
        </div>

        {/* Current Status Metrics */}
        <div className="glass-card widget-metric">
          <div className="card-header"><span className="card-title">Current Power</span></div>
          <div className="metric-value" style={{ color: '#f1c40f' }}>
            1.2<span className="metric-unit"> W</span>
          </div>
          <div className="metric-sub">Voltage: 12.4 V | Current: 0.1 A</div>
        </div>

        <div className="glass-card widget-metric">
          <div className="card-header"><span className="card-title">Illuminance</span></div>
          <div className="metric-value" style={{ color: '#ff9800' }}>
            54,715<span className="metric-unit"> lux</span>
          </div>
          <div className="metric-sub">Excellent sunlight</div>
        </div>

        <div className="glass-card widget-metric">
          <div className="card-header"><span className="card-title">Panel Temperature</span></div>
          <div className="metric-value" style={{ color: '#e74c3c' }}>
            38<span className="metric-unit"> °C</span>
          </div>
          <div className="metric-sub">Normal range: 20-45°C</div>
        </div>

        <div className="glass-card widget-metric">
          <div className="card-header"><span className="card-title">Efficiency</span></div>
          <div className="metric-value" style={{ color: '#2ecc71' }}>
            92<span className="metric-unit"> %</span>
          </div>
          <div className="metric-sub">Excellent performance</div>
        </div>

        {/* Hourly Generation Pattern */}
        <div className="glass-card widget-chart">
          <div className="card-header">
            <span className="card-title">Hourly Generation Pattern (24h)</span>
          </div>
          <div style={{ height: '100%', width: '100%' }}>
            <Line data={hourlyData} options={chartOptions} />
          </div>
        </div>

        {/* Peak Records */}
        <div className="glass-card" style={{ gridColumn: 'span 4', height: '350px' }}>
          <div className="card-header"><span className="card-title">Peak Records</span></div>
          <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: 'calc(100% - 50px)' }}>
            <div style={{ paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Today's Peak</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f1c40f' }}>1.5 W</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>at 12:30 PM</div>
            </div>
            <div style={{ paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>This Week</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff9800' }}>2.2 W</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>on Thursday</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>All Time</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#e74c3c' }}>2.8 W</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>June 21, 2024</div>
            </div>
          </div>
        </div>

        {/* Illuminance Pattern */}
        <div className="glass-card" style={{ gridColumn: 'span 8', height: '350px' }}>
          <div className="card-header">
            <span className="card-title">Illuminance Pattern (24h)</span>
          </div>
          <div style={{ height: '100%', width: '100%' }}>
            <Line data={illuminanceData} options={chartOptions} />
          </div>
        </div>

        {/* Panel Temperature */}
        <div className="glass-card" style={{ gridColumn: 'span 4', height: '350px' }}>
          <div className="card-header">
            <span className="card-title">Panel Temperature (24h)</span>
          </div>
          <div style={{ height: '100%', width: '100%' }}>
            <Line data={temperatureData} options={chartOptions} />
          </div>
        </div>

        {/* Weekly Generation */}
        <div className="glass-card widget-small-chart">
          <div className="card-header">
            <span className="card-title">Weekly Generation</span>
          </div>
          <div style={{ height: '100%', width: '100%' }}>
            <Bar data={weeklyData} options={chartOptions} />
          </div>
        </div>

        {/* Efficiency Trend */}
        <div className="glass-card widget-small-chart">
          <div className="card-header">
            <span className="card-title">Efficiency Trend (Monthly)</span>
          </div>
          <div style={{ height: '100%', width: '100%' }}>
            <Line data={efficiencyData} options={chartOptions} />
          </div>
        </div>

        {/* Generation Summary */}
        <div className="glass-card" style={{ gridColumn: 'span 4', height: '350px' }}>
          <div className="card-header"><span className="card-title">Generation Summary</span></div>
          <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: 'calc(100% - 50px)' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Today</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f1c40f' }}>18 Wh</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>This Week</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff9800' }}>122 Wh</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>This Month</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2ecc71' }}>520 Wh</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Lifetime</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary-color)' }}>18.6 kWh</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarDetail;
