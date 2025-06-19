import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "./Submission.css";
import { Button, Col, Container, Row } from "react-bootstrap";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import TreatmentOption from "../../../Assets/images/treatment-option.png";
import { useLocation, useNavigate } from "react-router-dom";
import PublicHeader from "../../../Components/PublicHeader/PublicHeader";
import PublicFooter from "../../../Components/PublicFooter/PublicFooter";
import showToast from "../../../Utils/Toast/ToastNotification";
import ConsultationService from "../../../Services/ConsultationServices/ConsultationService";
const Submission = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(location?.state || null);
  useEffect(() => {
    if (!formData) {
      showToast("error", "Please complete the previous steps.");
      navigate(-1); // Replace with the correct stepper start route
    } else {
      setLoading(false);
    }
  }, [formData, navigate]);
  if (loading) {
    return null; // Render nothing until loading is complete
  }

  const pageContent = formData?.content.data || {};
  const submitData = formData?.submitData || {};
  const recommandation = formData?.currentPackage || {};
  const areasOfConcern = formData?.selectedParts || [];
  // console.log(areasOfConcern,"are-of-concern--");
  const selectedImageData = formData?.selectedImage;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loader

    try {
      const data = {
        clinicId: pageContent?.user,
        firstName: submitData.firstName,
        lastName: submitData.lastName,
        phone: submitData.phone,
        email: submitData.email,
        ageRange: submitData.ageRange,
        hadAestheticTreatmentBefore: submitData.hadAestheticTreatmentBefore,
        // isConsultationSaved: false,
        selectedImage: selectedImageData,
        recommandation: recommandation,
        areasOfConcern: areasOfConcern,
      };

      // Call the API to send an email
      const saveDetails = await ConsultationService.sendNewConsultationEmail(
        data
      );

      if (saveDetails?.data?.statusCode === 200) {
        showToast("success", saveDetails?.data?.message);

        setTimeout(() => {
          let redirectUrl = pageContent?.submission?.redirectUrl;

          if (
            !redirectUrl ||
            typeof redirectUrl !== "string" ||
            redirectUrl.trim() === ""
          ) {
            navigate("/");
          } else {
            try {
              const isAbsoluteURL = /^https?:\/\//i.test(redirectUrl);

              if (isAbsoluteURL) {
                window.location.replace(redirectUrl);
              } else {
                navigate(
                  redirectUrl.startsWith("/") ? redirectUrl : `/${redirectUrl}`,
                  {
                    replace: true,
                  }
                );
              }
            } catch (error) {
              console.error("Redirection error:", error);
              navigate("/", { state: null, replace: true }); // Redirect to home if an error occurs
            }
          }
        }, 700);
      } else {
        showToast("error", saveDetails?.data?.message);
      }
    } catch (error) {
      console.error("Email sending error:", error);

      // Ensure error messages are displayed
      if (error.response?.data?.message) {
        showToast("error", error.response.data.message);
      } else if (error.message) {
        showToast("error", error.message);
      } else {
        showToast("error", "Something went wrong");
      }
    } finally {
      setIsLoading(false); // Ensure loader stops in all cases
    }
  };

  return (
    <>
      <PublicHeader content={formData?.content} />
      <section className="face-stapper submission-sec">
        <Container>
          <Row>
            <Col>
              <h2>THANKS FOR YOUR SUBMISSION</h2>
              <p class="head-discrption text-muted">
                {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum. */}
              </p>
            </Col>
          </Row>
          <Row className="section-spacer mobile-reverse">
            <Col md={8}>
              <div className="filled-data">
                <h4>Personal Details</h4>
                <Form className="custom-form  mt-4">
                  <Row className="align-items-center">
                    <Col md="12">
                      <Row>
                        <Col md={3}>
                          <Form.Label htmlFor="inlineFormInputGroup">
                            Name*
                          </Form.Label>
                        </Col>
                        <Col md={9}>
                          <InputGroup className="mb-4">
                            <InputGroup.Text>
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M11.9817 11.5996H8.01852C6.8521 11.6575 5.81868 12.37 5.34974 13.4396C4.78414 14.55 5.91294 15.5996 7.22574 15.5996H12.7745C14.0881 15.5996 15.2169 14.55 14.6505 13.4396C14.1816 12.37 13.1482 11.6575 11.9817 11.5996Z"
                                  stroke="#050505"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M12.3996 6.80039C12.3996 8.12587 11.3251 9.20039 9.99958 9.20039C8.67414 9.20039 7.59961 8.12587 7.59961 6.80039C7.59961 5.47491 8.67414 4.40039 9.99958 4.40039C10.6361 4.40039 11.2466 4.65325 11.6967 5.10333C12.1468 5.55342 12.3996 6.16387 12.3996 6.80039Z"
                                  stroke="#050505"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </InputGroup.Text>
                            <Form.Control
                              id="inlineFormInputGroup"
                              value={
                                submitData?.firstName +
                                " " +
                                submitData?.lastName
                              }
                              readOnly
                            />
                          </InputGroup>
                        </Col>
                      </Row>
                    </Col>
                    <Col md="12">
                      <Row>
                        <Col md={3}>
                          <Form.Label htmlFor="inlineFormInputGroup">
                            Age range*
                          </Form.Label>
                        </Col>
                        <Col md={9}>
                          <InputGroup className="mb-4">
                            <InputGroup.Text>
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M17 10C17 13.866 13.866 17 10 17C6.134 17 3 13.866 3 10C3 6.134 6.134 3 10 3C13.866 3 17 6.134 17 10Z"
                                  stroke="#050505"
                                />
                                <path
                                  d="M3 10H5.1"
                                  stroke="#050505"
                                  stroke-linecap="round"
                                />
                                <path
                                  d="M14.9004 10H17.0004"
                                  stroke="#050505"
                                  stroke-linecap="round"
                                />
                                <path
                                  d="M10 16.9994V14.8994"
                                  stroke="#050505"
                                  stroke-linecap="round"
                                />
                                <path
                                  d="M10 5.1V3"
                                  stroke="#050505"
                                  stroke-linecap="round"
                                />
                                <path
                                  d="M8.60059 10H10.0006H11.4006"
                                  stroke="#050505"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M10 11.3996V9.99961V8.59961"
                                  stroke="#050505"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </InputGroup.Text>
                            {/* <Form.Select
                              aria-label="Age Range"
                              className="form-control"
                              
                              disbled
                            >
                              <option value="1" selected>
                                {submitData?.ageRange}
                              </option>
                            </Form.Select> */}
                            <Form.Select
                              aria-label="Age Range"
                              className="form-control"
                              disabled
                            >
                              <option value="1">{submitData?.ageRange}</option>
                            </Form.Select>
                          </InputGroup>
                        </Col>
                      </Row>
                    </Col>
                    <Col md="12">
                      <Row>
                        <Col md={3}>
                          <Form.Label htmlFor="inlineFormInputGroup">
                            Phone number*
                          </Form.Label>
                        </Col>
                        <Col md={9}>
                          <InputGroup className="mb-4">
                            {/* <PhoneInput
                              value={submitData?.phone}
                              className="form-control d-flex"
                            /> */}
                            <PhoneInput
                              value={submitData?.phone}
                              onChange={() => {}} // Prevent changes
                              className="form-control d-flex non-clickable-phone-input"
                            />
                          </InputGroup>
                        </Col>
                      </Row>
                    </Col>
                    <Col md="12">
                      <Row>
                        <Col md={3}>
                          <Form.Label htmlFor="inlineFormInputGroup">
                            Email address*
                          </Form.Label>
                        </Col>
                        <Col md={9}>
                          <InputGroup className="mb-4">
                            <InputGroup.Text>
                              <svg
                                width="21"
                                height="20"
                                viewBox="0 0 21 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M16.3003 7.62305C16.3121 7.95421 16.5901 8.21311 16.9213 8.20132C17.2524 8.18953 17.5113 7.91151 17.4995 7.58035L16.3003 7.62305ZM13.4711 4.4017V5.0017C13.4778 5.0017 13.4845 5.00159 13.4912 5.00136L13.4711 4.4017ZM8.3287 4.4017L8.30866 5.00136C8.31534 5.00159 8.32202 5.0017 8.3287 5.0017V4.4017ZM4.30028 7.58035C4.28848 7.91151 4.54739 8.18953 4.87855 8.20132C5.20971 8.21311 5.48772 7.95421 5.49952 7.62305L4.30028 7.58035ZM17.4999 7.6017C17.4999 7.27033 17.2313 7.0017 16.8999 7.0017C16.5685 7.0017 16.2999 7.27033 16.2999 7.6017H17.4999ZM16.8999 12.4017L17.4995 12.423C17.4997 12.416 17.4999 12.4089 17.4999 12.4017H16.8999ZM13.4711 15.6017L13.4912 15.0021C13.4845 15.0018 13.4778 15.0017 13.4711 15.0017V15.6017ZM8.3287 15.6017V15.0017C8.32202 15.0017 8.31534 15.0018 8.30866 15.0021L8.3287 15.6017ZM4.8999 12.4017H4.2999C4.2999 12.4089 4.30003 12.416 4.30028 12.423L4.8999 12.4017ZM5.4999 7.6017C5.4999 7.27033 5.23127 7.0017 4.8999 7.0017C4.56853 7.0017 4.2999 7.27033 4.2999 7.6017H5.4999ZM17.2025 8.11978C17.4887 7.95263 17.5851 7.58519 17.418 7.29906C17.2509 7.01293 16.8834 6.91647 16.5973 7.08362L17.2025 8.11978ZM12.6887 10.0617L12.3861 9.54357L12.3811 9.54653L12.6887 10.0617ZM9.1111 10.0617L9.41878 9.54653L9.41374 9.54365L9.1111 10.0617ZM5.20254 7.08362C4.91641 6.91647 4.54896 7.01293 4.38182 7.29906C4.21468 7.58519 4.31113 7.95263 4.59726 8.11978L5.20254 7.08362ZM17.4995 7.58035C17.4226 5.4201 15.6115 3.72983 13.451 3.80203L13.4912 5.00136C14.9902 4.95126 16.2469 6.12411 16.3003 7.62305L17.4995 7.58035ZM13.4711 3.8017H8.3287V5.0017H13.4711V3.8017ZM8.34874 3.80203C6.18833 3.72983 4.3772 5.4201 4.30028 7.58035L5.49952 7.62305C5.5529 6.12411 6.8096 4.95126 8.30866 5.00136L8.34874 3.80203ZM16.2999 7.6017V12.4017H17.4999V7.6017H16.2999ZM16.3003 12.3804C16.2469 13.8793 14.9902 15.0521 13.4912 15.0021L13.451 16.2013C15.6115 16.2736 17.4226 14.5833 17.4995 12.423L16.3003 12.3804ZM13.4711 15.0017H8.3287V16.2017H13.4711V15.0017ZM8.30866 15.0021C6.8096 15.0521 5.55289 13.8793 5.49952 12.3804L4.30028 12.423C4.3772 14.5833 6.18833 16.2736 8.34874 16.2013L8.30866 15.0021ZM5.4999 12.4017V7.6017H4.2999V12.4017H5.4999ZM16.5973 7.08362L12.3861 9.54357L12.9913 10.5798L17.2025 8.11978L16.5973 7.08362ZM12.3811 9.54653C11.4688 10.0914 10.3311 10.0914 9.41878 9.54653L8.8035 10.5769C10.0947 11.348 11.7051 11.348 12.9963 10.5769L12.3811 9.54653ZM9.41374 9.54365L5.20254 7.08362L4.59726 8.11978L8.80846 10.5798L9.41374 9.54365Z"
                                  fill="#050505"
                                />
                              </svg>
                            </InputGroup.Text>
                            <Form.Control
                              id="inlineFormInputGroup"
                              value={submitData?.email}
                              readOnly
                            />
                          </InputGroup>
                        </Col>
                      </Row>
                    </Col>

                    <Col md="12">
                      <Row>
                        <Col md={3}>
                          <Form.Label htmlFor="inlineFormInputGroup">
                            Aesthetic naive*
                          </Form.Label>
                        </Col>
                        <Col md={9}>
                          {/* <InputGroup className="mb-4">{submitData?.hadAestheticTreatmentBefore}</InputGroup> */}
                          <InputGroup className="mb-4">
                            {submitData?.hadAestheticTreatmentBefore
                              ? submitData.hadAestheticTreatmentBefore
                                  .charAt(0)
                                  .toUpperCase() +
                                submitData.hadAestheticTreatmentBefore.slice(1)
                              : ""}
                          </InputGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
            <Col md={4}>
              <div className="uploaded-img">
                <img
                  src={selectedImageData?.imageUrl}
                  className="img-fluid"
                  alt="upload image"
                />
              </div>
              <div className="text-center italic-gray">
                Image chosen / uploaded
              </div>
            </Col>
          </Row>
          <Row className="section-spacer">
            <Col md={6}>
              <h3>RECOMMENDED FOR YOU</h3>
              <h4>{recommandation?.packageName}</h4>
              <p>{recommandation?.description}</p>
            </Col>
            <Col md={6}>
              <div className="treat-pack">
                <h5>treatments in this package</h5>
                <span className="text-muted">(Depending on consultation)</span>
                <ul className="checkList">
                  {recommandation?.includes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                  {/* <li>Anti-wrinkle injections</li>
                  <li>Skincare</li>
                  <li>Dermal fillers</li>
                  <li>Coolsculpting</li>
                  <li>Skin boosters</li>
                  <li>Dermal therapies</li> */}
                </ul>
                <p className="mt-3">
                  COSTS <br />
                  {recommandation?.amount}
                  {/* $XX - $XX */}
                </p>
              </div>
            </Col>
          </Row>
          <Row className="section-spacer">
            <Col md={12}>
              <h3>Areas of Concern</h3>
              <Form className="custom-form  mt-4">
                <Row className="align-items-center">
                  {areasOfConcern.map((area, index) => (
                    <Col md="12" key={index}>
                      <Row>
                        <Col md={2}>
                          <Form.Label htmlFor={`inlineFormInputGroup-${index}`}>
                            {area.partName}
                          </Form.Label>
                        </Col>
                        <Col md={10}>
                          <InputGroup className="mb-4">
                            <Form.Control
                              id={`inlineFormInputGroup-${index}`}
                              value={area.question || ""}
                              readOnly
                            />
                          </InputGroup>
                        </Col>
                      </Row>
                    </Col>
                  ))}
                </Row>
              </Form>
            </Col>
          </Row>
          <div className="step-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                background: pageContent?.buttonSettings?.buttonColor || "",
                "--button-hover-bg":
                  pageContent?.buttonSettings?.buttonHoverColor || "#947287",
                opacity: isLoading ? 0.7 : 1, // Reduce opacity when loading
                cursor: isLoading ? "not-allowed" : "pointer", // Cursor styling from first button
              }}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm align-middle me-1"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Processing...
                </>
              ) : (
                <>
                  <span
                    style={{
                      color:
                        pageContent?.buttonSettings?.buttonTextColor ||
                        "#FFFFFF",
                    }}
                  >
                    BOOK CONSULTATION
                  </span>
                  <svg
                    className="ms-3"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 12H21.6667L14.6668 19M18.1667 8.5L14.6667 5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </Container>
      </section>
      <PublicFooter content={formData?.content} />
    </>
  );
};

export default Submission;
