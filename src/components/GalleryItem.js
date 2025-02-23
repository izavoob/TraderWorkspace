import React from 'react';
import { Link } from 'react-router-dom';

function GalleryItem({ title, path }) {
  return (
    <Link to={path} className="gallery-item">
      <div>{title}</div>
    </Link>
  );
}

export default GalleryItem;