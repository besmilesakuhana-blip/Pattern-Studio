"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

export type LoadingScreenProps = {
    isLoading: boolean;
};

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
    const [isVisible, setIsVisible] = useState(isLoading);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setIsVisible(true);
            setIsFadingOut(false);
        } else {
            setIsFadingOut(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 700);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#7B83A2] transition-opacity duration-700 ease-out ${
                isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            aria-live="polite"
            aria-busy={isLoading}
        >
            <style>{`
                @keyframes slowSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-slow-spin {
                    animation: slowSpin 14s linear infinite;
                }
            `}</style>

            <div className="flex flex-col items-center justify-center select-none pointer-events-none">
                {/* 1. 薔薇アイコン */}
                <div className="relative h-36 w-36 sm:h-48 sm:w-48 animate-slow-spin">
                    <Image
                        src="/images/loading.svg"
                        alt="Loading..."
                        fill
                        priority
                        className="object-contain"
                    />
                </div>

                {/* 2. Now loading 文字（ほんの少しだけ隙間を確保） */}
                <div className="relative -mt-3 sm:-mt-4 h-16 w-64 sm:h-20 sm:w-80">
                    <Image
                        src="/images/now.png"
                        alt="Now loading"
                        fill
                        priority
                        className="object-contain"
                    />
                </div>
            </div>
        </div>
    );
}