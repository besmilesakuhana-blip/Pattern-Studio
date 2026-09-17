"use client";

import Image from "next/image";
import React from "react";

export function NoticeSection() {
    return (
        <section className="mx-auto max-w-6xl px-6 pb-20 sm:px-10">
            <div className="rounded-xl border border-[#333333] bg-[#0d0d0d] p-6 sm:p-8 shadow-2xl">
                {/* 見出し */}
                <div className="flex items-center space-x-3 border-b border-[#262626] pb-4">
                    <div className="relative h-6 w-6 flex-shrink-0">
                        <Image
                            src="/images/tiisaibara.png"
                            alt=""
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h2 className="font-serif text-base tracking-[0.2em] text-[#e4bf70] sm:text-lg">
                        型紙のご利用に関する注意事項・お願い
                    </h2>
                </div>

                {/* 注意事項リスト（4枚共通のカードデザイン） */}
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* 1. ダウンロード時の表示モード */}
                    <div className="flex flex-col rounded-lg border border-[#222222] bg-[#141414] p-5">
                        <div className="mb-3 flex items-center space-x-2 text-[#e4bf70]">
                            <span className="text-base">📥</span>
                            <h3 className="font-serif text-sm font-semibold tracking-wider">
                                ダウンロード・印刷時の表示モードについて
                            </h3>
                        </div>
                        <p className="text-xs leading-relaxed text-neutral-300">
                            型紙の印刷（PDF）やダウンロード（JPEG/PNG/SVG）を行う際は、表示モードが必ず<strong>「平置き型紙（パーツ展開）」</strong>になっていることをご確認ください。
                            <span className="mt-2 block text-neutral-400 text-[11px] leading-relaxed">
                                ※「完成シルエット（写真に重ねる）」のままでは、縫い合わせるためのパーツ型紙データを出力できません。必ずプレビュー上のボタンで「平置き型紙」に切り替えてから保存してください。
                            </span>
                        </p>
                    </div>

                    {/* 2. 完成シルエット調整について */}
                    <div className="flex flex-col rounded-lg border border-[#222222] bg-[#141414] p-5">
                        <div className="mb-3 flex items-center space-x-2 text-[#e4bf70]">
                            <span className="text-base">👗</span>
                            <h3 className="font-serif text-sm font-semibold tracking-wider">
                                完成シルエット（写真重ね合わせ）について
                            </h3>
                        </div>
                        <p className="text-xs leading-relaxed text-neutral-300">
                            「完成シルエット」画面で行う<strong>表示倍率・上下左右の位置調整・腕の開き角度</strong>は、アップロードされたイラストや写真に合わせて見栄えを整えるための視覚的なプレビュー機能です。
                            <span className="mt-2 block text-neutral-400 text-[11px] leading-relaxed">
                                ※ここでの倍率・位置操作は、印刷・保存される型紙の実寸寸法には一切影響しません。型紙自体の寸法を変更したい場合は「基本サイズ（着丈・身幅など）」のスライダーを調整してください。
                            </span>
                        </p>
                    </div>

                    {/* 3. AI生成・自動製図について */}
                    <div className="flex flex-col rounded-lg border border-[#222222] bg-[#141414] p-5">
                        <div className="mb-3 flex items-center space-x-2 text-[#e4bf70]">
                            <span className="text-base">🪄</span>
                            <h3 className="font-serif text-sm font-semibold tracking-wider">
                                AIによる自動製図・フィッティング
                            </h3>
                        </div>
                        <p className="text-xs leading-relaxed text-neutral-300">
                            当サイトの型紙は、入力された寸法や画像解析をもとにAI・プログラムによって自動生成されています。ドールのボディ個体差や生地の伸縮性によって着心地が異なる場合がありますので、本番布を裁断する前に、不要な布（シーチング等）で仮縫い・試着確認を行うことをおすすめします。
                        </p>
                    </div>

                    {/* 4. 印刷とはみ出し時の貼り合わせ */}
                    <div className="flex flex-col rounded-lg border border-[#222222] bg-[#141414] p-5">
                        <div className="mb-3 flex items-center space-x-2 text-[#e4bf70]">
                            <span className="text-base">✂️</span>
                            <h3 className="font-serif text-sm font-semibold tracking-wider">
                                印刷ではみ出す場合の貼り合わせ
                            </h3>
                        </div>
                        <p className="text-xs leading-relaxed text-neutral-300">
                            DDやMDDなど大きめの服や、丈を長くして用紙サイズを越えたパーツは、自動的に「半分（上下または左右）」に分割して出力されます。貼り合わせ用の余白（10mmのりしろ）を設けていますので、印刷後に中心の合印線を合わせてテープやのりで繋げてから布を裁断してください。
                        </p>
                    </div>
                </div>

                {/* 禁止事項・販売について */}
                <div className="mt-6 rounded-lg border border-[#222222] bg-[#141414] p-5">
                    <div className="mb-2 flex items-center space-x-2 text-[#e4bf70]">
                        <span className="text-base">⚠️</span>
                        <h3 className="font-serif text-sm font-semibold tracking-wider">
                            型紙データの販売・再配布の禁止
                        </h3>
                    </div>
                    <p className="text-xs leading-relaxed text-neutral-300">
                        生成された型紙データ（PDF・SVG・画像等）の転売、再配布、自作発言は固く禁止しております。個人利用の範囲でお楽しみください。<br />
                        <span className="mt-1.5 block text-[#d8cfd8] text-[11px]">
                            ※当型紙を使って制作された「お洋服・完成品」のバザーやフリマアプリでの販売・個人のハンドメイド活動は問題ございません。
                        </span>
                    </p>
                </div>

                {/* 実寸印刷確認のアドバイス */}
                <div className="mt-6 rounded bg-[#181512] border border-[#3d321d] p-3.5 text-xs text-[#e4bf70] flex items-start space-x-2.5">
                    <span className="text-sm">💡</span>
                    <div className="leading-relaxed">
                        <strong>印刷時のポイント：</strong> プリンターやコンビニ印刷の際は、印刷倍率を「用紙に合わせる」ではなく必ず<strong>「実際のサイズ（100%）」</strong>に設定してください。右上の「30mm × 30mm」テスト枠を定規で測り、ぴったり3cmになっているか確認してからお使いください。
                    </div>
                </div>
            </div>
        </section>
    );
}