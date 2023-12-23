
import React, { useState } from "react";
import { styled } from "@mui/system";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import './form.css';
import { useDataContext } from "../useContextt/context";

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
    marginLeft: theme.spacing(0),marginBottom:theme.spacing(0)
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(0),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));


const TotalDrop = ({shipmentTotal}) => {
    const { data, TotalCalculator } = useDataContext();


    const [expanded, setExpanded] = useState(false);

    const handleChange = () => {
      setExpanded(!expanded);
    };
  
    return(
        <>
         <div className="" >
          <Accordion
            onChange={handleChange}
          >
           <AccordionSummary
  aria-controls="panel1d-content"
  id="panel1d-header"
>
  <Typography variant="body1" fontWeight="500" className="row" style={{ display: "flex", justifyContent: "space-between",width:"100%",height:"3vh"}}>
    <div  className="col-6" style={{ textAlign: "left" ,display:"flex",justifyContent:"center",alignItems:"center"}}>Order Summary</div>
    <div className="col-6 "style={{ textAlign: "right" }}>Rs. {shipmentTotal+TotalCalculator()}.00/-</div>
  </Typography>
</AccordionSummary>

            <AccordionDetails>
              <Typography >
              {/* <div className="col-md-5 col-12 " style={{paddingLeft:"1px",paddingLeft:"2px"}}> */}
              <div className="col-md-5 col-12 ">
                                    <div className="row seq-ord-1 h-10" >
                                        {data && data.map((item) =>(
                                        <div style={{display:"flex",minHeight:"100px",height:"auto",minWidth:"100%",marginTop:"10px"}}>
                                        <div className="col-3" style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                                        <a href="#" className="anchirr" >
                                                                 <img className="imageee" src={item._doc.images[0]} alt="Your Alt Text" 
                                                                 style={{ maxWidth: "80px", width: "80px", maxHeight: "90px"}} />   
                                                                    <span className="bg-dark poss" style={{ color: "#fff" }}>
                                                                        <p style={{ display: "flex", justifyContent: "center", alignItems: "center",backgroundColor:"blue" }}>
                                                                            {item.quantity}</p></span>
                                                                            </a>
                                        </div>
                                        <div className="col-6" style={{paddingLeft:"7px",paddingRight:"4px",display:"flex",justifyContent:"center",alignItems:"center"}}>
                                                                <p style={{fontSize:"14px"}}>{item._doc.brandName} {item._doc.productTitle}</p>
                                        </div>
                                        <div className="col-3" style={{paddingLeft:"2px",paddingRight:"2px",display:"flex",justifyContent:"center",alignItems:"center"}}>
                                        <div id="pos"><span>Rs. {item._doc.productPrice}.00/-</span></div>
                                        </div>
                                        <br />
                                        </div>
                                        
                                            ))}
                                        {/* second and so onm */}
                                    </div>

                                    <hr />
                                    {/* belwo is for calcualtion */}
                                    <div className="row" >
                                    <div className="col-6">
                                                Subtotal <br />
                                                Shipping
                                    </div>
                                    <div className="col-6" style={{display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
                                                <div className="pr-2"  style={{ textAlign: 'right', fontSize: '16px', paddingLeft: 0 }}>
                                                    Rs.{TotalCalculator()}.00/-
                                                </div>
                                                <div className="pr-2" style={{ textAlign: 'right', fontSize: '16px', paddingLeft: 0 }}>
                                                    {shipmentTotal !== 0 ? (
                                                        `Rs.${shipmentTotal}.00/-`
                                                    ) : (
                                                        <span style={{ textAlign: 'right', paddingLeft: 0 }}>Calculating...</span>
                                                    )}
                                                </div>
                                            </div>
                                    </div>

                                    {/* <div className="row">
                                        <div className="shipment">
                                            <div className="col-6 aligng">
                                                Subtotal <br />
                                                Shipping
                                            </div>
                                            <div className="col-6 amountts">
                                                <div className="row pr-2">
                                                    Rs.{TotalCalculator()}.00
                                                </div>
                                                <div className="row pr-2" style={{ textAlign: 'right', fontSize: '16px', paddingLeft: 0 }}>
                                                    {shipmentTotal !== 0 ? (
                                                        `Rs.${shipmentTotal}.00`
                                                    ) : (
                                                        <span style={{ textAlign: 'right', paddingLeft: 0 }}>Calculating...</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    <hr />
                                    <div className="row">
                                            <div className="col-6">
                                                Total
                                            </div>
                                            <div className="col-6 " style={{ textAlign: 'right', fontSize: '16px', paddingLeft: 0 }}>
                                                <div className="pr-2">
                                                    Rs.{shipmentTotal + TotalCalculator()}.00/-
                                                </div>
                                            </div>
                                    </div>


                                </div>                
              </Typography>
            </AccordionDetails>
          </Accordion>
          </div>
        </>
    )
;}
export default TotalDrop;