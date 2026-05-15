# 🥗 SmartPlate AI (Flavor Fusion)

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/Groq-FF5722?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Groq AI">
</p>

---

## 🌟 Overview
**SmartPlate AI** is a premium, full-stack nutrition and wellness ecosystem designed to bridge the gap between medical needs and culinary delight. Using **Groq's Llama 3.3** and a robust **Supabase Relational Database**, it generates clinically-backed meal plans tailored to specific health conditions, dietary preferences, and real-time metabolic tracking.

**Live Demo:** [https://flavor-fusion-nine.vercel.app/](https://flavor-fusion-nine.vercel.app/)

## ✨ Key Features

-   🤖 **AI Meal Generation**: Personalized 1-day meal plans focused on Medical Nutrition Therapy (MNT).
-   🔐 **Full Auth Persistence**: Secure login/signup via Supabase with automatic onboarding recovery.
-   🗄️ **Relational Persistence**: Cloud-synced tracking for biometrics, meal plans, and individual meal completions.
-   📊 **Clinical Dashboard**: Real-time BMI calculation, metabolic parameter tracking, and macro precision.
-   🥗 **Dietary Flexibility**: Switch between Jain, Keto, Vegan, Mediterranean, and more on-the-fly with AI re-syncing.
-   📈 **Streak Tracking**: Built-in gamification that tracks daily completion goals and historical streaks.
-   💬 **AI Nutritionist**: A 24/7 chat assistant for expert clinical dietary advice.

## 🚀 Tech Stack

-   **Frontend**: React 18, Vite, TypeScript
-   **Backend/DB**: Supabase (PostgreSQL, Auth, RLS)
-   **AI Engine**: Groq API (Llama-3.3-70b-versatile)
-   **Animations**: Framer Motion
-   **UI Components**: Shadcn UI, Lucide Icons, Recharts

## 🛠️ Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Draavith-DNA/Flavor_fusion.git
    cd flavor-fusion-plans
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    VITE_GROQ_API_KEY=your_groq_api_key
    ```

4.  **Database Setup**:
    Run the following script in your **Supabase SQL Editor** to initialize the relational schema:
    ```sql
    -- Full Schema Initialization available in docs/db_schema.sql
    ```

5.  **Run Locally**:
    ```bash
    npm run dev
    ```

## 📂 Database Schema (Relational)

The application uses a normalized PostgreSQL structure for maximum efficiency:
-   **`profiles`**: Master user identity and onboarding status.
-   **`biometrics`**: Specialized table for physical health metrics.
-   **`meal_plans`**: Historical log of all AI-generated plan sessions.
-   **`meals`**: Granular tracking of every meal's macros and completion status.

## 🤝 Contributing

Contributions are welcome! Please fork the project and open a pull request for any major changes.

## 📄 License

Distributed under the MIT License.

---

<p align="center">
  Built with ❤️ for Clinical Excellence.
</p>
