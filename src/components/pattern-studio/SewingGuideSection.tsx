"use client";

import Image from "next/image";
import { useState } from "react";

function SewingIllustration({ type }: { type: string }) {
    switch (type) {
        case "shoulder":
            return (
                <svg viewBox="0 0 200 130" className="w-full h-full bg-[#181818] rounded border border-[#2a2a2a] select-none">
                    <defs>
                        <marker id="arrowGold" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f43f5e" />
                        </marker>
                    </defs>
                    <g transform="translate(100, 68)">
                        <path d="M -30,10 L 30,10 L 26,45 L -26,45 Z" fill="#292929" stroke="#555" strokeWidth="1" />
                        <path d="M -28,10 L -12,10 L 0,22 L 12,10 L 28,10" fill="none" stroke="#777" strokeWidth="1" />
                        <text x="0" y="32" fill="#888" fontSize="8" textAnchor="middle">前身頃</text>
                        <line x1="-28" y1="10" x2="-12" y2="10" stroke="#f43f5e" strokeWidth="3" />
                        <line x1="12" y1="10" x2="28" y2="10" stroke="#f43f5e" strokeWidth="3" />
                        <text x="-20" y="6" fill="#f43f5e" fontSize="8" fontWeight="bold" textAnchor="middle">A</text>
                        <text x="20" y="6" fill="#f43f5e" fontSize="8" fontWeight="bold" textAnchor="middle">A</text>

                        <path d="M -68,-40 L -48,-40 L -48,-5 L -64,-5 Z" fill="#222" stroke="#555" strokeWidth="1" />
                        <path d="M 48,-40 L 68,-40 L 64,-5 L 48,-5 Z" fill="#222" stroke="#555" strokeWidth="1" />
                        <text x="-58" y="-20" fill="#888" fontSize="7" textAnchor="middle">後(左)</text>
                        <text x="58" y="-20" fill="#888" fontSize="7" textAnchor="middle">後(右)</text>
                        <line x1="-68" y1="-5" x2="-52" y2="-5" stroke="#f43f5e" strokeWidth="3" />
                        <line x1="52" y1="-5" x2="68" y2="-5" stroke="#f43f5e" strokeWidth="3" />
                        <text x="-60" y="-8" fill="#f43f5e" fontSize="8" fontWeight="bold" textAnchor="middle">A</text>
                        <text x="60" y="-8" fill="#f43f5e" fontSize="8" fontWeight="bold" textAnchor="middle">A</text>

                        <path d="M -58,0 Q -40,5 -25,8" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrowGold)" />
                        <path d="M 58,0 Q 40,5 25,8" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrowGold)" />
                        
                        <text x="0" y="-48" fill="#e4bf70" fontSize="8.5" textAnchor="middle">前後の肩線【A】同士を中表で縫合</text>
                    </g>
                </svg>
            );
        case "sleeve":
            return (
                <svg viewBox="0 0 200 130" className="w-full h-full bg-[#181818] rounded border border-[#2a2a2a] select-none">
                    <defs>
                        <marker id="arrowCyan" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#06b6d4" />
                        </marker>
                    </defs>
                    <g transform="translate(100, 68)">
                        <path d="M -22,-30 L 22,-30 L 30,25 L -30,25 Z" fill="#292929" stroke="#555" strokeWidth="1" />
                        <text x="0" y="0" fill="#888" fontSize="8" textAnchor="middle">開いた身頃</text>
                        <path d="M -22,-30 C -35,-10 -35,5 -30,25" fill="none" stroke="#06b6d4" strokeWidth="3" />
                        <text x="-40" y="-2" fill="#06b6d4" fontSize="9" fontWeight="bold">B</text>

                        <g transform="translate(-62, -2)">
                            <path d="M -22,12 C -18,-15 18,-15 22,12 L 15,30 L -15,30 Z" fill="#222" stroke="#555" strokeWidth="1" />
                            <path d="M -22,12 C -18,-15 18,-15 22,12" fill="none" stroke="#06b6d4" strokeWidth="3" />
                            <text x="0" y="22" fill="#888" fontSize="7.5" textAnchor="middle">袖</text>
                            <text x="0" y="-12" fill="#06b6d4" fontSize="9" fontWeight="bold" textAnchor="middle">B</text>
                        </g>

                        <path d="M -50,-8 Q -38,-15 -32,-8" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrowCyan)" />
                        <text x="0" y="-48" fill="#e4bf70" fontSize="8.5" textAnchor="middle">身頃袖ぐり【B】と袖山【B】を縫合</text>
                    </g>
                </svg>
            );
        case "side":
            return (
                <svg viewBox="0 0 200 130" className="w-full h-full bg-[#181818] rounded border border-[#2a2a2a] select-none">
                    <g transform="translate(100, 65)">
                        <path d="M -20,-38 L 20,-38 L 50,-10 L 35,40 L -35,40 L -50,-10 Z" fill="#292929" stroke="#555" strokeWidth="1.2" />
                        <path d="M -48,-10 L -30,5 L -30,38" fill="none" stroke="#eab308" strokeWidth="3" strokeDasharray="4 2" />
                        <path d="M 48,-10 L 30,5 L 30,38" fill="none" stroke="#eab308" strokeWidth="3" strokeDasharray="4 2" />
                        
                        <text x="-40" y="20" fill="#eab308" fontSize="9" fontWeight="bold">C</text>
                        <text x="36" y="20" fill="#eab308" fontSize="9" fontWeight="bold">C</text>

                        <text x="0" y="2" fill="#999" fontSize="8" textAnchor="middle">中表に折る</text>
                        <text x="0" y="-46" fill="#e4bf70" fontSize="8.5" textAnchor="middle">袖口から脇裾【C】まで一気に縫う</text>
                    </g>
                </svg>
            );
        case "skirtSides":
            return (
                <svg viewBox="0 0 200 130" className="w-full h-full bg-[#181818] rounded border border-[#2a2a2a] select-none">
                    <g transform="translate(100, 65)">
                        <path d="M -25,-18 Q 0,-12 25,-18 L 45,35 Q 0,46 -45,35 Z" fill="#202020" stroke="#444" strokeWidth="1" />
                        <text x="0" y="-24" fill="#888" fontSize="7.5" textAnchor="middle">後スカート</text>
                        
                        <path d="M -30,-10 Q -5,-4 20,-10 L 40,42 Q -5,53 -50,42 Z" fill="#2c2c2c" stroke="#666" strokeWidth="1" />
                        <text x="-5" y="18" fill="#e4bf70" fontSize="8" textAnchor="middle">前スカート (中表)</text>

                        <line x1="-30" y1="-10" x2="-50" y2="42" stroke="#eab308" strokeWidth="3" strokeDasharray="4 2" />
                        <line x1="20" y1="-10" x2="40" y2="42" stroke="#eab308" strokeWidth="3" strokeDasharray="4 2" />
                        <text x="-48" y="16" fill="#eab308" fontSize="9" fontWeight="bold">C</text>
                        <text x="36" y="16" fill="#eab308" fontSize="9" fontWeight="bold">C</text>

                        <text x="0" y="-48" fill="#e4bf70" fontSize="8.5" textAnchor="middle">前後のスカート脇線【C】同士を縫合</text>
                    </g>
                </svg>
            );
        case "skirtWaist":
            return (
                <svg viewBox="0 0 200 130" className="w-full h-full bg-[#181818] rounded border border-[#2a2a2a] select-none">
                    <g transform="translate(100, 65)">
                        <path d="M -30,-5 Q 0,2 30,-5 L 48,42 Q 0,55 -48,42 Z" fill="#292929" stroke="#555" strokeWidth="1" />
                        <path d="M -30,-5 Q 0,2 30,-5 L 29,6 Q 0,13 -29,6 Z" fill="#3a3a3a" stroke="#777" strokeWidth="1" />
                        <path d="M -28,3 Q 0,10 28,3" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="3 2" />
                        <text x="36" y="5" fill="#a855f7" fontSize="9" fontWeight="bold">D</text>
                        
                        <path d="M -40,-18 Q 0,-8 40,-18" fill="none" stroke="#f5ebd7" strokeWidth="1.2" strokeDasharray="2 2" />
                        <text x="0" y="-20" fill="#f5ebd7" fontSize="7.5" textAnchor="middle">ゴム通し / 折り返しステッチ</text>
                        <text x="0" y="26" fill="#888" fontSize="8" textAnchor="middle">スカート単体</text>
                        <text x="0" y="-48" fill="#e4bf70" fontSize="8.5" textAnchor="middle">ウエスト端【D】を折り込みゴムを通す</text>
                    </g>
                </svg>
            );
        case "hem":
            return (
                <svg viewBox="0 0 200 130" className="w-full h-full bg-[#181818] rounded border border-[#2a2a2a] select-none">
                    <g transform="translate(100, 65)">
                        <rect x="-55" y="-35" width="110" height="60" fill="#292929" stroke="#555" strokeWidth="1" />
                        <rect x="-55" y="10" width="110" height="15" fill="#383838" stroke="#777" strokeWidth="1" />
                        <line x1="-50" y1="18" x2="50" y2="18" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 2" />
                        <text x="0" y="-15" fill="#999" fontSize="8" textAnchor="middle">袖口・裾・首まわり</text>
                        <text x="0" y="4" fill="#10b981" fontSize="8" textAnchor="middle">二つ折り / 三つ折り端ミシン</text>
                        <text x="0" y="-44" fill="#e4bf70" fontSize="8.5" textAnchor="middle">端を折り込んでステッチ留め</text>
                    </g>
                </svg>
            );
        case "skirtGather":
            return (
                <svg viewBox="0 0 200 130" className="w-full h-full bg-[#181818] rounded border border-[#2a2a2a] select-none">
                    <defs>
                        <marker id="arrowPurple" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#a855f7" />
                        </marker>
                    </defs>
                    <g transform="translate(100, 65)">
                        <path d="M -30,-42 L 30,-42 L 25,-12 L -25,-12 Z" fill="#292929" stroke="#555" strokeWidth="1" />
                        <line x1="-25" y1="-12" x2="25" y2="-12" stroke="#a855f7" strokeWidth="3" />
                        <text x="0" y="-24" fill="#888" fontSize="8" textAnchor="middle">上半身身頃</text>
                        <text x="32" y="-9" fill="#a855f7" fontSize="9" fontWeight="bold">D</text>

                        <path d="M -45,15 L 45,15 L 55,48 L -55,48 Z" fill="#222" stroke="#555" strokeWidth="1" />
                        <line x1="-45" y1="15" x2="45" y2="15" stroke="#a855f7" strokeWidth="3" strokeDasharray="3 2" />
                        <text x="0" y="34" fill="#888" fontSize="8" textAnchor="middle">ギャザースカート</text>
                        <text x="50" y="18" fill="#a855f7" fontSize="9" fontWeight="bold">D</text>

                        <path d="M 0,10 L 0,-6" fill="none" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#arrowPurple)" />
                        <text x="0" y="-48" fill="#e4bf70" fontSize="8.5" textAnchor="middle">ウエスト線【D】のギャザーを寄せて縫合</text>
                    </g>
                </svg>
            );
        case "crotch":
            return (
                <svg viewBox="0 0 200 130" className="w-full h-full bg-[#181818] rounded border border-[#2a2a2a] select-none">
                    <g transform="translate(100, 68)">
                        <path d="M -50,-40 L -20,-40 L -20,-10 L -30,35 L -60,35 Z" fill="#292929" stroke="#555" strokeWidth="1" />
                        <path d="M 50,-40 L 20,-40 L 20,-10 L 30,35 L 60,35 Z" fill="#292929" stroke="#555" strokeWidth="1" />
                        
                        <path d="M -20,-38 Q -20,-15 -28,30" fill="none" stroke="#f97316" strokeWidth="3" />
                        <path d="M 20,-38 Q 20,-15 28,30" fill="none" stroke="#f97316" strokeWidth="3" />
                        
                        <text x="-12" y="-15" fill="#f97316" fontSize="9" fontWeight="bold">E</text>
                        <text x="12" y="-15" fill="#f97316" fontSize="9" fontWeight="bold">E</text>

                        <text x="-38" y="-10" fill="#888" fontSize="7.5" textAnchor="middle">左パンツ</text>
                        <text x="38" y="-10" fill="#888" fontSize="7.5" textAnchor="middle">右パンツ</text>

                        <text x="0" y="-48" fill="#e4bf70" fontSize="8.5" textAnchor="middle">前後の股上カーブ【E】同士を縫合</text>
                    </g>
                </svg>
            );
        case "inseam":
            return (
                <svg viewBox="0 0 200 130" className="w-full h-full bg-[#181818] rounded border border-[#2a2a2a] select-none">
                    <g transform="translate(100, 65)">
                        <path d="M -40,-35 L 40,-35 L 50,38 L 18,38 L 0,-2 L -18,38 L -50,38 Z" fill="#292929" stroke="#555" strokeWidth="1" />
                        <path d="M -18,35 L 0,2 L 18,35" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="4 2" />
                        
                        <text x="0" y="24" fill="#06b6d4" fontSize="9" fontWeight="bold" textAnchor="middle">F</text>
                        <text x="0" y="-16" fill="#888" fontSize="8" textAnchor="middle">股を開いて中表</text>
                        <text x="0" y="-44" fill="#e4bf70" fontSize="8.5" textAnchor="middle">股下線【F】を一気に縫い合わせる</text>
                    </g>
                </svg>
            );
        case "collar":
            return (
                <svg viewBox="0 0 200 130" className="w-full h-full bg-[#181818] rounded border border-[#2a2a2a] select-none">
                    <g transform="translate(100, 65)">
                        <path d="M -40,-30 Q 0,-15 40,-30 L 30,30 L -30,30 Z" fill="#292929" stroke="#555" strokeWidth="1" />
                        <path d="M -40,-30 Q 0,-15 40,-30" fill="none" stroke="#3b82f6" strokeWidth="3" />
                        
                        <path d="M -35,-45 Q 0,-30 35,-45 L 40,-25 L 0,-10 L -40,-25 Z" fill="#eee" stroke="#888" strokeWidth="1" />
                        <path d="M -35,-45 Q 0,-30 35,-45" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="3 2" />
                        
                        <text x="0" y="-2" fill="#3b82f6" fontSize="9" fontWeight="bold">G</text>
                        <text x="0" y="-48" fill="#e4bf70" fontSize="8.5" textAnchor="middle">前後の首ぐり【G】に襟パーツを挟んで縫合</text>
                    </g>
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 200 130" className="w-full h-full bg-[#181818] rounded border border-[#2a2a2a]" />
            );
    }
}

export function SewingGuideSection({ category, collarType }: { category: string; collarType: string }) {
    const [isOpen, setIsOpen] = useState(true);

    type Step = {
        title: string;
        targetLines: string;
        desc: string;
        illustration: string;
        tip?: string;
    };

    const getSteps = (): Step[] => {
        let baseSteps: Step[] = [];

        if (category === "Tシャツ" || category === "ワンピース") {
            baseSteps = [
                {
                    title: "STEP 1. 肩を縫い合わせる",
                    targetLines: "縫い合わせ箇所：前身頃の肩線【A】 ＋ 後身頃の肩線【A】",
                    desc: "前身頃と後身頃（左右2枚）を中表（生地の表同士を内側）に重ね、左右の肩線【A】を縫い代幅で縫い合わせます。ぬい服などの小さい服の場合は、先に襟ぐり（首元）を二つ折りしてボンドまたはステッチで始末しておくと仕上がりが綺麗です。",
                    illustration: "shoulder",
                    tip: "💡 小さいサイズ（10cm・15cmぬい等）は手縫いの半返し縫いを使うと縫いズレを防げます。",
                }
            ];

            if (collarType !== "襟なし") {
                baseSteps.push({
                    title: "STEP 1.5 襟を縫い付ける",
                    targetLines: "縫い合わせ箇所：身頃首ぐり【G】 ＋ 襟パーツ【G】",
                    desc: "肩を縫った身頃を開き、首ぐりのカーブに合わせて襟パーツを縫い付けます。",
                    illustration: "collar",
                });
            }

            baseSteps.push(
                {
                    title: "STEP 2. 平らに開いて袖を付ける",
                    targetLines: "縫い合わせ箇所：身頃のアームホール【B】 ＋ 袖の袖山カーブ【B】",
                    desc: "身頃の肩線を開いて平らに置き、アームホール（袖ぐり）のカーブ【B】に合わせて袖パーツの山カーブ【B】を中表で縫い合わせます。パフスリーブ設定の場合は、袖山中央にいせ込み糸を入れてギャザーを寄せてから合わせます。",
                    illustration: "sleeve",
                    tip: "💡 袖山の中央と肩線の縫い目をピンでしっかり固定してから両端へ縫い進めるのがコツです。",
                },
                {
                    title: "STEP 3. 袖下〜脇を一気に縫う",
                    targetLines: "縫い合わせ箇所：袖下〜前後の脇線【C】",
                    desc: "身頃をふたたび中表に二つ折りにたたみ、袖口から袖下を通り、そのまま脇線を通って裾【C】までを一気に縫い合わせます。",
                    illustration: "side",
                },
                {
                    title: "STEP 4. 袖口・裾・背開きの始末",
                    targetLines: "縫い合わせ箇所：袖口・裾の折り返し ＋ 背中心の開き具",
                    desc: "袖口と裾を二つ折りまたは三つ折りにしてステッチをかけます。背中の中央には面ファスナー（薄手マジックテープ）やスナップボタンを縫い付ければ完成です。",
                    illustration: "hem",
                }
            );
            return baseSteps;
        }

        if (category === "ワンピース(上下切替)") {
            baseSteps = [
                {
                    title: "STEP 1. 上半身の肩と袖を組み立てる",
                    targetLines: "縫い合わせ箇所：肩線【A】 ＋ アームホール・袖山【B】",
                    desc: "前身頃と後身頃の肩線【A】を縫い合わせた後、袖【B】をアームホールに縫い付けます。ここまでは通常のトップスと同様の手順です。",
                    illustration: "shoulder",
                }
            ];

            if (collarType !== "襟なし") {
                baseSteps.splice(1, 0, {
                    title: "STEP 1.5 襟を縫い付ける",
                    targetLines: "縫い合わせ箇所：身頃首ぐり【G】 ＋ 襟パーツ【G】",
                    desc: "肩を縫った身頃を開き、首ぐりのカーブに合わせて襟パーツを縫い付けます。",
                    illustration: "collar",
                });
            }

            baseSteps.push(
                {
                    title: "STEP 2. スカートのギャザー寄せと身頃合体",
                    targetLines: "縫い合わせ箇所：上半身裾【D】 ＋ スカート上端【D】",
                    desc: "ギャザースカートパーツの上端に粗ミシンをかけ、上半身身頃のウエスト幅と同じになるようギャザーを均等に寄せます。上半身とスカートを中表に重ねて縫い合わせます。",
                    illustration: "skirtGather",
                    tip: "💡 ギャザーのヒダが均等になるよう、中心と両端を待ち針で仮止めしてから縫いましょう。",
                },
                {
                    title: "STEP 3. 袖下からウエスト、スカート脇を一気に縫う",
                    targetLines: "縫い合わせ箇所：袖下〜ウエスト切替〜スカート裾【C】",
                    desc: "身頃を中表に合わせ、袖口から袖下、ウエストの切り替え位置をきれいに合わせてスカート裾まで一気に縫い合わせます。",
                    illustration: "side",
                    tip: "💡 ウエストの切り替えラインが左右で段違いにならないよう、切り替え位置をピンで厳密に固定してください。",
                },
                {
                    title: "STEP 4. 裾の処理と背開きパーツの取り付け",
                    targetLines: "縫い合わせ箇所：スカート裾のステッチ ＋ 背中心の開き具",
                    desc: "スカートの裾を三つ折りしてステッチをかけます。背中心の持ち出し部分に薄手マジックテープまたはスナップボタンを取り付けて完成です。",
                    illustration: "hem",
                }
            );
            return baseSteps;
        }

        if (category === "スカート") {
            return [
                {
                    title: "STEP 1. スカートの両脇（サイド）を縫う",
                    targetLines: "縫い合わせ箇所：前スカート脇線【C】 ＋ 後スカート脇線【C】",
                    desc: "前スカートと後スカートを中表に重ね、両側の脇線【C】を縫い合わせます。※背中やサイドを開閉式（マジックテープ仕様）にする場合は、片方の脇のみ縫い合わせ、もう片方は開けておきます。",
                    illustration: "skirtSides",
                    tip: "💡 ぬい服などウエストゴムを通す場合は両脇を縫い、伸縮性のない布帛生地の場合は片側を開けておくと着せ替えしやすくなります。",
                },
                {
                    title: "STEP 2. ウエスト部分のステッチ・ゴム入れ",
                    targetLines: "縫い合わせ箇所：ウエスト上端の折り返し線【D】",
                    desc: "ウエスト部分の端を二つ折り（または三つ折り）にしてステッチをかけ、平ゴムを通します。開閉タイプの場合は、開けておいた脇や背中に面ファスナー（薄手マジックテープ）を取り付けます。",
                    illustration: "skirtWaist",
                    tip: "💡 サーキュラー型はウエストがカーブしているため、アイロンでしっかり折り目をつけてからステッチをかけるとねじれず縫えます。",
                },
                {
                    title: "STEP 3. スカート裾（ヘム）のステッチ処理",
                    targetLines: "縫い合わせ箇所：スカート裾の全周カーブ",
                    desc: "裾の広がるカーブに沿って細く二つ折り（またはほつれ止めボンド塗布＋アイロン）にして、端から1〜2mmの位置にステッチをかけて完成です。",
                    illustration: "hem",
                    tip: "💡 小さいドール服の場合は、細く折り込むのが難しいため「ほつれ止めピケ」や「裁ほう上手」を活用するのもおすすめです。",
                },
            ];
        }

        return [
            {
                title: "STEP 1. 前後の股上をそれぞれ縫い合わせる",
                targetLines: "縫い合わせ箇所：前パンツ同士の股上【E】 / 後パンツ同士の股上【E】",
                desc: "左右のパンツパーツを中表に合わせ、前パンツ同士の股上カーブ【E】、後パンツ同士の股上カーブ【E】をそれぞれ縫い合わせます。",
                illustration: "crotch",
                tip: "💡 ぬい服など背開きパンツにする場合は、後ろの股上上部を少し開けておきます。",
            },
            {
                title: "STEP 2. 股下を一気に縫い合わせる",
                targetLines: "縫い合わせ箇所：左右の股下線【F】",
                desc: "パンツを開き直して前後の股中心を合わせ、裾から股下中央を通り、反対側の裾までを一気に縫い合わせます。",
                illustration: "inseam",
            },
            {
                title: "STEP 3. 脇線・ウエスト・裾の始末",
                targetLines: "縫い合わせ箇所：外側脇線 ＋ ウエストゴム ＋ 裾折り返し",
                desc: "両脇（外側の線）を縫い合わせます。裾を二つ折りにしてステッチをかけ、ウエスト部分に細いゴムを通すか、背中に面ファスナーを取り付けて完成です。",
                illustration: "hem",
            },
        ];
    };

    const steps = getSteps();

    return (
        <section className="mx-auto max-w-6xl px-6 pb-12 sm:px-10">
            <div className="rounded-xl border border-[#333333] bg-[#0d0d0d] p-6 shadow-2xl">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-full items-center justify-between border-b border-[#262626] pb-4 text-left transition hover:opacity-90"
                >
                    <div className="flex items-center space-x-3">
                        <div className="relative h-6 w-6">
                            <Image
                                src="/images/tiisaibara.png"
                                alt=""
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h2 className="font-serif text-base tracking-[0.2em] text-[#e4bf70] sm:text-lg">
                            {category}の縫い方・組み立てガイド（合印・縫い合わせ箇所付き）
                        </h2>
                    </div>
                   <div className="flex items-center space-x-2 text-xs text-neutral-400">
    <span className="hidden sm:inline">
        {isOpen ? "閉じる" : "開く"}
    </span>
    <span className="text-[#c59c52]">
        {isOpen ? "▲" : "▼"}
    </span>
</div>
                </button>

                {isOpen && (
                    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="flex flex-col rounded-lg border border-[#222222] bg-[#141414] p-5 transition hover:border-[#444]"
                            >
                                <div className="mb-4 aspect-[16/10] w-full overflow-hidden">
                                    <SewingIllustration type={step.illustration} />
                                </div>
                                <h3 className="mb-1 text-sm font-semibold tracking-wide text-[#f5ebd7]">
                                    {step.title}
                                </h3>
                                <div className="mb-2 text-[11px] font-medium text-[#e4bf70]">
                                    {step.targetLines}
                                </div>
                                <p className="mb-3 text-xs leading-relaxed text-neutral-300">
                                    {step.desc}
                                </p>
                                {step.tip && (
                                    <div className="mt-auto rounded bg-[#1c1914] p-2.5 text-[11px] text-[#e4bf70]">
                                        {step.tip}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}