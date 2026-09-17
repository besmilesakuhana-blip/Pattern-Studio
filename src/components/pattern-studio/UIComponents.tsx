"use client";

import Image from "next/image";

export type SelectFieldProps = {
    label: string;
    value: string;
    options: string[];
    disabled?: boolean;
    useAltIcon?: boolean;
    onChange: (value: string) => void;
};

export function SelectField({ label, value, options, disabled, useAltIcon, onChange }: SelectFieldProps) {
    const iconSrc = useAltIcon ? "/images/ookiibara.png" : "/images/tiisaibara.png";

    return (
        <div className={`flex flex-col items-center justify-center ${disabled ? "opacity-30" : ""}`}>
            <span className="mb-2 block h-4 text-center text-xs tracking-[0.2em] text-white">
                {label}
            </span>

            <div className="relative w-full max-w-[280px] h-[40px] flex items-center justify-center">
                <div 
                    className={`absolute right-0 h-[2px] pointer-events-none z-0 ${
                        useAltIcon 
                            ? "bottom-[4px] left-[22px] bg-gradient-to-r from-[#663b19] via-[#48280f] to-transparent" 
                            : "bottom-[3px] left-[16px] bg-gradient-to-r from-[#966330] via-[#6d451e] to-transparent"
                    }`} 
                />

                <div className={`absolute left-0 z-10 pointer-events-none ${
                    useAltIcon 
                        ? "-bottom-[1px] h-[36px] w-[36px]" 
                        : "bottom-0 h-[32px] w-[32px]"
                }`}>
                    <Image
                        src={iconSrc}
                        alt=""
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                <div className="relative z-20 w-full pl-11 pr-6 pb-1 flex items-center">
                    <select
                        value={value}
                        disabled={disabled}
                        onChange={(event) => onChange(event.target.value)}
                        className="w-full appearance-none bg-transparent text-center text-sm font-light text-white outline-none cursor-pointer disabled:cursor-not-allowed"
                    >
                        {options.map((option) => (
                            <option key={option} value={option} className="bg-[#141414] text-white">
                                {option}
                            </option>
                        ))}
                    </select>

                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 pb-1 text-[9px] text-[#c59c52]">
                        ▼
                    </span>
                </div>
            </div>
        </div>
    );
}

export function SliderField({
    label,
    value,
    min,
    max,
    step = 0.5,
    unit,
    onChange,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit: string;
    onChange: (value: number) => void;
}) {
    return (
        <label className="block">
            <span className="mb-1.5 flex items-center justify-between text-xs tracking-[0.1em] text-[#d8cfd8]">
                <span>{label}</span>
                <span className="font-serif text-[#e4bf70]">
                    {unit === " %" || unit === " 段階" || unit === "°" || unit === " px" ? value : value.toFixed(1)}
                    {unit}
                </span>
            </span>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(event) => onChange(Number(event.target.value))}
                className="h-1 w-full cursor-pointer accent-[#d7ae5d]"
            />
        </label>
    );
}