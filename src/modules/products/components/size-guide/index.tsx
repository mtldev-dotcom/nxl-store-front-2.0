"use client"

import { useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { useTranslation } from "@lib/context/translation-context"

type SizeGuideProps = {
    productType?: string
}

const SizeGuide: React.FC<SizeGuideProps> = ({ productType = "apparel" }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { translate } = useTranslation()

    const sizeData = {
        apparel: {
            title: "Size Guide - Apparel",
            description: "Find your perfect fit with our comprehensive size guide. All measurements are in inches.",
            sizes: [
                { size: "XS", chest: "34-36", waist: "28-30", hip: "34-36", shoulderWidth: "16", sleeveLength: "24" },
                { size: "S", chest: "36-38", waist: "30-32", hip: "36-38", shoulderWidth: "17", sleeveLength: "25" },
                { size: "M", chest: "38-40", waist: "32-34", hip: "38-40", shoulderWidth: "18", sleeveLength: "26" },
                { size: "L", chest: "40-42", waist: "34-36", hip: "40-42", shoulderWidth: "19", sleeveLength: "27" },
                { size: "XL", chest: "42-44", waist: "36-38", hip: "42-44", shoulderWidth: "20", sleeveLength: "28" },
                { size: "XXL", chest: "44-46", waist: "38-40", hip: "44-46", shoulderWidth: "21", sleeveLength: "29" },
            ],
            measurementTips: [
                "Chest: Measure around the fullest part of your chest, under your arms and over your shoulder blades.",
                "Waist: Measure around your natural waistline, keeping the tape comfortably loose.",
                "Hip: Measure around the fullest part of your hips.",
                "Shoulder Width: Measure from shoulder point to shoulder point across your back.",
                "Sleeve Length: Measure from the center back of your neck to your wrist."
            ]
        },
        hoodie: {
            title: "Size Guide - Hoodies & Sweatshirts",
            description: "Our hoodies are designed for a relaxed, comfortable fit. Measurements are in inches.",
            sizes: [
                { size: "XS", chest: "36-38", length: "26", shoulderWidth: "17", sleeveLength: "25" },
                { size: "S", chest: "38-40", length: "27", shoulderWidth: "18", sleeveLength: "26" },
                { size: "M", chest: "40-42", length: "28", shoulderWidth: "19", sleeveLength: "27" },
                { size: "L", chest: "42-44", length: "29", shoulderWidth: "20", sleeveLength: "28" },
                { size: "XL", chest: "44-46", length: "30", shoulderWidth: "21", sleeveLength: "29" },
                { size: "XXL", chest: "46-48", length: "31", shoulderWidth: "22", sleeveLength: "30" },
            ],
            measurementTips: [
                "Chest: Measure around the fullest part of your chest.",
                "Length: Measure from the highest point of the shoulder to the bottom hem.",
                "Shoulder Width: Measure from shoulder seam to shoulder seam.",
                "Sleeve Length: Measure from shoulder seam to cuff."
            ]
        }
    }

    const currentData = sizeData[productType as keyof typeof sizeData] || sizeData.apparel

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-sm font-button uppercase tracking-wider text-nxl-gold hover:text-nxl-gold-light transition-colors duration-300 underline underline-offset-2"
            >
                {translate("product", "sizeGuide", "Size Guide")}
            </button>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-nxl-black/75 backdrop-blur-md" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform bg-gradient-to-br from-nxl-black via-nxl-black to-nxl-navy/20 border border-nxl-gold/20 rounded-2xl p-8 text-left align-middle shadow-luxury transition-all">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <Dialog.Title as="h3" className="text-2xl font-serif font-bold text-nxl-gold mb-2">
                                                {currentData.title}
                                            </Dialog.Title>
                                            <p className="text-nxl-ivory/80 font-body">{currentData.description}</p>
                                        </div>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="text-nxl-ivory/60 hover:text-nxl-ivory transition-colors p-2 rounded-lg hover:bg-nxl-gold/10"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Size Chart */}
                                    <div className="mb-8 overflow-x-auto">
                                        <table className="w-full border border-nxl-gold/20 rounded-lg overflow-hidden">
                                            <thead className="bg-gradient-to-r from-nxl-gold/20 to-nxl-gold/10">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-sm font-button uppercase tracking-wider text-nxl-gold">Size</th>
                                                    {productType === "hoodie" ? (
                                                        <>
                                                            <th className="px-4 py-3 text-left text-sm font-button uppercase tracking-wider text-nxl-gold">Chest</th>
                                                            <th className="px-4 py-3 text-left text-sm font-button uppercase tracking-wider text-nxl-gold">Length</th>
                                                            <th className="px-4 py-3 text-left text-sm font-button uppercase tracking-wider text-nxl-gold">Shoulder</th>
                                                            <th className="px-4 py-3 text-left text-sm font-button uppercase tracking-wider text-nxl-gold">Sleeve</th>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <th className="px-4 py-3 text-left text-sm font-button uppercase tracking-wider text-nxl-gold">Chest</th>
                                                            <th className="px-4 py-3 text-left text-sm font-button uppercase tracking-wider text-nxl-gold">Waist</th>
                                                            <th className="px-4 py-3 text-left text-sm font-button uppercase tracking-wider text-nxl-gold">Hip</th>
                                                            <th className="px-4 py-3 text-left text-sm font-button uppercase tracking-wider text-nxl-gold">Shoulder</th>
                                                            <th className="px-4 py-3 text-left text-sm font-button uppercase tracking-wider text-nxl-gold">Sleeve</th>
                                                        </>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-nxl-black/40 backdrop-blur-sm">
                                                {currentData.sizes.map((size, index) => (
                                                    <tr key={size.size} className={`border-t border-nxl-gold/10 hover:bg-nxl-gold/5 transition-colors ${index % 2 === 0 ? 'bg-nxl-navy/10' : ''}`}>
                                                        <td className="px-4 py-3 text-sm font-bold text-nxl-gold">{size.size}</td>
                                                        <td className="px-4 py-3 text-sm text-nxl-ivory">{size.chest}</td>
                                                        {productType === "hoodie" ? (
                                                            <>
                                                                <td className="px-4 py-3 text-sm text-nxl-ivory">{(size as any).length}</td>
                                                                <td className="px-4 py-3 text-sm text-nxl-ivory">{size.shoulderWidth}</td>
                                                                <td className="px-4 py-3 text-sm text-nxl-ivory">{size.sleeveLength}</td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td className="px-4 py-3 text-sm text-nxl-ivory">{(size as any).waist}</td>
                                                                <td className="px-4 py-3 text-sm text-nxl-ivory">{(size as any).hip}</td>
                                                                <td className="px-4 py-3 text-sm text-nxl-ivory">{size.shoulderWidth}</td>
                                                                <td className="px-4 py-3 text-sm text-nxl-ivory">{size.sleeveLength}</td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Measurement Tips */}
                                    <div className="mb-8">
                                        <h4 className="text-lg font-serif text-nxl-gold mb-4">How to Measure</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {currentData.measurementTips.map((tip, index) => (
                                                <div key={index} className="flex items-start gap-3 p-4 bg-nxl-navy/20 border border-nxl-gold/10 rounded-lg">
                                                    <div className="w-2 h-2 bg-nxl-gold rounded-full mt-2 flex-shrink-0"></div>
                                                    <p className="text-sm text-nxl-ivory/90 font-body leading-relaxed">{tip}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Additional Info */}
                                    <div className="bg-gradient-to-r from-nxl-gold/10 to-transparent border border-nxl-gold/20 rounded-lg p-6">
                                        <h4 className="text-lg font-serif text-nxl-gold mb-3">Fit Notes</h4>
                                        <div className="space-y-2 text-sm text-nxl-ivory/90 font-body">
                                            <p>• Our garments are designed for a modern, athletic fit that moves with you</p>
                                            <p>• Premium fabrics provide stretch and comfort for all-day wear</p>
                                            <p>• If you're between sizes, we recommend sizing up for a more relaxed fit</p>
                                            <p>• Still unsure? Contact our fit specialists for personalized recommendations</p>
                                        </div>
                                    </div>

                                    {/* Close Button */}
                                    <div className="mt-8 flex justify-end">
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="nxl-btn-primary px-8 py-3"
                                        >
                                            {translate("general", "close", "Close")}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default SizeGuide 