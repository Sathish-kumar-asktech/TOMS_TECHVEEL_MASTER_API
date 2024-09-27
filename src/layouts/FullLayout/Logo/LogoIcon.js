import React from "react";
import logoicn from "../../../assets/images/images.png";
const LogoIcon = (props) => {
  return (
    <img
      alt="Logo"
      style={{ objectFit: "contain", maxWidth: 200, backgroundColor: "white" }}
      src={logoicn}
      {...props}
    />
  );
};

export default LogoIcon;
