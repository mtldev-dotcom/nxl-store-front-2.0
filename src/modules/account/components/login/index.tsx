import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
  dictionary?: Record<string, any>
}

const Login = ({ setCurrentView, dictionary }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div className="w-full" data-testid="login-page">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="nxl-heading text-2xl mb-3 text-nxl-gold">
          {dictionary?.account?.welcomeBack || "Welcome Back"}
        </h1>
        <p className="nxl-body text-base opacity-80">
          {dictionary?.account?.loginDescription || "Sign in to access your premium shopping experience"}
        </p>
      </div>

      {/* Login Form */}
      <form className="w-full space-y-6" action={formAction}>
        <div className="space-y-4">
          <Input
            label={dictionary?.account?.email || "Email"}
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            className="nxl-input w-full"
            data-testid="email-input"
          />
          <Input
            label={dictionary?.account?.password || "Password"}
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="nxl-input w-full"
            data-testid="password-input"
          />
        </div>

        {/* Error Message */}
        {message && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <ErrorMessage error={message} data-testid="login-error-message" />
          </div>
        )}

        {/* Submit Button */}
        <SubmitButton 
          data-testid="sign-in-button" 
          className="nxl-btn-primary w-full py-4 text-base shimmer"
        >
          {dictionary?.account?.signIn || "Sign In"}
        </SubmitButton>
      </form>

      {/* Register Link */}
      <div className="text-center mt-8 pt-6 border-t border-nxl-gold border-opacity-20">
        <p className="nxl-body text-sm opacity-80">
          {dictionary?.account?.notAMember || "Not a member?"}{" "}
          <button
            onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
            className="text-nxl-gold hover:text-nxl-gold-light transition-colors duration-300 font-medium underline decoration-nxl-gold underline-offset-4"
            data-testid="register-button"
          >
            {dictionary?.account?.joinUs || "Join us"}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
