import { React, useState, useRef } from 'react';
import Button from '../widgets/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram, faSquareXTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import './styles/LandingPage.css';
import Navbar from '../widgets/Navbar';
import { useNavigate } from 'react-router-dom';
import menu from '../assets/images/menu.png';
import pizza from '../assets/images/home-pizza.png'
import hammburger from '../assets/images/hamburger.png';
import frenchfries from '../assets/images/french-fries.png';
import qrcode from '../assets/images/qr-code.png';
import biryani from '../assets/images/biryani.png';
import aboutimage from '../assets/images/2149357853.jpg';
import playstorelight from '../assets/images/playstore-light.png';
import appstorelight from '../assets/images/appstore-light.png';



function LandingPage() {

    const homeRef = useRef(null);
    const featuresRef = useRef(null);
    const howtoRef = useRef(null);
    const aboutRef = useRef(null);

    const mapRef = {
        "hero": homeRef,
        "features": featuresRef,
        "howto": howtoRef,
        "about": aboutRef,
    };

    const navlist = [
        {
            id: "hero",
            name: "Home"
        },
        {
            id: "features",
            name: "Features"
        },
        {
            id: "howto",
            name: "How To"
        },
        {
            id: "about",
            name: "About"
        },
        {
            id: "restaurant",
            name: "For Restaurant"
        },
    ];

    const [navid, setNavId] = useState('webnav');
    const [visibility, setVisibility] = useState('hide');
    const navigate = useNavigate();

    const goToScanner = () => {
        navigate('/scanner'); // Navigates to the QrScanner page
    };

    const goToLogin = () => {
        navigate('/business/login');
    };


    function scrollToSection(ref) {
        console.log("Closing nav...");
        toggleNav("close");
        console.log("Scrolling to section:", ref);

        if (ref === "restaurant") {
            goToLogin();
        } else {
            if (mapRef[ref]?.current) { // Check if the ref and current exist
                mapRef[ref].current.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.error(`Invalid ref: ${ref}`);
            }
        }
    }

    const toggleNav = (action) => {
        console.log("Action:", action);
        if (action === "close") {
            setVisibility('hide');
            setNavId("webnav");
        } else if (action === "open") {
            setVisibility('shownav');
            setNavId("mobilenav");
        }
    };

    return (
        <>
            <header ref={homeRef}>
                <h1 id="logo" className='text-lg font-bold'>Easy<span>Menu</span></h1>
                <Navbar data={navlist} classname={visibility} idvalue={navid} onMenuClick={scrollToSection} />
                <img className='menuimg' onClick={() => toggleNav('open')} src={menu}></img>
            </header>
            <main>
                <section className="hero">
                    <div className="left">
                        <h1>Discover Your Next Bite with a Simple Scan</h1>
                        <p>Your dining experience just got more exciting!</p>
                        <Button text={"Scan Qr Code"} onBtnclick={goToScanner} />
                    </div>
                    <div className="right">
                        <img src={pizza} alt="" />
                    </div>

                </section>
                <section ref={featuresRef} className='features'>
                    <h4>FEATURES</h4>
                    <h2>Why Choose Us for Your Next Dining Adventure?</h2>
                    <div className="f-box">
                        <div className="f-item">
                            <img src={qrcode} alt="" />
                            <div className="content">
                                <h2>Instant Menu Access</h2>
                                <p>Simply scan the QR code, and the entire menu opens up on your device. No waiting, no hassle—just quick, easy access to all the options.</p>
                            </div>
                        </div>
                        <div className="f-item">
                            <img src={hammburger} alt="" />
                            <div className="content">
                                <h2>Visual Menus</h2>
                                <p>Get a taste of every dish before ordering! See high-quality images of each item, so you know exactly what to expect.</p>
                            </div>
                        </div>
                        <div className="f-item">
                            <img src={frenchfries} alt="" />
                            <div className="content">
                                <h2>Special Promotions</h2>
                                <p>Discover exclusive special promotions on the establishment's story, keeping you updated on the latest deals and limited-time offers.</p>
                            </div>
                        </div>
                        <div className="f-item">
                            <img src={biryani} alt="" />
                            <div className="content">
                                <h2>Order Confidence</h2>
                                <p>Take the guesswork out of ordering! Feel confident in your choices with detailed dish descriptions and allergy information at a glance.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section ref={howtoRef} className='features'>
                    <h4>HOW IT WORKS</h4>
                    <h2>Ordering Made Simple in Just 4 Steps</h2>
                    <div className="f-box">
                        <div className="f-item">
                            <div className="circle">Step 1</div>
                            <div className="content">
                                <h2>Scan the QR Code</h2>
                                <p>Use your smartphone camera or our app to scan the QR code placed at your table or in the menu booklet.</p>
                            </div>
                        </div>
                        <div className="f-item">
                            <div className="circle">Step 2</div>
                            <div className="content">
                                <h2>Explore the Menu</h2>
                                <p>Browse through a visually engaging menu with high-quality images and detailed descriptions of every dish.</p>
                            </div>
                        </div>
                        <div className="f-item">
                            <div className="circle">Step 3</div>
                            <div className="content">
                                <h2>Make Your Choice</h2>
                                <p>Tap on your favorite dishes to add them to your selection, and customize your order as needed.</p>
                            </div>
                        </div>
                        <div className="f-item">
                            <div className="circle">Step 4</div>
                            <div className="content">
                                <h2>Place Your Order</h2>
                                <p>Confirm your choices and send your order directly to the kitchen or inform the waiter for a seamless dining experience.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section ref={aboutRef} className='about'>
                    <div className='a-left'>
                        <img src={aboutimage} alt='' />
                    </div>
                    <div className='a-right'>
                        <h3>Revolutionizing the Way You Dine</h3>
                        <p>Whether you're at a cozy restaurant, a luxurious hotel, or soaring on a flight, our app empowers you to explore vivid, detailed menus and confidently choose your next favorite meal.
                        </p>
                        <a href={null} >Scan Now</a>
                    </div>
                </section>
                <footer>
                    <div className='footer-box'>
                        <div className="column">
                            <h2>EasyMenu</h2>
                            <p>Your dining experience just got more exciting!</p>
                            <div className="social">
                                <FontAwesomeIcon className='icons' icon={faFacebook} />
                                <FontAwesomeIcon className='icons' icon={faSquareXTwitter} />
                                <FontAwesomeIcon className='icons' icon={faInstagram} />
                                <FontAwesomeIcon className='icons' icon={faLinkedin} />
                            </div>
                        </div>
                        <div className="column">
                            <h2>Links</h2>
                            <ul>
                                <li><a href=''>Terms and Condition</a></li>
                                <li><a href=''>Privacy Policy</a></li>
                                <li><a href=''>Photographers</a></li>
                            </ul>
                        </div>
                        <div className="column image">
                            <h2>Download the App</h2>
                            <div>
                                <img src={playstorelight} alt='playstore' />
                                <img src={appstorelight} alt='appstore' />
                            </div>
                        </div>
                    </div>
                    <p>© EasyMenu 2024. All Rights Reserved.</p>
                </footer>
            </main>
        </>
    );
}

export default LandingPage;