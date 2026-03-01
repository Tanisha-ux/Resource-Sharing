import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import HomePage from "./HomePage.jsx";
import UploadResource from "./UploadResource.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import ResourceDetails from "./pages/ResourceDetails.jsx";
import UpdateResource from "./pages/UpdateResource.jsx";
import "./index.css";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadResource />} />
        <Route path="/resources/:id" element={<ResourceDetails />} />
        <Route path="/admin" element={<AdminDashboard />}/>
        <Route path="/update/:id" element={<UpdateResource/>} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;