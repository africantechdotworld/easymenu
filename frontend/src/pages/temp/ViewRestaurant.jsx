import { React, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './styles/Restaurant.css';
import photo1 from '../assets/images/2149357853.jpg';
import photo2 from '../assets/images/bibimbap.png';
import burgers from '../assets/images/170302153529-garlic-crab.jpg';
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import badge from '../assets/images/badge.png';
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const ViewRestaurant = () => {
    const [isMobile, setIsMobile] = useState(true);
    const navigate = useNavigate();
  
    const goTo = (location, data) => {
        navigate(location);
    };

    return (
        <>
            <div className="v-container">
                <div className="v-header">
                    <div className="n-item" onClick={ () => goTo('/', null) }>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </div>
                    <nav>
                        <div className="n-item" onClick={ () => goTo('/', null) }>
                            <FontAwesomeIcon icon={faHouse} />
                        </div>
                        <div className="n-item" onClick={ () => goTo('/favourites', null) }>
                            <FontAwesomeIcon icon={faHeart} />
                        </div>
                    </nav>
                </div>
                <div className="profile-container">
                    <div className="photo-box">
                        <img className="c-photo" src={photo1} alt="" />
                        <div className="p-photo">
                            <img className="" src={photo2} alt="" />
                        </div>
                        <div className="c-details">
                            <h1>Oreo Bite and Spice</h1>
                            <div className="cta-buttons">
                                <p onClick={ () => goTo('/about-business', null)}> More Info<FontAwesomeIcon icon={faCircleInfo} /></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="m-container">
                    <div className="specials">
                        <h2>Specials</h2>
                        <div className="specials-body">
                            <div className="category-card">
                                <img src={burgers} alt="Product" />
                                <h2 class="category-title">Offer 1</h2>
                                <img src={badge} className="badge" alt="specials" />
                            </div>
                            <div className="category-card">
                                <img src={burgers} alt="Product" />
                                <h2 class="category-title">Offer 2</h2>
                                <img src={badge} className="badge" alt="specials" />
                            </div>
                            <div className="category-card">
                                <img src={burgers} alt="Product" />
                                <h2 class="category-title">Offer 3</h2>
                                <img src={badge} className="badge" alt="specials" />
                            </div>
                        </div>
                    </div>
                    <div className="categories">
                        <h2>Menu</h2>
                        <div className="search">
                            <input type="text" name="search" placeholder="Search Oreo Bite and Spice" />
                        </div>
                        <div className={isMobile ? "cat-container" : "cat-body"}>
                            {
                                !isMobile ? (
                                    <>

                                        <div className="category-card">
                                            <img src={burgers} alt="Product" />
                                            <h2 class="category-title">Burgers</h2>
                                        </div>
                                        <div className="category-card">
                                            <img src={burgers} alt="Product" />
                                            <h2 class="category-title">Drinks</h2>
                                        </div>
                                        <div className="category-card">
                                            <img src={burgers} alt="Product" />
                                            <h2 class="category-title">Pasteries</h2>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="category-tile">
                                            <h3>Burgers</h3>
                                            <FontAwesomeIcon icon={faChevronRight} />
                                        </div>
                                        <div className="category-tile">
                                            <h3>Drinks</h3>
                                            <FontAwesomeIcon icon={faChevronRight} />
                                        </div>
                                        <div className="category-tile">
                                            <h3>Fruits</h3>
                                            <FontAwesomeIcon icon={faChevronRight} />
                                        </div>
                                        <div className="category-tile">
                                            <h3>Pasteries</h3>
                                            <FontAwesomeIcon icon={faChevronRight} />
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewRestaurant;