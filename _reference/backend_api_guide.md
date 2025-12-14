# Solar Charging Monitor - Backend API Server Guide

Arduino 센서 데이터를 수집하고 실시간으로 프론트엔드에 제공하는 Node.js API 서버 구축 가이드

## 목차
1. [프로젝트 구조](#프로젝트-구조)
2. [초기 설정](#초기-설정)
3. [데이터베이스 설정](#데이터베이스-설정)
4. [Express 서버 구현](#express-서버-구현)
5. [WebSocket 실시간 스트리밍](#websocket-실시간-스트리밍)
6. [Arduino 연동](#arduino-연동)
7. [프론트엔드 연동](#프론트엔드-연동)
8. [배포 및 운영](#배포-및-운영)

---

## 프로젝트 구조

```
solar-charging-api/
├── src/
│   ├── config/
│   │   ├── database.js         # MongoDB 연결 설정
│   │   └── env.js              # 환경 변수 설정
│   ├── models/
│   │   └── SensorData.js       # 센서 데이터 모델
│   ├── routes/
│   │   ├── sensor.routes.js    # 센서 데이터 API
│   │   └── dashboard.routes.js # 대시보드 API
│   ├── controllers/
│   │   ├── sensor.controller.js
│   │   └── dashboard.controller.js
│   ├── services/
│   │   ├── sensor.service.js   # 비즈니스 로직
│   │   └── websocket.service.js # WebSocket 관리
│   ├── middleware/
│   │   ├── auth.middleware.js  # 인증 미들웨어
│   │   ├── validation.middleware.js
│   │   └── errorHandler.js
│   └── server.js               # 서버 엔트리 포인트
├── .env                        # 환경 변수
├── .env.example                # 환경 변수 예제
├── package.json
└── README.md
```

---

## 초기 설정

### 1. 프로젝트 생성

```bash
# API 서버 디렉토리 생성
mkdir solar-charging-api
cd solar-charging-api

# package.json 초기화
npm init -y
```

### 2. 필수 패키지 설치

```bash
# 핵심 의존성
npm install express mongoose cors dotenv

# WebSocket
npm install ws

# 유틸리티
npm install helmet compression morgan

# 개발 의존성
npm install --save-dev nodemon
```

### 3. package.json 스크립트 설정

```json
{
  "name": "solar-charging-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### 4. 환경 변수 설정 (.env)

```env
# Server Configuration
NODE_ENV=development
PORT=3001
HOST=localhost

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/solar_charging
MONGODB_TEST_URI=mongodb://localhost:27017/solar_charging_test

# WebSocket Configuration
WS_PORT=3002

# API Security
API_KEY=your_device_api_key_here
JWT_SECRET=your_jwt_secret_here

# CORS
CORS_ORIGIN=http://localhost:5174

# Logging
LOG_LEVEL=debug
```

---

## 데이터베이스 설정

### 1. MongoDB 로컬 설치 및 실행

```bash
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Windows
# MongoDB Community Server 다운로드 및 설치
# https://www.mongodb.com/try/download/community

# Linux (Ubuntu)
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### 2. 데이터베이스 연결 설정 (src/config/database.js)

```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // 연결 이벤트 핸들러
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // 프로세스 종료 시 연결 해제
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;
```

### 3. 센서 데이터 모델 (src/models/SensorData.js)

```javascript
import mongoose from 'mongoose';

const sensorDataSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  power_metrics: {
    voltage_v: {
      type: Number,
      required: true,
    },
    current_a: {
      type: Number,
      required: true,
    },
    active_power_w: {
      type: Number,
      required: true,
    },
    power_factor: {
      type: Number,
      min: 0,
      max: 1,
    },
  },
  battery_metrics: {
    soc_percent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    power_flow_w: {
      type: Number,
      required: true,
    },
    temperature_c: {
      type: Number,
    },
  },
  environment: {
    illuminance_lux: {
      type: Number,
      min: 0,
    },
    panel_temp_c: {
      type: Number,
    },
  },
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
});

// 인덱스 설정 (쿼리 성능 향상)
sensorDataSchema.index({ deviceId: 1, timestamp: -1 });

// TTL 인덱스 (90일 후 자동 삭제)
sensorDataSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

const SensorData = mongoose.model('SensorData', sensorDataSchema);

export default SensorData;
```

---

## Express 서버 구현

### 1. 메인 서버 파일 (src/server.js)

```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { WebSocketServer } from 'ws';
import http from 'http';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import sensorRoutes from './routes/sensor.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { initWebSocketService } from './services/websocket.service.js';

// 환경 변수 로드
dotenv.config();

// Express 앱 생성
const app = express();
const PORT = process.env.PORT || 3001;
const WS_PORT = process.env.WS_PORT || 3002;

// 데이터베이스 연결
connectDB();

// 미들웨어
app.use(helmet()); // 보안 헤더
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
  credentials: true
}));
app.use(compression()); // gzip 압축
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // 로깅

// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API 라우트
app.use('/api/sensor', sensorRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// HTTP 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

// WebSocket 서버 생성
const wss = new WebSocketServer({ port: WS_PORT });
initWebSocketService(wss);

console.log(`🔌 WebSocket Server running on ws://localhost:${WS_PORT}`);

// 우아한 종료
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  app.close(() => {
    console.log('HTTP server closed');
  });
});
```

### 2. 센서 데이터 컨트롤러 (src/controllers/sensor.controller.js)

```javascript
import SensorData from '../models/SensorData.js';
import { broadcastSensorData } from '../services/websocket.service.js';

// 센서 데이터 수신 (Arduino에서 POST)
export const receiveSensorData = async (req, res) => {
  try {
    const { deviceId, power_metrics, battery_metrics, environment } = req.body;

    // 데이터 검증
    if (!deviceId || !power_metrics || !battery_metrics) {
      return res.status(400).json({
        error: 'Missing required fields: deviceId, power_metrics, battery_metrics'
      });
    }

    // MongoDB에 저장
    const sensorData = new SensorData({
      deviceId,
      timestamp: new Date(),
      power_metrics,
      battery_metrics,
      environment,
    });

    await sensorData.save();

    // WebSocket으로 실시간 브로드캐스트
    broadcastSensorData(sensorData);

    res.status(201).json({
      message: 'Sensor data received successfully',
      id: sensorData._id,
    });

  } catch (error) {
    console.error('Error receiving sensor data:', error);
    res.status(500).json({ error: 'Failed to save sensor data' });
  }
};

// 최신 센서 데이터 조회
export const getLatestData = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const latestData = await SensorData
      .findOne({ deviceId })
      .sort({ timestamp: -1 })
      .limit(1);

    if (!latestData) {
      return res.status(404).json({ error: 'No data found for this device' });
    }

    res.json(latestData);

  } catch (error) {
    console.error('Error fetching latest data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

// 시간 범위별 데이터 조회
export const getDataByTimeRange = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { startTime, endTime, interval } = req.query;

    const query = { deviceId };

    if (startTime || endTime) {
      query.timestamp = {};
      if (startTime) query.timestamp.$gte = new Date(startTime);
      if (endTime) query.timestamp.$lte = new Date(endTime);
    }

    const data = await SensorData
      .find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(interval) || 100);

    res.json({
      count: data.length,
      data,
    });

  } catch (error) {
    console.error('Error fetching time range data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
```

### 3. 센서 라우트 (src/routes/sensor.routes.js)

```javascript
import express from 'express';
import {
  receiveSensorData,
  getLatestData,
  getDataByTimeRange
} from '../controllers/sensor.controller.js';
import { validateApiKey } from '../middleware/auth.middleware.js';

const router = express.Router();

// Arduino에서 데이터 전송 (API Key 인증 필요)
router.post('/data', validateApiKey, receiveSensorData);

// 최신 데이터 조회
router.get('/latest/:deviceId', getLatestData);

// 시간 범위별 데이터 조회
router.get('/history/:deviceId', getDataByTimeRange);

export default router;
```

### 4. 인증 미들웨어 (src/middleware/auth.middleware.js)

```javascript
export const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'API Key is required' });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Invalid API Key' });
  }

  next();
};
```

---

## WebSocket 실시간 스트리밍

### 1. WebSocket 서비스 (src/services/websocket.service.js)

```javascript
let wss = null;
const clients = new Set();

// WebSocket 서버 초기화
export const initWebSocketService = (websocketServer) => {
  wss = websocketServer;

  wss.on('connection', (ws, req) => {
    console.log('🔌 New WebSocket client connected from', req.socket.remoteAddress);
    clients.add(ws);

    // 연결 확인 메시지
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to Solar Charging Monitor',
      timestamp: new Date().toISOString(),
    }));

    // 주기적 핑 (연결 유지)
    const pingInterval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.ping();
      }
    }, 30000);

    // 클라이언트로부터 메시지 수신
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log('Received from client:', data);

        // 클라이언트 요청 처리 (예: 특정 디바이스 구독)
        if (data.type === 'subscribe' && data.deviceId) {
          ws.deviceId = data.deviceId;
          ws.send(JSON.stringify({
            type: 'subscribed',
            deviceId: data.deviceId,
          }));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    // 연결 종료
    ws.on('close', () => {
      console.log('❌ WebSocket client disconnected');
      clients.delete(ws);
      clearInterval(pingInterval);
    });

    // 에러 처리
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });
};

// 센서 데이터 브로드캐스트
export const broadcastSensorData = (sensorData) => {
  const message = JSON.stringify({
    type: 'sensor_data',
    data: sensorData,
    timestamp: new Date().toISOString(),
  });

  clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      // 특정 디바이스 구독 필터링
      if (!client.deviceId || client.deviceId === sensorData.deviceId) {
        client.send(message);
      }
    }
  });
};

// 연결된 클라이언트 수 조회
export const getConnectedClients = () => {
  return clients.size;
};
```

---

## Arduino 연동

### Arduino 샘플 코드 (WiFi + HTTP POST)

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi 설정
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// API 서버 설정
const char* serverUrl = "http://your-server-ip:3001/api/sensor/data";
const char* apiKey = "your_device_api_key_here";
const char* deviceId = "SOLAR_PANEL_01";

// 센서 핀 설정 (예시)
const int VOLTAGE_PIN = A0;
const int CURRENT_PIN = A1;
const int BATTERY_SOC_PIN = A2;
const int LUX_SENSOR_PIN = A3;

// 데이터 전송 주기 (밀리초)
const unsigned long SEND_INTERVAL = 5000; // 5초
unsigned long lastSendTime = 0;

void setup() {
  Serial.begin(115200);

  // WiFi 연결
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  unsigned long currentMillis = millis();

  // 주기적 데이터 전송
  if (currentMillis - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = currentMillis;
    sendSensorData();
  }
}

void sendSensorData() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected, reconnecting...");
    WiFi.reconnect();
    return;
  }

  // 센서 데이터 읽기
  float voltage = readVoltage();
  float current = readCurrent();
  float activePower = voltage * current;
  float batterySoc = readBatterySOC();
  float illuminance = readIlluminance();
  float panelTemp = readTemperature();

  // JSON 생성
  StaticJsonDocument<512> doc;
  doc["deviceId"] = deviceId;

  JsonObject powerMetrics = doc.createNestedObject("power_metrics");
  powerMetrics["voltage_v"] = voltage;
  powerMetrics["current_a"] = current;
  powerMetrics["active_power_w"] = activePower;
  powerMetrics["power_factor"] = 0.98;

  JsonObject batteryMetrics = doc.createNestedObject("battery_metrics");
  batteryMetrics["soc_percent"] = batterySoc;
  batteryMetrics["power_flow_w"] = activePower;
  batteryMetrics["temperature_c"] = 25.0;

  JsonObject environment = doc.createNestedObject("environment");
  environment["illuminance_lux"] = illuminance;
  environment["panel_temp_c"] = panelTemp;

  String jsonString;
  serializeJson(doc, jsonString);

  // HTTP POST 전송
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-API-Key", apiKey);

  int httpResponseCode = http.POST(jsonString);

  if (httpResponseCode > 0) {
    Serial.printf("✓ Data sent successfully, response code: %d\n", httpResponseCode);
    String response = http.getString();
    Serial.println(response);
  } else {
    Serial.printf("✗ Error sending data: %s\n", http.errorToString(httpResponseCode).c_str());
  }

  http.end();
}

// 센서 읽기 함수들 (실제 센서에 맞게 구현)
float readVoltage() {
  int raw = analogRead(VOLTAGE_PIN);
  return (raw / 4095.0) * 3.3 * 100; // 예시 변환
}

float readCurrent() {
  int raw = analogRead(CURRENT_PIN);
  return (raw / 4095.0) * 5.0; // 예시 변환
}

float readBatterySOC() {
  int raw = analogRead(BATTERY_SOC_PIN);
  return (raw / 4095.0) * 100.0;
}

float readIlluminance() {
  int raw = analogRead(LUX_SENSOR_PIN);
  return (raw / 4095.0) * 100000.0;
}

float readTemperature() {
  return 25.0 + random(-5, 10); // 임시 값
}
```

### Arduino 필수 라이브러리

```bash
# Arduino IDE Library Manager에서 설치
- WiFi (ESP32/ESP8266 보드 패키지에 포함)
- HTTPClient (기본 제공)
- ArduinoJson (v6.x)
```

---

## 프론트엔드 연동

### 1. API 클라이언트 서비스 (src/services/api.js)

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3002';

// HTTP API 클라이언트
export const sensorAPI = {
  // 최신 데이터 가져오기
  getLatestData: async (deviceId) => {
    const response = await fetch(`${API_BASE_URL}/sensor/latest/${deviceId}`);
    if (!response.ok) throw new Error('Failed to fetch latest data');
    return response.json();
  },

  // 이력 데이터 가져오기
  getHistoryData: async (deviceId, startTime, endTime) => {
    const params = new URLSearchParams();
    if (startTime) params.append('startTime', startTime);
    if (endTime) params.append('endTime', endTime);

    const response = await fetch(
      `${API_BASE_URL}/sensor/history/${deviceId}?${params}`
    );
    if (!response.ok) throw new Error('Failed to fetch history data');
    return response.json();
  },

  // 대시보드 통계
  getDashboardStats: async (deviceId) => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats/${deviceId}`);
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  },
};

// WebSocket 클라이언트
export class SensorWebSocket {
  constructor(deviceId) {
    this.deviceId = deviceId;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.listeners = new Map();
  }

  connect() {
    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      console.log('✓ WebSocket connected');
      this.reconnectAttempts = 0;

      // 디바이스 구독
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        deviceId: this.deviceId,
      }));
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.emit(message.type, message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('✗ WebSocket disconnected');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(), this.reconnectDelay);
    } else {
      console.error('Max reconnect attempts reached');
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
```

### 2. Dashboard.jsx에서 WebSocket 사용

```javascript
import { useEffect, useState } from 'react';
import { sensorAPI, SensorWebSocket } from './services/api';

function Dashboard() {
  const [sensorData, setSensorData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const deviceId = 'SOLAR_PANEL_01';

  useEffect(() => {
    // 초기 데이터 로드
    const loadInitialData = async () => {
      try {
        const data = await sensorAPI.getLatestData(deviceId);
        setSensorData(data);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();

    // WebSocket 연결
    const ws = new SensorWebSocket(deviceId);

    ws.on('connection', (message) => {
      console.log('Connected:', message);
      setIsConnected(true);
    });

    ws.on('sensor_data', (message) => {
      console.log('Real-time data received:', message.data);
      setSensorData(message.data);
    });

    ws.connect();

    // 클린업
    return () => {
      ws.disconnect();
      setIsConnected(false);
    };
  }, [deviceId]);

  return (
    <div className="dashboard">
      <div className="connection-status">
        {isConnected ? '🟢 실시간 연결' : '🔴 연결 끊김'}
      </div>

      {sensorData && (
        <div className="sensor-metrics">
          <h2>전력 정보</h2>
          <p>전압: {sensorData.power_metrics.voltage_v}V</p>
          <p>전류: {sensorData.power_metrics.current_a}A</p>
          <p>전력: {sensorData.power_metrics.active_power_w}W</p>

          <h2>배터리 정보</h2>
          <p>충전률: {sensorData.battery_metrics.soc_percent}%</p>
          <p>온도: {sensorData.battery_metrics.temperature_c}°C</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
```

### 3. 환경 변수 설정 (.env.local)

프론트엔드 프로젝트 루트에 `.env.local` 파일 생성:

```env
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3002
```

---

## 배포 및 운영

### 1. 서버 실행

```bash
# 개발 모드 (nodemon)
npm run dev

# 프로덕션 모드
npm start
```

### 2. PM2로 프로세스 관리 (프로덕션)

```bash
# PM2 설치
npm install -g pm2

# 서버 실행
pm2 start src/server.js --name solar-api

# 자동 재시작 설정
pm2 startup
pm2 save

# 로그 확인
pm2 logs solar-api

# 모니터링
pm2 monit
```

### 3. Docker 배포 (선택사항)

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001 3002

CMD ["node", "src/server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: solar_charging

  api:
    build: .
    ports:
      - "3001:3001"
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/solar_charging
    depends_on:
      - mongodb
    restart: unless-stopped

volumes:
  mongodb_data:
```

실행:

```bash
docker-compose up -d
```

### 4. 로깅 및 모니터링

추가 패키지 설치:

```bash
npm install winston winston-daily-rotate-file
```

Logger 설정 (src/config/logger.js):

```javascript
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

---

## 다음 단계

1. **Firebase 마이그레이션 계획**
   - Firestore로 데이터 이전
   - Firebase Functions로 서버 전환
   - Firebase Authentication 구현

2. **고급 기능 추가**
   - 데이터 집계 및 분석 API
   - 알림 시스템 (이메일, Push)
   - 사용자 인증 및 권한 관리

3. **성능 최적화**
   - Redis 캐싱 레이어 추가
   - API Rate Limiting
   - 데이터 압축 및 최적화

4. **보안 강화**
   - HTTPS/WSS 적용
   - API Key 관리 개선
   - 입력 데이터 검증 강화

---

## 문제 해결

### MongoDB 연결 실패

```bash
# MongoDB 실행 확인
brew services list | grep mongodb

# MongoDB 재시작
brew services restart mongodb-community
```

### WebSocket 연결 오류

- CORS 설정 확인
- 방화벽 포트 열림 확인 (3002)
- 클라이언트 URL 확인

### Arduino 데이터 전송 실패

- WiFi 연결 상태 확인
- API Key 일치 확인
- 서버 URL 및 포트 확인
- Serial Monitor로 로그 확인

---

## 참고 자료

- [Express.js 공식 문서](https://expressjs.com/)
- [MongoDB 가이드](https://www.mongodb.com/docs/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [ESP32 WiFi 라이브러리](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/wifi.html)
- [ArduinoJson 라이브러리](https://arduinojson.org/)

---

**작성자**: goodjwon
**최종 수정**: 2025-12-14
