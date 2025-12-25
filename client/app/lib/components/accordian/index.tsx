"use client";

import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

interface AccordianProps {
  title: React.ReactNode;
}

function Accordian({ title, children }: PropsWithChildren<AccordianProps>) {
  return (
    <Accordion sx={{ border: '1px solid black' }}>
      <AccordionSummary sx={{ width: '100%' }}>
        {title}
      </AccordionSummary>
      <AccordionDetails>
        {children}
      </AccordionDetails>
    </Accordion>
  )
}

export default Accordian;