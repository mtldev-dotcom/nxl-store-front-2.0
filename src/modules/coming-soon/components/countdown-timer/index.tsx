"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
    launchDate: Date
}

interface TimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
}

export default function CountdownTimer({ launchDate }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })
    const [isExpired, setIsExpired] = useState(false)

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date()
            const difference = launchDate.getTime() - now.getTime()

            if (difference <= 0) {
                setIsExpired(true)
                return {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                }
            }

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            }
        }

        // Initial calculation
        setTimeLeft(calculateTimeLeft())

        // Update every second
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer)
    }, [launchDate])

    const formatNumber = (num: number) => {
        return num.toString().padStart(2, '0')
    }

    if (isExpired) {
        return (
            <div className="text-center space-y-4">
                <h3 className="font-serif text-3xl md:text-4xl text-nxl-gold">
                    We're Live!
                </h3>
                <p className="font-body text-lg text-nxl-ivory opacity-90">
                    Next X Level is now available. Explore our collection.
                </p>
                <button className="nxl-btn-primary mt-6">
                    Shop Now
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Countdown Header */}
            <div className="text-center space-y-4">
                <h3 className="font-serif text-2xl md:text-3xl text-nxl-ivory">
                    Official Launch In
                </h3>
                <p className="font-body text-nxl-ivory opacity-75">
                    June 25, 2025 at 12:00 PM
                </p>
            </div>

            {/* Countdown Display */}
            <div className="flex justify-center">
                <div className="grid grid-cols-4 gap-4 md:gap-8">
                    {/* Days */}
                    <div className="bg-nxl-black-soft backdrop-blur-sm border border-nxl-gold border-opacity-20 rounded-lg p-4 md:p-6 text-center min-w-[80px] md:min-w-[100px] hover:border-opacity-40 transition-all duration-300">
                        <div className="space-y-2">
                            <div className="font-display text-2xl md:text-4xl lg:text-5xl text-nxl-gold tracking-wider">
                                {formatNumber(timeLeft.days)}
                            </div>
                            <div className="font-body text-xs md:text-sm text-nxl-ivory opacity-75 uppercase tracking-wider">
                                Days
                            </div>
                        </div>
                    </div>

                    {/* Hours */}
                    <div className="bg-nxl-black-soft backdrop-blur-sm border border-nxl-gold border-opacity-20 rounded-lg p-4 md:p-6 text-center min-w-[80px] md:min-w-[100px] hover:border-opacity-40 transition-all duration-300">
                        <div className="space-y-2">
                            <div className="font-display text-2xl md:text-4xl lg:text-5xl text-nxl-gold tracking-wider">
                                {formatNumber(timeLeft.hours)}
                            </div>
                            <div className="font-body text-xs md:text-sm text-nxl-ivory opacity-75 uppercase tracking-wider">
                                Hours
                            </div>
                        </div>
                    </div>

                    {/* Minutes */}
                    <div className="bg-nxl-black-soft backdrop-blur-sm border border-nxl-gold border-opacity-20 rounded-lg p-4 md:p-6 text-center min-w-[80px] md:min-w-[100px] hover:border-opacity-40 transition-all duration-300">
                        <div className="space-y-2">
                            <div className="font-display text-2xl md:text-4xl lg:text-5xl text-nxl-gold tracking-wider">
                                {formatNumber(timeLeft.minutes)}
                            </div>
                            <div className="font-body text-xs md:text-sm text-nxl-ivory opacity-75 uppercase tracking-wider">
                                Minutes
                            </div>
                        </div>
                    </div>

                    {/* Seconds */}
                    <div className="bg-nxl-black-soft backdrop-blur-sm border border-nxl-gold border-opacity-20 rounded-lg p-4 md:p-6 text-center min-w-[80px] md:min-w-[100px] hover:border-opacity-40 transition-all duration-300">
                        <div className="space-y-2">
                            <div className="font-display text-2xl md:text-4xl lg:text-5xl text-nxl-gold tracking-wider animate-pulse">
                                {formatNumber(timeLeft.seconds)}
                            </div>
                            <div className="font-body text-xs md:text-sm text-nxl-ivory opacity-75 uppercase tracking-wider">
                                Seconds
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2 text-nxl-ivory opacity-60">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-body text-sm">
                        Eastern Standard Time (EST)
                    </span>
                </div>

                <p className="font-body text-sm text-nxl-ivory opacity-50 max-w-md mx-auto">
                    Mark your calendar! Our exclusive launch event begins at noon with special early-bird pricing for waitlist members.
                </p>
            </div>
        </div>
    )
} 