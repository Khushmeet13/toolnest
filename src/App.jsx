import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
import MainLayout from "./layout/MainLayout";
import Generators from "./pages/Generators";
import Converters from "./pages/Converters";
import ImageTools from "./pages/ImageTools";
import DevTools from "./pages/DevTools";
import About from "./pages/About";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Main Layout */}
        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />
          <Route path="/generators" element={<Generators />} />
          <Route path="/converters" element={<Converters />} />
          <Route path="/image-tools" element={<ImageTools />} />
           <Route path="/dev-tools" element={<DevTools />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/contact" element={<Contact />} /> */}

        </Route>

      </Routes>
    </BrowserRouter>
  );
}
