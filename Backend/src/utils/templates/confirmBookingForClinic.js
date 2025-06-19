export const customeJsxTemplatForClinicWithPatientDetails = async (data) => {
  const emailData = data;
  let bookingData = emailData?.bookingData;
  let clinicData = emailData?.clinicData;
  let clinicConent = emailData?.clinicConent;
  let packageData = emailData?.packageData;
  let basePath = process.env.BASE_PATH || `http://localhost:8055/`;
  let structure_logo = basePath + "Structure_logo.png";
  let icon_checkmark = basePath + "icon_checkmark.png";
  let clinic_logo = clinicConent?.logo?.path
    ? basePath + clinicConent?.logo?.path
    : "";

  let jsxEmailTemplateData = `
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Treatment Builder</title>
</head>

<body marginheight="0" bgcolor="#f7f7f7" marginwidth="0"
    style="margin: 0; font: normal 14px/17px Arial, Helvetica, sans-serif; color: #050505;" link="#991b1e">
    <table width="600" border="0" cellspacing="0" cellpadding="10" align="center"
        style="width: 600px; max-width: 100%;  margin: 0 auto; color: #050505;background: #fff; font: normal 14px/17px Arial, Helvetica, sans-serif;">
        <tr>
            <td style="padding: 0;">
                <table style="width: 100%; background: #EFEBEB; padding: 20px 0;">
                    <tr>
                        <td valign="top" style="text-align: left;">
                          <a href="#">  <img src="${structure_logo}" alt="logo" style="max-width: 100%; height: 50px;" /></a>
                        </td>
                        <td valign="top" style="text-align: right;">
                            <a href="#">  <img src="${clinic_logo}" alt="logo" style="max-width: 100%; height: 42px;" /></a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table style="width: 100%;">
                    <tr>
                        <td>
                            <h1>Online consultation submission</h1>
                            <p>Congratulations! You have a new prospective patient.</p>
                            <p>View their details below.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table cellspacing="0" style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td colspan="2">
                            <h2>Personal Details</h2>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table style="width: 100%;">
                                <tr>
                                    <td style=" padding: 10px 0;"> Name :</td>
                                    <td style=" padding: 10px 0;"> ${
                                      bookingData?.firstName
                                    } ${bookingData?.lastName} </td>
                                </tr>
                                <tr>
                                    <td style=" padding: 10px 0;"> Age range :</td>
                                    <td style=" padding: 10px 0;"> ${
                                      bookingData?.ageRange
                                    } </td>
                                </tr>
                                <tr>
                                    <td style=" padding: 10px 0;"> Phone number :</td>
                                    <td style=" padding: 10px 0;"> ${
                                      bookingData?.phone
                                    }</td>
                                </tr>
                                <tr>
                                    <td style=" padding: 10px 0;"> Email address : </td>
                                    <td style=" padding: 10px 0;"> ${
                                      bookingData?.email
                                    }</td>
                                </tr>
                                <tr>
                                    <td style=" padding: 10px 0;">Aesthetic naive :</td>
                                    <td style=" padding: 10px 0;"> ${
                                      bookingData?.hadAestheticTreatmentBefore
                                    }</td>
                                </tr>
                            </table>
                        </td>
                        <td>
                            <img src="${basePath}${
    bookingData?.selectedImage
  }" alt="image" style="max-width: 160px; max-height: 160px;" />
                            <br />
                            <span>Image chosen / uploaded</span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table cellspacing="0" style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td colspan="2">
                            <h2>Recommended FOR YOU</h2>
                            <h3>${packageData?.packageName}</h3>
                            <p>${packageData?.description}</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="2">
                            <h3>treatments in this package</h3>
                            <span>(Depending on consultation)</span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table cellspacing="0" style="width: 100%; border-collapse: collapse;">
                        ${packageData?.includes
                          ?.reduce((rows, item, index) => {
                            // Start a new row for every 4th item
                            if (index % 4 === 0) rows.push([]);
                            rows[rows.length - 1].push(item);
                            return rows;
                          }, [])
                          .map(
                            (row) => `
                                <tr>
                                    ${row
                                      .map(
                                        (includ) => `
                                        <td>
                                            <p style="margin-top: 0;">
                                                <img src="${
                                                  icon_checkmark || ""
                                                }" style="position: relative; bottom: -4px;" />
                                                ${includ}
                                            </p>
                                        </td>
                                    `
                                      )
                                      .join("")}
                                </tr>
                            `
                          )
                          .join("")}
                    <tr>
                        <td colspan="2">COSTS <br />
                            $${packageData?.amount}</td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td colspan="2">
                            <h2>Their Areas of Concern</h2>
                        </td>
                        ${bookingData?.areasOfConcern
                          ?.map(
                            (concern) => `
                            <tr>
                                <td style="color: #000; width: 130px; display: inline-block; padding: 10px 0;">
                                    ${concern?.partName} :
                                </td>
                                <td>
                                    ${concern?.question}
                                </td>
                            </tr>
                        `
                          )
                          .join("")}                    
            </td>
        </tr>
    </table>
    </td>
    </tr>

    <tr>
        <td style="text-align:center; background:#B0AEAB; padding: 50px 10px;">
            <p> <a href=""><img src="${clinic_logo}" alt="logo" style="max-width: 100%; height: 42px;" /></a></p>

            <P style="font-size: 12px;color: #05050580;">${
              clinicConent?.footer?.footerCopyRight ||
              "© 2024 Structure Clinics. All Rights Reserved."
            }</P>
            <P style="font-size: 12px;">
                <a href=${
                  clinicConent?.footer?.privacyPolicy || "#"
                } style="color: #05050580; margin-right: 1.25rem;">Privacy Policy</a>
                <a href=${
                  clinicConent?.footer?.termsOfService || "#"
                } style="color: #05050580; margin-right: 1.25rem;">Terms of Service</a>
            </P>
        </td>
    </tr>
    </table>

</body>

</html>
  `;

  return jsxEmailTemplateData;
};

export const customeJsxTemplatForPatientWintClinicDetails = async (data) => {
  const emailData = data;
  let bookingData = emailData?.bookingData;
  let clinicData = emailData?.clinicData;
  let clinicConent = emailData?.clinicConent;
  let packageData = emailData?.packageData;
  let basePath = process.env.BASE_PATH || `http://localhost:8055/`;
  let structure_logo = basePath + "Structure_logo.png";
  let icon_checkmark = basePath + "icon_checkmark.png";
  let clinic_logo = clinicConent?.logo?.path
    ? basePath + clinicConent?.logo?.path
    : "";

  let jsxEmailTemplateData = `
  <!doctype html>
  <html lang="en">
  
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Treatment Builder</title>
  </head>
  
  <body marginheight="0" bgcolor="#f7f7f7" marginwidth="0"
      style="margin: 0; font: normal 14px/17px Arial, Helvetica, sans-serif; color: #050505;" link="#991b1e">
      <table width="600" border="0" cellspacing="0" cellpadding="10" align="center"
          style="width: 600px; max-width: 100%;  margin: 0 auto; color: #050505;background: #fff; font: normal 14px/17px Arial, Helvetica, sans-serif;">
          <tr>
              <td style="padding: 0;">
                  <table style="width: 100%; background: #EFEBEB; padding: 20px 0;">
                      <tr>
                          <td valign="top" style="text-align: left;">
                            <a href="#">  <img src="${structure_logo}" alt="logo" style="max-width: 100%; height: 50px;" /></a>
                          </td>
                          <td valign="top" style="text-align: right;">
                              <a href="#">  <img src="${clinic_logo}" alt="logo" style="max-width: 100%; height: 42px;" /></a>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td>
                  <table style="width: 100%;">
                      <tr>
                          <td>
                              <h1>THANKS FOR YOUR INPUT</h1>
                              <p> ${bookingData?.firstName} ${bookingData?.lastName}</p>
                              <p>Thanks for the mini consultation submission.
                                Our team will get in touch with you very soon.
                                View your details below.</p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td>
                  <table cellspacing="0" style="width: 100%; border-collapse: collapse;">
                      <tr>
                          <td colspan="2">
                              <h2>Personal Details</h2>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <table style="width: 100%;">
                                  <tr>
                                      <td style=" padding: 10px 0;"> Name :</td>
                                      <td style=" padding: 10px 0;"> ${
                                        bookingData?.firstName
                                      } ${bookingData?.lastName} </td>
                                  </tr>
                                  <tr>
                                      <td style=" padding: 10px 0;"> Age range :</td>
                                      <td style=" padding: 10px 0;"> ${
                                        bookingData?.ageRange
                                      } </td>
                                  </tr>
                                  <tr>
                                      <td style=" padding: 10px 0;"> Phone number :</td>
                                      <td style=" padding: 10px 0;"> ${
                                        bookingData?.phone
                                      }</td>
                                  </tr>
                                  <tr>
                                      <td style=" padding: 10px 0;"> Email address : </td>
                                      <td style=" padding: 10px 0;"> ${
                                        bookingData?.email
                                      }</td>
                                  </tr>
                                  <tr>
                                      <td style=" padding: 10px 0;">Aesthetic naive :</td>
                                      <td style=" padding: 10px 0;"> ${
                                        bookingData?.hadAestheticTreatmentBefore
                                      }</td>
                                  </tr>
                              </table>
                          </td>
                          <td>
                            <img src="${
                              bookingData?.selectedImage
                                ? /^https?:\/\//.test(bookingData.selectedImage)
                                  ? bookingData.selectedImage
                                  : `${basePath.replace(
                                      /\/$/,
                                      ""
                                    )}/${bookingData.selectedImage.replace(
                                      /^\/+/,
                                      ""
                                    )}`
                                : ""
                            }" 
                              alt="image" style="max-width: 160px; max-height: 160px;" />
                              
                              <br />
                              <span>Image chosen / uploaded</span>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td>
                  <table cellspacing="0" style="width: 100%; border-collapse: collapse;">
                      <tr>
                          <td colspan="2">
                              <h2>Recommended FOR YOU</h2>
                              <h3>${packageData?.packageName}</h3>
                              <p>${packageData?.description}</p>
                          </td>
                      </tr>
                      <tr>
                          <td class="2">
                              <h3>treatments in this package</h3>
                              <span>(Depending on consultation)</span>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td>
                  <table cellspacing="0" style="width: 100%; border-collapse: collapse;">
                          ${packageData?.includes
                            ?.reduce((rows, item, index) => {
                              // Start a new row for every 4th item
                              if (index % 4 === 0) rows.push([]);
                              rows[rows.length - 1].push(item);
                              return rows;
                            }, [])
                            .map(
                              (row) => `
                                  <tr>
                                      ${row
                                        .map(
                                          (includ) => `
                                          <td>
                                              <p style="margin-top: 0;">
                                                  <img src="${
                                                    icon_checkmark || ""
                                                  }" style="position: relative; bottom: -4px;" />
                                                  ${includ}
                                              </p>
                                          </td>
                                      `
                                        )
                                        .join("")}
                                  </tr>
                              `
                            )
                            .join("")}
                      <tr>
                          <td colspan="2">COSTS <br />
                              $${packageData?.amount}</td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td>
                  <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                          <td colspan="2">
                              <h2>Their Areas of Concern</h2>
                          </td>
                          ${bookingData?.areasOfConcern
                            ?.map(
                              (concern) => `
                              <tr>
                                  <td style="color: #000; width: 130px; display: inline-block; padding: 10px 0;">
                                      ${concern?.partName} :
                                  </td>
                                  <td>
                                      ${concern?.question}
                                  </td>
                              </tr>
                          `
                            )
                            .join("")}                    
              </td>
          </tr>
      </table>
      </td>
      </tr>
  
      <tr>
          <td style="text-align:center; background:#B0AEAB; padding: 50px 10px;">
              <p> <a href=""><img src="${clinic_logo}" alt="logo" style="max-width: 100%; height: 42px;" /></a></p>
  
              <P style="font-size: 12px;color: #05050580;">${
                clinicConent?.footer?.footerCopyRight ||
                "© 2024 Structure Clinics. All Rights Reserved."
              }</P>
              <P style="font-size: 12px;">
                  <a href=${
                    clinicConent?.footer?.privacyPolicy || "#"
                  } style="color: #05050580; margin-right: 1.25rem;">Privacy Policy</a>
                  <a href=${
                    clinicConent?.footer?.termsOfService || "#"
                  } style="color: #05050580; margin-right: 1.25rem;">Terms of Service</a>
              </P>
          </td>
      </tr>
      </table>
  
  </body>
  
  </html>
    `;

  return jsxEmailTemplateData;
};
