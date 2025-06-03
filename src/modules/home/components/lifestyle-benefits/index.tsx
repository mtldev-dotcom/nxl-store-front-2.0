"use client"

import { useTranslation } from "@lib/context/translation-context"

interface LifestyleBenefitsProps {
  dictionary?: Record<string, any>
}

const LifestyleBenefits = ({ dictionary }: LifestyleBenefitsProps) => {
  const { translate } = useTranslation()
  
  // If dictionary isn't passed as a prop, use defaults
  const benefitsText = dictionary?.benefits || {
    title: "The Next X Level Advantage",
    subtitle: "Our commitment to quality, performance, and style sets us apart",
    quality: {
      title: "Premium Quality", 
      description: "Our apparel is crafted from the finest materials for comfort and durability on and off the course."
    },
    performance: {
      title: "Performance Design",
      description: "Engineered with strategic venting, moisture-wicking technology, and stretch fabrics for peak performance."
    },
    materialInnovation: {
      title: "Material Innovation",
      description: "We partner with leading textile manufacturers to integrate cutting-edge fabric technologies, ensuring garments that breathe, move, and last."
    },
    shipping: {
      title: "Fast Shipping",
      description: "Free delivery across Canada and fast international shipping options available."
    }
  }
  
  const benefits = [
    {
      key: "quality",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
      ),
      title: benefitsText.quality.title,
      description: benefitsText.quality.description
    },
    {
      key: "performance",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19 9 9l-6.553 6.553a1.5 1.5 0 0 0-.102 1.939l.5.666c.412.548 1.08.848 1.757.81L9 19.13l1.217 1.295a1.5 1.5 0 0 0 2.122 0L13.5 19.2l3.536-.033a2.25 2.25 0 0 0 1.732-.72l.882-.882a2.25 2.25 0 0 0 0-3.18l-1.03-1.031a2.25 2.25 0 0 0-.03-3.143L20.917 7.84a2.25 2.25 0 0 0 0-3.182l-1.042-1.04a1.5 1.5 0 0 0-2.121 0L16.325 5.05a1.5 1.5 0 0 1-2.12 0L10.783.783a1.5 1.5 0 0 0-2.122 0L7.636 1.808a2.249 2.249 0 0 0-.053 3.131L9 7.233l-3.409 7.644A2.25 2.25 0 0 1 3.477 16.6l-.795.334a2.248 2.248 0 0 0-1.234 1.237l-.091.195a2.25 2.25 0 0 0 1.146 2.924l2.77 1.261a2.25 2.25 0 0 0 2.657-.572l.156-.173a2.25 2.25 0 0 1 3.378 0l.157.173a2.25 2.25 0 0 0 2.656.572l2.77-1.261a2.25 2.25 0 0 0 1.146-2.924l-.09-.195a2.25 2.25 0 0 0-1.235-1.237l-.794-.334a2.25 2.25 0 0 1-1.212-1.112L9.732 9.002 6.116 5.19Z" />
        </svg>
      ),
      title: benefitsText.performance.title,
      description: benefitsText.performance.description
    },
    {
      key: "materialInnovation",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      ),
      title: benefitsText.materialInnovation.title,
      description: benefitsText.materialInnovation.description
    },
    {
      key: "shipping",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
      title: benefitsText.shipping.title,
      description: benefitsText.shipping.description
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-nxl-navy to-nxl-black">
      <div className="content-container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-nxl-gold uppercase tracking-wider mb-4">
            {benefitsText.title}
          </h2>
          <p className="font-body text-nxl-ivory/80 max-w-xl mx-auto">
            {benefitsText.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={benefit.key} 
              className="nxl-card flex flex-col items-center text-center hover:border-nxl-gold/40 group"
            >
              <div className="text-nxl-gold mb-4 group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <h3 className="font-button text-nxl-gold text-xl uppercase mb-3">
                {benefit.title}
              </h3>
              <p className="font-body text-nxl-ivory/80 text-sm">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LifestyleBenefits
