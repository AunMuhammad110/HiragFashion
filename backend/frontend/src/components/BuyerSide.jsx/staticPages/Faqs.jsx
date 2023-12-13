// import * as React from 'react';
// import { styled } from '@mui/material/styles';
// import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
// import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
// import MuiAccordionSummary, {
//   AccordionSummaryProps,
// } from '@mui/material/AccordionSummary';
// import MuiAccordionDetails from '@mui/material/AccordionDetails';
// import Typography from '@mui/material/Typography';

// export default function Faqs(){
//     return(
//         <div className="static-container">
//             <div className="child-static-container">
//                 <h1>
//                     FAQs
//                 </h1>
//                 <p className="hr-mt-10">We Don’t offer any ‘Exchange’ or ‘Returns’ for any of products.</p>
//                 <p className="hr-mt-10">We Don’t offer any ‘Exchange’ or ‘Returns’ for any of products.</p>
//                 <p className="hr-mt-10">We Don’t offer any ‘Exchange’ or ‘Returns’ for any of products.</p>
//                 <p className="hr-mt-10">We Don’t offer any ‘Exchange’ or ‘Returns’ for any of products.</p>
//                 <p className="hr-mt-10">We Don’t offer any ‘Exchange’ or ‘Returns’ for any of products.</p>
//                 <p className="hr-mt-10">We Don’t offer any ‘Exchange’ or ‘Returns’ for any of products.</p>

//             </div>
//         </div>
//     )
// }

import React, { useState } from "react";
import { styled } from "@mui/system";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

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
        <div className="hr-mt-40" >
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
          <Accordion
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
            className="hr-mt-10"
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
            <Typography variant="body1" fontWeight="500">Q2) Is my payment information secure?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="faq-answer">
              All payments are carried out through a payment secure gateway.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
            className="hr-mt-10"
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
            <Typography variant="body1" fontWeight="500">Q3) How will I know if my order is confirmed?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="faq-answer">
              Unstitched products ship out between 3-5 days, and take 2-5 days to be delivered, depending on your locality within and outside Pakistan. Stitched products require extra processing time according to the requirements of your order.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel4"}
            onChange={handleChange("panel4")}
            className="hr-mt-10"
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
            <Typography variant="body1" fontWeight="500">Q4) How can I cancel my order? </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="faq-answer">
              You may reach out to our team on call, whatsapp, or any of our official social media channels to cancel your order. Please note that the order can only be cancelled if it is not processed by our team.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel5"}
            onChange={handleChange("panel5")}
            className="hr-mt-10"
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
            <Typography variant="body1" fontWeight="500">Q5) How can I make changes to my order?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="faq-answer">
              You may reach out to our team on any of our official social media channels to discuss any changes you’d like to make to your order. Any amendments can be suggested within 24 hours from the receipt of the order. Any amendment to the original order after 24 hours may be subject to additional charges which will be determined after reviewing the requested changes. Depending on the order type, and the time lapsed, changes to certain orders may not apply.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel6"}
            onChange={handleChange("panel6")}
            className="hr-mt-10"
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
            <Typography variant="body1" fontWeight="500">Q6) What is your exchange policy?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="faq-answer">
                For more information about exchange policy, please <span className="underline-text" > Click here! </span>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel7"}
            onChange={handleChange("panel7")}
            className="hr-mt-10"
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
            <Typography variant="body1" fontWeight="500">Q7)What should I do if my product is damaged?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="faq-answer">
              For more information, please Contact via whatsapp with order no and pictures of the produc.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === "panel8"}
            onChange={handleChange("panel8")}
            className="hr-mt-10"
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
            <Typography variant="body1" fontWeight="500">Q8) How will I know if my order is confirmed?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="faq-answer">
              After the order is placed on our website, our customers will be receiving a confirmation Email from our respective team, along with their order details and order number.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel9"}
            onChange={handleChange("panel9")}
            className="hr-mt-10"
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
            <Typography variant="body1" fontWeight="500">Q9) What if the product color varies?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="faq-answer">
              Hira G Fashions ensures that the product descriptions and photographs provided on this web site are accurate and life-like. Whilst the reproduction of colors and styles contained on the photographs shown on this web site are as accurate as image and photographic processing will allow, Hira G Fashions do not accept responsibility for slight variances in color or style.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default Faqs;
