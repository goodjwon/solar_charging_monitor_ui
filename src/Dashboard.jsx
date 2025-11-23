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
            <span className="card-title">Solar Power<HelpIcon text="태양광 패널에서 현재 생산되는 전력량입니다. 전압과 전류를 곱한 값입니다." multiline /></span>
          </div>
          <div className="metric-value" style={{ color: 'var(--primary-color)' }}>
            1.2<span className="metric-unit"> W</span>
          </div>
          <div className="metric-sub">Voltage: 12.4 V | Current: 0.1 A</div>
        </div>

        <div className="glass-card widget-metric">
          <div className="card-header">
            <span className="card-title">Battery Status<HelpIcon text="배터리의 현재 충전 상태(SOC)와 예상 사용 가능 시간입니다." multiline /></span>
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
            <span className="card-title">Load Power<HelpIcon text="현재 연결된 부하(전등, 기기 등)가 소비하는 전력량입니다." multiline /></span>
          </div>
          <div className="metric-value" style={{ color: 'var(--accent-color)' }}>
            0.3<span className="metric-unit"> W</span>
          </div>
          <div className="metric-sub">Status: Active</div>
        </div>

        <div className="glass-card widget-metric">
          <div className="card-header">
            <span className="card-title">Efficiency<HelpIcon text="태양광 시스템의 전체 효율입니다. 발전량 대비 실제 사용 가능한 에너지 비율입니다." multiline /></span>
          </div>
          <div className="metric-value" style={{ color: '#2196F3' }}>
            92<span className="metric-unit"> %</span>
          </div>
          <div className="metric-sub">System Health: Good</div>
        </div>

        {/* Charts */}
        <div className="glass-card widget-chart">
          <div className="card-header">
            <span className="card-title">Power Generation History (24h)</span>
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
            <span className="card-title">Eco Impact<HelpIcon text="태양광 발전으로 절감한 CO2 배출량, 절약 금액, 에너지 자립률 등 환경 효과입니다." multiline /></span>
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
          <div className="card-header"><span className="card-title">Monthly Energy</span></div>
          <div style={{ height: '100%', width: '100%' }}>
            <Bar data={monthlyData} options={commonChartOptions} />
          </div>
        </div>
        <div className="glass-card widget-small-chart">
          <div className="card-header"><span className="card-title">Yearly Energy</span></div>
          <div style={{ height: '100%', width: '100%' }}>
            <Line data={yearlyData} options={commonChartOptions} />
          </div>
        </div>
        <div className="glass-card widget-small-chart">
          <div className="card-header"><span className="card-title">Total Cumulative</span></div>
          <div style={{ height: '100%', width: '100%' }}>
            <Line data={cumulativeData} options={commonChartOptions} />
          </div>
        </div>

        {/* Logs */}
        <div className="glass-card widget-logs">
          <div className="card-header">
            <span className="card-title">System Logs<HelpIcon text="시스템의 주요 이벤트와 상태 변화를 시간순으로 기록한 로그입니다." multiline /></span>
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
    </>
  );
};

export default Dashboard;
