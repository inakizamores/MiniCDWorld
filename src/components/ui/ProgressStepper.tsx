import React, { useEffect, useState } from 'react'
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
  const [prevStep, setPrevStep] = useState(currentStep)
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward' | null>(null)
  
  useEffect(() => {
    if (currentStep > prevStep) {
      setAnimationDirection('forward')
    } else if (currentStep < prevStep) {
      setAnimationDirection('backward')
    }
    setPrevStep(currentStep)
    
    // Reset animation direction after animation completes
    const timer = setTimeout(() => {
      setAnimationDirection(null)
    }, 600)
    
    return () => clearTimeout(timer)
  }, [currentStep, prevStep])
  
  return (
    <nav aria-label="Progress" className="w-full my-8">
      <ol className="flex items-center justify-between px-5 relative">
        {/* Single continuous progress line that sits behind all steps */}
        <div className="absolute h-1 bg-secondary-300 left-[5%] right-[5%] top-7" />
        <div 
          className="absolute h-1 bg-gradient-to-r from-primary-600 to-primary-400 left-[5%] top-7 transition-all duration-500 ease-in-out"
          style={{ 
            width: `${(Math.max(0, currentStep - 1) / (steps.length - 1)) * 90}%`,
          }}
        />
        
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep
          
          // Animation classes
          let animationClass = ''
          if (animationDirection === 'forward' && stepNumber === currentStep) {
            animationClass = 'animate-bounce-in'
          } else if (animationDirection === 'backward' && stepNumber === currentStep) {
            animationClass = 'animate-slide-in'
          }
          
          return (
            <li key={step.name} className="relative flex flex-col items-center z-10">
              {/* Add padding space and ensure overflow visible for animations */}
              <div className="p-2 overflow-visible">
                <div className={`flex flex-col items-center ${animationClass} overflow-visible`}>
                  {/* Circle indicator */}
                  <div className="relative overflow-visible">
                    {isCompleted ? (
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-primary-500 shadow-md transition-all duration-300">
                        <FaCheck className="h-5 w-5 text-white" aria-hidden="true" />
                      </span>
                    ) : isActive ? (
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary-600 bg-white shadow-[0_0_0_4px_rgba(2,132,199,0.1)] transition-all duration-300">
                        <span className="text-primary-600 font-bold">{stepNumber}</span>
                      </span>
                    ) : (
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-secondary-300 bg-white transition-all duration-300">
                        <span className="text-secondary-500">{stepNumber}</span>
                      </span>
                    )}
                  </div>
                  
                  {/* Text - shown only on medium screens and up */}
                  <div className="mt-3 hidden md:block text-center max-w-[120px]">
                    <span className={`font-medium block ${isActive || isCompleted ? 'text-primary-600' : 'text-secondary-500'}`}>
                      {step.name}
                    </span>
                    <p className="text-xs text-secondary-500 mt-1">{step.description}</p>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default ProgressStepper 