import React, { useEffect, useState } from "react";
import ContentManagementService from "../../../Services/ContentManagement/ContentManagementService";
import showToast from "../../../Utils/Toast/ToastNotification";
import "./ContentManagement.css"; // Import the CSS file
import { Avatar, Box, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const fontOptions = [
  { value: "Roboto", label: "Roboto" },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Verdana', label: 'Verdana' },
];

const ContentManagement = () => {
  const [myContent, setMyContent] = useState({});
  console.log(myContent,"myContent-----")
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");


  const handleFontFamilyChange = (e) => {
    const newFont = e.target.value;
    setMyContent((prevContent) => ({
      ...prevContent,
      footer: {
        ...prevContent.footer,
        fontFamily: newFont,
      },
    }));
  };
  
  const getContent = async () => {
    try {
      const response = await ContentManagementService.getContent();
      // console.log('response---------',response)
      if (response?.data?.statusCode === 200) {
        setMyContent(response?.data?.data);
        setLogoPreview(response?.data?.data?.logo?.path);
      } else {
        showToast("error", response?.data?.message);
      }
    } catch (error) {
      showToast("error", "Failed to fetch content");
    }
  };

  const updateLogo = async () => {
    if (!logo) {
      showToast("error", "Please select a logo to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("logo", logo);
    formData.append("user", JSON.stringify(myContent?.user)); // Include user data if required
    try {
      const response = await ContentManagementService.updateLogo(formData);
      if (response?.data?.statusCode === 200) {
        showToast("success", "Logo updated successfully!");
        setMyContent((prev) => ({
          ...prev,
          logoPath: response?.data?.data?.logoPath,
        }));
      } else {
        showToast("error", response?.data?.message || "Failed to update logo.");
      }
    } catch (error) {
      showToast("error", "Error uploading logo.");
    }
  };

  // Function to handle checkbox changes and send the updated data to the server
  const updateServices = async (updatedServices) => {
    try {
      const updatedContent = await ContentManagementService.updateContent({
        ...myContent,
        services: updatedServices,
      });

      if (updatedContent?.data?.statusCode === 200) {
        setMyContent(updatedContent?.data?.data);
        showToast("success", "Services updated successfully");
      } else {
        showToast("error", updatedContent?.data?.message);
      }
    } catch (error) {
      showToast("error", "Failed to update services");
    }
  };

  const handleCopyPath = (path) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(path)
        .then(() => {
          showToast("success", "Path copied to clipboard!");
        })
        .catch((err) => {
          showToast("error", "Failed to copy path.");
        });
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = path;
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        showToast("success", "Path copied to clipboard!");
      } catch (err) {
        showToast("error", "Failed to copy path.");
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const updatedServices = {
      ...myContent.services,
      [name]: checked,
    };
    setMyContent((prev) => ({
      ...prev,
      services: updatedServices,
    }));
    updateServices(updatedServices);
  };

  const handleTextFieldChange = (section, field, value) => {
    setMyContent((prevContent) => {
      if (field) {
        // Handling nested keys
        return {
          ...prevContent,
          [section]: {
            ...prevContent[section],
            [field]: value,
          },
        };
      } else {
        // Handling top-level keys like `fontFamily`
        return {
          ...prevContent,
          [section]: value,
        };
      }
    });
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append("logo", file);
      formData.append("user", myContent?.user);

      try {
        const response = await ContentManagementService.updateContentLogo(
          formData
        );
        if (response?.data?.statusCode === 200) {
          showToast("success", "Logo updated successfully!");
          setLogoPreview(response?.data?.data?.logo?.path);
        } else {
          showToast(
            "error",
            response?.data?.message || "Failed to update logo."
          );
        }
      } catch (error) {
        showToast("error", "Error uploading logo.");
      }
    }
  };

  // Function to handle form submission and update content
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the body for submission
    const body = {
      user: myContent?.user, // Assuming you have a user object from API
      services: myContent?.services,
      submission: {
        redirectUrl: myContent?.submission?.redirectUrl,
      },
      headingSettings: {
        heading1: myContent?.headingSettings?.heading1,
      },
      step1: {
        // heading1: myContent?.step1?.heading1,
        heading2: myContent?.step1?.heading2,
        step1Description: myContent?.step1?.step1Description,
      },
      step2: {
        // heading1: myContent?.step2?.heading1,
        heading2: myContent?.step2?.heading2,
        step2Description: myContent?.step2?.step2Description,
      },
      step3: {
        // heading1: myContent?.step3?.heading1,
        heading2: myContent?.step3?.heading2,
        step3Description: myContent?.step3?.step3Description,
      },
      step4: {
        // heading1: myContent?.step4?.heading1,
        heading2: myContent?.step4?.heading2,
        step4Description: myContent?.step4?.step4Description,
      },
      buttonSettings: {
        buttonColor: myContent?.buttonSettings?.buttonColor,
        buttonHoverColor: myContent?.buttonSettings?.buttonHoverColor,
        buttonTextColor: myContent?.buttonSettings?.buttonTextColor
      },
      stepperSettings: {
        stepperColor: myContent?.stepperSettings?.stepperColor,
      },
      footer: {
        footerCopyRight: myContent?.footer?.footerCopyRight,
        termsOfService: myContent?.footer?.termsOfService,
        privacyPolicy: myContent?.footer?.privacyPolicy,
        footerColor: myContent?.footer?.footerColor,
        footerTextColor: myContent?.footer?.footerTextColor,
        footerSocialMediaLinks: myContent?.footer?.footerSocialMediaLinks,
      },
      font: {
        fontFamily: myContent?.font?.fontFamily,
      },
      header: {
        headerColor: myContent?.header?.headerColor,
      },
      submitForm: {
        submitDescription: myContent?.submitForm?.submitDescription,
        submitTitle: myContent?.submitForm?.submitTitle,
      },
      isDeleted: myContent?.isDeleted || false,
      // fontFamily: myContent?.fontFamily || "", // Dynamically adding key
    };

    try {
      const updatedContent = await ContentManagementService.updateContent(body);
      console.log('response---------',updatedContent)

      if (updatedContent?.data?.statusCode === 200) {
        setMyContent(updatedContent?.data?.data);
        showToast("success", "Content updated successfully!");
      } else {
        showToast("error", "Failed to update content.");
      }
    } catch (error) {
      showToast("error", "Error submitting content.");
    }
  };

  const resetPage = async () => {
    try {
      const resetPageContent = await ContentManagementService.resetDesign();
      if (resetPageContent?.data?.statusCode === 200) {
        showToast("success", "Content reset successfully!");
        setMyContent({});
      } else {
        showToast("error", "Failed to reset content.");
      }
    } catch (error) {
      showToast("error", "Error resetting content.");
    }
  };

  useEffect(() => {
    getContent();
  }, []);

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Content Management
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          className="logo-avatar-section"
          style={{ position: "relative", display: "inline-block" }}
        >
          <label htmlFor="logo-upload" style={{ cursor: "pointer" }}>
            <Avatar
              src={logoPreview || (myContent?.logoPath ? `${myContent.logoPath}?t=${Date.now()}` : "/default-logo.png")}
              alt="Logo"
              sx={{ width: 100, height: 100, cursor: "pointer" }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 5,
                right: 5,
                background: "white",
                borderRadius: "50%",
                padding: "4px",
                boxShadow: 1,
              }}
            >
              <EditIcon fontSize="small" sx={{ color: "#1976d2" }} />
            </Box>
          </label>
          <input
            type="file"
            id="logo-upload"
            accept="image/*"
            onChange={handleLogoChange}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        {/* Services Section (Checkboxes for face, body) */}
        <div className="checkbox-container">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="face"
              checked={myContent?.services?.face}
              onChange={handleCheckboxChange}
              className="custom-checkbox"
            />
            Face
          </label>
          {myContent?.paths?.face && (
            <div className="path-display">
              <input
                type="text"
                value={myContent?.paths?.face}
                readOnly
                className="readonly-input"
              />
              <button
                type="button"
                className="copy-button"
                onClick={() => handleCopyPath(myContent?.paths?.face)}
              >
                Copy
              </button>
            </div>
          )}
        </div>

        <div className="checkbox-container">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="body"
              checked={myContent?.services?.body}
              onChange={handleCheckboxChange}
              className="custom-checkbox"
            />
            Body
          </label>
          {myContent?.paths?.body && (
            <div className="path-display">
              <input
                type="text"
                value={myContent?.paths?.body}
                readOnly
                className="readonly-input"
              />
              <button
                type="button"
                className="copy-button"
                onClick={() => handleCopyPath(myContent?.paths?.body)}
              >
                Copy
              </button>
            </div>
          )}
        </div>

        {/* Step Fields (step1, step2, step3, step4) */}
        <div className="step-sections">
          {["step1", "step2", "step3", "step4"].map((step, index) => (
            <div key={index} className="step-section">
              <h4>{`Step ${index + 1} Content`}</h4>
              <div className="step-fields">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Insert the title of the step here..."
                  value={myContent?.[step]?.heading2 || ""}
                  onChange={(e) =>
                    handleTextFieldChange(step, "heading2", e.target.value)
                  }
                />
                <label>Description Text</label>
                <textarea
                  placeholder="Insert the description text of the step here..."
                  value={myContent?.[step]?.[`${step}Description`] || ""}
                  onChange={(e) =>
                    handleTextFieldChange(
                      step,
                      `${step}Description`,
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="step-sections">
            <div className="step-section">
              <label className="main-heading">
                <h4>Quick Treatment Overview Heading Content</h4>
              </label>
              <textarea
                type="text"
                style={{ width: "100%", height: "100%" }}
                className="readonly-input"
                placeholder="Example : Personalised treatment options in 2 minutes"
                value={myContent?.headingSettings?.heading1 || ""}
                onChange={(e) =>
                  handleTextFieldChange(
                    "headingSettings",
                    "heading1",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Button Settings */}
            <div className="step-section">
              <h4>Button</h4>
              <div className="step-fields">
                <label>Button Color</label>
                <input
                  type="color"
                  value={myContent?.buttonSettings?.buttonColor || "#ffffff"}
                  onChange={(e) =>
                    handleTextFieldChange(
                      "buttonSettings",
                      "buttonColor",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="step-fields">
                <label>Button Hover Color</label>
                <input
                  type="color"
                  value={
                    myContent?.buttonSettings?.buttonHoverColor || "#ffffff"
                  }
                  onChange={(e) =>
                    handleTextFieldChange(
                      "buttonSettings",
                      "buttonHoverColor",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="step-fields">
                <label>Button Text Color</label>
                <input
                  type="color"
                  value={
                    myContent?.buttonSettings?.buttonTextColor || "#ffffff"
                  }
                  onChange={(e) =>
                    handleTextFieldChange(
                      "buttonSettings",
                      "buttonTextColor",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* <div className="step-section">
              <h4>Footer</h4>
              <div className="step-fields">
                <label>Font Family</label>
                <select
                  value={myContent?.font?.fontFamily || 'Arial'}
                  // onChange={handleFontFamilyChange}
                  onChange={(e) =>
                    handleTextFieldChange(
                      "font",
                      "fontFamily",
                      e.target.value
                    )
                  }
                >
                  {fontOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div style={{ fontFamily: myContent?.font?.fontFamily }}>
                  lorem this work
                </div>
              </div>
            </div> */} 

            {/* Footer Section */}
            <div className="step-section">
              <h4>Footer</h4>
              <div className="step-fields">
                <label>Footer copyright©</label>
                <input
                  type="text"
                  placeholder="Example : © 2024 Structure Clinics. All Rights Reserved."
                  value={myContent?.footer?.footerCopyRight || ""}
                  onChange={(e) =>
                    handleTextFieldChange(
                      "footer",
                      "footerCopyRight",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="step-fields">
                <label>Font Family</label>
                <select
                  value={myContent?.font?.fontFamily || 'Arial'}
                  // onChange={handleFontFamilyChange}
                  onChange={(e) =>
                    handleTextFieldChange(
                      "font",
                      "fontFamily",
                      e.target.value
                    )
                  }
                >
                  {fontOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="step-fields">
                <label>Footer Color</label>
                <input
                  type="color"
                  value={myContent?.footer?.footerColor || "#ffffff"}
                  onChange={(e) =>
                    handleTextFieldChange(
                      "footer",
                      "footerColor",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="step-fields">
                <label>Footer Text Color</label>
                <input
                  type="color"
                  value={myContent?.footer?.footerTextColor || "#ffffff"}
                  onChange={(e) =>
                    handleTextFieldChange(
                      "footer",
                      "footerTextColor",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* Header Section */}
            <div className="step-section">
              <h4>Header</h4>
              <div className="step-fields">
                <label>Header Color</label>
                <input
                  type="color"
                  value={myContent?.header?.headerColor || "#ffffff"}
                  onChange={(e) =>
                    handleTextFieldChange(
                      "header",
                      "headerColor",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* Submition form */}
            <div className="step-fields">
              <label className="main-heading">
                <h4>Submission Form Conent</h4>
              </label>
              <label>Title</label>
              <input
                type="text"
                placeholder="Insert the title submission form here..."
                value={myContent?.submitForm?.submitTitle || ""}
                onChange={(e) =>
                  handleTextFieldChange(
                    "submitForm",
                    "submitTitle",
                    e.target.value
                  )
                }
              />

              <label>Description</label>
              <textarea
                type="text"
                style={{ width: "100%" }}
                className="readonly-input"
                placeholder="Example : Add a text which will be diplayed to patient"
                value={myContent?.submitForm?.submitDescription || ""}
                onChange={(e) =>
                  handleTextFieldChange(
                    "submitForm",
                    "submitDescription",
                    e.target.value
                  )
                }
              />
              <div className="step-fields">
                <label>After submission url to redirect user</label>
                <input
                  type="text"
                  placeholder="https://www.google.com/"
                  value={myContent?.submission?.redirectUrl || ""}
                  onChange={(e) =>
                    handleTextFieldChange(
                      "submission",
                      "redirectUrl",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* <div className="step-fields">
              <div className="step-fields">
                <label>Font</label>
                <select
                  value={myContent?.fontFamily || ""}
                  onChange={(e) =>
                    handleTextFieldChange("fontFamily", null, e.target.value)
                  }
                >
                  <option value="">Select a font</option>
                  {fontFamilies.map((font) => (
                    <option
                      key={font}
                      value={font}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </option>
                  ))}
                </select>
              </div>
            </div> */}

            {/* Social Media Links */}
            <div className="step-section">
              <h4>Social Media Links</h4>
              <div className="step-fields">
                <label>Facebook</label>
                <input
                  type="text"
                  placeholder="https://www.facebook.com/"
                  value={
                    myContent?.footer?.footerSocialMediaLinks?.facebook || ""
                  }
                  onChange={(e) =>
                    handleTextFieldChange("footer", "footerSocialMediaLinks", {
                      ...myContent?.footer?.footerSocialMediaLinks,
                      facebook: e.target.value,
                    })
                  }
                />
              </div>
              <div className="step-fields">
                <label>Instagram</label>
                <input
                  type="text"
                  placeholder="https://www.instagram.com/"
                  value={
                    myContent?.footer?.footerSocialMediaLinks?.instagram || ""
                  }
                  onChange={(e) =>
                    handleTextFieldChange("footer", "footerSocialMediaLinks", {
                      ...myContent?.footer?.footerSocialMediaLinks,
                      instagram: e.target.value,
                    })
                  }
                />
              </div>
              <div className="step-fields">
                <label>YouTube</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/channel/"
                  value={
                    myContent?.footer?.footerSocialMediaLinks?.youtube || ""
                  }
                  onChange={(e) =>
                    handleTextFieldChange("footer", "footerSocialMediaLinks", {
                      ...myContent?.footer?.footerSocialMediaLinks,
                      youtube: e.target.value,
                    })
                  }
                />
              </div>
              <div className="step-fields">
                <label>Threads</label>
                <input
                  type="text"
                  placeholder="https://www.threads.net/"
                  value={
                    myContent?.footer?.footerSocialMediaLinks?.threads || ""
                  }
                  onChange={(e) =>
                    handleTextFieldChange("footer", "footerSocialMediaLinks", {
                      ...myContent?.footer?.footerSocialMediaLinks,
                      threads: e.target.value,
                    })
                  }
                />
              </div>
              <div className="step-fields">
                <label>LinkedIn</label>
                <input
                  type="text"
                  placeholder="https://www.linkedin.com/in/username/"
                  value={
                    myContent?.footer?.footerSocialMediaLinks?.linkedin || ""
                  }
                  onChange={(e) =>
                    handleTextFieldChange("footer", "footerSocialMediaLinks", {
                      ...myContent?.footer?.footerSocialMediaLinks,
                      linkedin: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="step-section">
              <h4>Privacy Policy & Terms Of Service</h4>

              {/* Privacy Policy */}
              <div className="step-fields">
                <label>Privacy Policy URL</label>
                <input
                  type="text"
                  placeholder="Example: https://www.example.com/privacy-policy"
                  value={myContent?.footer?.privacyPolicy || ""}
                  onChange={(e) =>
                    handleTextFieldChange(
                      "footer",
                      "privacyPolicy",
                      e.target.value
                    )
                  }
                />
              </div>

              {/* Terms of Service */}
              <div className="step-fields">
                <label>Terms of Service URL</label>
                <input
                  type="text"
                  placeholder="Example: https://www.example.com/terms-of-service"
                  value={myContent?.footer?.termsOfService || ""}
                  onChange={(e) =>
                    handleTextFieldChange(
                      "footer",
                      "termsOfService",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Save
          </button>
          <button type="button" className="submit-button" onClick={resetPage}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentManagement;
