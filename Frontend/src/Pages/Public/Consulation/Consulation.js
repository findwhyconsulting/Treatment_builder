import React from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import "./Consulation.css";
import { Button, Col, Container, Row } from "react-bootstrap";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import TreatmentOption from "../../../Assets/images/treatment-option.png";
const Consulation = () => {



  return (
    <>
     <section className="inner-banner">

     </section>
      <section className="face-stapper submission-sec">
        <Container>
          <Row>
            <Col>
              <h2>Book a consulation</h2>
              <p class="head-discrption text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </Col>
          </Row>


          <Row className="section-spacer">
            <Col md={12}>
              <h3>Areas of Concern</h3>
              <Form className="custom-form  mt-4">
                <Row className="align-items-center">
                  <Col md="12">
                    <Form.Label htmlFor="inlineFormInputGroup">
                      Please input custom URL*
                    </Form.Label>
                    <InputGroup className="mb-4">
                      <InputGroup.Text>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M0.833984 6C0.833984 3.51472 2.8487 1.5 5.33398 1.5H8.00065C10.4859 1.5 12.5007 3.51472 12.5007 6C12.5007 8.48527 10.4859 10.5 8.00065 10.5H6.66732C6.39118 10.5 6.16732 10.2761 6.16732 10C6.16732 9.72387 6.39118 9.5 6.66732 9.5H8.00065C9.93365 9.5 11.5007 7.933 11.5007 6C11.5007 4.06701 9.93365 2.5 8.00065 2.5H5.33398C3.40099 2.5 1.83398 4.06701 1.83398 6C1.83398 6.89673 2.17056 7.71367 2.72508 8.3332C2.90924 8.539 2.89173 8.85507 2.68596 9.03927C2.4802 9.2234 2.1641 9.20587 1.97994 9.00013C1.26768 8.20433 0.833984 7.1522 0.833984 6ZM8.00065 6.5C6.06766 6.5 4.50065 8.067 4.50065 10C4.50065 11.933 6.06766 13.5 8.00065 13.5H10.6673C12.6003 13.5 14.1673 11.933 14.1673 10C14.1673 9.10327 13.8307 8.28633 13.2763 7.6668C13.0921 7.461 13.1096 7.14493 13.3153 6.96073C13.5211 6.7766 13.8372 6.79413 14.0214 6.99987C14.7337 7.79567 15.1673 8.8478 15.1673 10C15.1673 12.4853 13.1526 14.5 10.6673 14.5H8.00065C5.51537 14.5 3.50065 12.4853 3.50065 10C3.50065 7.51473 5.51537 5.5 8.00065 5.5H9.33398C9.61012 5.5 9.83398 5.72386 9.83398 6C9.83398 6.27614 9.61012 6.5 9.33398 6.5H8.00065Z" fill="#050505" />
                        </svg>
                      </InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" placeholder="https://domain.com" />
                    </InputGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="step-footer">
                      <button type="button" className="btn btn-primary" >
                        <svg className="me-3" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 12H2.33333L9.33322 19M5.83333 8.5L9.33333 5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        GO BACK
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                      >
                        SUBMIT
                        <svg className="ms-3" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 12H21.6667L14.6668 19M18.1667 8.5L14.6667 5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>

        </Container>
      </section>





    </>
  );
};

export default Consulation;

