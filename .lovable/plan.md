

# MindGuard – AI Powered Cognitive Load & Burnout Early Detection System

## Design System
- **Dark premium theme**: Deep black/brown background with subtle amber/orange gradient glows
- **Glassmorphism cards**: Semi-transparent backgrounds with backdrop blur and soft borders
- **Typography**: Large, modern, clean fonts with amber/orange accent colors
- **Animations**: Smooth fade-in, slide, hover scale, and pulse effects throughout
- **Buttons**: Rounded pill-shaped with amber/orange gradients
- **Mobile-first**: All pages optimized for mobile with responsive desktop layout

## Pages & Features

### 1. Landing Page
- Hero section with ambient gradient glow background (inspired by the "Discover Inner Peace" reference)
- Title: "Understand Your Stress. Prevent Burnout. Improve Life."
- Two pill buttons: "Get Started" → Register, "Sign In" → Login
- Subtle floating animations

### 2. Auth Pages (Login & Register)
- Glassmorphism card form on dark background with amber arc glow (per reference)
- **Login**: Email + Password fields, link to Register
- **Register**: Full Name, Email, Password, Confirm Password, Gender, DOB (auto-calculates age), City, Country
- Connects to Supabase Auth (email/password only)
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### 3. Role Selection
- Two glassmorphism cards: **Student** / **Employee**
- Selecting a role reveals role-specific fields:
  - Student: College, Course, Year
  - Employee: Company, Role, Department, Work Type
- Data saved via API call to backend

### 4. Health Profile Setup
- Form with: Height, Weight, Blood Group, BP, Pulse, Optional Health Notes
- Submitted to backend, then navigates to Dashboard

### 5. Dashboard
- Greeting header ("Hey, [Name]") with avatar
- Glassmorphism metric cards: Daily Check-in, Burnout Risk Today, Weekly Report, Monthly Report, Chat with AI, Wellness Programs
- **Burnout Meter**: Curved gauge from Green → Yellow → Red showing current risk level
- Quick-access navigation to all features

### 6. Daily Check-in
- Slider inputs (1–10) for: Fatigue, Stress
- Number inputs for: Sleep Hours, Work Hours, Study Hours, Screen Time, Social Media Hours
- On submit → `POST ${VITE_BACKEND_URL}/predict`
- Displays result card: Probability %, Risk Level badge, AI Explanation text

### 7. AI Chatbot
- ChatGPT-style interface with dark bubbles and amber accents (per reference)
- Animated input bar at bottom with send button
- Messages sent via `POST ${VITE_BACKEND_URL}/chat`
- "Analyze My Reports" button → `POST ${VITE_BACKEND_URL}/chat_with_report`
- Markdown rendering for AI responses

### 8. Reports & Analytics
- Tabbed view: Daily / Weekly / Monthly
- Charts (using Recharts): stress trends, sleep patterns, burnout risk over time
- Glassmorphism card containers for each chart

### 9. Wellness Programs
- Curated list of wellness activities in card layout
- Categories like meditation, exercise, breathing exercises
- Static content with premium card design

### 10. Profile Page
- User avatar, name, email display (per reference)
- Stats cards (check-in streak, risk score, etc.)
- Sections: Settings, Help Center, Send Feedback
- Logout button

### 11. Help & Support
- FAQ accordion
- Contact/feedback form
- Links to resources

## Navigation & Routing
- Protected routes (redirect to login if not authenticated)
- Bottom navigation bar on mobile (Dashboard, Check-in, Chat, Reports, Profile)
- Proper flow: Landing → Auth → Role → Health Profile → Dashboard
- Fix: Ensure all form submissions navigate forward correctly

## API Integration Pattern
- All API calls use `VITE_BACKEND_URL` environment variable
- Auth token from Supabase session passed in headers
- No API keys exposed in frontend code
- Reusable API service layer for backend calls

