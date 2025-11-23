import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import BatteryDetail from './pages/BatteryDetail'
import EcoDetail from './pages/EcoDetail'
import LogsDetail from './pages/LogsDetail'
import SolarDetail from './pages/SolarDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/battery" element={<BatteryDetail />} />
        <Route path="/eco" element={<EcoDetail />} />
        <Route path="/logs" element={<LogsDetail />} />
        <Route path="/solar" element={<SolarDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
