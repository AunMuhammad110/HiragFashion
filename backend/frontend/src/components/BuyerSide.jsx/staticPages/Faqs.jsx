import React, { lazy, Suspense, useState } from "react";
import { styled } from "@mui/system"; // Import styled here

const ArrowForwardIosSharpIcon = lazy(() => import("@mui/icons-material/ArrowForwardIosSharp"));
const MuiAccordion = lazy(() => import("@mui/material/Accordion"));
const MuiAccordionDetails = lazy(() => import("@mui/material/AccordionDetails"));
const MuiAccordionSummary = lazy(() => import("@mui/material/AccordionSummary"));
const Typography = lazy(() => import("@mui/material/Typography"));

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function Faqs() {
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className="static-container">
      <div className="faq-static-container">
        <h1 className="font-60">FAQs</h1>
        <p className="font-grey-color">Frequently Asked Questions </p>
        <p className="font-grey-color">Here are some common questions about Hira g Fashion.</p>
        <div className="hr-mt-40">
          <Suspense fallback={<div>Loading...</div>}>
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography variant="body1" fontWeight="500">Q1) How will I know if my order is confirmed?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography className="faq-answer">
                  After the order is placed on our website, our customers will be receiving a confirmation Email from our respective team, along with their order details and order number.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default Faqs;
