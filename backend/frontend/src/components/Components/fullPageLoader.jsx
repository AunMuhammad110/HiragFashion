import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function SimpleBackdrop() {
  return (
      <div className="flex-container">
        <div>
          <CircularProgress color="inherit" />
        </div>
      </div>
  );
}
