import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "../../Assets/images/logo.svg";
import "./PublicFooter.css";
const PublicFooter = (content) => {
  const pageContent = content?.content?.data || {};
  const clinicLogo = content?.content?.logo || {};
  console.log("pageContent", pageContent);
  console.log("Footer Text Color:", pageContent?.footer?.footerTextColor);
  console.log("Footer Background Color:", pageContent?.footer?.footerColor);

  return (
    <footer style={{ background: pageContent?.footer?.footerColor || "" }}>
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            {/* <img
              src={clinicLogo ? clinicLogo : Logo}
              alt="Logo"
              className="img-fluid main-logo"
            /> */}
            {String(clinicLogo).split("/").pop() !== "undefined" ? (
              <img
                src={clinicLogo ? clinicLogo : Logo}
                className="img-fluid main-logo"
              />
            ) : null}
          </Col>
          <Col md={6}>
            <div className="privacy-post">
              <ul className="social-media">
                {pageContent?.footer?.footerSocialMediaLinks?.instagram ? (
                  <li>
                    <a
                      href={
                        pageContent?.footer?.footerSocialMediaLinks
                          ?.instagram || "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        width="30"
                        height="31"
                        viewBox="0 0 30 31"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.0301 3.58402C8.75326 3.64422 7.88137 3.84802 7.11907 4.14741C6.33027 4.45491 5.66157 4.86741 4.99628 5.53511C4.33108 6.20281 3.92128 6.87191 3.61608 7.6621C3.32068 8.4259 3.12048 9.2986 3.06408 10.5761C3.00768 11.8536 2.99518 12.2643 3.00148 15.5231C3.00768 18.7817 3.02208 19.1902 3.08398 20.4704C3.14498 21.7469 3.34798 22.6186 3.64748 23.3811C3.95548 24.17 4.36748 24.8384 5.03548 25.5039C5.70337 26.1694 6.37197 26.5782 7.16397 26.8839C7.92717 27.1788 8.80007 27.3799 10.0774 27.4358C11.3547 27.4918 11.7658 27.5048 15.0235 27.4985C18.2813 27.4923 18.6915 27.4778 19.9713 27.4171C21.2513 27.3564 22.1183 27.152 22.8811 26.8539C23.67 26.5453 24.3389 26.1339 25.0039 25.4658C25.6689 24.7976 26.0784 24.128 26.3834 23.3374C26.6791 22.5742 26.88 21.7014 26.9354 20.425C26.9914 19.1441 27.0046 18.7352 26.9984 15.477C26.9921 12.2187 26.9774 11.8102 26.9167 10.5305C26.856 9.2508 26.6527 8.3818 26.3534 7.6188C26.045 6.82991 25.6334 6.16201 24.9658 5.49601C24.2981 4.83001 23.6279 4.42081 22.8377 4.11652C22.0739 3.82102 21.2016 3.61972 19.9243 3.56452C18.647 3.50932 18.2359 3.49502 14.9769 3.50142C11.718 3.50762 11.31 3.52162 10.0301 3.58402ZM10.1703 25.2771C9.00026 25.2262 8.36497 25.0318 7.94157 24.8691C7.38097 24.6531 6.98157 24.392 6.55967 23.9741C6.13767 23.5563 5.87857 23.1555 5.65967 22.5961C5.49527 22.1727 5.29728 21.5381 5.24258 20.3681C5.18308 19.1036 5.17058 18.7239 5.16358 15.5201C5.15658 12.3164 5.16888 11.9371 5.22428 10.6721C5.27428 9.5031 5.46987 8.8671 5.63227 8.4439C5.84827 7.8826 6.10847 7.48391 6.52727 7.06231C6.94607 6.64061 7.34567 6.38091 7.90557 6.16201C8.32857 5.99691 8.96306 5.80061 10.1326 5.74491C11.3981 5.68491 11.7773 5.67291 14.9805 5.66591C18.1838 5.65891 18.564 5.67091 19.83 5.72671C20.999 5.77751 21.6353 5.97121 22.058 6.13471C22.6188 6.35071 23.018 6.61011 23.4396 7.02971C23.8613 7.44911 24.1212 7.8473 24.3401 8.4084C24.5054 8.8301 24.7018 9.4644 24.757 10.6347C24.8172 11.9002 24.8309 12.2797 24.8366 15.4827C24.8424 18.6857 24.8311 19.0661 24.7756 20.3307C24.7246 21.5007 24.5306 22.1362 24.3676 22.5601C24.1516 23.1205 23.8913 23.5201 23.4722 23.9415C23.0532 24.363 22.6541 24.6226 22.0939 24.8415C21.6715 25.0064 21.0362 25.2032 19.8677 25.2589C18.6021 25.3184 18.2229 25.3309 15.0184 25.3379C11.814 25.3449 11.4358 25.3319 10.1703 25.2771ZM19.9529 9.0864C19.9534 9.37123 20.0383 9.64952 20.197 9.88608C20.3556 10.1226 20.5809 10.3068 20.8442 10.4154C21.1076 10.5239 21.3972 10.5519 21.6764 10.4958C21.9557 10.4397 22.212 10.3021 22.4131 10.1003C22.6141 9.89853 22.7508 9.64167 22.8058 9.36221C22.8608 9.08274 22.8317 8.79324 22.7222 8.5303C22.6127 8.26737 22.4277 8.04282 22.1905 7.88506C21.9534 7.7273 21.6748 7.64341 21.3899 7.644C21.0081 7.6448 20.6423 7.79719 20.3728 8.06768C20.1033 8.33816 19.9523 8.70459 19.9529 9.0864ZM8.83846 15.512C8.84516 18.9152 11.6091 21.6677 15.0114 21.6613C18.414 21.6548 21.1684 18.8912 21.162 15.488C21.1555 12.0848 18.391 9.3315 14.988 9.3382C11.5851 9.3449 8.83206 12.1092 8.83846 15.512ZM11 15.5077C10.9984 14.7166 11.2315 13.9428 11.6697 13.2841C12.1079 12.6254 12.7316 12.1115 13.4619 11.8073C14.1922 11.5031 14.9963 11.4223 15.7725 11.5751C16.5487 11.7279 17.2622 12.1075 17.8227 12.6658C18.3832 13.224 18.7656 13.936 18.9215 14.7116C19.0774 15.4872 18.9998 16.2916 18.6985 17.0231C18.3972 17.7546 17.8858 18.3804 17.2289 18.8212C16.5719 19.262 15.7991 19.4982 15.0079 19.4998C14.4826 19.5009 13.9623 19.3985 13.4765 19.1985C12.9908 18.9984 12.5492 18.7047 12.177 18.3339C11.8048 17.9632 11.5093 17.5228 11.3074 17.0379C11.1054 16.553 11.0009 16.033 11 15.5077Z"
                          fill={pageContent?.footer?.footerTextColor || "rgba(0,0,0,0.5)"}
                        />
                      </svg>
                    </a>
                  </li>
                ) : (
                  ""
                )}
                {pageContent?.footer?.footerSocialMediaLinks?.facebook ? (
                  <li>
                    <a
                      href={
                        pageContent?.footer?.footerSocialMediaLinks?.facebook ||
                        "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        width="30"
                        height="31"
                        viewBox="0 0 30 31"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.7463 26.747V16.5019H20.2025L20.7163 12.4907H16.7463V9.9357C16.7463 8.7782 17.0688 7.9857 18.73 7.9857H20.835V4.40945C19.8108 4.29969 18.7813 4.24669 17.7513 4.2507C14.6963 4.2507 12.5988 6.1157 12.5988 9.53945V12.4832H9.16504V16.4944H12.6063V26.747H16.7463Z"
                          fill={pageContent?.footer?.footerTextColor || "rgba(0,0,0,0.5)"}
                        />
                      </svg>
                    </a>
                  </li>
                ) : (
                  ""
                )}
                {pageContent?.footer?.footerSocialMediaLinks?.youtube ? (
                  <li>
                    <a
                      href={
                        pageContent?.footer?.footerSocialMediaLinks?.youtube ||
                        "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        width="30"
                        height="31"
                        viewBox="0 0 30 31"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M26.9912 9.50376C26.8488 8.97551 26.5706 8.49376 26.1841 8.10647C25.7977 7.71917 25.3166 7.43983 24.7887 7.29626C22.8312 6.75876 14.9999 6.75001 14.9999 6.75001C14.9999 6.75001 7.16992 6.74126 5.21117 7.25501C4.68358 7.40519 4.20345 7.68848 3.81688 8.07768C3.43031 8.46687 3.15028 8.94891 3.00367 9.47751C2.48742 11.435 2.48242 15.495 2.48242 15.495C2.48242 15.495 2.47742 19.575 2.98992 21.5125C3.27742 22.5838 4.12117 23.43 5.19367 23.7188C7.17117 24.2563 14.9812 24.265 14.9812 24.265C14.9812 24.265 22.8124 24.2738 24.7699 23.7613C25.298 23.6179 25.7796 23.3392 26.167 22.9527C26.5544 22.5662 26.8342 22.0853 26.9787 21.5575C27.4962 19.6013 27.4999 15.5425 27.4999 15.5425C27.4999 15.5425 27.5249 11.4613 26.9912 9.50376ZM12.4949 19.2563L12.5012 11.7563L19.0099 15.5125L12.4949 19.2563Z"
                          fill={pageContent?.footer?.footerTextColor || "rgba(0,0,0,0.5)"}
                        />
                      </svg>
                    </a>
                  </li>
                ) : (
                  ""
                )}

                {pageContent?.footer?.footerSocialMediaLinks?.threads ? (
                  <li>
                    <a
                      href={
                        pageContent?.footer?.footerSocialMediaLinks?.threads ||
                        "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.901 1.65283H22.581L14.541 10.8428L24 23.3458H16.594L10.794 15.7618L4.156 23.3458H0.474L9.074 13.5158L0 1.65383H7.594L12.837 8.58583L18.901 1.65283ZM17.61 21.1438H19.649L6.486 3.73983H4.298L17.61 21.1438Z"
                          fill={pageContent?.footer?.footerTextColor || "rgba(0,0,0,0.5)"}
                        />
                      </svg>
                    </a>
                  </li>
                ) : (
                  ""
                )}

                {pageContent?.footer?.footerSocialMediaLinks?.linkedin ? (
                  <li>
                    <a
                      href={
                        pageContent?.footer?.footerSocialMediaLinks?.linkedin ||
                        "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_237_9121)">
                          <path
                            d="M20.447 20.952H16.893V15.383C16.893 14.055 16.866 12.346 15.041 12.346C13.188 12.346 12.905 13.791 12.905 15.285V20.952H9.351V9.5H12.765V11.061H12.811C13.288 10.161 14.448 9.211 16.181 9.211C19.782 9.211 20.448 11.581 20.448 14.666L20.447 20.952ZM5.337 7.933C4.193 7.933 3.274 7.007 3.274 5.868C3.274 4.73 4.194 3.805 5.337 3.805C6.477 3.805 7.401 4.73 7.401 5.868C7.401 7.007 6.476 7.933 5.337 7.933ZM7.119 20.952H3.555V9.5H7.119V20.952ZM22.225 0.5H1.771C0.792 0.5 0 1.274 0 2.229V22.771C0 23.727 0.792 24.5 1.771 24.5H22.222C23.2 24.5 24 23.727 24 22.771V2.229C24 1.274 23.2 0.5 22.222 0.5H22.225Z"
                            fill={pageContent?.footer?.footerTextColor || "rgba(0,0,0,0.5)"}
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_237_9121">
                            <rect
                              width="24"
                              height="24"
                              fill="white"
                              transform="translate(0 0.5)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </a>
                  </li>
                ) : (
                  ""
                )}
              </ul>
            </div>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={6}>
            <p
              style={{
                color: pageContent?.footer?.footerTextColor || "rgba(0,0,0,0.7)",
                fontFamily: pageContent?.font?.fontFamily || "Arial",
              }}
            >
              {pageContent?.footer?.footerCopyRight
                ? pageContent?.footer?.footerCopyRight
                : "© 2024 Structure Clinics. All Rights Reserved."}
            </p>
          </Col>
          <Col md={6}>
            <div className="privacy-post">
              <a
                href={pageContent?.footer?.privacyPolicy || "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: pageContent?.footer?.footerTextColor || "rgba(0,0,0,0.7)" }}
              >
                Privacy Policy
              </a>
              <a
                href={pageContent?.footer?.termsOfService || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="ms-3"
                style={{ color: pageContent?.footer?.footerTextColor || "rgba(0,0,0,0.7)" }}
              >
                Terms of Service
              </a>
            </div>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12} className="text-center">
            <p
              style={{
                color: pageContent?.footer?.footerTextColor || "rgba(0,0,0,0.7)",
                fontFamily: pageContent?.font?.fontFamily || "Arial",
                fontSize: "12px",
                margin: "0",
              }}
            >
              Powered by AesthetiQ ™
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default PublicFooter;
