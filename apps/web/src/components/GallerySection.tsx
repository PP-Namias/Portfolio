import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

const galleryImages: GalleryImage[] = [
  { src: "/gallery/work1.jpg", alt: "Working at the office", category: "work" },
  { src: "/gallery/work2.jpg", alt: "Coding and development", category: "work" },
  { src: "/gallery/work3.jpg", alt: "Team collaboration", category: "work" },
  { src: "/gallery/group1.jpg", alt: "Groupie with Friends on Museum", category: "team" },
  { src: "/gallery/group2.jpg", alt: "Group Photo", category: "team" },
  { src: "/gallery/group3.jpg", alt: "The Bredsters", category: "team" },
  { src: "/gallery/group4.jpg", alt: "Outdoor team activity", category: "team" },
  { src: "/gallery/casual1.jpg", alt: "Team collaboration meeting", category: "work" },
  { src: "/gallery/coding1.jpg", alt: "Coding session", category: "work" },
];

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filteredImages = galleryImages.filter(
    (image) => filter === "all" || image.category === filter
  );

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === 0 ? filteredImages.length - 1 : selectedImage - 1
      );
    }
  };

  return (
    <section id="gallery" className="py-20 px-6 bg-gradient-to-br from-background to-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 gradient-text">Gallery</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A glimpse into my professional journey, team collaborations, and moments
            that define my experience in development and innovation.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              filter === "all"
                ? "gradient-bg text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("work")}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              filter === "work"
                ? "gradient-bg text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Work
          </button>
          <button
            onClick={() => setFilter("team")}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              filter === "team"
                ? "gradient-bg text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Team
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white text-lg font-medium">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>
            
            <button
              onClick={prevImage}
              className="absolute left-4 text-white hover:text-gray-300 z-10"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 text-white hover:text-gray-300 z-10"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            <img
              src={filteredImages[selectedImage].src}
              alt={filteredImages[selectedImage].alt}
              className="max-w-full max-h-full object-contain"
            />
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
              <p className="text-lg font-medium">{filteredImages[selectedImage].alt}</p>
              <p className="text-sm text-gray-300">
                {selectedImage + 1} of {filteredImages.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}