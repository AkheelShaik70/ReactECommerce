# LuxeMart — Single Page E-Commerce Application (React + Vite + Tailwind CSS)

## 1. Terminal Commands to Initialize & Install Dependencies
```bash
# Create Vite + React (JavaScript) project
npm create vite@latest luxe-mart-spa -- --template react
cd luxe-mart-spa

# Install core dependencies (React Router DOM v6+ and Axios)
npm install react-router-dom axios

# Install Tailwind CSS and PostCSS peer dependencies
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Start the development server
npm run dev
```

## 2. Project Folder Structure
```text
luxe-mart-spa/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    ├── api/
    │   └── axiosInstance.js
    ├── context/
    │   └── CartContext.jsx
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── ProductCard.jsx
    │   └── Skeletons.jsx
    └── pages/
        ├── Home.jsx
        ├── ProductDetails.jsx
        ├── Cart.jsx
        └── NotFound.jsx
```
