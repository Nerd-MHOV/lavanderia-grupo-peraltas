import { Button } from "@/components/ui/button";
import React from "react";

const ButtonsOrderDescribe = ({ buttonText }: { buttonText: string }) => {
  const openModal = () => {
    (
      document.querySelector(".open-modal-confirmation") as HTMLElement
    )?.click();
  };

  return (
    <div className="flex justify-center px-8 ">
      {/* <Button className="bg-btnRed hover:bg-btnRedHover font-bold ">
        Remover
      </Button> */}

      <Button
        className="bg-btnGreen hover:bg-btnGreenHover font-bold "
        onClick={openModal}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default ButtonsOrderDescribe;
