"use client";

import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

interface AccordianProps {
  title: React.ReactNode;
  maxHeight?: number;
}

function Accordian({ title, children, maxHeight = 600 }: PropsWithChildren<AccordianProps>) {
  return (
    <Accordion className="border border-black bg-[#27272A]! overflow-hidden">
      <AccordionSummary className="w-full">
        {title}
      </AccordionSummary>
      <AccordionDetails sx={{ maxHeight: `min(${maxHeight}px, 70vh)` }} className="overflow-y-auto overflow-hidden">
        {children}
      </AccordionDetails>
    </Accordion>
  )
}

export default Accordian;