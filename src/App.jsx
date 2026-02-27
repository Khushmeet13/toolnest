import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
import MainLayout from "./layout/MainLayout";
import Generators from "./pages/Generators";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Main Layout */}
        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />
          <Route path="/generators" element={<Generators />} />
          {/* <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> */}

        </Route>

      </Routes>
    </BrowserRouter>
  );
}
