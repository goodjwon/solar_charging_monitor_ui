# 🎨 Solar Charging Monitor - Design System Guide

## **1. Design Concept: "Eco-Futurism"**
자연 친화적인 에너지(Eco)와 첨단 기술(Tech)이 결합된 느낌을 지향합니다.
단순한 데이터 표시를 넘어, 살아있는 유기체처럼 반응하는 인터페이스를 제공합니다.

*   **Keywords:** Clean, Glowing, Translucent, Dynamic
*   **Style:** **Glassmorphism (글래스모피즘)** + **Neon Accents**
    *   배경은 깊이감 있는 어두운 톤
    *   카드는 반투명한 유리 질감 (Blur 효과)
    *   데이터와 상태는 선명한 네온 컬러로 강조

---

## **2. Color Palette**

### **Background (Deep Space)**
깊이감을 주는 어두운 그라데이션 배경을 사용하여 네온 컬러가 돋보이게 합니다.
*   **Main BG:** `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)` (Deep Slate)
*   **Card BG:** `rgba(255, 255, 255, 0.05)` (White with 5% opacity)
*   **Card Border:** `rgba(255, 255, 255, 0.1)`

### **Accent Colors (Neon Energy)**
각 에너지 상태를 직관적으로 나타내는 형광색을 사용합니다.
*   **Solar (Generation):** `#FDB813` (Sunlight Yellow) → `#FFD700` (Gold Glow)
*   **Battery (Storage):** `#00E676` (Matrix Green) → `#69F0AE` (Soft Green)
*   **Consumption (Load):** `#FF4081` (Cyber Pink) → `#F50057` (Deep Pink)
*   **Text (Primary):** `#FFFFFF` (Pure White)
*   **Text (Secondary):** `#94A3B8` (Cool Grey)

---

## **3. Typography**

가독성이 좋으면서도 현대적인 산세리프 폰트를 사용합니다.
*   **Font Family:** `'Inter', system-ui, sans-serif`
*   **Headings:** Bold / 700 weight (강조된 숫자)
*   **Body:** Regular / 400 weight (설명 텍스트)
*   **Monospace:** `'JetBrains Mono'` (데이터 값, 로그 등 기술적인 느낌 강조)

---

## **4. UI Components**

### **A. Glass Cards (유리 카드)**
모든 위젯은 유리 위에 떠 있는 듯한 느낌을 줍니다.
```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}
```

### **B. Glowing Gauges (빛나는 게이지)**
단순한 선이 아니라, 데이터 값에 따라 은은하게 빛나는 효과(Drop Shadow)를 추가합니다.
*   발전량이 높을수록 태양 아이콘과 게이지가 더 강하게 빛납니다.

### **C. Animated Flow (흐르는 에너지)**
에너지의 이동을 보여주는 연결선은 단순한 실선이 아니라, **빛의 입자가 이동하는 애니메이션**을 적용합니다.
*   SVG Stroke Dasharray 애니메이션 사용
*   속도는 전력량(W)에 비례하여 빨라지거나 느려짐

---

## **5. Micro-Interactions**

*   **Hover Effects:** 카드 위에 마우스를 올리면 살짝 떠오르며(`transform: translateY(-5px)`), 테두리가 밝아집니다.
*   **Data Updates:** 숫자가 바뀔 때 바로 바뀌지 않고, 카운트업(Count-up) 애니메이션으로 부드럽게 변경됩니다.
*   **Click Feedback:** 버튼 클릭 시 물결 효과(Ripple)와 함께 부드럽게 눌리는 느낌을 줍니다.

---

## **6. Layout Structure**

*   **Grid System:** CSS Grid를 사용하여 반응형으로 배치합니다.
    *   **Desktop:** 3단 레이아웃 (좌: 발전, 중: 배터리, 우: 소비) 또는 대시보드 형태
    *   **Mobile:** 스크롤 가능한 1단 카드 리스트
*   **Spacing:** 넉넉한 여백(Padding, Gap)을 주어 답답하지 않고 시원한 느낌을 줍니다.
