import React, { useRef } from 'react';
import '../Card/card.css';
const ZoomImage = ({src}) => {
  const zoomRef = useRef(null);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = zoomRef.current.getBoundingClientRect();

    const x = clientX - left;
    const y = clientY - top;

    const centerX = width / 2;
    const centerY = height / 2;

    const translateX = (centerX - x) * 0.05;
    const translateY = (centerY - y) * 0.05;

    zoomRef.current.style.transformOrigin = `${x}px ${y}px`;
    zoomRef.current.style.transform = `scale(1.5) translate(${translateX}px, ${translateY}px)`;
  };

  const handleMouseLeave = () => {
    zoomRef.current.style.transform = 'scale(1)';
  };

  return (
    <div
      className="zoom"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={zoomRef}
    >
      <img src={src} alt="Zoomable Image" />
    </div>
  );
};

export default ZoomImage;
