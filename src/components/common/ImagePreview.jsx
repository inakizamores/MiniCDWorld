const ImagePreview = ({ image, alt, aspectRatio }) => {
  // Determine if this is a thin image
  const isThinImage = aspectRatio && aspectRatio.width / aspectRatio.height < 0.2;
  
  return (
    <div className={`image-preview ${isThinImage ? 'thin-image' : ''}`}>
      {image && <img src={image} alt={alt || 'Image preview'} />}
    </div>
  );
}; 