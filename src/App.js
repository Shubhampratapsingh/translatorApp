import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Protect } from "@clerk/clerk-react";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
// import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Translator from "./pages/Translator/Translator";
import NoData from "./components/NoData/NoData";
// import About from "./pages/About-us/About";
// import Privacy from "./pages/Privacy-Policy/Privacy";
// import Contact from "./pages/Contact-us/Contact";
// import Terms from "./pages/Terms-&-Conditions/Terms";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <Protect fallback={<Navigate to="/login" />}>
                <Dashboard />
              </Protect>
            }
          />
          <Route
            path="/translator"
            element={
              <Protect fallback={<Navigate to="/login" />}>
                <Translator />
              </Protect>
            }
          />
          <Route path="*" element={<NoData title="Page not found" />} />
          {/* <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
           */}
        </Routes>
        {/* <Footer /> */}
      </Router>
    </>
  );
}

export default App;
