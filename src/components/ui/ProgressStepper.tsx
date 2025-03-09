import React from 'react'
import { FaCheck } from 'react-icons/fa'

interface Step {
  name: string
  description: string
}

interface ProgressStepperProps {
  steps: Step[]
  currentStep: number
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress" className="w-full my-8">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep
          const isFirstStep = index === 0
          
          return (
            <li key={step.name} className={`relative ${index !== steps.length - 1 ? 'flex-1' : ''}`}>
              {/* Connector line between steps with gradient for completed steps */}
              {index !== steps.length - 1 && (
                <div className={`absolute top-5 h-0.5 z-0 ${
                  isFirstStep ? 'left-1/2 w-1/2' : 'left-0 w-full'
                }`}>
                  <div
                    className={`h-0.5 ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-primary-600 to-primary-400' 
                        : 'bg-secondary-300'
                    }`}
                  />
                </div>
              )}
            
              {isCompleted ? (
                <div className="group flex items-center relative z-10">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-primary-500 shadow-md">
                    <FaCheck className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                  <div className="ml-3">
                    <span className="font-medium text-primary-600">{step.name}</span>
                    <p className="text-xs text-secondary-500">{step.description}</p>
                  </div>
                </div>
              ) : isActive ? (
                <div className="flex items-center relative z-10" aria-current="step">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary-600 bg-white shadow-[0_0_0_4px_rgba(2,132,199,0.1)]">
                    <span className="text-primary-600 font-bold">{stepNumber}</span>
                  </span>
                  <div className="ml-3">
                    <span className="font-medium text-primary-600">{step.name}</span>
                    <p className="text-xs text-secondary-500">{step.description}</p>
                  </div>
                </div>
              ) : (
                <div className="group flex items-center relative z-10">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-secondary-300 bg-white">
                    <span className="text-secondary-500">{stepNumber}</span>
                  </span>
                  <div className="ml-3">
                    <span className="text-secondary-500">{step.name}</span>
                    <p className="text-xs text-secondary-400">{step.description}</p>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default ProgressStepper 