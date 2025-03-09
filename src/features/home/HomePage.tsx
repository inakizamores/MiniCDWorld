import { Link } from 'react-router-dom'
import { FaUpload, FaCrop, FaFilePdf, FaArrowRight, FaCheck } from 'react-icons/fa'

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white/90 backdrop-blur-sm p-8 shadow-lg">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Create Professional CD Templates
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Design stunning CD covers and labels with our easy-to-use template generator.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button className="rounded-xl bg-primary-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                Get Started
              </button>
              <button className="rounded-xl px-6 py-3 text-lg font-semibold text-gray-900 border-2 border-primary-600 hover:bg-primary-50">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="rounded-2xl bg-white/90 backdrop-blur-sm p-8 shadow-lg">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.title} className="relative group">
                  <div className="rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-600 text-white mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32 bg-gradient-to-b from-white to-primary-50">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="rounded-2xl bg-white/90 backdrop-blur-sm p-8 shadow-lg">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-12">
              Features
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature.title} className="relative group">
                  <div className="rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 text-primary-600 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 p-8 shadow-lg text-white">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Ready to Create Your CD Template?
              </h2>
              <p className="text-lg mb-8">
                Start designing your professional CD template today.
              </p>
              <button className="rounded-xl bg-white px-6 py-3 text-lg font-semibold text-primary-600 shadow-sm hover:bg-primary-50 transition-colors">
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage 