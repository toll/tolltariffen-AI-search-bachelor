import React from "react";

// Define the styles for the custom spinner that encircles the SVG
const spinnerStyle: React.CSSProperties = {
  //   border: "8px solid #f3f3f3", // Light grey for fallback
  //   borderTopColor: "red",
  //   borderRightColor: "red",
  //   borderBottomColor: "blue",
  //   borderLeftColor: "white",
  //   borderRadius: "50%",
  //   width: "420px", // Size adjusted to encircle the SVG appropriately
  //   height: "420px",
  //   animation: "spin 2s linear infinite",
  //   position: "absolute", // Position relative to its parent flex container
  border: "6px solid #f3f3f3", // Light grey
  borderTop: "6px solid #3498db", // Blue
  borderRadius: "50%",
  width: "50px",
  height: "50px",
  animation: "spin 2s linear infinite",
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

// // Import the SVG from the public folder
// const svgStyle: React.CSSProperties = {
//     width: '300px',
//     height: '300px',
//     zIndex: 1, // Ensure the SVG is above the spinner
// };

// Global styles with keyframe animations
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingIndicator = () => (
  <>
    <style>{globalStyles}</style>
    <div style={overlayStyle}>
      <div style={spinnerStyle}></div>
      {/* <img src="/norway_loading.svg" style={svgStyle} alt="Loading..." /> */}
    </div>
  </>
);

export default LoadingIndicator;
