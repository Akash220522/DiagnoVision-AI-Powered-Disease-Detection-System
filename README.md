# 🧬 Lumina Health AI: Enterprise Healthcare Ecosystem

Lumina Health AI is a futuristic, enterprise-level AI Healthcare Ecosystem designed to revolutionize patient care and clinical workflows. It combines advanced multimodal AI diagnostics with a seamless, blockchain-grade patient experience.

## 🔥 Key Features

- **AI Multi-Disease Diagnosis**: Intelligent detection across 12+ categories (Pneumonia, Brain Tumor, Skin Diseases, etc.) with heatmap visualization and confidence scoring.
- **AI Medical Assistant**: LLM-powered (Gemini) chatbot for symptom analysis, report explanation, and health guidance.
- **Integrated Health Dashboard**: Real-time analytics, medical history timeline, and AI personalized health tips.
- **Professional Report System**: Automated, professional medical PDF generation with clinical observations.
- **Appointment Hub**: Hybrid online/offline consultation management system.
- **Secure Architecture**: Built on Firebase with enterprise-grade security rules and dark glassmorphic UI.

## 🛠 Tech Stack

- **Frontend**: React 19, Tailwind CSS 4, Framer Motion, Lucide Icons, Recharts.
- **Backend Infrastructure**: Express (Node.js) + Firebase Firestore & Auth.
- **AI Engine**: Google Gemini API (@google/genai).
- **ML Training Pipelines**: Python/TensorFlow (provided as backend scripts).
- **Reporting**: jsPDF.

## 📁 Project Structure

```text
/
├── backend/            # Python ML training pipelines & utilities
├── src/
│   ├── components/     # UI components (Header, Sidebar, etc.)
│   ├── pages/          # Feature views (Diagnostics, Assistant, etc.)
│   ├── services/       # API & Firebase logic
│   └── types/          # TypeScript definitions
├── datasets/           # Medical dataset structure
├── firestore.rules     # Secure database gates
└── firebase-blueprint.json # Database architecture
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase Project
- Gemini API Key

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your environment variables in `.env`:
   ```env
   GEMINI_API_KEY=your_key
   ```
4. Start the development environment:
   ```bash
   npm run dev
   ```

### Dataset Preparation
To initialize the 12-disease dataset structure:
```bash
python backend/utils/dataset_manager.py
```

### Model Training
Refer to `backend/training/` for individual disease training scripts.
```bash
python backend/training/train_pneumonia.py
```

## ⚖️ Disclaimer
Lumina Health AI is an experimental AI tool. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.
