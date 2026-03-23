# Friendly Dev Frontend Website

This is a portfolio and blog website built as part of the **"Modern React From The Beginning"** course. It is a **React Router v7 Framework** app that demonstrates modern React best practices.

It includes:

- A dynamic **Projects Page** with filtering, sorting, and pagination.
- A **Blog Section** powered by content from a **Strapi Headless CMS**.
- Fully responsive UI using **Tailwind CSS**.

The projects and blog posts are managed via a Strapi backend. The backend code is available in a separate repo: [Strapi Repo](https://github.com/tassos-venetikidis/friendly-dev-backend)

---

## 🚀 Features

- React Router v7
- Fetching content from Strapi CMS
- Dynamic route-based pages
- Filtering and pagination for projects
- Blog post metadata loading
- Environment-based config with `.env`
- Deployed-API friendly

---

## 🛠️ Setup & Usage

### 1. Start or Deploy the Strapi API

Make sure your Strapi backend is running either locally (`http://localhost:1337`) or deployed (e.g., on Render, Railway, etc.)

### 2. Create a `.env` file

Create a `.env` file in the root and add your API base URL:

```
VITE_API_URL="http://localhost:1337/api"
VITE_STRAPI_URL="http://localhost:1337"
```

### 3. Install Dependencies

```bash
npm install
```

4. Run the App

```bash
npm run dev
```

Tassos Venetikidis, March 2026.
