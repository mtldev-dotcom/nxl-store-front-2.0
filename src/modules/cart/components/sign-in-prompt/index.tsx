import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-transparent flex items-center justify-between px-2 py-4">
      <div>
        <Heading level="h2" className="txt-xlarge text-nxl-gold">
          Already have an account?
        </Heading>
        <Text className="txt-medium text-nxl-ivory/80 mt-2">
          Sign in for a better experience.
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button 
            variant="secondary" 
            className="h-10 bg-transparent text-nxl-gold border border-nxl-gold font-button uppercase tracking-wider hover:bg-nxl-gold/10 transition-all duration-300" 
            data-testid="sign-in-button"
          >
            Sign in
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
