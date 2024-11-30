"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

type TwoFactorAuthFormProps = {
  twoFactorActivated?: boolean;
};

export function TwoFactorAuthForm({
  twoFactorActivated = false,
}: TwoFactorAuthFormProps) {
  const [isActivated, setIsActivated] = useState(twoFactorActivated);
  const [step, setStep] = useState(1);

  async function handleEnableClick() {
    setStep(2);
  }

  if (!isActivated) {
    return (
      <div>
        {step === 1 && (
          <Button onClick={handleEnableClick}>
            Enable Two Factor Authentication
          </Button>
        )}

        {step === 2 && <div>Display QR Code</div>}
      </div>
    );
  }

  return <h1>TwoFactorAuthForm</h1>;
}
