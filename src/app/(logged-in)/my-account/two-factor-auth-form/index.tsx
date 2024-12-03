"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { get2FaSecret } from "./actions";

type TwoFactorAuthFormProps = {
  twoFactorActivated?: boolean;
};

export function TwoFactorAuthForm({
  twoFactorActivated = false,
}: TwoFactorAuthFormProps) {
  const [isActivated, setIsActivated] = useState(twoFactorActivated);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const { toast } = useToast();

  async function handleEnableClick() {
    const response = await get2FaSecret();
    if (response.error != null || response.error) {
      toast({
        variant: "destructive",
        title: response.message,
      });

      return;
    }

    setStep(2);
    setCode(response.twoFactorSecret);
  }

  if (!isActivated) {
    return (
      <div>
        {step === 1 && (
          <Button onClick={handleEnableClick}>
            Enable Two Factor Authentication
          </Button>
        )}

        {step === 2 && (
          <div>
            <p className="text-xs text-muted-foreground my-2">
              Scan the QR code below in the Google Authenticator app to activate
              Two-Factor Authentication.
            </p>

            <QRCodeSVG value={code} />

            <Button onClick={() => setStep(3)} className="w-full my-2">
              I have scanned the QR code
            </Button>
            <Button
              onClick={() => setStep(1)}
              className="w-full my-2"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    );
  }

  return <h1>TwoFactorAuthForm</h1>;
}
