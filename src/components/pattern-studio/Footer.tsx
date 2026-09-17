"use client";

import Image from "next/image";
import React from "react";

export function Footer() {
    return (
        <footer className="relative isolate overflow-hidden bg-[#7B83A2] text-white py-14 px-6">
            {/* ローディング画面と同じ14秒の優雅な回転アニメーション */}
            <style>{`
                @keyframes footerSlowSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-footer-spin {
                    animation: footerSlowSpin 14s linear infinite;
                }
            `}</style>

            <div className="mx-auto flex max-w-5xl flex-col items-center justify-center space-y-7">
                {/* 薔薇アイコン（回転） + Pattern Studio ロゴ */}
                <div className="flex items-center justify-center space-x-4 sm:space-x-7 select-none pointer-events-none">
                    <div className="relative h-20 w-20 sm:h-28 sm:w-28 flex-shrink-0 animate-footer-spin">
                        <Image
                            src="/images/loading.svg"
                            alt="Rose icon"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="relative h-20 w-60 sm:h-28 sm:w-80 flex-shrink-0">
                        <Image
                            src="/images/logo-text.png"
                            alt="Pattern Studio"
                            fill
                            className="object-contain object-left"
                        />
                    </div>
                </div>

                {/* コピーライト */}
                <p className="text-xs sm:text-sm tracking-[0.25em] text-[#f0edf5] opacity-90 select-none">
                    &copy; 2026 CHAMIKO
                </p>
            </div>
        </footer>
    );
}