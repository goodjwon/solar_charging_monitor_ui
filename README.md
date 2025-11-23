# ☀️ Solar Charging Monitor UI

실시간 태양광 충전 모니터링 대시보드 - Arduino 기반 태양광 발전 시스템을 위한 웹 인터페이스

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?logo=chartdotjs)

## 📋 프로젝트 개요

"나만의 작은 발전소를 한눈에" - Arduino 기반 태양광 충전 키트의 에너지 생산, 저장, 소비를 실시간으로 시각화하는 웹/모바일 대시보드입니다.

### 주요 기능

- ⚡ **실시간 에너지 흐름 시각화** - 태양광 → 배터리 → 부하 간 전력 흐름을 애니메이션으로 표현
- 📊 **핵심 지표 모니터링** - 발전량, 배터리 상태, 소비 전력, 시스템 효율
- 📈 **이력 데이터 차트** - 24시간/월별/연도별/누적 발전량 그래프
- 🌲 **환경 영향 분석** - CO2 절감량, 나무 심기 효과, 에너지 자립률
- 📝 **시스템 로그** - 이벤트 타임라인 및 알림
- 🖥️ **풀스크린 모드** - 대형 모니터 전시용 전체화면 지원

## 🚀 빠른 시작

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone git@github.com:goodjwon/solar_charging_monitor_ui.git
cd solar_charging_monitor_ui

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5174` 접속

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 🎨 디자인 시스템

**Material Design** 기반의 다크 테마

- **Primary Color**: Cyan (#00bcd4)
- **Accent Color**: Pink (#ff4081)
- **Success**: Green (#4caf50)
- **Warning**: Orange (#ff9800)

## 📦 기술 스택

- **Frontend Framework**: React 18
- **Build Tool**: Vite 7
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: react-icons (Material Design)
- **Styling**: CSS (Material Design theme)
- **Font**: Google Fonts (Roboto)

## 📁 프로젝트 구조

```
solar_charging_monitor_ui/
├── _reference/              # 참조 문서 및 프로토타입
│   ├── design_guide.md
│   ├── project_requirements.md
│   └── solar_dashboard (1).html
├── src/
│   ├── Dashboard.jsx        # 메인 대시보드 컴포넌트
│   ├── Dashboard.css        # 대시보드 스타일
│   ├── App.jsx             # 루트 컴포넌트
│   ├── index.css           # 글로벌 스타일
│   └── main.jsx            # 엔트리 포인트
├── public/
├── package.json
└── vite.config.js
```

## 🔧 향후 개발 계획

### Phase 1: 백엔드 연동
- [ ] GCP Cloud Functions API 연결
- [ ] Firestore 데이터베이스 연동
- [ ] WebSocket 실시간 데이터 스트리밍

### Phase 2: 인증 및 보안
- [ ] Firebase Authentication 구현
- [ ] 장치 API Key 인증
- [ ] 사용자 권한 관리

### Phase 3: 고급 기능
- [ ] 날씨 API 연동 (발전 예측)
- [ ] 데이터 내보내기 기능
- [ ] 알림 시스템
- [ ] 설정 패널

## 📊 데이터 포맷

시스템은 다음과 같은 JSON 형식의 데이터를 처리합니다:

```json
{
  "deviceId": "SOLAR_PANEL_01",
  "timestamp": "2025-10-08T16:13:03.326859+09:00",
  "power_metrics": {
    "voltage_v": 221.4,
    "current_a": 2.3,
    "active_power_w": 497.64,
    "power_factor": 0.978
  },
  "battery_metrics": {
    "soc_percent": 44.35,
    "power_flow_w": -475.43,
    "temperature_c": 27.63
  },
  "environment": {
    "illuminance_lux": 54715.35,
    "panel_temp_c": 38.22
  }
}
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License

## 👤 작성자

**goodjwon**

- GitHub: [@goodjwon](https://github.com/goodjwon)

## 🙏 감사의 말

- Chart.js 팀
- React 커뮤니티
- Material Design 가이드라인

---

⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!
