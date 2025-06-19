import React, { useEffect, useState } from "react";
import "./Home.css";
import { Button, Col, Container, Row } from "react-bootstrap";
import HeroImg from "../../../Assets/images/main-banner.png";
import AesIco1 from "../../../Assets/images/aes-ico1.svg";
import AesIco2 from "../../../Assets/images/aes-ico2.svg";
import AesIco3 from "../../../Assets/images/aes-ico3.svg";
import AesIco4 from "../../../Assets/images/aes-ico4.svg";
import AesIco5 from "../../../Assets/images/aes-ico5.svg";
import AesIco6 from "../../../Assets/images/aes-ico6.svg";
import BeforeAfter from "../../../Assets/images/before-after.png";
const Home = () => {

  const faceParts = [
    { id: 1, label: "Forehead", x: 50, y: 20, region: "Upper Face" },
    { id: 2, label: "Left Eye", x: 40, y: 50, region: "Mid Face" },
    { id: 3, label: "Right Eye", x: 60, y: 50, region: "Mid Face" },
    { id: 4, label: "Chin", x: 50, y: 80, region: "Lower Face" },
  ];

  const [selectedPart, setSelectedPart] = useState(null);

  const handleDotClick = (part) => {
    // console.log('part details : ',part);
    
    setSelectedPart(part);
  };

  return (
    <>
    <section className="main-banner">
      <Container>
        <Row>
          <Col md={6}>
          <h1>Welcome to your virtual aesthetics consultation</h1>
          <p>Takes 2 minutes. Get an instant cost range for your treatment package. See before & afters.</p>
          <p>What problem areas do you want to address?</p>
          <Button variant="primary" className='me-3'>FACE</Button>
          <Button variant="secondary" className='me-3'>BODY</Button>
            </Col>
          <div className="hero-img">
            <img src={HeroImg} className="img-fluid" alt="banner"/>
          </div>
        </Row>
      </Container>
    </section>
    <section className="aesthetic-treatment">
    <Container>
        <Row>
          <Col md={12}>
      <h2>Our approach to aesthetic treatment</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </Col>
         </Row>
         <Row>
          <Col md={6} lg={4}>
          <div className="treatment-boxes">
            <img src={AesIco1} alt="icon" />
            <h5>Achieve natural-looking results</h5>
            <p>This description supports and extends the bullet point above.</p>
          </div>
          </Col>
          <Col md={6} lg={4}>
          <div className="treatment-boxes">
            <img src={AesIco2} alt="icon" />
            <h5>Achieve natural-looking results</h5>
            <p>This description supports and extends the bullet point above.</p>
          </div>
          </Col>
          <Col md={6} lg={4}>
          <div className="treatment-boxes">
            <img src={AesIco3} alt="icon" />
            <h5>Achieve natural-looking results</h5>
            <p>This description supports and extends the bullet point above.</p>
          </div>
          </Col>
          <Col md={6} lg={4}>
          <div className="treatment-boxes">
            <img src={AesIco4} alt="icon" />
            <h5>Achieve natural-looking results</h5>
            <p>This description supports and extends the bullet point above.</p>
          </div>
          </Col>
          <Col md={6} lg={4}>
          <div className="treatment-boxes">
            <img src={AesIco5} alt="icon" />
            <h5>Achieve natural-looking results</h5>
            <p>This description supports and extends the bullet point above.</p>
          </div>
          </Col>
          <Col md={6} lg={4}>
          <div className="treatment-boxes">
            <img src={AesIco6} alt="icon" />
            <h5>Achieve natural-looking results</h5>
            <p>This description supports and extends the bullet point above.</p>
          </div>
          </Col>
         </Row>
      </Container>
    </section>
      <section className="upload-relevant">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
            <img src={BeforeAfter} alt="BeforeAfter" className="before-after-img"/>
            </Col>
            <Col md={6}>
            <h2>
            See before and afters relevant to you
            </h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <Button variant="primary" className='me-3'>UPLOAD AN IMAGE 
                <svg className="ms-3" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 21H9C6.17157 21 4.75736 21 3.87868 20.1213C3 19.2426 3 17.8284 3 15M21 15C21 17.8284 21 19.2426 20.1213 20.1213C19.8215 20.4211 19.4594 20.6186 19 20.7487" stroke="#050505" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M12 16V3M12 3L16 7.375M12 3L8 7.375" stroke="#050505" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

            </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;

