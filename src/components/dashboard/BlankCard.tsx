import React from "react";

/**
 * Renders a blank card with fixed dimensions and styling
 * @returns JSX.Element - The rendered blank card
 */
const BlankCard: React.FC = () => {
  return (
    <div className="relative w-[408px] h-[1262px] max-xs:h-[932px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full" />
  );
};

export default BlankCard;
