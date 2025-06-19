import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Face from "../Face/Face";
import Body from "../Body/Body";
import PublicContentManagementService from "../../../Services/PublicServices/ContentServices";
import showToast from "../../../Utils/Toast/ToastNotification";
import PublicHeader from "../../../Components/PublicHeader/PublicHeader";
import PublicFooter from "../../../Components/PublicFooter/PublicFooter";

const DynamicPage = () => {
  const { username, part } = useParams();
  const [content, setContent] = useState(null);
  const [isServiceAvailable, setIsServiceAvailable] = useState(true); // To handle service availability

  const fetchContent = async () => {
    try {
      const getContent = await PublicContentManagementService.getPublicContent({
        userName: username,
        part: part,
      });

      if (getContent?.data?.statusCode === 200) {
        setContent(getContent?.data?.data);
        setIsServiceAvailable(true);
      } else {
        setIsServiceAvailable(false);
        showToast("error", getContent?.data?.message);
      }
    } catch (error) {
      setIsServiceAvailable(false);
      showToast("error", "Something went wrong");
    }
  };

  useEffect(() => {
    fetchContent();
  }, [username, part]);

  return (
    <div>
      <PublicHeader content={content} />
      {isServiceAvailable ? (
        <>
          {part === "face" && <Face content={content} />}
          {part === "body" && <Body content={content} />}
        </>
      ) : (
        <div className="empty-areas">
          <h3>Clinic does not provide the service</h3>
        </div>
      )}
      <PublicFooter content={content} />
    </div>
  );
};

export default DynamicPage;
