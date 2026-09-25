"use client";

import React from "react";

export type PatternPreviewSvgProps = {
    length: number;
    width: number;
    sleeve: number;
    sleeveAngle: number;
    shoulderWidthRatio: number;
    waistCurve: number;
    hemFlare: number;
    neckDepth: number;
    puffVolume: number;
    cuffWidthRatio: number;
    neckOffsetY: number;
    neckOffsetX: number;
    overlayZoom: number;
    riseDepth: number;
    thighWidthRatio: number;
    pantHemRatio: number;
    category: string;
    size: string;
    seamAllowance: string;
    fabricType?: string;
    isOverlayMode: boolean;
    hasSleeve: boolean;
    collarType: string;
    collarScale: number;
    svgRef?: React.RefObject<SVGSVGElement | null>;
};

export function PatternPreviewSvg({
    length,
    width,
    sleeve,
    sleeveAngle,
    shoulderWidthRatio,
    waistCurve,
    hemFlare,
    neckDepth,
    puffVolume,
    cuffWidthRatio,
    neckOffsetY,
    neckOffsetX,
    overlayZoom,
    riseDepth,
    thighWidthRatio,
    pantHemRatio,
    category,
    size,
    seamAllowance,
    fabricType = "ニット・伸縮生地",
    isOverlayMode,
    hasSleeve,
    collarType,
    collarScale,
    svgRef,
}: PatternPreviewSvgProps) {
    // 布帛（非伸縮）選択時は、ドールが無理なく着脱できるよう身幅・袖幅に約8%のゆとり係数を適用
    const isWoven = fabricType === "布帛・非伸縮";
    const easeRatio = isWoven ? 1.08 : 1.0;

    const scale = isOverlayMode ? (10 * overlayZoom) : 10;

    // 基本身幅・着丈の計算（布帛時は幅にイーズが付加される）
    const bodyW = width * scale * easeRatio;
    const bodyH = length * scale;

    const isTee = category === "Tシャツ";
    const isSeparatedOnePiece = category === "ワンピース(上下切替)";
    const isAnyTop = isTee || category === "ワンピース" || isSeparatedOnePiece;

    const bodiceH = isSeparatedOnePiece ? bodyH * 0.42 : bodyH;
    const skirtPartH = isSeparatedOnePiece ? bodyH * 0.58 : bodyH;

    const waistIndent = (waistCurve * 1.5) * (isOverlayMode ? overlayZoom : 1);
    const flareOffset = (hemFlare * 2.5) * (isOverlayMode ? overlayZoom : 1);
    const puffHeight = hasSleeve ? (puffVolume * 2.0 * (isOverlayMode ? overlayZoom : 1)) : 0;
    const neckCurvature = (neckDepth * 2.5) * (isOverlayMode ? overlayZoom : 1);

    const seamStrokeWidth = seamAllowance === "なし" ? 0 : seamAllowance === "10mm" ? 10 : seamAllowance === "7mm" ? 7 : 5;

    const crotchLength = (bodyH * (0.28 + riseDepth * 0.015));
    const thighW = (bodyW * 0.5) * thighWidthRatio;
    const pantHemW = (bodyW * 0.4) * pantHemRatio;

    const centerX = 250 + neckOffsetX;
    const topY = 170 + neckOffsetY;

    const halfW = bodyW / 2;
    const baseShoulderRatio = isTee ? 0.90 : 0.86;
    const nsOffset = hasSleeve ? 1.0 : 0.85;
    const shoulderW = halfW * baseShoulderRatio * shoulderWidthRatio * nsOffset;
    const shoulderOffset = shoulderW;
    const neckHalfW = halfW * (isTee ? 0.42 : 0.46);
    const shoulderDrop = 4 * (isOverlayMode ? overlayZoom : 1);
    const armholeDepth = Math.min(bodiceH * 0.44, 45 * (isOverlayMode ? overlayZoom : 1));

    const actualWaistIndent = isTee ? 0 : waistIndent;
    const actualFlareOffset = isTee ? 0 : flareOffset;

    const baseSleeveReferenceW = Math.min(width * scale * 0.6 * easeRatio, 120 * (isOverlayMode ? overlayZoom : 1)); 
    const flatSleeveW = Math.max((armholeDepth * 1.4 + Math.abs(halfW - shoulderW) * 0.8), baseSleeveReferenceW);
    const flatSleeveH = sleeve * scale;
    const sleeveCapH = Math.max(armholeDepth * 0.40 + puffHeight, 10 * (isOverlayMode ? overlayZoom : 1));
    const sleeveCuffW = flatSleeveW * Math.min(cuffWidthRatio, 1.8);

    const overlaySleeveW = Math.max(flatSleeveW * 0.45, (width * 0.42) * scale * easeRatio);
    const overlaySleeveH = sleeve * scale;
    const overlayCuffW = overlaySleeveW * Math.min(cuffWidthRatio, 1.4);

    const baseCollarH = Math.min(bodyH * 0.15, 18 * (isOverlayMode ? overlayZoom : 1));
    const cH = baseCollarH * collarScale;
    
    const cOuterX = -neckHalfW * (0.5 + 0.5 * collarScale);
    const cPointX = -neckHalfW * 0.9 * collarScale;

    // サイズ判定
    const isSmallDoll = size === "10cmぬい" || size === "ねんどろいどどーる";
    const isMidDoll = size === "15cmぬい" || size === "20cmぬい";
    const titleFontSize = isSmallDoll ? 4.5 : isMidDoll ? 6.5 : 8.5;
    const subFontSize = isSmallDoll ? 3.4 : isMidDoll ? 5.0 : 6.8;

    const overlayPointedCollarPath = `
        M 0 ${neckCurvature}
        L ${cPointX} ${neckCurvature + cH}
        L ${cOuterX} ${neckCurvature - 2}
        Q ${-neckHalfW * 0.5} ${neckCurvature + 3} 0 ${neckCurvature}
    `;
    const overlayRoundCollarPath = `
        M 0 ${neckCurvature}
        C ${cPointX * 0.2} ${neckCurvature + cH + 4 * collarScale} ${cPointX * 1.2} ${neckCurvature + cH} ${cOuterX} ${neckCurvature - 2}
        Q ${-neckHalfW * 0.5} ${neckCurvature + 3} 0 ${neckCurvature}
    `;

    const fCollarW = neckHalfW * 1.6;
    const fOuterW = fCollarW * (0.5 + 0.5 * collarScale);

    const flatPointedCollarPath = `
        M 0 0
        Q ${fCollarW * 0.5} 4 ${fCollarW} -2
        L ${fOuterW * 1.1} ${cH}
        L 0 ${cH - 3 * collarScale}
        Z
    `;
    const flatRoundCollarPath = `
        M 0 0
        Q ${fCollarW * 0.5} 4 ${fCollarW} -2
        C ${fOuterW * 1.3} 8 ${fOuterW * 0.8} ${cH + 4 * collarScale} 0 ${cH}
        Z
    `;

    const frontBodicePath = isSeparatedOnePiece ? `
        M ${-neckHalfW} ${-(bodiceH * 0.5)}
        Q 0 ${-(bodiceH * 0.5) + neckCurvature + 8} ${neckHalfW} ${-(bodiceH * 0.5)}
        L ${shoulderW} ${-(bodiceH * 0.5) + shoulderDrop}
        Q ${(shoulderW + halfW) * 0.48} ${-(bodiceH * 0.5) + armholeDepth * 0.6} ${halfW} ${-(bodiceH * 0.5) + armholeDepth}
        L ${halfW - actualWaistIndent * 0.4} ${(bodiceH * 0.5)}
        L ${-(halfW - actualWaistIndent * 0.4)} ${(bodiceH * 0.5)}
        L ${-halfW} ${-(bodiceH * 0.5) + armholeDepth}
        Q ${-(shoulderW + halfW) * 0.48} ${-(bodiceH * 0.5) + armholeDepth * 0.6} ${-shoulderW} ${-(bodiceH * 0.5) + shoulderDrop}
        Z
    ` : `
        M ${-neckHalfW} ${-(bodyH * 0.45)}
        Q 0 ${-(bodyH * 0.45) + neckCurvature + (isTee ? 4 : 8)} ${neckHalfW} ${-(bodyH * 0.45)}
        L ${shoulderW} ${-(bodyH * 0.45) + shoulderDrop}
        Q ${(shoulderW + halfW) * 0.48} ${-(bodyH * 0.45) + armholeDepth * 0.6} ${halfW} ${-(bodyH * 0.45) + armholeDepth}
        Q ${halfW - actualWaistIndent} 0 ${halfW + actualFlareOffset} ${(bodyH * 0.45)}
        L ${-(halfW + actualFlareOffset)} ${(bodyH * 0.45)}
        Q ${-(halfW - actualWaistIndent)} 0 ${-halfW} ${-(bodyH * 0.45) + armholeDepth}
        Q ${-(shoulderW + halfW) * 0.48} ${-(bodyH * 0.45) + armholeDepth * 0.6} ${-shoulderW} ${-(bodyH * 0.45) + shoulderDrop}
        Z
    `;

    const backOverlap = 6;
    const backBodicePath = isSeparatedOnePiece ? `
        M 0 ${-(bodiceH * 0.5)}
        L ${neckHalfW} ${-(bodiceH * 0.5) + 3}
        L ${shoulderW} ${-(bodiceH * 0.5) + shoulderDrop}
        Q ${(shoulderW + halfW) * 0.48} ${-(bodiceH * 0.5) + armholeDepth * 0.6} ${halfW} ${-(bodiceH * 0.5) + armholeDepth}
        L ${halfW - actualWaistIndent * 0.4} ${(bodiceH * 0.5)}
        L ${-backOverlap} ${(bodiceH * 0.5)}
        L ${-backOverlap} ${-(bodiceH * 0.5)}
        Z
    ` : `
        M 0 ${-(bodyH * 0.45)}
        L ${neckHalfW} ${-(bodyH * 0.45) + 3}
        L ${shoulderW} ${-(bodyH * 0.45) + shoulderDrop}
        Q ${(shoulderW + halfW) * 0.48} ${-(bodyH * 0.45) + armholeDepth * 0.6} ${halfW} ${-(bodyH * 0.45) + armholeDepth}
        Q ${halfW - actualWaistIndent} 0 ${halfW + actualFlareOffset} ${(bodyH * 0.45)}
        L ${-backOverlap} ${(bodyH * 0.45)}
        L ${-backOverlap} ${-(bodyH * 0.45)}
        Z
    `;

    const skirtWaistW = (halfW - actualWaistIndent * 0.4) * 2 * 1.4;
    const skirtHemW = skirtWaistW + flareOffset * 2.2;
    const separatedSkirtPath = `
        M ${-skirtWaistW / 2} ${-(skirtPartH * 0.45)}
        L ${skirtWaistW / 2} ${-(skirtPartH * 0.45)}
        L ${skirtHemW / 2} ${(skirtPartH * 0.45)}
        L ${-skirtHemW / 2} ${(skirtPartH * 0.45)}
        Z
    `;

    const sleeveBodyH = Math.max(flatSleeveH - sleeveCapH, 10);
    const sleevePath = `
        M ${-flatSleeveW / 2} ${-sleeveBodyH / 2}
        C ${-flatSleeveW * 0.35} ${-sleeveBodyH / 2 - sleeveCapH * 0.3} ${-flatSleeveW * 0.2} ${-sleeveBodyH / 2 - sleeveCapH} 0 ${-sleeveBodyH / 2 - sleeveCapH}
        C ${flatSleeveW * 0.2} ${-sleeveBodyH / 2 - sleeveCapH} ${flatSleeveW * 0.35} ${-sleeveBodyH / 2 - sleeveCapH * 0.3} ${flatSleeveW / 2} ${-sleeveBodyH / 2}
        L ${sleeveCuffW / 2} ${sleeveBodyH / 2}
        L ${-sleeveCuffW / 2} ${sleeveBodyH / 2}
        Z
    `;

    const skHalfWaist = (bodyW * 0.5) * 1.05;
    const skH = Math.max(bodyH * 0.75, 35);
    const skFlareAdd = (hemFlare * 4.0);
    const skHalfHem = skHalfWaist + 10 + skFlareAdd;
    const skWaistCurveDepth = hemFlare * 1.0; 
    const skHemCurveDepth = 5 + (hemFlare * 1.5);
    const skTopY = -skH * 0.5;
    const skBottomY = skH * 0.5;
    const skirtPath = `
        M ${-skHalfWaist} ${skTopY}
        Q 0 ${skTopY + skWaistCurveDepth} ${skHalfWaist} ${skTopY}
        L ${skHalfHem} ${skBottomY}
        Q 0 ${skBottomY + skHemCurveDepth} ${-skHalfHem} ${skBottomY}
        Z
    `;

    const pY_top = -bodyH / 2;
    const pY_hip = -bodyH / 2 + crotchLength;
    const pY_hem = bodyH / 2;
    const fWaistX = bodyW * 0.22;
    const fHipX = bodyW * 0.26;
    const fHemX = pantHemW * 0.5;
    const fCrotchX = -(thighW * 0.5 + 6);
    const frontPantPath = `
        M ${-fWaistX + 3} ${pY_top + 3} 
        L ${fWaistX} ${pY_top} 
        Q ${fHipX + 3} ${(pY_top + pY_hip)/2} ${fHipX} ${pY_hip} 
        L ${fHemX} ${pY_hem} 
        L ${-fHemX} ${pY_hem} 
        L ${fCrotchX} ${pY_hip} 
        Q ${-fWaistX + 2} ${(pY_top + pY_hip)/2} ${-fWaistX + 3} ${pY_top + 3} 
        Z
    `;
    const bWaistX = bodyW * 0.22;
    const bHipX = bodyW * 0.28;
    const bHemX = pantHemW * 0.52;
    const bCrotchX = thighW * 0.5 + 14;
    const backPantPath = `
        M ${-bWaistX} ${pY_top} 
        L ${bWaistX} ${pY_top - 6} 
        Q ${bWaistX - 2} ${(pY_top + pY_hip)/2 + 5} ${bCrotchX} ${pY_hip} 
        L ${bHemX} ${pY_hem} 
        L ${-bHemX} ${pY_hem} 
        L ${-bHipX} ${pY_hip} 
        Q ${-bHipX - 3} ${(pY_top + pY_hip)/2} ${-bWaistX} ${pY_top} 
        Z
    `;

    const overlayBodiceW = bodyW;
    const overlayWaistW = bodyW - waistIndent * 0.8;
    const overlaySkirtBottomW = overlayWaistW + flareOffset * 2.2;

    const PAD = isSmallDoll ? 30 : 50;

    let patternLeftX = 250;
    let patternRightX = 250;
    let patternCenterX = 250;
    let maxPatternWidth = 500;
    let maxPatternHeight = 500;

    let skCenterY = 250;
    let pCenterY = 240;

    let bodiceTopY = 100;
    let collarY = 180;
    let bottomPartsY = 260;
    let sleeveY = 340;
    let normalSleeveY = 300;
    let pantGap = 80;

    if (category === "スカート") {
        patternCenterX = Math.max(250, skHalfHem + PAD);
        skCenterY = Math.max(250, -skTopY + PAD + (isSmallDoll ? 15 : 25));
        maxPatternWidth = Math.max(500, patternCenterX + skHalfHem + PAD);
        maxPatternHeight = Math.max(500, skCenterY + skBottomY + PAD);
    } else if (category === "ボトムス") {
        pantGap = thighW / 2 + (isSmallDoll ? 25 : 40);
        const leftPantLocalLeft = Math.min(-fWaistX + 3, fCrotchX, -fHemX);
        const rightPantLocalRight = Math.max(bWaistX, bCrotchX, bHemX);
        patternCenterX = Math.max(250, PAD + pantGap - leftPantLocalLeft);
        pCenterY = Math.max(240, -pY_top + PAD + (isSmallDoll ? 15 : 25));
        maxPatternWidth = Math.max(500, patternCenterX + pantGap + rightPantLocalRight + PAD);
        maxPatternHeight = Math.max(500, pCenterY + pY_hem + PAD);
    } else {
        const topPartH = isSeparatedOnePiece ? (bodiceH * 0.5) : (bodyH * 0.45);
        bodiceTopY = Math.max(60, topPartH + PAD + (isSmallDoll ? 15 : 25));
        const bodiceBottomY = bodiceTopY + topPartH;
        const cH_val = collarType !== "襟なし" ? cH : 0;
        collarY = bodiceBottomY + Math.max(15, cH_val + 8) + (isSmallDoll ? 15 : 25);
        bottomPartsY = collarType !== "襟なし" ? collarY + cH_val + (isSmallDoll ? 25 : 45) : bodiceBottomY + (isSmallDoll ? 25 : 45);

        const sleeveTotalCap = (sleeveBodyH / 2 + sleeveCapH);
        sleeveY = bottomPartsY + sleeveTotalCap + (isSmallDoll ? 15 : 25);
        normalSleeveY = bottomPartsY + sleeveTotalCap + (isSmallDoll ? 15 : 25);

        const frontHalfExt = Math.max(halfW + actualFlareOffset, shoulderW);
        const backHalfExt = Math.max(halfW + actualFlareOffset, shoulderW, backOverlap);

        let col1HalfW = frontHalfExt;
        let col2HalfW = backHalfExt;

        if (isSeparatedOnePiece) {
            col1HalfW = Math.max(col1HalfW, skirtHemW / 2);
            if (hasSleeve) col2HalfW = Math.max(col2HalfW, flatSleeveW / 2);
        }

        patternLeftX = Math.max(120, col1HalfW + PAD);
        patternRightX = patternLeftX + col1HalfW + col2HalfW + (isSmallDoll ? 20 : PAD);
        patternCenterX = (patternLeftX + patternRightX) / 2;

        if (hasSleeve && !isSeparatedOnePiece) {
            const currentGap = patternRightX - patternLeftX - col1HalfW - col2HalfW;
            const minGap = flatSleeveW + (isSmallDoll ? 20 : PAD);
            if (currentGap < minGap) {
                patternRightX += (minGap - currentGap);
                patternCenterX = (patternLeftX + patternRightX) / 2;
            }
        }

        maxPatternWidth = Math.max(500, patternRightX + col2HalfW + PAD);

        if (isSeparatedOnePiece) {
            maxPatternHeight = Math.max(500, bottomPartsY + skirtPartH * 0.9 + PAD + (isSmallDoll ? 15 : 30));
            if (hasSleeve) maxPatternHeight = Math.max(maxPatternHeight, sleeveY + (flatSleeveH / 2) + PAD + (isSmallDoll ? 15 : 30));
        } else {
            maxPatternHeight = Math.max(500, bodiceBottomY + PAD + (isSmallDoll ? 15 : 30));
            if (hasSleeve) maxPatternHeight = Math.max(maxPatternHeight, normalSleeveY + (flatSleeveH / 2) + PAD + (isSmallDoll ? 15 : 30));
        }
        if (collarType !== "襟なし") {
            maxPatternHeight = Math.max(maxPatternHeight, collarY + cH_val + PAD + (isSmallDoll ? 15 : 30));
        }
    }

    const frontTopY = isSeparatedOnePiece ? -(bodiceH * 0.5) : -(bodyH * 0.45);
    const backTopY = isSeparatedOnePiece ? -(bodiceH * 0.5) : -(bodyH * 0.45);
    const skirtSepTopY = -(skirtPartH * 0.45);
    const sleeveTopY = -(sleeveBodyH / 2 + sleeveCapH);

    const backPartWidth = halfW + actualFlareOffset;
    const isBackNarrow = backPartWidth < 65 || isSmallDoll;
    const backTextY1 = isBackNarrow ? (backTopY - 11) : -4;
    const backTextY2 = isBackNarrow ? (backTopY - 3) : (titleFontSize + 3);
    const backTextX = isBackNarrow ? (halfW * 0.25) : (halfW * 0.35);

    const frontTextY1 = isSmallDoll ? (frontTopY - 11) : -4;
    const frontTextY2 = isSmallDoll ? (frontTopY - 3) : (titleFontSize + 2);

    const sleeveTextY1 = isSmallDoll ? (sleeveTopY - 11) : -2;
    const sleeveTextY2 = isSmallDoll ? (sleeveTopY - 3) : (titleFontSize + 3);

    const skirtSepTextY1 = isSmallDoll ? (skirtSepTopY - 11) : -4;
    const skirtSepTextY2 = isSmallDoll ? (skirtSepTopY - 3) : (titleFontSize + 2);

    const viewBoxStr = isOverlayMode ? "0 0 500 500" : `0 0 ${maxPatternWidth} ${maxPatternHeight}`;
    const svgStyle = isOverlayMode ? { width: "100%", height: "100%" } : { width: `${maxPatternWidth}px`, height: `${maxPatternHeight}px` };

    return (
        <svg
            ref={svgRef}
            viewBox={viewBoxStr}
            style={svgStyle}
            data-render-width={maxPatternWidth}
            data-render-height={maxPatternHeight}
            className={`select-none block ${isOverlayMode ? 'p-2' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <style>{`
                .pattern-label-title {
                    font-weight: bold;
                    fill: #111;
                    paint-order: stroke fill;
                    stroke: #ffffff;
                    stroke-width: 3.5px;
                    stroke-linejoin: round;
                }
                .pattern-label-sub {
                    fill: #333;
                    paint-order: stroke fill;
                    stroke: #ffffff;
                    stroke-width: 2.8px;
                    stroke-linejoin: round;
                }
            `}</style>

          {!isOverlayMode && (
    <defs>
        <pattern
            id="patternGrid"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
        >
            <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="#ececec"
                strokeWidth="0.5"
            />
        </pattern>
    </defs>
)}

{!isOverlayMode && (
    <rect
        width="100%"
        height="100%"
        fill="url(#patternGrid)"
        className="pattern-grid-rect"
    />
)}
            {!isOverlayMode && <rect width="100%" height="100%" fill="url(#patternGrid)" className="pattern-grid-rect" />}

            {isOverlayMode ? (
                <g id="finished-clothing-silhouette">
                    {isAnyTop && (
                        <>
                            {hasSleeve && (
                                <>
                                    <g transform={`translate(${centerX - shoulderOffset}, ${topY}) rotate(${sleeveAngle})`}>
                                        <path
                                            d={`
                                                M ${-overlaySleeveW / 2} 0
                                                Q 0 ${-puffHeight} ${overlaySleeveW / 2} 0
                                                L ${overlayCuffW / 2} ${overlaySleeveH}
                                                L ${-overlayCuffW / 2} ${overlaySleeveH}
                                                Z
                                            `}
                                            fill="rgba(255, 255, 255, 0.65)"
                                            stroke="#111"
                                            strokeWidth="2"
                                        />
                                    </g>
                                    <g transform={`translate(${centerX + shoulderOffset}, ${topY}) rotate(${-sleeveAngle})`}>
                                        <path
                                            d={`
                                                M ${-overlaySleeveW / 2} 0
                                                Q 0 ${-puffHeight} ${overlaySleeveW / 2} 0
                                                L ${overlayCuffW / 2} ${overlaySleeveH}
                                                L ${-overlayCuffW / 2} ${overlaySleeveH}
                                                Z
                                            `}
                                            fill="rgba(255, 255, 255, 0.65)"
                                            stroke="#111"
                                            strokeWidth="2"
                                        />
                                    </g>
                                </>
                            )}

                            <g transform={`translate(${centerX}, ${topY})`}>
                                {isSeparatedOnePiece ? (
                                    <>
                                        <path
                                            d={`
                                                M ${-overlayBodiceW / 2} 0
                                                Q 0 ${neckCurvature} ${overlayBodiceW / 2} 0
                                                L ${overlayWaistW / 2} ${bodiceH}
                                                L ${-overlayWaistW / 2} ${bodiceH}
                                                Z
                                            `}
                                            fill="rgba(255, 255, 255, 0.75)"
                                            stroke="#111"
                                            strokeWidth="2.2"
                                        />
                                        <path
                                            d={`
                                                M ${-overlayWaistW / 2} ${bodiceH}
                                                L ${overlayWaistW / 2} ${bodiceH}
                                                L ${overlaySkirtBottomW / 2} ${bodyH}
                                                L ${-overlaySkirtBottomW / 2} ${bodyH}
                                                Z
                                            `}
                                            fill="rgba(255, 255, 255, 0.75)"
                                            stroke="#111"
                                            strokeWidth="2.2"
                                        />
                                    </>
                                ) : (
                                    <path
                                        d={`
                                            M ${-(bodyW / 2)} 0
                                            Q 0 ${neckCurvature} ${(bodyW / 2)} 0
                                            L ${(bodyW / 2)} ${Math.min(bodyH * 0.3, 35 * overlayZoom)}
                                            Q ${(bodyW / 2) - actualWaistIndent} ${bodyH * 0.45} ${(bodyW / 2) + actualFlareOffset} ${bodyH}
                                            L ${-(bodyW / 2) - actualFlareOffset} ${bodyH}
                                            Q ${-(bodyW / 2) + actualWaistIndent} ${bodyH * 0.45} ${-(bodyW / 2)} ${Math.min(bodyH * 0.3, 35 * overlayZoom)}
                                            Z
                                        `}
                                        fill="rgba(255, 255, 255, 0.75)"
                                        stroke="#111"
                                        strokeWidth="2.2"
                                    />
                                )}
                                
                                {collarType !== "襟なし" && (
                                    <>
                                        <path
                                            d={collarType === "角襟" ? overlayPointedCollarPath : overlayRoundCollarPath}
                                            fill="rgba(255, 255, 255, 0.9)"
                                            stroke="#111"
                                            strokeWidth="1.5"
                                        />
                                        <g transform="scale(-1, 1)">
                                            <path
                                                d={collarType === "角襟" ? overlayPointedCollarPath : overlayRoundCollarPath}
                                                fill="rgba(255, 255, 255, 0.9)"
                                                stroke="#111"
                                                strokeWidth="1.5"
                                            />
                                        </g>
                                    </>
                                )}

                                <text x="0" y={Math.min(bodyH * 0.4, 55 * overlayZoom)} textAnchor="middle" fill="#222" fontSize={11 * Math.min(overlayZoom, 1.4)} fontWeight="bold">
                                    {category}
                                </text>
                                <text x="0" y={Math.min(bodyH * 0.4 + 16 * overlayZoom, 71 * overlayZoom)} textAnchor="middle" fill="#555" fontSize={8.5 * Math.min(overlayZoom, 1.4)}>
                                    丈:{length.toFixed(1)}cm / 幅:{width.toFixed(1)}cm {isWoven ? "(布帛ゆとり込)" : ""}
                                </text>
                            </g>
                        </>
                    )}

                    {category === "スカート" && (
                        <g transform={`translate(${centerX}, ${topY + 60 * overlayZoom})`}>
                            <path
                                d={`
                                    M ${-(bodyW * 0.4)} 0
                                    Q 0 ${6 * overlayZoom} ${(bodyW * 0.4)} 0
                                    L ${(bodyW * 0.4) + flareOffset} ${bodyH}
                                    Q 0 ${bodyH + (12 + flareOffset * 0.2) * overlayZoom} ${-(bodyW * 0.4) - flareOffset} ${bodyH}
                                    Z
                                `}
                                fill="rgba(255, 255, 255, 0.75)"
                                stroke="#111"
                                strokeWidth="2.2"
                            />
                            <text x="0" y={Math.min(bodyH * 0.5, 45 * overlayZoom)} textAnchor="middle" fill="#222" fontSize={11 * Math.min(overlayZoom, 1.4)} fontWeight="bold">スカート</text>
                            <text x="0" y={Math.min(bodyH * 0.5 + 16 * overlayZoom, 61 * overlayZoom)} textAnchor="middle" fill="#555" fontSize={8.5 * Math.min(overlayZoom, 1.4)}>丈:{length.toFixed(1)}cm</text>
                        </g>
                    )}

                    {category === "ボトムス" && (
                        <g transform={`translate(${centerX}, ${topY + 60 * overlayZoom})`}>
                            {[-1, 1].map((dir, idx) => (
                                <path
                                    key={idx}
                                    d={`
                                        M ${dir * 3 * overlayZoom} 0
                                        L ${dir * (bodyW * 0.35)} 0
                                        L ${dir * (bodyW * 0.35 + (thighW * 0.2))} ${crotchLength}
                                        L ${dir * (pantHemW / 2 + 10 * overlayZoom)} ${bodyH}
                                        L ${dir * 4 * overlayZoom} ${bodyH}
                                        L ${dir * 4 * overlayZoom} ${crotchLength}
                                        Z
                                    `}
                                    fill="rgba(255, 255, 255, 0.75)"
                                    stroke="#111"
                                    strokeWidth="2.2"
                                />
                            ))}
                            <text x="0" y={Math.min(bodyH * 0.4, 40 * overlayZoom)} textAnchor="middle" fill="#222" fontSize={11 * Math.min(overlayZoom, 1.4)} fontWeight="bold">パンツ</text>
                        </g>
                    )}
                </g>
            ) : (
                <g id="flat-pattern-pieces" transform="translate(0, 0)">
                    {isAnyTop && (
                        <>
                            <g id="piece-front" transform={`translate(${patternLeftX}, ${bodiceTopY})`}>
                                {seamStrokeWidth > 0 && (
                                    <path
                                        d={frontBodicePath}
                                        fill="none"
                                        stroke="#c59c52"
                                        strokeWidth={seamStrokeWidth}
                                        strokeDasharray="4 2"
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                    />
                                )}
                                <path
                                    d={frontBodicePath}
                                    fill="#faf8f5"
                                    stroke="#222"
                                    strokeWidth="1.5"
                                    strokeLinejoin="round"
                                />
                                <text x={0} y={frontTextY1} textAnchor="middle" fontSize={titleFontSize} className="pattern-label-title">
                                    {isSeparatedOnePiece ? "上半身前身頃 (わ)" : isTee ? "Tシャツ前身頃 (わ)" : "前身頃 (わ)"}
                                </text>
                                <text x={0} y={frontTextY2} textAnchor="middle" fontSize={subFontSize} className="pattern-label-sub">
                                    1枚裁断 {isWoven ? "(布帛)" : ""}
                                </text>
                            </g>

                            <g id="piece-back" transform={`translate(${patternRightX}, ${bodiceTopY})`}>
                                {seamStrokeWidth > 0 && (
                                    <path
                                        d={backBodicePath}
                                        fill="none"
                                        stroke="#c59c52"
                                        strokeWidth={seamStrokeWidth}
                                        strokeDasharray="4 2"
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                    />
                                )}
                                <path
                                    d={backBodicePath}
                                    fill="#faf8f5"
                                    stroke="#222"
                                    strokeWidth="1.5"
                                    strokeLinejoin="round"
                                />
                                <text x={backTextX} y={backTextY1} textAnchor="middle" fontSize={titleFontSize} className="pattern-label-title">
                                    {isSeparatedOnePiece ? "上半身後身頃" : isTee ? "Tシャツ後身頃" : "後身頃"}
                                </text>
                                <text x={backTextX} y={backTextY2} textAnchor="middle" fontSize={subFontSize} className="pattern-label-sub">
                                    左右2枚 (背開き) {isWoven ? "(布帛)" : ""}
                                </text>
                            </g>

                            {collarType !== "襟なし" && (
                                <g id="piece-collar" transform={`translate(${patternCenterX}, ${collarY})`}>
                                    {[-1, 1].map((dir, idx) => (
                                        <g key={idx} transform={`translate(${dir * (fCollarW + 4)}, 0) scale(${dir}, 1)`}>
                                            {seamStrokeWidth > 0 && (
                                                <path
                                                    d={collarType === "角襟" ? flatPointedCollarPath : flatRoundCollarPath}
                                                    fill="none"
                                                    stroke="#c59c52"
                                                    strokeWidth={seamStrokeWidth}
                                                    strokeDasharray="4 2"
                                                    strokeLinejoin="round"
                                                />
                                            )}
                                            <path
                                                d={collarType === "角襟" ? flatPointedCollarPath : flatRoundCollarPath}
                                                fill="#faf8f5"
                                                stroke="#222"
                                                strokeWidth="1.2"
                                                strokeLinejoin="round"
                                            />
                                        </g>
                                    ))}
                                    <text x="0" y={-cH - 10} textAnchor="middle" fontSize={titleFontSize * 0.9} className="pattern-label-title">{collarType}</text>
                                    <text x="0" y={-cH - 2} textAnchor="middle" fontSize={subFontSize} className="pattern-label-sub">左右2枚裁断</text>
                                </g>
                            )}

                            {isSeparatedOnePiece ? (
                                <>
                                    <g id="piece-skirt-sep" transform={`translate(${patternLeftX}, ${bottomPartsY + skirtPartH * 0.45})`}>
                                        {seamStrokeWidth > 0 && (
                                            <path
                                                d={separatedSkirtPath}
                                                fill="none"
                                                stroke="#c59c52"
                                                strokeWidth={seamStrokeWidth}
                                                strokeDasharray="4 2"
                                                strokeLinejoin="round"
                                                strokeLinecap="round"
                                            />
                                        )}
                                        <path
                                            d={separatedSkirtPath}
                                            fill="#faf8f5"
                                            stroke="#222"
                                            strokeWidth="1.5"
                                            strokeLinejoin="round"
                                        />
                                        <text x={0} y={skirtSepTextY1} textAnchor="middle" fontSize={titleFontSize} className="pattern-label-title">
                                            ふんわりスカート
                                        </text>
                                        <text x={0} y={skirtSepTextY2} textAnchor="middle" fontSize={subFontSize} className="pattern-label-sub">前後2枚裁断</text>
                                    </g>

                                    {hasSleeve && (
                                        <g id="piece-sleeve" transform={`translate(${patternRightX}, ${sleeveY})`}>
                                            {seamStrokeWidth > 0 && (
                                                <path
                                                    d={sleevePath}
                                                    fill="none"
                                                    stroke="#c59c52"
                                                    strokeWidth={seamStrokeWidth}
                                                    strokeDasharray="4 2"
                                                    strokeLinejoin="round"
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            <path
                                                d={sleevePath}
                                                fill="#faf8f5"
                                                stroke="#222"
                                                strokeWidth="1.5"
                                                strokeLinejoin="round"
                                            />
                                            <text x={0} y={sleeveTextY1} textAnchor="middle" fontSize={titleFontSize} className="pattern-label-title">袖</text>
                                            <text x={0} y={sleeveTextY2} textAnchor="middle" fontSize={subFontSize} className="pattern-label-sub">左右2枚裁断</text>
                                        </g>
                                    )}
                                </>
                            ) : (
                                hasSleeve && (
                                    <g id="piece-sleeve" transform={`translate(${patternCenterX}, ${normalSleeveY})`}>
                                        {seamStrokeWidth > 0 && (
                                            <path
                                                d={sleevePath}
                                                fill="none"
                                                stroke="#c59c52"
                                                strokeWidth={seamStrokeWidth}
                                                strokeDasharray="4 2"
                                                strokeLinejoin="round"
                                                strokeLinecap="round"
                                            />
                                        )}
                                        <path
                                            d={sleevePath}
                                            fill="#faf8f5"
                                            stroke="#222"
                                            strokeWidth="1.5"
                                            strokeLinejoin="round"
                                        />
                                        <text x={0} y={sleeveTextY1} textAnchor="middle" fontSize={titleFontSize} className="pattern-label-title">袖</text>
                                        <text x={0} y={sleeveTextY2} textAnchor="middle" fontSize={subFontSize} className="pattern-label-sub">左右2枚裁断</text>
                                    </g>
                                )
                            )}
                        </>
                    )}

                    {category === "スカート" && (
                        <g id="piece-skirt" transform={`translate(${patternCenterX}, ${skCenterY})`}>
                            {seamStrokeWidth > 0 && (
                                <path
                                    d={skirtPath}
                                    fill="none"
                                    stroke="#c59c52"
                                    strokeWidth={seamStrokeWidth}
                                    strokeDasharray="4 2"
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                />
                            )}
                            <path
                                d={skirtPath}
                                fill="#faf8f5"
                                stroke="#222"
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                            />
                            <text x={0} y={isSmallDoll ? (skTopY - 11) : -4} textAnchor="middle" fontSize={titleFontSize} className="pattern-label-title">
                                スカートパターン
                            </text>
                            <text x={0} y={isSmallDoll ? (skTopY - 3) : (titleFontSize + 3)} textAnchor="middle" fontSize={subFontSize} className="pattern-label-sub">
                                前・後 2枚裁断 (わ裁ち)
                            </text>
                        </g>
                    )}

                    {category === "ボトムス" && (
                        <g id="piece-pants" transform={`translate(${patternCenterX}, ${pCenterY})`}>
                            <g transform={`translate(${-pantGap}, 0)`}>
                                {seamStrokeWidth > 0 && (
                                    <path
                                        d={frontPantPath}
                                        fill="none"
                                        stroke="#c59c52"
                                        strokeWidth={seamStrokeWidth}
                                        strokeDasharray="4 2"
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                    />
                                )}
                                <path
                                    d={frontPantPath}
                                    fill="#faf8f5"
                                    stroke="#222"
                                    strokeWidth="1.5"
                                    strokeLinejoin="round"
                                />
                                <text x={0} y={isSmallDoll ? (pY_top - 11) : -4} textAnchor="middle" fontSize={titleFontSize} className="pattern-label-title">
                                    前パンツ
                                </text>
                                <text x={0} y={isSmallDoll ? (pY_top - 3) : (titleFontSize + 3)} textAnchor="middle" fontSize={subFontSize} className="pattern-label-sub">左右2枚裁断</text>
                            </g>

                            <g transform={`translate(${pantGap}, 0)`}>
                                {seamStrokeWidth > 0 && (
                                    <path
                                        d={backPantPath}
                                        fill="none"
                                        stroke="#c59c52"
                                        strokeWidth={seamStrokeWidth}
                                        strokeDasharray="4 2"
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                    />
                                )}
                                <path
                                    d={backPantPath}
                                    fill="#faf8f5"
                                    stroke="#222"
                                    strokeWidth="1.5"
                                    strokeLinejoin="round"
                                />
                                <text x={0} y={isSmallDoll ? (pY_top - 11) : -4} textAnchor="middle" fontSize={titleFontSize} className="pattern-label-title">
                                    後パンツ
                                </text>
                                <text x={0} y={isSmallDoll ? (pY_top - 3) : (titleFontSize + 3)} textAnchor="middle" fontSize={subFontSize} className="pattern-label-sub">左右2枚裁断</text>
                            </g>
                        </g>
                    )}
                </g>
            )}
        </svg>
    );
}