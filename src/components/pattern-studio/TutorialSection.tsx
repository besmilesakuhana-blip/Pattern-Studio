"use client";

import Image from "next/image";
import React, { useState } from "react";

export function TutorialSection() {
    const [isOpen, setIsOpen] = useState(true);

    const steps = [
        {
            num: "01",
            icon: "📸",
            title: "服の写真やイラストを選ぶ",
            desc: "作ってみたいお洋服のイラストや写真を「写真」エリアからアップロードします。AIが服の形を解析し、自動で最適な型紙の初期位置をセッティングします。",
        },
        {
            num: "02",
            icon: "📐",
            title: "サイズとカテゴリを設定",
            desc: "ドールやぬいぐるみの大きさ（10cmぬい〜DDまで対応）、カテゴリ（ワンピース・Tシャツ等）、縫い代幅、布地タイプ（ニット/布帛）を選択します。",
        },
        {
            num: "03",
            icon: "✨",
            title: "「生成」を押して微調整",
            desc: "「生成」ボタンを押すと型紙が作られます。右側の「微調整」スライダーを使って、着丈・身幅・袖丈や、パフスリーブ・裾のフレア具合を理想の形に整えましょう。",
        },
        {
            num: "04",
            icon: "🖨️",
            title: "実寸等倍で印刷・保存",
            desc: "表示モードを「平置き型紙」に切り替えて、印刷（PDF）またはJPEG/PNG/SVG保存を行います。実寸等倍（100%）で出力されるため、切ってそのまま布に写せます。",
        },
    ];

    return (
        <section className="mx-auto max-w-6xl px-6 pb-12 sm:px-10">
            <div className="rounded-xl border border-[#333333] bg-[#0d0d0d] p-6 sm:p-8 shadow-2xl transition-all">
                {/* 見出し（クリックで開閉可能） */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                    <div className="flex items-center space-x-3">
                        <div className="relative h-6 w-6 flex-shrink-0">
                            <Image
                                src="/images/tiisaibara.png"
                                alt=""
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h2 className="font-serif text-base tracking-[0.2em] text-[#e4bf70] sm:text-lg group-hover:text-[#f3e5ab] transition-colors">
                            Pattern Studio の使い方（チュートリアル）
                        </h2>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-neutral-400 group-hover:text-white hidden sm:inline">
                            {isOpen ? "閉じる" : "開く"}
                        </span>
                        <span
                            className={`text-xs text-[#e4bf70] transition-transform duration-300 ${
                                isOpen ? "rotate-180" : "rotate-0"
                            }`}
                        >
                            ▼
                        </span>
                    </div>
                </button>

                {/* ステップ一覧 */}
                {isOpen && (
                    <div className="mt-6 border-t border-[#262626] pt-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {steps.map((step) => (
                                <div
                                    key={step.num}
                                    className="relative flex flex-col rounded-lg border border-[#222222] bg-[#141414] p-5 hover:border-[#d7ae5d]/50 transition"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-2xl">{step.icon}</span>
                                        <span className="font-mono text-xs font-bold text-[#d7ae5d]/80 bg-[#252018] px-2 py-0.5 rounded border border-[#d7ae5d]/30">
                                            STEP {step.num}
                                        </span>
                                    </div>
                                    <h3 className="font-serif text-sm font-semibold tracking-wider text-[#f5ebd7] mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs leading-relaxed text-neutral-400">
                                        {step.desc}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* クラウド保存・共有機能のミニヒント */}
                        <div className="mt-6 rounded-lg bg-[#141414] border border-[#262626] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-neutral-300">
                            <div className="flex items-center space-x-2">
                                <span className="text-base">☁️</span>
                                <span>
                                    <strong>便利な機能：</strong> 作成した型紙は「クラウド保存」でこの端末にキープしたり、「🔗 共有」リンクを送ればお友達や別のスマホ・PCでも同じ数値をそのまま開けます。
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}