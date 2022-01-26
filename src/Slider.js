import React, {useEffect} from "react";
import './slider.css';
import Image1 from './images/image1.png';
import Image2 from './images/image2.png';
import Image3 from './images/image3.png';

let slideIndex = 0

const Slider = () => {

    useEffect(() => {
        showSlides()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const showSlides = () => {
        var i;
        var slides = document.getElementsByClassName("mySlides");
        for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
        }
        slideIndex++
        if (slideIndex > slides.length) {slideIndex = 1}
        slides[slideIndex-1].style.display = "block";
        setTimeout(showSlides, 3000);
    }

    return (
        <div className="slideshow-container">    
          <div className="mySlides fade">
            <img src={Image1} style={{width:'100%'}} alt="" />
          </div>
    
          <div className="mySlides fade">
            <img src={Image2} style={{width:'100%'}} alt="" />
          </div>
    
          <div className="mySlides fade">
            <img src={Image3} style={{width:'100%'}} alt="" />
          </div>
        </div>
    )
}

export default Slider