"use client"
import RegisterFrom from "@/components/RegisterFrom";
import Welcome from "@/components/Welcome";
import { useState } from "react";


const Regiter = () => {
  const [step, setStep] = useState(0);
  return (
    <div>
        {step === 0 ? (
          <Welcome setStep={setStep} />
        ) : (
          <RegisterFrom setStep={setStep}/>
        )}

    </div>
  )
}

export default Regiter