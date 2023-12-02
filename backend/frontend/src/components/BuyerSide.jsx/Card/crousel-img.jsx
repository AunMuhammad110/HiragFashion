import React, { useState } from 'react';
import './card.css'
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (index) => {
    setCurrentIndex(index);
  };

  return (
    <Carousel
      selectedItem={currentIndex}
      onChange={handleSwipe}
      emulateTouch
      showArrows={false} // Optional: Hide navigation arrows
      showStatus={false} // Optional: Hide status indicator
      showThumbs={false} // Optional: Hide thumbnail navigation
    >
      {images.map((image, index) => (
        <div className='image-carousel' key={index}>
          <img src={image} alt={`Image ${index}`} />
        </div>
      ))}
    </Carousel>
  );
};

export default ImageCarousel;
