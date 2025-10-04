# Kashef - AI Hardware Component Identifier

<p align="center">
  <img src="https://raw.githubusercontent.com/Mod578/Kashef/master/public/favicon.svg" alt="Kashef Logo" width="150">
</p>

<h1 align="center">Kashef (كاشف)</h1>

<p align="center">
  An intelligent web application that instantly identifies PC components using your device's camera and AI, providing detailed technical specs and an integrated chat assistant for all your hardware questions.
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

Identifying PC hardware can be a major hurdle for newcomers and hobbyists alike. Kashef (Arabic for "Detector" or "Revealer") simplifies this process into a seamless, three-step experience:

1.  **Scan & Identify:** Use your camera or upload an image to get instant, accurate component identification.
2.  **Get Details:** Review a technical summary, key specs, and a generated image for each part.
3.  **Ask the Expert:** Chat with an integrated AI assistant to ask about compatibility, performance, and more.

This project was developed as a final graduation project for the Data Science and Artificial Intelligence diploma at Tuwaiq Academy.

## ✨ Key Features

- **📸 Instant Camera Recognition:** Analyze PC components in real-time using your device's camera or by uploading images and video files.
- **🧠 Accurate AI Detection:** Powered by the latest Google Gemini models for high-precision component identification and spec extraction.
- **📋 Comprehensive Details:** Get a technical summary and organized key specifications for every detected component.
- **🖼️ Visual Component Rendering:** Generate high-quality, realistic images of detected components using the Imagen 4 model for better understanding.
- **🤖 Integrated AI Assistant:** Ask questions and get accurate answers about components, backed by Google Search for up-to-date information.
- **🎨 Modern & Interactive UI:** A fully responsive interface that supports both light and dark modes for a comfortable user experience.

## 🚀 How It Works

The application sends the captured image to the Google Gemini API, which analyzes it, identifies the components, and returns structured JSON data. This data is then displayed on an interactive dashboard. When a component is selected, the `imagen` model is called to generate an illustrative image, and the chat assistant is initialized with the component's context to provide precise, relevant answers.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **State Management:** React Context API
- **AI & Image Generation (Google Gemini API):**
    -   `gemini-2.5-flash`: For object detection, data extraction, and intelligent chat.
    -   `imagen-4.0-generate-001`: For generating illustrative component images.
- **Icons:** React Icons

## 📂 Project Structure

```
/
├── public/
├── src/
│   ├── components/     # React Components
│   ├── constants/      # Prompts, settings, etc.
│   ├── context/        # React Context for state management
│   ├── hooks/          # Custom React Hooks
│   ├── services/       # Gemini API service wrapper
│   ├── types/          # TypeScript definitions
│   ├── utils/          # Helper functions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
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
    *   Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   In the project's root directory, create a new file named `.env.local`.
    *   Add the following line, replacing `your_api_key_here` with your actual key:
        ```
        VITE_GEMINI_API_KEY=your_api_key_here
        ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

> **Note:** The app is configured to look for `VITE_GEMINI_API_KEY` for local development and `API_KEY` in deployment environments, ensuring flexibility between development and production.

## 🤝 Contributing

Contributions to improve Kashef are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📜 License

This project is licensed under the [MIT License](LICENSE).


## ✨ الميزات الرئيسية

*   **📸 تعرف فوري بالكاميرا:** تحليل مباشر لمكونات الحاسب باستخدام كاميرا الجهاز أو عبر رفع الصور وملفات الفيديو.
*   **🧠 تحديد دقيق بالذكاء الاصطناعي:** استخدام أحدث نماذج Google Gemini لتحديد المكونات بدقة عالية واستخراج مواصفاتها.
*   **📋 تفاصيل فنية شاملة:** الحصول على ملخص تقني ومواصفات رئيسية منظمة لكل مكون يتم اكتشافه.
*   **🖼️ عرض بصري للمكونات:** إنشاء صور واقعية وعالية الجودة للمكونات المكتشفة باستخدام نموذج Imagen 4 لفهم أفضل.
*   **🤖 مساعد ذكي متكامل:** طرح أسئلة والحصول على إجابات دقيقة حول المكونات، مدعومة ببحث Google لضمان حداثة المعلومات.
*   **🎨 تصميم عصري وتفاعلي:** واجهة مستخدم حديثة، متجاوبة بالكامل مع جميع الأجهزة، وتدعم الوضعين الفاتح والداكن لتجربة مريحة.

## 🚀 كيف يعمل

يقوم التطبيق بإرسال الصورة الملتقطة إلى Google Gemini API لتحليلها وتحديد المكونات الظاهرة فيها، ثم يعيدها كبيانات منظمة (JSON) لعرضها في لوحة تحكم تفاعلية. عند اختيار مكون معين، يتم استدعاء نموذج `imagen` لإنشاء صورة توضيحية له، بينما يتم تهيئة مساعد المحادثة بمعلومات المكون المحدد لتقديم إجابات سياقية ودقيقة.

## 🛠️ التقنيات المستخدمة

*   **الواجهة الأمامية:** React, TypeScript, Tailwind CSS, Vite
*   **إدارة الحالة:** React Context API
*   **الذكاء الاصطناعي (Google Gemini API):**
    *   `gemini-2.5-flash`: لكشف العناصر، استخراج البيانات، والمحادثة الذكية.
    *   `imagen-4.0-generate-001`: لإنشاء الصور التوضيحية للمكونات.
*   **الأيقونات:** React Icons

## 📂 بنية المشروع

```
/
├── public/
├── src/
│   ├── components/     # مكونات React
│   ├── constants/      # الثوابت (الموجهات، الإعدادات)
│   ├── context/        # React Context لإدارة الحالة
│   ├── hooks/          # Hooks مخصصة
│   ├── services/       # خدمة التفاعل مع Gemini API
│   ├── types/          # تعريفات TypeScript
│   ├── utils/          # دوال مساعدة
│   ├── App.tsx         # المكون الرئيسي للتطبيق
│   └── main.tsx        # نقطة الدخول للتطبيق
├── index.html
├── package.json
└── README.md
```

## 👥 فريق العمل

*   محمد المطيري (Mohammed Almutairi)
*   خالد العصماني (Khalid Alosmani)

## ⚙️ تشغيل المشروع محلياً

لتشغيل هذا التطبيق محلياً، ستحتاج إلى [Node.js](https://nodejs.org/) (v18 أو أحدث) و npm ومفتاح Google Gemini API.

1.  **استنساخ المستودع:**
    ```bash
    git clone https://github.com/username/kashef.git
    cd kashef
    ```

2.  **تثبيت التبعيات:**
    ```bash
    npm install
    ```

3.  **إعداد مفتاح API:**
    *   احصل على مفتاح API الخاص بك من [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   في المجلد الرئيسي للمشروع، أنشئ ملفًا جديدًا باسم `.env.local`.
    *   أضف السطر التالي إلى الملف، مع استبدال `your_api_key_here` بمفتاحك الفعلي:
        ```
        VITE_GEMINI_API_KEY=your_api_key_here
        ```

4.  **تشغيل خادم التطوير:**
    ```bash
    npm run dev
    ```
    سيقوم هذا بتشغيل التطبيق على عنوان محلي (عادة `http://localhost:5173`). افتح هذا العنوان في متصفحك.

> **ملاحظة:** تم تكوين التطبيق للبحث عن `VITE_GEMINI_API_KEY` للتشغيل المحلي، وعن `API_KEY` في بيئات النشر (Deployment)، مما يضمن المرونة بين التطوير والإنتاج.

## 🤝 المساهمة (Contributing)

نرحب بالمساهمات لتحسين "كاشف"! إذا كنت ترغب في المساهمة، يرجى اتباع الخطوات التالية:

1.  قم بعمل Fork للمستودع.
2.  أنشئ فرعًا جديدًا لميزتك (`git checkout -b feature/AmazingFeature`).
3.  قم بتطبيق تغييراتك (`git commit -m 'Add some AmazingFeature'`).
4.  ادفع إلى الفرع (`git push origin feature/AmazingFeature`).
5.  افتح طلب سحب (Pull Request).

## 📜 الترخيص (License)

هذا المشروع مرخص تحت [رخصة MIT](LICENSE).
