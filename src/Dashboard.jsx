import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { MdSolarPower, MdAutorenew, MdBatteryChargingFull, MdLightbulb, MdFullscreen, MdSettings, MdArrowForward, MdHelpOutline } from 'react-icons/md';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

// Help Icon Component with Tooltip
const HelpIcon = ({ text, multiline = false }) => (
  <div className="tooltip-container">
    <div className="help-icon">
      <MdHelpOutline size={12} />
    </div>
    <span className={`tooltip-text ${multiline ? 'multiline' : ''}`}>{text}</span>
  </div>
);

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      document.body.classList.add('fullscreen-mode');
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      document.body.classList.remove('fullscreen-mode');
      setIsFullscreen(false);
    }
  };

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#b0bec5' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#b0bec5' } }
    }
  };

  const historyData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [{
      label: 'Generation (W)',
      data: [0, 0.5, 1.2, 2.5, 1.8, 0.2],
      borderColor: '#00bcd4',
      backgroundColor: 'rgba(0, 188, 212, 0.3)',
      fill: true,
      tension: 0.4,
      pointRadius: 4
    }]
  };

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [120, 150, 180, 220, 250, 280],
      backgroundColor: '#00bcd4',
      borderRadius: 4
    }]
  };

  const yearlyData = {
    labels: ['2021', '2022', '2023', '2024', '2025'],
    datasets: [{
      data: [3200, 3500, 3800, 4100, 4000],
      borderColor: '#ff4081',
      backgroundColor: 'rgba(255, 64, 129, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const cumulativeData = {
    labels: ['2021', '2022', '2023', '2024', '2025'],
    datasets: [{
      data: [3200, 6700, 10500, 14600, 18600],
      borderColor: '#4caf50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <>
      <header>
        <div className="header-content">
          <div className="header-title">
            <h1><MdSolarPower /> SOLAR MONITOR</h1>
          </div>
          <div className="header-controls">
            <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)', fontSize: '16px' }}>
              {currentTime}
            </span>
            <button onClick={toggleFullscreen}>
              <MdFullscreen /> Fullscreen
            </button>
            <button>
              <MdSettings />
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Energy Flow */}
        <div className="glass-card widget-energy-flow">
          <div className="card-header">
            <span className="card-title">Real-time Energy Flow</span>
            <MdAutorenew style={{ color: 'var(--text-secondary)' }} />
          </div>
          <div className="flow-container">
            <div className="flow-node">
              <div className="node-icon solar"><MdSolarPower /></div>
              <div style={{ position: 'absolute', top: '70px', textAlign: 'center', width: '150px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#f1c40f' }}>Generation</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, color: 'var(--text-secondary)' }}>1.2 W</div>
              </div>
            </div>

            <div className="flow-line">
              <div className="flow-particle" style={{ animationDuration: '1.5s' }}></div>
              <div className="flow-particle" style={{ animationDuration: '1.5s', animationDelay: '0.75s' }}></div>
            </div>

            <div className="flow-node">
              <div className="node-icon battery"><MdBatteryChargingFull /></div>
              <div style={{ position: 'absolute', top: '70px', textAlign: 'center', width: '150px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#2ecc71' }}>Storage</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, color: 'var(--text-secondary)' }}>75 %</div>
              </div>
            </div>

            <div className="flow-line">
              <div className="flow-particle" style={{ animationDuration: '1.5s' }}></div>
              <div className="flow-particle" style={{ animationDuration: '1.5s', animationDelay: '0.75s' }}></div>
            </div>

            <div className="flow-node">
              <div className="node-icon load"><MdLightbulb /></div>
              <div style={{ position: 'absolute', top: '70px', textAlign: 'center', width: '150px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#e74c3c' }}>Consumption</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, color: 'var(--text-secondary)' }}>0.3 W</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="glass-card widget-metric">
          <div className="card-header">
            <span className="card-title">Solar Power<HelpIcon text="현재 태양광 패널 발전량 (전압 × 전류)" /></span>
          </div>
          <div className="metric-value" style={{ color: 'var(--primary-color)' }}>
            1.2<span className="metric-unit"> W</span>
          </div>
          <div className="metric-sub">Voltage: 12.4 V | Current: 0.1 A</div>
        </div>

        <div className="glass-card widget-metric">
          <div className="card-header">
            <span className="card-title">Battery Status<HelpIcon text="배터리 충전량과 예상 사용시간" /></span>
            <Link to="/battery" style={{ color: 'var(--primary-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
              Details <MdArrowForward size={14} />
            </Link>
          </div>
          <div className="battery-visual">
            <div className="battery-level"></div>
          </div>
          <div className="metric-value" style={{ color: 'var(--success-color)' }}>
            75<span className="metric-unit"> %</span>
          </div>
          <div className="metric-sub">Est. Time Left: 3h 20m</div>
        </div>

        <div className="glass-card widget-metric">
          <div className="card-header">
            <span className="card-title">Load Power<HelpIcon text="연결된 기기의 소비 전력" /></span>
          </div>
          <div className="metric-value" style={{ color: 'var(--accent-color)' }}>
            0.3<span className="metric-unit"> W</span>
          </div>
          <div className="metric-sub">Status: Active</div>
        </div>

        <div className="glass-card widget-metric">
          <div className="card-header">
            <span className="card-title">Efficiency<HelpIcon text="시스템 전체 에너지 효율" /></span>
          </div>
          <div className="metric-value" style={{ color: '#2196F3' }}>
            92<span className="metric-unit"> %</span>
          </div>
          <div className="metric-sub">System Health: Good</div>
        </div>

        {/* Charts */}
        <div className="glass-card widget-chart">
          <div className="card-header">
            <span className="card-title">Power Generation History (24h)<HelpIcon text="24시간 동안의 태양광 발전량 변화 추이" /></span>
            <Link to="/solar" style={{ color: 'var(--primary-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
              Details <MdArrowForward size={14} />
            </Link>
          </div>
          <div style={{ height: '100%', width: '100%' }}>
            <Line data={historyData} options={commonChartOptions} />
          </div>
        </div>

        {/* Eco Impact */}
        <div className="glass-card widget-eco">
          <div className="card-header">
            <span className="card-title">Eco Impact<HelpIcon text="CO2 절감, 절약금액, 에너지 자립률" /></span>
            <Link to="/eco" style={{ color: 'var(--primary-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
              Details <MdArrowForward size={14} />
            </Link>
          </div>
          <div className="eco-grid">
            <div className="eco-item">
              <div className="eco-icon">🌲</div>
              <div className="eco-val">0.5</div>
              <div className="eco-label">Trees Planted</div>
            </div>
            <div className="eco-item">
              <div className="eco-icon">☁️</div>
              <div className="eco-val">4.2 kg</div>
              <div className="eco-label">CO2 Saved</div>
            </div>
            <div className="eco-item">
              <div className="eco-icon">💰</div>
              <div className="eco-val">₩ 350</div>
              <div className="eco-label">Money Saved</div>
            </div>
            <div className="eco-item">
              <div className="eco-icon">🔋</div>
              <div className="eco-val">85 %</div>
              <div className="eco-label">Self-Sufficiency</div>
            </div>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="glass-card widget-small-chart">
          <div className="card-header"><span className="card-title">Monthly Energy<HelpIcon text="월별 총 발전량 비교" /></span></div>
          <div style={{ height: '100%', width: '100%' }}>
            <Bar data={monthlyData} options={commonChartOptions} />
          </div>
        </div>
        <div className="glass-card widget-small-chart">
          <div className="card-header"><span className="card-title">Yearly Energy<HelpIcon text="연도별 총 발전량 추이" /></span></div>
          <div style={{ height: '100%', width: '100%' }}>
            <Line data={yearlyData} options={commonChartOptions} />
          </div>
        </div>
        <div className="glass-card widget-small-chart">
          <div className="card-header"><span className="card-title">Total Cumulative<HelpIcon text="시스템 가동 후 누적 총 발전량" /></span></div>
          <div style={{ height: '100%', width: '100%' }}>
            <Line data={cumulativeData} options={commonChartOptions} />
          </div>
        </div>

        {/* Logs */}
        <div className="glass-card widget-logs">
          <div className="card-header">
            <span className="card-title">System Logs<HelpIcon text="시스템 이벤트 기록" /></span>
            <Link to="/logs" style={{ color: 'var(--primary-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
              View All <MdArrowForward size={14} />
            </Link>
          </div>
          <div>
            <div className="log-item">
              <span className="log-time">12:00:05</span>
              <span className="log-msg">Battery fully charged</span>
              <span className="log-type info">INFO</span>
            </div>
            <div className="log-item">
              <span className="log-time">11:45:22</span>
              <span className="log-msg">Solar panel voltage drop detected</span>
              <span className="log-type warn">WARN</span>
            </div>
            <div className="log-item">
              <span className="log-time">09:30:00</span>
              <span className="log-msg">System started</span>
              <span className="log-type info">INFO</span>
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
    </>
  );
};

export default Dashboard;
