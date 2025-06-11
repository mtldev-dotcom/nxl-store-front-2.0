import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type SignInPromptProps = {
  dictionary: any
}

const SignInPrompt = ({ dictionary }: SignInPromptProps) => {
  return (
    <div className="bg-transparent flex items-center justify-between px-2 py-4">
      <div>
        <Heading level="h2" className="txt-xlarge text-nxl-gold font-serif">
          {dictionary.cart.signInPrompt.title}
        </Heading>
        <Text className="txt-medium text-nxl-ivory mt-2 font-light">
          {dictionary.cart.signInPrompt.description}
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button 
            variant="secondary" 
            className="h-10 bg-transparent text-nxl-gold border border-nxl-gold font-button uppercase tracking-wider hover:bg-nxl-gold/10 transition-all duration-300" 
            data-testid="sign-in-button"
          >
            {dictionary.cart.signInPrompt.signIn}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
