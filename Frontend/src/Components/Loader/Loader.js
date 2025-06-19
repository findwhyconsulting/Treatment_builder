import React from "react";
import { DNA } from "react-loader-spinner";
import "./Loader.css";
const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <DNA
        visible={true}
        height="150"
        width="150"
        ariaLabel="dna-loading"
        wrapperClass="dna-wrapper"
      />
    </div>
  );
};

export default Loader;
