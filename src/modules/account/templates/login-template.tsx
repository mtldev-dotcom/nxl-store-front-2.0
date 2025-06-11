"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

interface LoginTemplateProps {
  dictionary?: Record<string, any>
}

const LoginTemplate = ({ dictionary }: LoginTemplateProps) => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="min-h-screen bg-nxl-black">
      <div className="content-container py-12 small:py-20">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 small:mb-12">
            <h1 className="nxl-display text-2xl small:text-3xl mb-3">
              Next X Level
            </h1>
            <p className="nxl-body text-base opacity-70">
              {currentView === "sign-in" 
                ? dictionary?.account?.accessYourAccount || "Access your account"
                : dictionary?.account?.joinOurCommunity || "Join our community"}
            </p>
          </div>

          {/* Form Container */}
          <div className="nxl-card rounded-lg p-6 small:p-8 shadow-luxury">
            {currentView === "sign-in" ? (
              <Login setCurrentView={setCurrentView} dictionary={dictionary} />
            ) : (
              <Register setCurrentView={setCurrentView} dictionary={dictionary} />
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="nxl-body text-sm opacity-60">
              {dictionary?.general?.title || "Next X Level"} - Premium Canadian Apparel
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginTemplate
