import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Protect } from "@clerk/clerk-react";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Translator from "./pages/Translator/Translator";
import NoData from "./components/NoData/NoData";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/translator" replace />} />
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
        </Routes>
      </Router>
    </>
  );
}

export default App;
