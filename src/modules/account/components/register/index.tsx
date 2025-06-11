"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
  dictionary?: Record<string, any>
}

const Register = ({ setCurrentView, dictionary }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div className="w-full" data-testid="register-page">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="nxl-heading text-2xl mb-3 text-nxl-gold">
          {dictionary?.account?.joinNextXLevel || "Join Next X Level"}
        </h1>
        <p className="nxl-body text-base opacity-80">
          {dictionary?.account?.registerDescription || "Create your premium account and get access to an enhanced shopping experience"}
        </p>
      </div>

      {/* Registration Form */}
      <form className="w-full space-y-6" action={formAction}>
        <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
          <Input
            label={dictionary?.account?.firstName || "First name"}
            name="first_name"
            required
            autoComplete="given-name"
            className="nxl-input w-full"
            data-testid="first-name-input"
          />
          <Input
            label={dictionary?.account?.lastName || "Last name"}
            name="last_name"
            required
            autoComplete="family-name"
            className="nxl-input w-full"
            data-testid="last-name-input"
          />
        </div>

        <div className="space-y-4">
          <Input
            label={dictionary?.account?.email || "Email"}
            name="email"
            required
            type="email"
            autoComplete="email"
            className="nxl-input w-full"
            data-testid="email-input"
          />
          <Input
            label={dictionary?.account?.phone || "Phone"}
            name="phone"
            type="tel"
            autoComplete="tel"
            className="nxl-input w-full"
            data-testid="phone-input"
          />
          <Input
            label={dictionary?.account?.password || "Password"}
            name="password"
            required
            type="password"
            autoComplete="new-password"
            className="nxl-input w-full"
            data-testid="password-input"
          />
        </div>

        {/* Error Message */}
        {message && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <ErrorMessage error={message} data-testid="register-error" />
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="text-center text-xs nxl-body opacity-70 leading-relaxed">
          <p>
            {dictionary?.account?.agreementText || "By creating an account, you agree to Next X Level's"}{" "}
            <LocalizedClientLink
              href="/content/privacy-policy"
              className="text-nxl-gold hover:text-nxl-gold-light underline decoration-nxl-gold underline-offset-2 transition-colors duration-300"
            >
              {dictionary?.footer?.privacy || "Privacy Policy"}
            </LocalizedClientLink>{" "}
            {dictionary?.general?.and || "and"}{" "}
            <LocalizedClientLink
              href="/content/terms-of-use"
              className="text-nxl-gold hover:text-nxl-gold-light underline decoration-nxl-gold underline-offset-2 transition-colors duration-300"
            >
              {dictionary?.footer?.terms || "Terms of Use"}
            </LocalizedClientLink>
            .
          </p>
        </div>

        {/* Submit Button */}
        <SubmitButton 
          className="nxl-btn-primary w-full py-4 text-base shimmer" 
          data-testid="register-button"
        >
          {dictionary?.account?.register || "Join Us"}
        </SubmitButton>
      </form>

      {/* Login Link */}
      <div className="text-center mt-8 pt-6 border-t border-nxl-gold border-opacity-20">
        <p className="nxl-body text-sm opacity-80">
          {dictionary?.account?.alreadyMember || "Already a member?"}{" "}
          <button
            onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
            className="text-nxl-gold hover:text-nxl-gold-light transition-colors duration-300 font-medium underline decoration-nxl-gold underline-offset-4"
          >
            {dictionary?.account?.signIn || "Sign in"}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Register
