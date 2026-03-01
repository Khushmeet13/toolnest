import { useState } from "react";
import HeroSection from '../components/imageTools/HeroSection'
import ImageTabs from '../components/imageTools/ImageTabs'
import ToolDirectorySection from '../components/imageTools/ToolDirectorySection'

const ImageTools = () => {
   const [activeCategory, setActiveCategory] = useState("All");
  return (
    <div>
      <HeroSection />
       <ImageTabs
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <ToolDirectorySection
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
    </div>
  )
}

export default ImageTools
