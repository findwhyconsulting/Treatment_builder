import path from "path";
import fs from "fs";
import util from "util";
import { sendCustomEmail } from "./sendEmail";
import {
  customeJsxTemplatForClinicWithPatientDetails,
  customeJsxTemplatForPatientWintClinicDetails,
} from "./templates/confirmBookingForClinic";
import { generatePDFviaHtml } from "./customeFunction";

const readFileAsync = util.promisify(fs.readFile);
const RegistrationTemplate = path.resolve(
  __dirname,
  "../",
  "utils/templates/registration.html"
);
const ForgotPasswordTemplate = path.resolve(
  __dirname,
  "../",
  "utils/templates/forgetPassword.html"
);

const ClinicBookingTemplate = path.resolve(
  __dirname,
  "../",
  "utils/templates/confirmBookingClinic.html"
);

const PatientBookingTemplate = path.resolve(
  __dirname,
  "../",
  "utils/templates/confirmBookingPatient.html"
);

// Function to replace placeholders in HTML and send email
export const EmailProcess = async (data) => {
  try {
    // Read the template file
    const htmlTemplate = await readFileAsync(RegistrationTemplate, "utf-8");

    // Manually replace the placeholders based on custom mapping
    let customizedHtml = htmlTemplate;

    // Define custom replacements here
    const replacements = {
      "{{userName}}": data.firstName + ` ` + data.lastName,
      "{{userEmail}}": data.userEmail,
      "{{userPassword}}": data.userPassword,
      //   "{{otherCustomKey}}": data.otherCustomValue, // Add more if needed
    };

    // Loop through the replacements and apply them one by one
    for (const placeholder in replacements) {
      const value = replacements[placeholder];
      customizedHtml = customizedHtml.replace(
        new RegExp(placeholder, "g"),
        value
      );
    }

    // Send the updated HTML with replaced values
    if (customizedHtml) {
      await sendCustomEmail({
        to: data?.userEmail, // Single recipient or array of emails
        subject: "Treatment Builder Notification",
        html: customizedHtml, // Use for HTML
      });
    }
  } catch (error) {
    throw new Error("Failed to generate email HTML");
  }
};

// Function to replace placeholders in HTML and send email
export const verifyForgotPassword = async (data) => {
  try {
    // Read the template file
    const htmlTemplate = await readFileAsync(ForgotPasswordTemplate, "utf-8");

    // Manually replace the placeholders based on custom mapping
    let customizedHtml = htmlTemplate;

    // Define custom replacements here
    const replacements = {
      "{{userName}}": data.firstName + ` ` + data.lastName,
      "{{resetLink}}": data.resetLink,
      "{{currentYear}}": data.currentYear,
      //   "{{otherCustomKey}}": data.otherCustomValue, // Add more if needed
    };

    // Loop through the replacements and apply them one by one
    for (const placeholder in replacements) {
      const value = replacements[placeholder];
      customizedHtml = customizedHtml.replace(
        new RegExp(placeholder, "g"),
        value
      );
    }

    // Send the updated HTML with replaced values
    if (customizedHtml) {
      const sendEmail = await sendCustomEmail({
        to: data?.userEmail, // Single recipient or array of emails
        subject: "Forgot your password ? Check this!",
        html: customizedHtml, // Use for HTML
      });
      if (sendEmail) {
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.log(error.message);

    throw new Error("Failed to generate email HTML");
  }
};

// // send email to clinic with email template for patient appointments
// export const sendPatientAppointmentEmailToClinic = async (data) => {
//   try {
//     console.log("data : ", data);
//     const bookingData = data?.bookingData;
//     const clinicData = data?.clinicData;
//     const clinicConent = data?.clinicConent;
//     const packageData = data?.packageData;

//     const sendEmailToClinicTemplate = await readFileAsync(
//       ClinicBookingTemplate,
//       "utf-8"
//     );

//     // Manually replace the placeholders based on custom mapping
//     let customizedHtml = sendEmailToClinicTemplate;

//     let selectedImagePath = `${process.env.BASE_PATH}${bookingData.selectedImage}`;
//     console.log("selectedImagePath : ", selectedImagePath);

//     // Generate the includes list as HTML in columns with icons
//     const includes = packageData?.includes || [];
//     const includesPerColumn = 3; // Adjust as needed
//     const columns = [];
//     for (let i = 0; i < includes.length; i += includesPerColumn) {
//       const columnItems = includes.slice(i, i + includesPerColumn);
//       const columnHtml = `
//          <td>
//            ${columnItems
//              .map(
//                (item) => `
//                <p style="margin-top: 0;">
//                  <img src="${process.env.BASE_PATH}/check.png" style="position: relative; bottom: -4px; margin-right: 8px;" />
//                  ${item}
//                </p>
//              `
//              )
//              .join("")}
//          </td>`;
//       columns.push(columnHtml);
//     }
//     const includesColumns = columns.join("");

//     // Generate dynamic rows for Areas of Concern
//     const areasOfConcern = bookingData?.areasOfConcern || [];
//     const areasOfConcernRows = areasOfConcern
//       .map(
//         (area) => `
//         <tr>
//             <td style="color: #000; width: 130px; display: inline-block; padding: 10px 0;">${area.partName}:</td>
//             <td style="padding: 10px 0;">${area.question}</td>
//         </tr>`
//       )
//       .join("");

//     // Define custom replacements here
//     const replacements = {
//       "{{userName}}": bookingData?.firstName + ` ` + bookingData?.lastName,
//       "{{ageRange}}": bookingData?.ageRange,
//       "{{phoneNumber}}": bookingData?.phone,
//       "{{email}}": bookingData?.email,
//       "{{selectedImage}}": selectedImagePath ? selectedImagePath : "",
//       "{{aestheticValue}}": bookingData?.hadAestheticTreatmentBefore
//         ? bookingData.hadAestheticTreatmentBefore.charAt(0).toUpperCase() +
//           bookingData.hadAestheticTreatmentBefore.slice(1)
//         : bookingData?.hadAestheticTreatmentBefore,
//       "{{packageName}}": packageData?.packageName,
//       "{{packageAmount}}": packageData?.amount,
//       "{{packageDescription}}": packageData?.description,
//       "{{includesColumns}}": includesColumns,
//       "{{areasOfConcernRows}}": areasOfConcernRows,

//       //   "{{otherCustomKey}}": data.otherCustomValue, // Add more if needed
//     };

//     // Loop through the replacements and apply them one by one
//     for (const placeholder in replacements) {
//       const value = replacements[placeholder];
//       customizedHtml = customizedHtml.replace(
//         new RegExp(placeholder, "g"),
//         value
//       );
//     }

//     // Send the updated HTML with replaced values
//     if (customizedHtml) {
//       const sendEmail = await sendCustomEmail({
//         to: clinicData?.email, // Single recipient or array of emails
//         subject: "Someone booked an online consultation!",
//         html: customizedHtml, // Use for HTML
//       });
//       console.log("sendEmail", sendEmail);

//       if (sendEmail) {
//         return true;
//       } else {
//         return false;
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// // send email to clinic with email template for patient appointments
// export const sendAppointmentConfirmatiopnToPatient = async (data) => {
//   try {
//     console.log("data patient: ", data);
//     const bookingData = data?.bookingData;
//     const clinicData = data?.clinicData;
//     const clinicConent = data?.clinicConent;
//     const sendEmailToPatientTemplate = await readFileAsync(
//       PatientBookingTemplate,
//       "utf-8"
//     );

//     // Manually replace the placeholders based on custom mapping
//     let customizedHtml = sendEmailToPatientTemplate;

//     // Define custom replacements here
//     const replacements = {
//       "{{userName}}": bookingData.firstName + ` ` + bookingData.lastName,
//       //   "{{otherCustomKey}}": data.otherCustomValue, // Add more if needed
//     };

//     // Loop through the replacements and apply them one by one
//     for (const placeholder in replacements) {
//       const value = replacements[placeholder];
//       customizedHtml = customizedHtml.replace(
//         new RegExp(placeholder, "g"),
//         value
//       );
//     }

//     // Send the updated HTML with replaced values
//     if (customizedHtml) {
//       const sendEmail = await sendCustomEmail({
//         to: bookingData?.email, // Single recipient or array of emails
//         subject: "Consultation Booking Confirmation!",
//         html: customizedHtml, // Use for HTML
//       });
//       if (sendEmail) {
//         return true;
//       } else {
//         return false;
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

/**
 * This section is used to return an html to send email to clinic, this function uses a custome function which will
 * chnage the html code as jsx and return it to the user email
 * @param {html}
 * @param {string}
 * @param {data}
 */
export const sendEmailToClinicWithPatientDetails = async (data) => {
  try {
    const clinicData = data?.clinicData;
    const userData = data?.bookingData;
    // console.log(clinicData, "clinicData--------------------------------");

    const getGeneratedEmailWithPatientData =
      await customeJsxTemplatForClinicWithPatientDetails(data);
      console.log(data,"emaildata");
    if (getGeneratedEmailWithPatientData) {
      const sendEmail = await sendCustomEmail({
        to: clinicData?.email, // Single recipient or array of emails
        subject: `${userData.firstName} ${userData.lastName} booked an online consultation`,
        html: getGeneratedEmailWithPatientData, // Use for HTML
      });

      if (sendEmail) {
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.log("error", error);
    return error;
  }
};

/**
 * This section is used to return an html to send email to patient, this function uses a custome function which will
 * chnage the html code as jsx and return it to the patient email
 * @param {html}
 * @param {string}
 * @param {data}
 */
// export const sendEmailToPatientWithAllDetails = async (
//   data,
//   savedConsultation
// ) => {
//   try {
//     const bookingData = data?.bookingData;

//     const getGeneratedEmailWithPatientData =
//       await customeJsxTemplatForPatientWintClinicDetails(data);

//     const getPDFAttachment = await generatePDFviaHtml(
//       getGeneratedEmailWithPatientData,
//       savedConsultation
//     );

//     if (getGeneratedEmailWithPatientData) {
//       const sendEmail = await sendCustomEmail({
//         to: bookingData?.email, // Single recipient or array of emails
//         subject: "Booking an online consultation!",
//         html: getGeneratedEmailWithPatientData, // Use for HTML
//         attachments: [getPDFAttachment],
//       });

//       if (sendEmail) {
//         return true;
//       } else {
//         return false;
//       }
//     }
//   } catch (error) {
//     console.log("error", error);
//     return error;
//   }
// };

export const sendEmailToPatientWithAllDetails = async (data, savedConsultation) => {
  try {
    console.log("📌 Generating email template...");
    const emailTemplate = await customeJsxTemplatForPatientWintClinicDetails(data);
    
    if (!emailTemplate) {
      console.error("❌ Error: Email template generation failed.");
      return false;
    }

    console.log("📌 Generating PDF...");
    const pdfAttachment = await generatePDFviaHtml(emailTemplate, savedConsultation);

    if (!pdfAttachment) {
      console.error("❌ PDF generation failed. Email will not be sent.");
      return false;
    }

    console.log("📌 Sending email with attachment...");
    const sendEmail = await sendCustomEmail({
      to: data?.bookingData?.email, // Ensure recipient exists
      subject: "You Booked an online consultation!",
      html: emailTemplate, // Email body
      attachments: pdfAttachment, // Attach PDF
    });

    if (sendEmail) {
      console.log("✅ Email sent successfully.");
      return true;
    } else {
      console.error("❌ Email sending failed.");
      return false;
    }
  } catch (error) {
    console.error("❌ Error in sendEmailToPatientWithAllDetails:", error);
    return false;
  }
};

// export const sendEmailToPatientWithAllDetails = async (data, savedConsultation) => {
//   try {
//     console.log("Generating email template...");
//     const emailTemplate = await customeJsxTemplatForPatientWintClinicDetails(data);
    
//     console.log("Generating PDF...");
//     const pdfAttachment = await generatePDFviaHtml(emailTemplate, savedConsultation);

//     if (!pdfAttachment) {
//       console.error("PDF generation failed. Email will be sent without an attachment.");
//       return false; // Prevent email from being sent if the PDF fails
//     }

//     console.log("Sending email with attachment...");
//     const sendEmail = await sendCustomEmail({
//       to: data?.bookingData?.email, // Ensure recipient exists
//       subject: "Booking an online consultation!",
//       html: emailTemplate, // Email body
//       attachments: pdfAttachment, // Attach PDF
//     });

//     if (sendEmail) {
//       console.log("Email sent successfully.");
//       return true;
//     } else {
//       console.error("Email sending failed.");
//       return false;
//     }
//   } catch (error) {
//     console.error("Error in sendEmailToPatientWithAllDetails:", error);
//     return false;
//   }
// };
