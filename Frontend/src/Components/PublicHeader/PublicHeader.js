import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "../../Assets/images/logo.svg";
import "./PublicHeader.css";
import Body from "../../Pages/Public/Body/Body";
const PublicHeader = (content) => {
  console.log("content public header: ", content);

  const pageContent = content?.content?.data || {};
  const clinicLogo = content?.content?.logo || {};
  console.log("clinilogo--------------------------------", String(clinicLogo).split('/').pop())

  return (
    <header
      style={{ background: pageContent?.header?.headerColor || "#F7F5F5" }}
    >
      <Container>
        <Row>
          <Col xs={3}>
          {String(clinicLogo).split('/').pop() !== "undefined" ? <img
              src={clinicLogo ? clinicLogo : Logo}
              className="img-fluid main-logo"
            /> : null}
            
            {/* <Link><img src={Logo} alt="Logo" className='img-fluid main-logo' /></Link> */}
          </Col>
          <Col xs={9}>
            <div className="right-nav">
              {/* <Button variant="primary" className='me-3'>FACE</Button>
                           <Link to="/body"> <Button variant="secondary" className='me-3' >BODY</Button></Link> */}
              <span className="humburgar-menu">
                {/* <svg
                  width="35"
                  height="20"
                  viewBox="0 0 35 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect y="0.75" width="35" height="1.5" fill="#100F0D" />
                  <rect y="9.25" width="35" height="1.5" fill="#100F0D" />
                  <rect y="17.75" width="35" height="1.5" fill="#100F0D" />
                </svg> */}
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default PublicHeader;
