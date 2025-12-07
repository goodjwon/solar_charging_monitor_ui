import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { MdArrowBack, MdBatteryChargingFull } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { getBatteryDetailData, getChartOptions } from '../data/mockData';
import '../Dashboard.css';

const BatteryDetail = () => {
  const navigate = useNavigate();
  const [batteryData, setBatteryData] = useState(null);

  useEffect(() => {
    const data = getBatteryDetailData();
    setBatteryData(data);

    const refreshTimer = setInterval(() => {
      const refreshedData = getBatteryDetailData();
      setBatteryData(refreshedData);
    }, 5000);

    return () => clearInterval(refreshTimer);
  }, []);

  if (!batteryData) {
    return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;
  }

  const voltageData = {
    labels: batteryData.hourly.labels,
    datasets: [{
      label: 'Voltage (V)',
      data: batteryData.hourly.voltage,
      borderColor: '#4caf50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const currentData = {
    labels: batteryData.hourly.labels,
    datasets: [{
      label: 'Current (A)',
      data: batteryData.hourly.current,
      borderColor: '#00bcd4',
      backgroundColor: 'rgba(0, 188, 212, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const temperatureData = {
    labels: batteryData.hourly.labels,
    datasets: [{
      label: 'Temperature (°C)',
      data: batteryData.hourly.temperature,
      borderColor: '#ff4081',
      backgroundColor: 'rgba(255, 64, 129, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const chartOptions = getChartOptions();

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

      <Footer />
    </div>
  );
};

export default BatteryDetail;
