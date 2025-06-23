#!/usr/bin/env node
/**
 * Test script to verify Stripe payment providers configuration
 * Usage: node scripts/test-payment-providers.js
 */

const c = require("ansi-colors");
const fs = require("fs");
const path = require("path");

// Load environment variables from .env.local
function loadEnvFile() {
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, "utf8");
        const lines = envContent.split("\n");

        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith("#")) {
                const [key, ...valueParts] = trimmed.split("=");
                if (key && valueParts.length > 0) {
                    const value = valueParts.join("=").replace(/^["']|["']$/g, "");
                    process.env[key.trim()] = value;
                }
            }
        });
    }
}

// Load environment variables
loadEnvFile();

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "https://nxladmin.aiaa.dev";
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
const REGION_ID = "reg_01JT941T3TDA36FHWDYNFVQRBE"; // Canada region from logs

async function testPaymentProviders() {
    console.log(c.blue.bold("\n🧪 Testing Payment Providers Configuration\n"));

    if (!API_KEY) {
        console.error(c.red("❌ NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY not found"));
        console.log(c.yellow("Please set the environment variable and try again"));
        process.exit(1);
    }

    try {
        console.log(c.gray(`🔍 Testing backend: ${BACKEND_URL}`));
        console.log(c.gray(`🔍 Using region: ${REGION_ID}`));
        console.log(c.gray(`🔍 API Key: ${API_KEY.substring(0, 10)}...\n`));

        const url = `${BACKEND_URL}/store/payment-providers?region_id=${REGION_ID}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "x-publishable-api-key": API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        console.log(c.green("✅ API Response successful"));
        console.log(c.gray("📊 Raw response:"));
        console.log(JSON.stringify(data, null, 2));

        const providers = data.payment_providers || [];

        console.log(c.blue.bold("\n📋 Payment Providers Analysis:"));

        if (providers.length === 0) {
            console.log(c.red("❌ No payment providers found"));
            console.log(c.yellow("🔧 Action needed: Configure payment providers for this region"));
            return;
        }

        providers.forEach((provider, index) => {
            console.log(c.gray(`\n${index + 1}. ${provider.id}`));

            if (provider.id === "pp_system_default") {
                console.log(c.yellow("   📝 Manual Payment (test purposes only)"));
            } else if (provider.id.startsWith("pp_stripe")) {
                console.log(c.green("   💳 Stripe Payment Provider"));

                if (provider.id === "pp_stripe_stripe") {
                    console.log(c.green("      ✅ Credit Card payments enabled"));
                } else if (provider.id === "pp_stripe-ideal_stripe") {
                    console.log(c.blue("      ✅ iDeal payments enabled"));
                } else if (provider.id === "pp_stripe-bancontact_stripe") {
                    console.log(c.blue("      ✅ Bancontact payments enabled"));
                }
            } else {
                console.log(c.gray(`   🔌 Other provider: ${provider.id}`));
            }

            if (provider.is_enabled !== undefined) {
                console.log(c.gray(`   Status: ${provider.is_enabled ? 'Enabled' : 'Disabled'}`));
            }
        });

        // Analysis and recommendations
        console.log(c.blue.bold("\n🎯 Analysis & Recommendations:"));

        const hasStripe = providers.some(p => p.id.startsWith("pp_stripe"));
        const hasManualOnly = providers.length === 1 && providers[0].id === "pp_system_default";

        if (hasStripe) {
            console.log(c.green("✅ Stripe payment providers are configured"));
            console.log(c.green("✅ Your checkout should show credit card options"));
        } else if (hasManualOnly) {
            console.log(c.yellow("⚠️  Only manual payment is configured"));
            console.log(c.yellow("🔧 To enable Stripe payments:"));
            console.log(c.gray("   1. Install @medusajs/medusa-payment-stripe on backend"));
            console.log(c.gray("   2. Configure Stripe in medusa-config.js"));
            console.log(c.gray("   3. Add Stripe payment providers to this region"));
            console.log(c.gray("   4. Restart backend and test again"));
        } else {
            console.log(c.blue("ℹ️  Custom payment configuration detected"));
        }

        // Frontend verification
        const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY;
        if (stripeKey) {
            console.log(c.green("\n✅ Frontend Stripe key is configured"));
            console.log(c.gray(`   Key type: ${stripeKey.startsWith('pk_test_') ? 'Test' : 'Live'}`));
        } else {
            console.log(c.yellow("\n⚠️  NEXT_PUBLIC_STRIPE_KEY not found in frontend"));
        }

    } catch (error) {
        console.error(c.red("\n❌ Test failed:"));
        console.error(c.red(error.message));

        if (error.message.includes("fetch")) {
            console.log(c.yellow("\n🔧 Possible issues:"));
            console.log(c.gray("   • Backend is not running"));
            console.log(c.gray("   • Incorrect MEDUSA_BACKEND_URL"));
            console.log(c.gray("   • Network connectivity issues"));
            console.log(c.gray("   • CORS configuration problems"));
        }

        process.exit(1);
    }
}

// Run the test
if (require.main === module) {
    testPaymentProviders().catch(console.error);
}

module.exports = { testPaymentProviders }; 