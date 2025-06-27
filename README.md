# 📊 Momentum

Momentum is a sleek, modern web application designed to help you build and track your daily focus habits. It's a personal dashboard for visualizing effort, maintaining streaks, and turning intention into consistent, measurable progress.

**[➡️ View Live Demo](https://matinkhorshidi.github.io/Momentum/)**

![Momentum App Screenshot](![alt text](AppScreenshot.png))

## ✨ Features

Momentum is more than just a timer; it's a complete ecosystem for focus and productivity.

- **User Authentication**: Secure sign-up and login functionality powered by Supabase Auth.
- **Dynamic Focus Tracking**: Add "blocks" of focus for different categories throughout your day.
- **Customizable Categories**: Full CRUD (Create, Read, Update, Delete) functionality for your focus areas.
  - Change names and colors.
  - Reorder categories with drag-and-drop.
- **Habit Routines & Streaks**:
  - Define **daily** or **weekly** recurring goals for any category.
  - A dedicated "Today's Routines" card tracks pending and completed habits.
  - A **streak counter** motivates you to stay consistent.
- **Interactive Activity Chart**: A beautiful, stacked bar chart (built with Recharts) visualizes your effort over the last 7 or 30 days.
- **Focus Session Timer**: A modern, Pomodoro-style timer with a circular progress bar and customizable durations to help you get into a state of deep work.
- **Advanced Statistics**: See your "Grand Tally" of total focus units and a breakdown of units per category.
- **Complete History**: "The Logbook" provides a detailed, expandable record of your past achievements.
- **Modern, Animated UI**: The interface is built with a minimalist dark theme and brought to life with smooth, purposeful animations using Framer Motion.
- **Data Portability**: Easily export your entire user data to a JSON file for backup or import it back into the app.
- **Persistent Cloud Data**: All user data, categories, and logs are securely saved to a Supabase database.

## 🛠️ Tech Stack & Key Packages

This project was built with a modern, professional frontend stack.

- **Core Framework**: [React](https://reactjs.org/) (with Vite)
- **Backend & Auth**: [Supabase](https://supabase.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Charting**: [Recharts](https://recharts.org/)
- **UI Positioning (Pop-overs)**: [Floating UI](https://floating-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [GitHub Pages](https://pages.github.com/) (using the `gh-pages` package)

## 🚀 Getting Started

To run this project locally on your machine, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/](https://github.com/matinkhorshidi/Momentum.git
    cd Momentum
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Supabase environment variables:**

    - Copy the example environment file. In your terminal, run:
      ```bash
      cp .env.example .env
      ```
    - Open the new `.env` file.
    - Log in to your [Supabase account](https://app.supabase.io) and find your Project URL and `anon` public key in _Project Settings > API_.
    - Replace the placeholder values in `.env` with your actual Supabase credentials.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:5173` (or another port if 5173 is in use).

## 📋 How to Use the App

1.  **Sign Up / Login**: Your session is securely saved.
2.  **Customize Your World**: Go to the "Your Focus Areas" card. Click "Edit" to rename the default categories or click "+ Add new..." to create your own. Pick a name and a color that suits you.
3.  **Build Habits**: Click the `📅` icon next to a category to open the routine pop-over. Set a daily or weekly goal to build consistency.
4.  **Track Your Work**: As you complete a block of work (e.g., a 45-minute study session), click the corresponding `+ Category` button in the "Alright, what's the mission for today?" card.
5.  **Stay Focused**: Use the "Focus Session" timer to commit to uninterrupted deep work.
6.  **Watch Your Progress**: See your "Today's Routines" get checked off automatically, your streaks increase, and your "Recent Activity" chart grow taller each day!

---
