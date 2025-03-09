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
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep
          
          return (
            <li key={step.name} className={`relative ${index !== steps.length - 1 ? 'flex-1' : ''}`}>
              {isCompleted ? (
                <div className="group flex items-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600">
                    <FaCheck className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                  <span className="ml-3 font-medium text-secondary-900">{step.name}</span>
                </div>
              ) : isActive ? (
                <div className="flex items-center" aria-current="step">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary-600 bg-white">
                    <span className="text-primary-600">{stepNumber}</span>
                  </span>
                  <span className="ml-3 font-medium text-primary-600">{step.name}</span>
                </div>
              ) : (
                <div className="group flex items-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-secondary-300 bg-white">
                    <span className="text-secondary-500">{stepNumber}</span>
                  </span>
                  <span className="ml-3 text-secondary-500">{step.name}</span>
                </div>
              )}
              
              {/* Connector line between steps */}
              {index !== steps.length - 1 && (
                <div className="absolute top-4 left-0 -ml-px mt-0.5 h-0.5 w-full">
                  <div
                    className={`h-0.5 ${
                      isCompleted ? 'bg-primary-600' : 'bg-secondary-300'
                    }`}
                  />
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