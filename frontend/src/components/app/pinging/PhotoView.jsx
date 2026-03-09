import React from "react";

const PhotoView = ( image ) => {
    return(
        <div className="photo-view">
            <img src={image} alt="Image" />
        </div>
    );
};

export default PhotoView;