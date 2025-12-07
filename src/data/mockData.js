// Mock sensor data generator based on actual sensor format
// Sensor format: { deviceId, timestamp, power_metrics, battery_metrics, environment }

// Generate time-series sensor data
const generateHourlySensorData = (hours = 24) => {
  const data = [];
  const now = new Date();

  for (let i = hours - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * 60 * 60 * 1000);
    const hour = timestamp.getHours();

    // Solar power varies with time of day (peak at noon)
    const solarFactor = Math.max(0, Math.sin((hour - 6) * Math.PI / 12));
    const baseIlluminance = solarFactor * 60000 + Math.random() * 5000;
    const basePower = solarFactor * 500 + Math.random() * 50;

    data.push({
      deviceId: "SOLAR_PANEL_01",
      timestamp: timestamp.toISOString(),
      power_metrics: {
        voltage_v: 220 + Math.random() * 10,
        current_a: basePower > 0 ? (basePower / 220) : 0,
        active_power_w: basePower,
        power_factor: 0.95 + Math.random() * 0.05
      },
      battery_metrics: {
        soc_percent: 40 + solarFactor * 50 + Math.random() * 10,
        power_flow_w: basePower - 300 - Math.random() * 100,
        temperature_c: 25 + solarFactor * 5 + Math.random() * 3
      },
      environment: {
        illuminance_lux: baseIlluminance,
        panel_temp_c: 30 + solarFactor * 15 + Math.random() * 5
      }
    });
  }

  return data;
};

const generateDailySensorData = (days = 7) => {
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    const dayOfWeek = date.getDay();

    // Weekend might have different patterns
    const basePower = (dayOfWeek === 0 || dayOfWeek === 6) ? 350 : 420;

    data.push({
      deviceId: "SOLAR_PANEL_01",
      timestamp: date.toISOString(),
      daily_total_kwh: basePower / 1000 * 8 + Math.random() * 0.5, // 8 hours of peak sun
      daily_avg_power_w: basePower + Math.random() * 50,
      daily_max_power_w: basePower * 1.2 + Math.random() * 30,
      battery_avg_soc: 65 + Math.random() * 15,
      total_illuminance: 400000 + Math.random() * 50000
    });
  }

  return data;
};

const generateMonthlySensorData = (months = 6) => {
  const data = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.getMonth();

    // Seasonal variation (summer has more solar)
    const seasonalFactor = 0.7 + 0.3 * Math.sin((month - 2) * Math.PI / 6);

    data.push({
      month: monthNames[month],
      year: date.getFullYear(),
      total_kwh: 120 * seasonalFactor + Math.random() * 20,
      avg_daily_kwh: 4 * seasonalFactor + Math.random() * 0.5,
      co2_saved_kg: 12 * seasonalFactor + Math.random() * 3,
      money_saved_krw: 1200 * seasonalFactor + Math.random() * 300
    });
  }

  return data;
};

const generateYearlySensorData = (years = 5) => {
  const data = [];
  const currentYear = new Date().getFullYear();

  for (let i = years - 1; i >= 0; i--) {
    const year = currentYear - i;
    const efficiency = 0.85 + i * 0.02; // Improving over years

    data.push({
      year: year.toString(),
      total_kwh: 1400 * efficiency + Math.random() * 100,
      total_co2_saved_kg: 140 * efficiency + Math.random() * 10,
      total_money_saved_krw: 14000 * efficiency + Math.random() * 1000,
      system_efficiency: efficiency
    });
  }

  return data;
};

// Current real-time data
export const getCurrentSensorData = () => {
  const hourlyData = generateHourlySensorData(1);
  return hourlyData[0];
};

// Dashboard data
export const getDashboardData = () => {
  const current = getCurrentSensorData();
  const hourly = generateHourlySensorData(24);
  const monthly = generateMonthlySensorData(6);
  const yearly = generateYearlySensorData(5);

  return {
    current: {
      solarPower: current.power_metrics.active_power_w,
      batteryLevel: current.battery_metrics.soc_percent,
      consumption: 320, // Mock consumption
      gridPower: Math.max(0, 320 - current.power_metrics.active_power_w),
      illuminance: current.environment.illuminance_lux,
      panelTemp: current.environment.panel_temp_c,
      batteryTemp: current.battery_metrics.temperature_c,
      voltage: current.power_metrics.voltage_v,
      current: current.power_metrics.current_a
    },
    history: {
      labels: hourly.map(d => new Date(d.timestamp).getHours() + ':00'),
      solarPower: hourly.map(d => d.power_metrics.active_power_w),
      batteryLevel: hourly.map(d => d.battery_metrics.soc_percent),
      consumption: hourly.map(() => 280 + Math.random() * 80)
    },
    monthly: {
      labels: monthly.map(d => d.month),
      generation: monthly.map(d => d.total_kwh),
      savings: monthly.map(d => d.money_saved_krw)
    },
    yearly: {
      labels: yearly.map(d => d.year),
      generation: yearly.map(d => d.total_kwh),
      cumulative: yearly.map((d, i) => yearly.slice(0, i + 1).reduce((sum, y) => sum + y.total_kwh, 0))
    }
  };
};

// Solar Detail data
export const getSolarDetailData = () => {
  const hourly = generateHourlySensorData(24);
  const daily = generateDailySensorData(7);
  const weekly = generateDailySensorData(28);

  return {
    current: {
      power: hourly[hourly.length - 1].power_metrics.active_power_w,
      voltage: hourly[hourly.length - 1].power_metrics.voltage_v,
      current: hourly[hourly.length - 1].power_metrics.current_a,
      illuminance: hourly[hourly.length - 1].environment.illuminance_lux,
      panelTemp: hourly[hourly.length - 1].environment.panel_temp_c,
      efficiency: 18.5,
      todayGeneration: 3.2
    },
    hourly: {
      labels: hourly.map(d => {
        const date = new Date(d.timestamp);
        return `${String(date.getHours()).padStart(2, '0')}:00`;
      }),
      power: hourly.map(d => d.power_metrics.active_power_w),
      illuminance: hourly.map(d => d.environment.illuminance_lux),
      temperature: hourly.map(d => d.environment.panel_temp_c)
    },
    weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      generation: daily.map(d => d.daily_total_kwh),
      peakPower: daily.map(d => d.daily_max_power_w)
    },
    monthly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      efficiency: [18.2, 18.5, 18.8, 18.6],
      avgPower: weekly.reduce((acc, d, i) => {
        const week = Math.floor(i / 7);
        acc[week] = (acc[week] || 0) + d.daily_avg_power_w / 7;
        return acc;
      }, [])
    }
  };
};

// Battery Detail data
export const getBatteryDetailData = () => {
  const hourly = generateHourlySensorData(24);

  return {
    current: {
      soc: hourly[hourly.length - 1].battery_metrics.soc_percent,
      voltage: hourly[hourly.length - 1].power_metrics.voltage_v,
      current: hourly[hourly.length - 1].power_metrics.current_a,
      powerFlow: hourly[hourly.length - 1].battery_metrics.power_flow_w,
      temperature: hourly[hourly.length - 1].battery_metrics.temperature_c,
      health: 98.5,
      cycles: 1247,
      capacity: 10, // kWh
      timeToFull: 2.5 // hours
    },
    hourly: {
      labels: hourly.map(d => {
        const date = new Date(d.timestamp);
        return `${String(date.getHours()).padStart(2, '0')}:00`;
      }),
      voltage: hourly.map(d => d.power_metrics.voltage_v),
      current: hourly.map(d => d.power_metrics.current_a),
      temperature: hourly.map(d => d.battery_metrics.temperature_c),
      soc: hourly.map(d => d.battery_metrics.soc_percent),
      powerFlow: hourly.map(d => d.battery_metrics.power_flow_w)
    }
  };
};

// Eco Detail data
export const getEcoDetailData = () => {
  const monthly = generateMonthlySensorData(6);
  const yearly = generateYearlySensorData(5);

  // CO2 calculation: 1 kWh ≈ 0.5 kg CO2 (Korea grid average)
  const totalKwh = yearly.reduce((sum, y) => sum + y.total_kwh, 0);
  const totalCO2 = totalKwh * 0.5;

  // Cost calculation: ≈ 100 won per kWh
  const totalMoneySaved = totalKwh * 100;

  return {
    current: {
      treesEquivalent: (totalCO2 / 20).toFixed(1), // 1 tree absorbs ~20kg CO2/year
      co2Saved: totalCO2.toFixed(1),
      moneySaved: Math.round(totalMoneySaved),
      selfSufficiency: 85,
      co2Today: 4.2,
      moneyToday: 350
    },
    monthly: {
      labels: monthly.map(d => d.month),
      co2: monthly.map(d => d.co2_saved_kg),
      money: monthly.map(d => d.money_saved_krw)
    },
    weekly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      selfSufficiency: [75, 82, 88, 85]
    }
  };
};

// Logs data
export const getLogsData = () => {
  const logs = [];
  const now = new Date();

  const logMessages = [
    { type: 'info', message: 'Solar charging started' },
    { type: 'success', message: 'Battery fully charged' },
    { type: 'warning', message: 'High panel temperature detected' },
    { type: 'info', message: 'Grid connection stable' },
    { type: 'error', message: 'Communication timeout - retry' },
    { type: 'success', message: 'Power export to grid started' },
    { type: 'info', message: 'Night mode activated' },
    { type: 'warning', message: 'Low battery - switching to grid' },
    { type: 'info', message: 'System diagnostics passed' },
    { type: 'success', message: 'Peak power achieved: 520W' }
  ];

  for (let i = 0; i < 50; i++) {
    const timestamp = new Date(now - i * 15 * 60 * 1000); // Every 15 minutes
    const logEntry = logMessages[Math.floor(Math.random() * logMessages.length)];

    logs.push({
      id: i + 1,
      timestamp: timestamp.toISOString(),
      type: logEntry.type,
      message: logEntry.message,
      deviceId: 'SOLAR_PANEL_01'
    });
  }

  return logs;
};

// Common chart options
export const getChartOptions = (multiline = false) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: { color: '#b0bec5' }
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: { color: '#b0bec5' }
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: { color: '#b0bec5' }
    }
  }
});

// Format helpers
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const formatPower = (watts) => {
  if (watts >= 1000) {
    return `${(watts / 1000).toFixed(2)} kW`;
  }
  return `${watts.toFixed(0)} W`;
};

export const formatEnergy = (kwh) => {
  return `${kwh.toFixed(2)} kWh`;
};
