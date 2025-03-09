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
  
  // Calculate progress width
  const maxWidth = {
    xs: 76, // 100 - (12% * 2)
    sm: 84, // 100 - (8% * 2)
    md: 86, // 100 - (7% * 2)
    lg: 90, // 100 - (5% * 2)
  }
  
  // Adjusted progress calculations that account for the non-linear spacing on larger screens
  const getProgressWidth = (screenSize: 'xs' | 'sm' | 'md' | 'lg') => {
    // Basic progress calculation (0 to 1)
    const baseProgress = Math.max(0, currentStep - 1) / (steps.length - 1)
    
    // For larger viewports, specifically adjust the first segment (between steps 1 and 2)
    if (screenSize === 'lg' && currentStep === 2) {
      // Return a smaller percentage for this specific case
      return (maxWidth[screenSize] * 0.32) + '%'; // ~29% of the total width
    }
    
    // For medium viewports, also adjust the first segment
    if (screenSize === 'md' && currentStep === 2) {
      return (maxWidth[screenSize] * 0.33) + '%'; // ~28% of the total width
    }
    
    // For small viewports, slight adjustment
    if (screenSize === 'sm' && currentStep === 2) {
      return (maxWidth[screenSize] * 0.34) + '%'; // ~29% of the total width
    }
    
    // Normal calculation for other cases
    return (baseProgress * maxWidth[screenSize]) + '%';
  }
  
  return (
    <nav aria-label="Progress" className="w-full my-8">
      <ol className="flex items-center justify-between px-5 relative">
        {/* Background line */}
        <div className="absolute h-1 bg-secondary-300 left-[12%] right-[12%] sm:left-[8%] sm:right-[8%] md:left-[7%] md:right-[7%] lg:left-[5%] lg:right-[5%] top-[1.625rem]" />
        
        {/* Colored progress line */}
        <div 
          className="absolute h-1 bg-gradient-to-r from-primary-600 to-primary-400 top-[1.625rem] transition-all duration-500 ease-in-out"
          style={{
            left: 'calc(12%)',
            width: getProgressWidth('xs'),
          }}
        />
        
        {/* Small screen colored progress line */}
        <div 
          className="absolute h-1 bg-gradient-to-r from-primary-600 to-primary-400 top-[1.625rem] transition-all duration-500 ease-in-out hidden sm:block md:hidden"
          style={{
            left: 'calc(8%)',
            width: getProgressWidth('sm'),
          }}
        />
        
        {/* Medium screen colored progress line */}
        <div 
          className="absolute h-1 bg-gradient-to-r from-primary-600 to-primary-400 top-[1.625rem] transition-all duration-500 ease-in-out hidden md:block lg:hidden"
          style={{
            left: 'calc(7%)',
            width: getProgressWidth('md'),
          }}
        />
        
        {/* Large screen colored progress line */}
        <div 
          className="absolute h-1 bg-gradient-to-r from-primary-600 to-primary-400 top-[1.625rem] transition-all duration-500 ease-in-out hidden lg:block"
          style={{
            left: 'calc(5%)',
            width: getProgressWidth('lg'),
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