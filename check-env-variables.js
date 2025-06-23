const c = require("ansi-colors")

const requiredEnvs = [
  {
    key: "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
    // TODO: we need a good doc to point this to
    description:
      "Learn how to create a publishable key: https://docs.medusajs.com/v2/resources/storefront-development/publishable-api-keys",
  },
]

const recommendedEnvs = [
  {
    key: "NEXT_PUBLIC_STRIPE_KEY",
    description:
      "Stripe publishable key for payment processing. Get this from Stripe Dashboard → Developers → API Keys",
  },
  {
    key: "MEDUSA_BACKEND_URL",
    description:
      "URL of your Medusa backend server. Defaults to http://localhost:9000 if not set",
  },
]

function checkEnvVariables() {
  const missingEnvs = requiredEnvs.filter(function (env) {
    return !process.env[env.key]
  })

  const missingRecommended = recommendedEnvs.filter(function (env) {
    return !process.env[env.key]
  })

  if (missingEnvs.length > 0) {
    console.error(
      c.red.bold("\n🚫 Error: Missing required environment variables\n")
    )

    missingEnvs.forEach(function (env) {
      console.error(c.yellow(`  ${c.bold(env.key)}`))
      if (env.description) {
        console.error(c.dim(`    ${env.description}\n`))
      }
    })

    console.error(
      c.yellow(
        "\nPlease set these variables in your .env.local file or environment before starting the application.\n"
      )
    )

    process.exit(1)
  }

  if (missingRecommended.length > 0) {
    console.warn(
      c.yellow.bold("\n⚠️  Warning: Missing recommended environment variables\n")
    )

    missingRecommended.forEach(function (env) {
      console.warn(c.yellow(`  ${c.bold(env.key)}`))
      if (env.description) {
        console.warn(c.dim(`    ${env.description}\n`))
      }
    })

    console.warn(
      c.yellow(
        "These variables are not required but recommended for full functionality.\n"
      )
    )

    // Special warning for Stripe
    if (missingRecommended.some(env => env.key === "NEXT_PUBLIC_STRIPE_KEY")) {
      console.warn(
        c.magenta(
          "💳 Without NEXT_PUBLIC_STRIPE_KEY, Stripe payment options will not appear at checkout.\n"
        )
      )
    }
  }

  // Success message
  if (missingEnvs.length === 0 && missingRecommended.length === 0) {
    console.log(c.green.bold("✅ All environment variables are configured correctly!\n"))
  } else if (missingEnvs.length === 0) {
    console.log(c.green("✅ Required environment variables are set.\n"))
  }
}

module.exports = checkEnvVariables
