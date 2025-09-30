# Kashef - AI Hardware Component Identifier

<p align="center">
  <img src="https://raw.githubusercontent.com/Mod578/Kashef/main/public/favicon.svg" alt="Kashef Logo" width="120">
</p>

<h1 align="center">Kashef (كاشف)</h1>

<p align="center">
  An intelligent web application that instantly identifies PC components using your device's camera and AI, with features for saving and reviewing your scan history.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Google Gemini">
</p>

---

## 🎯 The Goal

The world of PC hardware can be intimidating for newcomers. "Kashef" (Arabic for "Detector" or "Revealer") aims to demystify computer components by providing a simple, visual way to identify parts and understand their purpose.

This project was developed as a final graduation project for the Data Science and Artificial Intelligence diploma at Tuwaiq Academy.

## ✨ Key Features

- **Instant Camera Recognition:** Point your device's camera or upload an image to get immediate component identification.
- **Accurate AI Detection:** Powered by the Google Gemini API with optimized prompts for speed and precision.
- **Comprehensive Details:** Receive a technical summary, key specifications, and a generated image for each identified component.
- **Scan History:** Save your scan results with a custom name and review them anytime.
- **Demo Mode:** Explore the app's capabilities with pre-loaded data for various use cases.
- **Modern UX:** A fully responsive interface with light/dark mode support and interactive loading states.

## 🚀 How It Works

The application captures an image and sends it to the Google Gemini API for analysis. The API processes the image and returns structured JSON data identifying the components. These components are then displayed on an interactive dashboard. When a user selects a component, another API call fetches detailed technical information and generates a photorealistic image of the part.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **State Management:** React Context API
- **AI & Image Generation:**
  - **Google Gemini API (`@google/genai`)**:
    - `gemini-2.5-flash`: For object detection, data extraction, and chat.
    - `imagen-4.0-generate-001`: For generating photorealistic component images.
- **Icons:** React Icons

## 📂 Project Structure

```
/
├── public/
├── src/
│   ├── components/     # React Components
│   ├── constants/      # Prompts, settings, etc.
│   ├── context/        # React Context for state management
│   ├── data/           # Demo mode data
│   ├── hooks/          # Custom React Hooks
│   ├── services/       # Gemini API service wrapper
│   ├── types/          # TypeScript definitions
│   ├── utils/          # Helper functions
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   └── index.css
├── .env.local          # Local environment variables
├── index.html
├── package.json
└── README.md
```

## 👥 Team

- Mohammed Almutairi
- Khalid Alosmani

## ⚙️ Running Locally

To run this application locally, you will need [Node.js](https://nodejs.org/) (v18 or newer), npm, and a Google Gemini API key.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Mod578/Kashef.git
    cd Kashef
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the API Key:**
    - Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    - In the project's root directory, create a new file named `.env.local`.
    - Add the following line, replacing `your_api_key_here` with your actual key:
      ```
      VITE_GEMINI_API_KEY=your_api_key_here
      ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.
