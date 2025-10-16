import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "@fortawesome/fontawesome-free/css/all.min.css";
import "animate.css";


import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <AppRoutes />
    </div>
  );
}

export default App;




