import React from 'react';
import { TiTick } from 'react-icons/ti';

interface StepperProps {
  currentStep: number;
  complete?: boolean;
  steps?: string[];
}

const Stepper = ({ currentStep, complete, steps }: StepperProps) => {
  return (
    <>
      <div className="flex justify-between">
        {steps?.map((step, i) => (
          <div
            key={i}
            className={`step-item ${currentStep === i + 1 && 'active'} ${
              (i + 1 < currentStep || complete) && 'complete'
            } `}
          >
            <div className="step">
              {i + 1 < currentStep || complete ? <TiTick size={24} /> : i + 1}
            </div>
            <p className="text-sm text-gray-700">{step}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Stepper;
