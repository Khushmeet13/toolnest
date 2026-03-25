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
import Blog from "./pages/Blog";
import ContentDescription from "./components/blog/ContentDescription";
import Contact from "./pages/Contact";
import PrivacyPage from "./pages/PrivacyPage";
import Terms from "./pages/TermsPage";
import Changelog from "./pages/Changelog";
import Roadmap from "./pages/Roadmap";
import FAQPage from "./pages/FAQPage";
import GeneratorSinglePage from "./components/generators/GeneratorSinglePage";
import ConverterSinglePage from "./components/converters/ConverterSinglePage";

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
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<ContentDescription />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/faq" element={<FAQPage />} />

          <Route path="/generators/:slug" element={<GeneratorSinglePage />} />
          <Route path="/converters/:slug" element={<ConverterSinglePage />} />


          {/* <Route path="/contact" element={<Contact />} /> */}

        </Route>

      </Routes>
    </BrowserRouter>
  );
}
