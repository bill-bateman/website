import React from "react"

const MyImage = ({src, alt}) => (
    //having some issues with gatsby scaling vertical images weird, so using this instead
    <div style={{textAlign: "center"}}>
        <img style={{maxWidth: 650}} src={src} alt={alt}/>
    </div>
)
export default MyImage;