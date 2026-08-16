# ShortLink - Production Frontend

A modern, developer-focused SaaS frontend for the high-performance URL Shortener backend (built with Express, Redis, MongoDB, and BullMQ).

## 🚀 Features

- **⚡ Lightning-Fast URL Shortener**: Create short links with auto-generated collision-free 6-character codes or custom branded aliases.
- **🔐 Secure Authentication**: Integrated with HTTP-only JWT cookies (`/signup`, `/login`, `/logout`) and route protection.
- **📊 Real-time Analytics Visualizer**:
  - Total clicks & 24-hour traffic metrics.
  - Unique visitors calculation (distinct IP tracking).
  - 5-day daily click timeline graph with interactive SVG bars and tooltips.
  - Top 5 referral sources with percentage distribution bars.
- **📁 Dashboard Console**: Search by shortCode or destination URL, sort by newest/oldest/alphabetical, delete links with confirmation modal, and refresh metrics.
- **🛡️ Rate Limiting Awareness**: Handled gracefully with meaningful toast alerts on 429 status.
- **🎨 Modern Dark SaaS Aesthetics**: Glassmorphic styling, custom glowing gradients, responsive layout for mobile and desktop, accessible keyboard navigation.

---

## 🛠️ Technology Stack

- **React 18**
- **Vite 6**
- **React Router DOM 6**
- **Axios** (with interceptors and `withCredentials: true`)
- **Lucide React** (modern iconography)
- **Vanilla CSS** with a custom design system and tokens

---

## ⚙️ Environment Configuration

Create a `.env` file in the `frontend/` directory (see `.env.example`):

```env
# URL of the backend Express API (default: http://localhost:3000)
VITE_API_URL=http://localhost:3000

# Base URL used for generated short links
VITE_SHORT_URL_BASE=http://localhost:3000
```

---

## 💻 Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The frontend will start at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
```

---

## 🔌 Backend API Integration Contract

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/signup` | No | Creates a new user account `{ username, password }` |
| `POST` | `/login` | No | Authenticates user `{ username, password }`, sets HTTP-only `token` cookie |
| `POST` | `/logout` | No | Clears `token` cookie |
| `POST` | `/shorten` | **Yes** | Generates short URL `{ url, custom? }` |
| `GET` | `/my-urls` | **Yes** | Returns all URLs created by the authenticated user |
| `DELETE` | `/delete/:code` | **Yes** | Deletes a short link owned by the user |
| `GET` | `/analytics/:shortCode` | **Yes** | Returns click metrics, 5-day timeline, and top referrers |
| `GET` | `/:code` | No | Backend 302 redirect & BullMQ click tracking |
