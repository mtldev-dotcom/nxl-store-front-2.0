"use client"

import { useState, useEffect, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"
import { setAddresses } from "@lib/data/cart"
import { CheckCircleSolid } from "@medusajs/icons"
import { Heading, Text, useToggleState } from "@medusajs/ui"
import compareAddresses from "@lib/util/compare-addresses"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Input from "@modules/common/components/input"
import Checkbox from "@modules/common/components/checkbox"
import CountrySelect from "../country-select"

interface EnhancedAddressFormProps {
    cart: HttpTypes.StoreCart | null
    customer: HttpTypes.StoreCustomer | null
}

const EnhancedAddressForm = ({ cart, customer }: EnhancedAddressFormProps) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const isOpen = searchParams.get("step") === "address"

    const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
        cart?.shipping_address && cart?.billing_address
            ? compareAddresses(cart?.shipping_address, cart?.billing_address)
            : true
    )

    const [formData, setFormData] = useState({
        // Shipping address
        shipping_first_name: cart?.shipping_address?.first_name || "",
        shipping_last_name: cart?.shipping_address?.last_name || "",
        shipping_address_1: cart?.shipping_address?.address_1 || "",
        shipping_company: cart?.shipping_address?.company || "",
        shipping_postal_code: cart?.shipping_address?.postal_code || "",
        shipping_city: cart?.shipping_address?.city || "",
        shipping_country_code: cart?.shipping_address?.country_code || "",
        shipping_province: cart?.shipping_address?.province || "",
        shipping_phone: cart?.shipping_address?.phone || "",
        // Contact
        email: cart?.email || customer?.email || "",
        same_as_billing: sameAsBilling
    })

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleFieldChange = useCallback((field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: "" }))
        }
    }, [fieldErrors])

    const handleSameAsBillingToggle = useCallback(() => {
        const newValue = !formData.same_as_billing
        toggleSameAsBilling()
        setFormData(prev => ({ ...prev, same_as_billing: newValue }))
    }, [formData.same_as_billing, toggleSameAsBilling])

    const validateForm = useCallback((): boolean => {
        const errors: Record<string, string> = {}

        // Validate required fields
        if (!formData.shipping_first_name.trim()) errors.shipping_first_name = "First name is required"
        if (!formData.shipping_last_name.trim()) errors.shipping_last_name = "Last name is required"
        if (!formData.shipping_address_1.trim()) errors.shipping_address_1 = "Address is required"
        if (!formData.shipping_postal_code.trim()) errors.shipping_postal_code = "Postal code is required"
        if (!formData.shipping_city.trim()) errors.shipping_city = "City is required"
        if (!formData.shipping_country_code.trim()) errors.shipping_country_code = "Country is required"
        if (!formData.email.trim()) errors.email = "Email is required"

        // Validate email format
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Please enter a valid email address"
        }

        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }, [formData])

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)
        try {
            const submitFormData = new FormData()

            // Add shipping address fields
            submitFormData.append('shipping_address.first_name', formData.shipping_first_name)
            submitFormData.append('shipping_address.last_name', formData.shipping_last_name)
            submitFormData.append('shipping_address.address_1', formData.shipping_address_1)
            submitFormData.append('shipping_address.company', formData.shipping_company)
            submitFormData.append('shipping_address.postal_code', formData.shipping_postal_code)
            submitFormData.append('shipping_address.city', formData.shipping_city)
            submitFormData.append('shipping_address.country_code', formData.shipping_country_code)
            submitFormData.append('shipping_address.province', formData.shipping_province)
            submitFormData.append('shipping_address.phone', formData.shipping_phone)
            submitFormData.append('email', formData.email)

            if (formData.same_as_billing) {
                submitFormData.append('same_as_billing', 'on')
            }

            const result = await setAddresses(null, submitFormData)
            if (result) {
                console.error('Error setting addresses:', result)
            }
        } catch (error) {
            console.error('Error submitting form:', error)
        } finally {
            setIsSubmitting(false)
        }
    }, [formData, validateForm])

    const handleEdit = () => {
        router.push(pathname + "?step=address")
    }

    return (
        <div className="bg-nxl-black/80 backdrop-blur-sm border border-nxl-gold/30 rounded-xl p-6 shadow-xl">
            <div className="flex flex-row items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!isOpen && cart?.shipping_address
                        ? 'bg-green-500 text-white'
                        : 'bg-nxl-gold/20 text-nxl-gold border border-nxl-gold/30'
                        }`}>
                        {!isOpen && cart?.shipping_address ? (
                            <CheckCircleSolid className="w-5 h-5" />
                        ) : (
                            <span className="text-sm font-semibold">1</span>
                        )}
                    </div>
                    <Heading level="h2" className="text-2xl font-semibold text-nxl-gold font-display">
                        Address Information
                    </Heading>
                </div>
                {!isOpen && cart?.shipping_address && (
                    <button
                        onClick={handleEdit}
                        className="text-nxl-gold hover:text-nxl-gold/80 font-medium transition-colors duration-200"
                    >
                        Edit
                    </button>
                )}
            </div>

            {isOpen ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Heading level="h3" className="text-lg font-semibold text-nxl-gold mb-4">
                            Shipping Address
                        </Heading>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label="First name"
                                    name="shipping_first_name"
                                    value={formData.shipping_first_name}
                                    onChange={(e) => handleFieldChange('shipping_first_name', e.target.value)}
                                    required
                                />
                                {fieldErrors.shipping_first_name && (
                                    <span className="text-red-400 text-sm mt-1 block">{fieldErrors.shipping_first_name}</span>
                                )}
                            </div>
                            <div>
                                <Input
                                    label="Last name"
                                    name="shipping_last_name"
                                    value={formData.shipping_last_name}
                                    onChange={(e) => handleFieldChange('shipping_last_name', e.target.value)}
                                    required
                                />
                                {fieldErrors.shipping_last_name && (
                                    <span className="text-red-400 text-sm mt-1 block">{fieldErrors.shipping_last_name}</span>
                                )}
                            </div>
                            <div>
                                <Input
                                    label="Address"
                                    name="shipping_address_1"
                                    value={formData.shipping_address_1}
                                    onChange={(e) => handleFieldChange('shipping_address_1', e.target.value)}
                                    required
                                />
                                {fieldErrors.shipping_address_1 && (
                                    <span className="text-red-400 text-sm mt-1 block">{fieldErrors.shipping_address_1}</span>
                                )}
                            </div>
                            <Input
                                label="Company (optional)"
                                name="shipping_company"
                                value={formData.shipping_company}
                                onChange={(e) => handleFieldChange('shipping_company', e.target.value)}
                            />
                            <div>
                                <Input
                                    label="Postal code"
                                    name="shipping_postal_code"
                                    value={formData.shipping_postal_code}
                                    onChange={(e) => handleFieldChange('shipping_postal_code', e.target.value)}
                                    required
                                />
                                {fieldErrors.shipping_postal_code && (
                                    <span className="text-red-400 text-sm mt-1 block">{fieldErrors.shipping_postal_code}</span>
                                )}
                            </div>
                            <div>
                                <Input
                                    label="City"
                                    name="shipping_city"
                                    value={formData.shipping_city}
                                    onChange={(e) => handleFieldChange('shipping_city', e.target.value)}
                                    required
                                />
                                {fieldErrors.shipping_city && (
                                    <span className="text-red-400 text-sm mt-1 block">{fieldErrors.shipping_city}</span>
                                )}
                            </div>
                            <div>
                                <CountrySelect
                                    label="Country"
                                    name="shipping_country_code"
                                    region={cart?.region}
                                    value={formData.shipping_country_code}
                                    onChange={(e) => handleFieldChange('shipping_country_code', e.target.value)}
                                    required
                                />
                                {fieldErrors.shipping_country_code && (
                                    <span className="text-red-400 text-sm mt-1 block">{fieldErrors.shipping_country_code}</span>
                                )}
                            </div>
                            <Input
                                label="State / Province (optional)"
                                name="shipping_province"
                                value={formData.shipping_province}
                                onChange={(e) => handleFieldChange('shipping_province', e.target.value)}
                            />
                            <Input
                                label="Phone (optional)"
                                name="shipping_phone"
                                value={formData.shipping_phone}
                                onChange={(e) => handleFieldChange('shipping_phone', e.target.value)}
                            />
                            <div>
                                <Input
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleFieldChange('email', e.target.value)}
                                    required
                                />
                                {fieldErrors.email && (
                                    <span className="text-red-400 text-sm mt-1 block">{fieldErrors.email}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="my-6">
                        <Checkbox
                            label="Billing address same as shipping address"
                            name="same_as_billing"
                            checked={formData.same_as_billing}
                            onChange={handleSameAsBillingToggle}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${isSubmitting
                            ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                            : 'bg-nxl-gold hover:bg-nxl-gold/90 text-nxl-black'
                            }`}
                    >
                        {isSubmitting ? 'Saving...' : 'Continue to Delivery'}
                    </button>

                    {Object.keys(fieldErrors).length > 0 && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-red-400 text-sm font-medium mb-2">
                                Please fix the following errors:
                            </p>
                            <ul className="text-red-400 text-sm space-y-1">
                                {Object.values(fieldErrors).map((error, index) => (
                                    <li key={index}>• {error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </form>
            ) : (
                <div className="text-small-regular">
                    {cart && cart.shipping_address ? (
                        <div className="flex items-start gap-x-8">
                            <div className="flex items-start gap-x-1 w-full">
                                <div className="flex flex-col w-1/3">
                                    <Text className="txt-medium-plus text-nxl-gold mb-1 font-semibold">
                                        Shipping Address
                                    </Text>
                                    <Text className="txt-medium text-nxl-ivory/80">
                                        {cart.shipping_address.first_name} {cart.shipping_address.last_name}
                                    </Text>
                                    <Text className="txt-medium text-nxl-ivory/80">
                                        {cart.shipping_address.address_1}
                                    </Text>
                                    <Text className="txt-medium text-nxl-ivory/80">
                                        {cart.shipping_address.postal_code}, {cart.shipping_address.city}
                                    </Text>
                                    <Text className="txt-medium text-nxl-ivory/80">
                                        {cart.shipping_address.country_code?.toUpperCase()}
                                    </Text>
                                </div>
                                <div className="flex flex-col w-1/3">
                                    <Text className="txt-medium-plus text-nxl-gold mb-1 font-semibold">
                                        Contact
                                    </Text>
                                    <Text className="txt-medium text-nxl-ivory/80">
                                        {cart.email}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nxl-gold"></div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default EnhancedAddressForm 