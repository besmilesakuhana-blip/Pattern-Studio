"use client";

import Image from "next/image";
import { ChangeEvent, Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SelectField, SliderField } from "../components/pattern-studio/UIComponents";
import { PatternPreviewSvg } from "../components/pattern-studio/PatternPreviewSvg";
import { SewingGuideSection } from "../components/pattern-studio/SewingGuideSection";
import { NoticeSection } from "../components/pattern-studio/NoticeSection";
import { LoadingScreen } from "../components/pattern-studio/LoadingScreen";
import { Footer } from "../components/pattern-studio/Footer";

interface SavedPattern {
    id: string;
    title: string;
    category: string;
    size: string;
    bust?: string | null;
    fabricType: string;
    seamAllowance: string;
    parameters: any;
    createdAt: string;
}

// 端末固有トークンの取得または新規生成
const getOrCreateDeviceToken = (): string => {
    if (typeof window === "undefined") return "";
    let token = localStorage.getItem("pattern_studio_device_token");
    if (!token) {
        token = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem("pattern_studio_device_token", token);
    }
    return token;
};

function PatternStudioContent() {
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const [size, setSize] = useState("10cmぬい");
    const [bust, setBust] = useState("DD(M胸)");
    const [category, setCategory] = useState("ワンピース");
    const [seamAllowance, setSeamAllowance] = useState("5mm");
    const [fabricType, setFabricType] = useState("ニット・伸縮生地");
    const [paperOption, setPaperOption] = useState("パーツ個別出力（推奨・自動分割対応）");
    const [exportFormat, setExportFormat] = useState<"JPEG" | "PNG" | "SVG" | "PRINT">("JPEG");
    const [fileName, setFileName] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isFineTuneOpen, setIsFineTuneOpen] = useState(true);
    const [isGenerated, setIsGenerated] = useState(false);

    // エクスポート連打防止フラグ
    const [isExporting, setIsExporting] = useState(false);

    // クラウド保存・読込・削除・リネーム用ステート
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [savedPatterns, setSavedPatterns] = useState<SavedPattern[]>([]);
    const [saveTitleInput, setSaveTitleInput] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    
    // インラインリネーム用ステート
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitleText, setEditingTitleText] = useState("");
    const [isRenaming, setIsRenaming] = useState(false);

    const [viewMode, setViewMode] = useState<"overlay" | "pattern">("overlay");

    const [length, setLength] = useState(6.5);
    const [width, setWidth] = useState(4.0);
    const [sleeve, setSleeve] = useState(3.0);
    const [sleeveAngle, setSleeveAngle] = useState(60);
    const [shoulderWidthRatio, setShoulderWidthRatio] = useState(1.0);
    const [neckOffsetY, setNeckOffsetY] = useState(0);
    const [neckOffsetX, setNeckOffsetX] = useState(0);
    const [overlayZoom, setOverlayZoom] = useState(1.0);

    const [hasSleeve, setHasSleeve] = useState(true);
    const [collarType, setCollarType] = useState("襟なし");
    const [collarScale, setCollarScale] = useState(1.0);

    const [waistCurve, setWaistCurve] = useState(2);
    const [hemFlare, setHemFlare] = useState(5);
    const [neckDepth, setNeckDepth] = useState(2);
    const [puffVolume, setPuffVolume] = useState(0);
    const [cuffWidthRatio, setCuffWidthRatio] = useState(1.0);

    const [riseDepth, setRiseDepth] = useState(3);
    const [thighWidthRatio, setThighWidthRatio] = useState(1.1);
    const [pantHemRatio, setPantHemRatio] = useState(1.0);

    const [sliderLimits, setSliderLimits] = useState({
        length: { min: 2, max: 10 },
        width: { min: 2, max: 8 },
        sleeve: { min: 1, max: 6 },
    });

    const patternSvgRef = useRef<SVGSVGElement | null>(null);

    // アップロード画像のアンマウント時メモリ解放
    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const getBustOptions = () => {
        if (size === "MDD") return ["MDD(S胸)", "MDD(M胸)", "MDD(L胸)"];
        return ["DD(S胸)", "DD(M胸)", "DD(L胸)", "DDdy"];
    };

    const handleSizeChange = (newSize: string) => {
        setSize(newSize);
        if (newSize === "MDD") setBust("MDD(M胸)");
        else if (newSize === "DD") setBust("DD(M胸)");
    };

    const autoFitImageAnalysis = (imgElement: HTMLImageElement) => {
        const aspect = imgElement.naturalWidth / imgElement.naturalHeight;
        
        if (aspect > 0.9) {
            setSleeveAngle(85);
            setSleeve(4.0);
            setCuffWidthRatio(1.1);
            setShoulderWidthRatio(1.05);
            setNeckOffsetY(-35);
            setWidth(4.5);
        } else {
            setSleeveAngle(55);
            setSleeve(3.2);
            setCuffWidthRatio(1.1);
            setShoulderWidthRatio(1.0);
            setNeckOffsetY(0);
            setWidth(3.8);
        }
        setHemFlare(5);
        setWaistCurve(2);
        setCollarScale(1.0);
        setIsGenerated(true);
    };

    useEffect(() => {
        if (size === "10cmぬい") {
            setSliderLimits({ length: { min: 2, max: 10 }, width: { min: 2, max: 8 }, sleeve: { min: 1, max: 6 } });
            setLength(category.includes("ワンピース") ? 6.5 : category === "スカート" ? 3.5 : category === "ボトムス" ? 4.0 : 4.5);
            setWidth(4.0);
            setSleeve(3.0);
            setOverlayZoom(2.8);
        } else if (size === "15cmぬい") {
            setSliderLimits({ length: { min: 4, max: 15 }, width: { min: 3, max: 12 }, sleeve: { min: 2, max: 10 } });
            setLength(category.includes("ワンピース") ? 9.5 : category === "スカート" ? 5.0 : category === "ボトムス" ? 6.0 : 7.0);
            setWidth(6.0);
            setSleeve(4.5);
            setOverlayZoom(2.0);
        } else if (size === "20cmぬい") {
            setSliderLimits({ length: { min: 5, max: 20 }, width: { min: 4, max: 16 }, sleeve: { min: 3, max: 12 } });
            setLength(category.includes("ワンピース") ? 13.0 : category === "スカート" ? 7.0 : category === "ボトムス" ? 8.5 : 9.0);
            setWidth(8.0);
            setSleeve(6.0);
            setOverlayZoom(1.5);
        } else if (size === "ねんどろいどどーる") {
            setSliderLimits({ length: { min: 1.5, max: 8 }, width: { min: 1.5, max: 6 }, sleeve: { min: 1, max: 5 } });
            setLength(category.includes("ワンピース") ? 5.5 : category === "スカート" ? 2.5 : category === "ボトムス" ? 3.5 : 4.0);
            setWidth(3.5);
            setSleeve(3.5);
            setOverlayZoom(3.2);
        } else if (size === "MDD") {
            setSliderLimits({ length: { min: 6, max: 30 }, width: { min: 4, max: 18 }, sleeve: { min: 4, max: 20 } });
            const mddBustWidth = bust === "MDD(L胸)" ? 9.5 : bust === "MDD(M胸)" ? 8.5 : 8.0;
            setLength(category.includes("ワンピース") ? 19.0 : category === "スカート" ? 10.0 : category === "ボトムス" ? 16.0 : 12.0);
            setWidth(mddBustWidth);
            setSleeve(12.0);
            setOverlayZoom(1.1);
        } else if (size === "DD") {
            setSliderLimits({ length: { min: 10, max: 40 }, width: { min: 6, max: 24 }, sleeve: { min: 6, max: 26 } });
            const ddBustWidth = bust === "DDdy" ? 13.0 : bust === "DD(L胸)" ? 12.0 : bust === "DD(S胸)" ? 10.0 : 11.0;
            setLength(category.includes("ワンピース") ? 28.0 : category === "スカート" ? 14.0 : category === "ボトムス" ? 24.0 : 18.0);
            setWidth(ddBustWidth);
            setSleeve(17.0);
            setOverlayZoom(0.85);
        }

        if (category.includes("ワンピース") || category === "スカート") {
            setWaistCurve(2);
            setHemFlare(5);
        } else {
            setWaistCurve(0);
            setHemFlare(0);
        }
    }, [size, bust, category]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }

            setFileName(file.name);
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            setViewMode("overlay");

            const img = new window.Image();
            img.src = imageUrl;
            img.onload = () => {
                autoFitImageAnalysis(img);
            };
        }
    };

    // 保存済みパラメータをフォームに適用
    const handleApplyPattern = (item: SavedPattern) => {
        if (item.category) setCategory(item.category);
        if (item.size) setSize(item.size);
        if (item.fabricType) setFabricType(item.fabricType);
        if (item.seamAllowance) setSeamAllowance(item.seamAllowance);
        if (item.bust) setBust(item.bust);

        const p = item.parameters;
        if (p) {
            if (typeof p.length === "number") setLength(p.length);
            if (typeof p.width === "number") setWidth(p.width);
            if (typeof p.sleeve === "number") setSleeve(p.sleeve);
            if (typeof p.sleeveAngle === "number") setSleeveAngle(p.sleeveAngle);
            if (typeof p.shoulderWidthRatio === "number") setShoulderWidthRatio(p.shoulderWidthRatio);
            if (typeof p.waistCurve === "number") setWaistCurve(p.waistCurve);
            if (typeof p.hemFlare === "number") setHemFlare(p.hemFlare);
            if (typeof p.neckDepth === "number") setNeckDepth(p.neckDepth);
            if (typeof p.puffVolume === "number") setPuffVolume(p.puffVolume);
            if (typeof p.cuffWidthRatio === "number") setCuffWidthRatio(p.cuffWidthRatio);
            if (typeof p.collarType === "string") setCollarType(p.collarType);
            if (typeof p.collarScale === "number") setCollarScale(p.collarScale);
            if (typeof p.hasSleeve === "boolean") setHasSleeve(p.hasSleeve);
            if (typeof p.riseDepth === "number") setRiseDepth(p.riseDepth);
            if (typeof p.thighWidthRatio === "number") setThighWidthRatio(p.thighWidthRatio);
            if (typeof p.pantHemRatio === "number") setPantHemRatio(p.pantHemRatio);
        }

        setIsGenerated(true);
        setIsLoadModalOpen(false);
    };

    // URLパラメータ (?id=xxx) が存在する場合、初回アクセス時に自動復元
    useEffect(() => {
        const patternId = searchParams.get("id");
        if (!patternId) return;

        const loadPatternById = async () => {
            try {
                const res = await fetch(`/api/patterns?id=${encodeURIComponent(patternId)}`);
                if (res.ok) {
                    const item = await res.json();
                    handleApplyPattern(item);
                }
            } catch (err) {
                console.error("共有型紙の自動ロードに失敗しました:", err);
            }
        };

        loadPatternById();
    }, [searchParams]);

    // クラウド保存処理 (ownerToken 付与)
    const handleSaveToCloud = async () => {
        try {
            if (isSaving) return;

            const token = getOrCreateDeviceToken();
            const defaultTitle = `${size}の${category} (${new Date().toLocaleDateString("ja-JP")})`;
            const titleToSave = saveTitleInput.trim() || prompt("保存する型紙の名前を入力してください:", defaultTitle);
            
            if (titleToSave === null) return;

            setIsSaving(true);

            const payload = {
                title: titleToSave || defaultTitle,
                category,
                size,
                bust: (size === "DD" || size === "MDD") ? bust : null,
                fabricType,
                seamAllowance,
                ownerToken: token, // ★ 端末識別トークン
                parameters: {
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
                    collarType,
                    collarScale,
                    hasSleeve,
                    riseDepth,
                    thighWidthRatio,
                    pantHemRatio,
                },
            };

            const res = await fetch("/api/patterns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "保存に失敗しました。");
            }

            const saved = await res.json();
            alert(`「${saved.title}」をクラウドに保存しました！`);
            setSaveTitleInput("");
        } catch (e: any) {
            console.error(e);
            alert(e.message || "通信エラーが発生しました。");
        } finally {
            setIsSaving(false);
        }
    };

    // 履歴モーダルを開いて一覧取得 (ownerToken で絞り込み)
    const handleOpenLoadModal = async () => {
        setIsLoadModalOpen(true);
        setIsLoadingHistory(true);
        try {
            const token = getOrCreateDeviceToken();
            const res = await fetch(
                `/api/patterns?category=${encodeURIComponent(category)}&size=${encodeURIComponent(size)}&ownerToken=${encodeURIComponent(token)}`
            );
            if (res.ok) {
                const data = await res.json();
                setSavedPatterns(data);
            } else {
                throw new Error();
            }
        } catch (e) {
            console.error(e);
            setSavedPatterns([]);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    // 型紙削除ハンドラー (ownerToken を付与して検証)
    const handleDeletePattern = async (id: string, title: string) => {
        const ok = window.confirm(`型紙「${title}」を削除してもよろしいですか？\n※この操作は取り消せません。`);
        if (!ok) return;

        try {
            setDeletingId(id);
            const token = getOrCreateDeviceToken();
            const res = await fetch(`/api/patterns?id=${encodeURIComponent(id)}&ownerToken=${encodeURIComponent(token)}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "削除に失敗しました。");
            }

            // 一覧から即座に除外
            setSavedPatterns((prev) => prev.filter((item) => item.id !== id));
        } catch (e: any) {
            console.error("削除エラー:", e);
            alert(e.message || "削除処理中にエラーが発生しました。");
        } finally {
            setDeletingId(null);
        }
    };

    // 共有リンクのコピー
    const handleCopyShareLink = async (id: string) => {
        try {
            const shareUrl = `${window.location.origin}${window.location.pathname}?id=${encodeURIComponent(id)}`;
            await navigator.clipboard.writeText(shareUrl);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2500);
        } catch (err) {
            alert("リンクのコピーに失敗しました。URLを手動で共有してください。");
        }
    };

    // リネーム編集開始
    const handleStartRename = (id: string, currentTitle: string) => {
        setEditingId(id);
        setEditingTitleText(currentTitle);
    };

    // リネーム保存ハンドラー (ownerToken を付与して検証)
    const handleSaveRename = async (id: string) => {
        if (!editingTitleText.trim()) {
            alert("タイトル名を入力してください。");
            return;
        }

        try {
            setIsRenaming(true);
            const token = getOrCreateDeviceToken();
            const res = await fetch("/api/patterns", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    title: editingTitleText.trim(),
                    ownerToken: token,
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "タイトルの更新に失敗しました。");
            }

            // 一覧のタイトルを更新
            setSavedPatterns((prev) =>
                prev.map((item) => (item.id === id ? { ...item, title: editingTitleText.trim() } : item))
            );
            setEditingId(null);
        } catch (e: any) {
            console.error("リネームエラー:", e);
            alert(e.message || "タイトルの更新中にエラーが発生しました。");
        } finally {
            setIsRenaming(false);
        }
    };

    const handleDownload = () => {
        try {
            if (isExporting) return;

            if (!isGenerated) {
                alert("先に「生成」ボタンを押して型紙を作成してください。");
                return;
            }

            if (viewMode !== "pattern") {
                setViewMode("pattern");
                setTimeout(() => {
                    executeExport();
                }, 100);
                return;
            }

            executeExport();
        } catch (e) {
            console.error("ダウンロードエラー:", e);
            setIsExporting(false);
            alert("ダウンロード処理中にエラーが発生しました。コンソールをご確認ください。");
        }
    };

    const executeExport = () => {
        const svgEl = patternSvgRef.current;
        if (!svgEl) {
            alert("型紙の描画データが見つかりませんでした。表示モードを「平置き型紙」にしてお試しください。");
            return;
        }

        setIsExporting(true);

        const dateStr = new Date().toISOString().split("T")[0];
        const rW = Number(svgEl.getAttribute("data-render-width")) || 500;
        const rH = Number(svgEl.getAttribute("data-render-height")) || 500;
        const mmToPx = 11.811;

        let sheetW_mm = 210;
        let sheetH_mm = 297;
        if (paperOption.includes("A3")) {
            sheetW_mm = 297;
            sheetH_mm = 420;
        } else if (paperOption.includes("B4")) {
            sheetW_mm = 257;
            sheetH_mm = 364;
        }

        const margin_mm = 10;
        const printAreaTop_mm = 32;

        const flatPiecesGroup = svgEl.querySelector("#flat-pattern-pieces") as SVGGraphicsElement;
        
        let measuredBox: { x: number; y: number; width: number; height: number } | null = null;
        if (flatPiecesGroup) {
            try {
                const bb = flatPiecesGroup.getBBox();
                if (bb && bb.width > 0 && bb.height > 0) {
                    measuredBox = { x: bb.x, y: bb.y, width: bb.width, height: bb.height };
                }
            } catch {}
        }

        const sheetMaxW = Math.max(sheetW_mm, sheetH_mm);
        const sheetMinW = Math.min(sheetW_mm, sheetH_mm);
        
        const availLandscapeW = sheetMaxW - margin_mm * 2 - 4;
        const availLandscapeH = sheetMinW - margin_mm * 2 - printAreaTop_mm - 2;
        
        const availPortraitW = sheetMinW - margin_mm * 2 - 4;
        const availPortraitH = sheetMaxW - margin_mm * 2 - printAreaTop_mm - 2;

        const isSmallDoll = size === "10cmぬい" || size === "ねんどろいどどーる";
        const actualTotalW = measuredBox ? measuredBox.width + 10 : (width * 10 * 2.2);
        const actualTotalH = measuredBox ? measuredBox.height + 10 : (length * 10 * 2.0);

        const fitsPortrait = actualTotalW <= availPortraitW && actualTotalH <= availPortraitH;
        const fitsLandscape = actualTotalW <= availLandscapeW && actualTotalH <= availLandscapeH;
        const canFitInOneSheet = fitsPortrait || fitsLandscape;

        const pieceConfigs = [
            { id: "piece-front", name: "前身頃" },
            { id: "piece-back", name: "後身頃" },
            { id: "piece-sleeve", name: "袖" },
            { id: "piece-skirt", name: "スカート" },
            { id: "piece-skirt-sep", name: "ふんわりスカート" },
            { id: "piece-collar", name: "襟" },
            { id: "piece-pants", name: "前・後パンツ" },
        ];

        // 1. SVG保存（実寸設定 & URL即時解放）
        if (exportFormat === "SVG") {
            try {
                const clone = svgEl.cloneNode(true) as SVGSVGElement;
                const gridRect = clone.querySelector(".pattern-grid-rect");
                if (gridRect) gridRect.remove();
                
                clone.setAttribute("width", `${rW}mm`);
                clone.setAttribute("height", `${rH}mm`);
                clone.setAttribute("viewBox", `0 0 ${rW} ${rH}`);
                clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

                const serializer = new XMLSerializer();
                const svgString = serializer.serializeToString(clone);
                const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
                const blobUrl = URL.createObjectURL(svgBlob);
                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = `型紙_${category}_${size}_実寸等倍_${dateStr}.svg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
            } finally {
                setIsExporting(false);
            }
            return;
        }

        // 2. 印刷 / PDF保存
        if (exportFormat === "PRINT") {
            const printWindow = window.open("", "_blank");
            if (!printWindow) {
                alert("ポップアップブロックを解除してください。");
                setIsExporting(false);
                return;
            }

            const serializer = new XMLSerializer();
            let pagesHtml = "";

            const generatePageMarkup = (
                sourceNode: SVGGraphicsElement,
                titleName: string,
                cropX: number,
                cropY: number,
                cropW: number,
                cropH: number,
                isSubPiece: boolean = false
            ) => {
                const clone = sourceNode.cloneNode(true) as SVGGraphicsElement;
                if (isSubPiece) {
                    clone.removeAttribute("transform");
                }
                const svgPieceMarkup = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${cropX} ${cropY} ${cropW} ${cropH}" style="width:${cropW}mm; height:${cropH}mm; display:block;">
                        ${serializer.serializeToString(clone)}
                    </svg>
                `;

                return `
                    <div class="sheet-page">
                        <div class="sheet-header">
                            <div>
                                <div class="title">Pattern Studio 型紙 [${category} / ${size}] ${titleName}</div>
                                <div class="meta">用紙: ${paperOption} | 縫い代: ${seamAllowance} | 実寸等倍(100%) | 作成日: ${dateStr}</div>
                            </div>
                            <div class="scale-box">
                                <div>印刷倍率確認用</div>
                                <div style="font-weight:bold; font-size:10px;">30mm × 30mm</div>
                                <div style="color:#666;">※定規で確認</div>
                            </div>
                        </div>
                        <div class="piece-container">
                            ${svgPieceMarkup}
                        </div>
                    </div>
                `;
            };

            if (flatPiecesGroup && isSmallDoll && canFitInOneSheet) {
                const cropX = measuredBox ? measuredBox.x - 8 : 0;
                const cropY = measuredBox ? measuredBox.y - 8 : 0;
                const cropW = measuredBox ? measuredBox.width + 16 : actualTotalW;
                const cropH = measuredBox ? measuredBox.height + 16 : actualTotalH;
                pagesHtml = generatePageMarkup(flatPiecesGroup, "全パーツ一式", cropX, cropY, cropW, cropH, false);
            } else {
                pieceConfigs.forEach((cfg) => {
                    const el = svgEl.querySelector(`#${cfg.id}`) as SVGGraphicsElement;
                    if (!el) return;

                    const pathElem = el.querySelector("path");
                    let pathBBox = { x: 0, y: 0, width: 0, height: 0 };
                    if (pathElem) {
                        try {
                            const pb = pathElem.getBBox();
                            pathBBox = { x: pb.x, y: pb.y, width: pb.width, height: pb.height };
                        } catch {}
                    }
                    let groupBBox = { x: 0, y: 0, width: 0, height: 0 };
                    try {
                        groupBBox = el.getBBox();
                    } catch {}

                    const baseBox = (pathBBox.width > 0) ? pathBBox : groupBBox;
                    if (baseBox.width === 0 || baseBox.height === 0) return;

                    const padX = 15;
                    const padYTop = 22;
                    const padYBottom = 15;
                    const pieceW_mm = baseBox.width + padX * 2;
                    const pieceH_mm = baseBox.height + padYTop + padYBottom;

                    const curSheetW_mm = sheetMinW;
                    const curSheetH_mm = sheetMaxW;
                    const printableW_mm = curSheetW_mm - margin_mm * 2 - 10;
                    const printableH_mm = curSheetH_mm - margin_mm * 2 - printAreaTop_mm - 10;

                    const needSplitX = pieceW_mm > printableW_mm;
                    const needSplitY = pieceH_mm > printableH_mm;
                    const overlap = 10;
                    const startX = baseBox.x - padX;
                    const startY = baseBox.y - padYTop;

                    if (needSplitX && needSplitY) {
                        const halfW = baseBox.width / 2;
                        const halfH = baseBox.height / 2;
                        pagesHtml += generatePageMarkup(el, `${cfg.name} (左上・part1)`, startX, startY, halfW + padX + overlap, halfH + padYTop + overlap, true);
                        pagesHtml += generatePageMarkup(el, `${cfg.name} (右上・part2)`, baseBox.x + halfW - overlap, startY, halfW + padX + overlap, halfH + padYTop + overlap, true);
                        pagesHtml += generatePageMarkup(el, `${cfg.name} (左下・part3)`, startX, baseBox.y + halfH - overlap, halfW + padX + overlap, halfH + padYBottom + overlap, true);
                        pagesHtml += generatePageMarkup(el, `${cfg.name} (右下・part4)`, baseBox.x + halfW - overlap, baseBox.y + halfH - overlap, halfW + padX + overlap, halfH + padYBottom + overlap, true);
                    } else if (needSplitX && !needSplitY) {
                        const halfW = baseBox.width / 2;
                        pagesHtml += generatePageMarkup(el, `${cfg.name} (左・part1)`, startX, startY, halfW + padX + overlap, pieceH_mm, true);
                        pagesHtml += generatePageMarkup(el, `${cfg.name} (右・part2)`, baseBox.x + halfW - overlap, startY, halfW + padX + overlap, pieceH_mm, true);
                    } else if (!needSplitX && needSplitY) {
                        const halfH = baseBox.height / 2;
                        pagesHtml += generatePageMarkup(el, `${cfg.name} (上・part1)`, startX, startY, pieceW_mm, halfH + padYTop + overlap, true);
                        pagesHtml += generatePageMarkup(el, `${cfg.name} (下・part2)`, startX, baseBox.y + halfH - overlap, pieceW_mm, halfH + padYBottom + overlap, true);
                    } else {
                        pagesHtml += generatePageMarkup(el, cfg.name, startX, startY, pieceW_mm, pieceH_mm, true);
                    }
                });
            }

            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>型紙_${category}_${size}_${dateStr}</title>
                    <style>
                        @page {
                            size: ${paperOption.includes("A3") ? "A3" : paperOption.includes("B4") ? "B4" : "A4"} portrait;
                            margin: 10mm;
                        }
                        * { box-sizing: border-box; }
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: sans-serif;
                            background: #fff;
                            color: #000;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .sheet-page {
                            width: 100%;
                            min-height: 270mm;
                            page-break-after: always;
                            break-after: page;
                            position: relative;
                        }
                        .sheet-page:last-child {
                            page-break-after: auto;
                            break-after: auto;
                        }
                        .sheet-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-end;
                            border-bottom: 2px solid #333;
                            padding-bottom: 5px;
                            margin-bottom: 10px;
                        }
                        .title { font-size: 14px; font-weight: bold; }
                        .meta { font-size: 10px; color: #555; }
                        .scale-box {
                            width: 30mm;
                            height: 30mm;
                            border: 1.5px solid #000;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            font-size: 8px;
                            text-align: center;
                            line-height: 1.2;
                            box-sizing: border-box;
                        }
                        .piece-container {
                            width: 100%;
                            display: flex;
                            justify-content: flex-start;
                            align-items: flex-start;
                        }
                    </style>
                </head>
                <body>
                    ${pagesHtml}
                    <script>
                        window.onload = function() {
                            window.print();
                            window.onafterprint = function() { window.close(); };
                        };
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
            setIsExporting(false);
            return;
        }

        // 3. JPEG / PNG 保存
        const renderPieceSlice = (
            sourceNode: SVGGraphicsElement,
            fileNamePart: string,
            cropX: number,
            cropY: number,
            cropW: number,
            cropH: number,
            fileSuffix: string,
            curSheetW_mm: number,
            curSheetH_mm: number,
            isSubPiece: boolean = false,
            isLastSlice: boolean = false
        ) => {
            const canvasW = Math.round(curSheetW_mm * mmToPx);
            const canvasH = Math.round(curSheetH_mm * mmToPx);

            const clone = sourceNode.cloneNode(true) as SVGGraphicsElement;
            if (isSubPiece) {
                clone.removeAttribute("transform");
            }

            const serializer = new XMLSerializer();
            const pieceSvgString = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="${cropX} ${cropY} ${cropW} ${cropH}" width="${cropW * mmToPx}px" height="${cropH * mmToPx}px">
                    ${serializer.serializeToString(clone)}
                </svg>
            `;
            const blob = new Blob([pieceSvgString], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(blob);

            const pImg = new window.Image();
            pImg.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = canvasW;
                canvas.height = canvasH;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    URL.revokeObjectURL(url);
                    if (isLastSlice) setIsExporting(false);
                    return;
                }

                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvasW, canvasH);

                const margin_px = margin_mm * mmToPx;
                ctx.strokeStyle = "#cccccc";
                ctx.lineWidth = 2;
                ctx.strokeRect(margin_px, margin_px, canvasW - margin_px * 2, canvasH - margin_px * 2);

                ctx.fillStyle = "#111111";
                ctx.font = "bold 34px sans-serif";
                ctx.fillText(`Pattern Studio 型紙 [${category} / ${size}] ${fileNamePart} ${fileSuffix}`, margin_px + 20, margin_px + 50);

                ctx.font = "20px sans-serif";
                ctx.fillStyle = "#555555";
                ctx.fillText(`用紙設定: ${paperOption}  |  縫い代: ${seamAllowance}  |  等倍(100%)実寸  |  作成日: ${dateStr}`, margin_px + 20, margin_px + 90);

                const scaleBoxSize = Math.round(30 * mmToPx);
                const scaleBoxX = canvasW - margin_px - scaleBoxSize - 20;
                const scaleBoxY = margin_px + 20;
                ctx.strokeStyle = "#222222";
                ctx.lineWidth = 3;
                ctx.strokeRect(scaleBoxX, scaleBoxY, scaleBoxSize, scaleBoxSize);
                ctx.fillStyle = "#222222";
                ctx.font = "bold 20px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("印刷倍率確認用", scaleBoxX + scaleBoxSize / 2, scaleBoxY + scaleBoxSize * 0.4);
                ctx.fillText("30mm × 30mm", scaleBoxX + scaleBoxSize / 2, scaleBoxY + scaleBoxSize * 0.65);
                ctx.font = "16px sans-serif";
                ctx.fillStyle = "#777777";
                ctx.fillText("※定規で3cmか確認", scaleBoxX + scaleBoxSize / 2, scaleBoxY + scaleBoxSize * 0.88);
                ctx.textAlign = "left";

                const destW_px = cropW * mmToPx;
                const destH_px = cropH * mmToPx;
                const destX_px = margin_px + 20;
                const destY_px = (margin_mm + printAreaTop_mm) * mmToPx;

                ctx.drawImage(pImg, destX_px, destY_px, destW_px, destH_px);

                const mimeType = exportFormat === "PNG" ? "image/png" : "image/jpeg";
                const ext = exportFormat === "PNG" ? "png" : "jpg";

                canvas.toBlob((blob) => {
                    if (blob) {
                        const blobUrl = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = blobUrl;
                        link.download = `型紙_${category}_${size}_${fileNamePart}${fileSuffix}_${dateStr}.${ext}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(blobUrl);
                    }
                    if (isLastSlice) {
                        setIsExporting(false);
                    }
                }, mimeType, 0.95);

                URL.revokeObjectURL(url);
            };
            pImg.onerror = () => {
                URL.revokeObjectURL(url);
                if (isLastSlice) setIsExporting(false);
            };
            pImg.src = url;
        };

        if (flatPiecesGroup && isSmallDoll && canFitInOneSheet) {
            const cropX = measuredBox ? measuredBox.x - 8 : 0;
            const cropY = measuredBox ? measuredBox.y - 8 : 0;
            const cropW = measuredBox ? measuredBox.width + 16 : actualTotalW;
            const cropH = measuredBox ? measuredBox.height + 16 : actualTotalH;

            const useLandscape = !fitsPortrait && fitsLandscape;
            const curW = useLandscape ? sheetMaxW : sheetMinW;
            const curH = useLandscape ? sheetMinW : sheetMaxW;

            renderPieceSlice(flatPiecesGroup, "全パーツ一式", cropX, cropY, cropW, cropH, "", curW, curH, false, true);
            return;
        }

        const renderStandalonePiece = (
            pieceNode: SVGGraphicsElement,
            pieceName: string,
            isLast: boolean
        ) => {
            const pathElem = pieceNode.querySelector("path");
            let pathBBox = { x: 0, y: 0, width: 0, height: 0 };
            if (pathElem) {
                try {
                    const pb = pathElem.getBBox();
                    pathBBox = { x: pb.x, y: pb.y, width: pb.width, height: pb.height };
                } catch {}
            }

            let groupBBox = { x: 0, y: 0, width: 0, height: 0 };
            try {
                groupBBox = pieceNode.getBBox();
            } catch {}

            const baseBox = (pathBBox.width > 0) ? pathBBox : groupBBox;
            if (baseBox.width === 0 || baseBox.height === 0) {
                if (isLast) setIsExporting(false);
                return;
            }

            const padX = 15;
            const padYTop = 22;
            const padYBottom = 15;

            const pieceW_mm = baseBox.width + padX * 2;
            const pieceH_mm = baseBox.height + padYTop + padYBottom;

            const isPieceLandscape = pieceW_mm > pieceH_mm;
            const curSheetW_mm = isPieceLandscape ? Math.max(sheetW_mm, sheetH_mm) : Math.min(sheetW_mm, sheetH_mm);
            const curSheetH_mm = isPieceLandscape ? Math.min(sheetW_mm, sheetH_mm) : Math.max(sheetW_mm, sheetH_mm);

            const printableW_mm = curSheetW_mm - margin_mm * 2 - 10;
            const printableH_mm = curSheetH_mm - margin_mm * 2 - printAreaTop_mm - 10;

            const needSplitX = pieceW_mm > printableW_mm;
            const needSplitY = pieceH_mm > printableH_mm;
            const overlap = 10;

            const startX = baseBox.x - padX;
            const startY = baseBox.y - padYTop;

            if (needSplitX && needSplitY) {
                const halfW = baseBox.width / 2;
                const halfH = baseBox.height / 2;
                renderPieceSlice(pieceNode, pieceName, startX, startY, halfW + padX + overlap, halfH + padYTop + overlap, "_左上(part1)", curSheetW_mm, curSheetH_mm, true, false);
                setTimeout(() => renderPieceSlice(pieceNode, pieceName, baseBox.x + halfW - overlap, startY, halfW + padX + overlap, halfH + padYTop + overlap, "_右上(part2)", curSheetW_mm, curSheetH_mm, true, false), 300);
                setTimeout(() => renderPieceSlice(pieceNode, pieceName, startX, baseBox.y + halfH - overlap, halfW + padX + overlap, halfH + padYBottom + overlap, "_左下(part3)", curSheetW_mm, curSheetH_mm, true, false), 600);
                setTimeout(() => renderPieceSlice(pieceNode, pieceName, baseBox.x + halfW - overlap, baseBox.y + halfH - overlap, halfW + padX + overlap, halfH + padYBottom + overlap, "_右下(part4)", curSheetW_mm, curSheetH_mm, true, isLast), 900);
                return;
            }

            if (needSplitX && !needSplitY) {
                const halfW = baseBox.width / 2;
                renderPieceSlice(pieceNode, pieceName, startX, startY, halfW + padX + overlap, pieceH_mm, "_左(part1)", curSheetW_mm, curSheetH_mm, true, false);
                setTimeout(() => renderPieceSlice(pieceNode, pieceName, baseBox.x + halfW - overlap, startY, halfW + padX + overlap, pieceH_mm, "_右(part2)", curSheetW_mm, curSheetH_mm, true, isLast), 400);
                return;
            }

            if (!needSplitX && needSplitY) {
                const halfH = baseBox.height / 2;
                renderPieceSlice(pieceNode, pieceName, startX, startY, pieceW_mm, halfH + padYTop + overlap, "_上(part1)", curSheetW_mm, curSheetH_mm, true, false);
                setTimeout(() => renderPieceSlice(pieceNode, pieceName, startX, baseBox.y + halfH - overlap, pieceW_mm, halfH + padYBottom + overlap, "_下(part2)", curSheetW_mm, curSheetH_mm, true, isLast), 400);
                return;
            }

            renderPieceSlice(pieceNode, pieceName, startX, startY, pieceW_mm, pieceH_mm, "", curSheetW_mm, curSheetH_mm, true, isLast);
        };

        const existingPieces = pieceConfigs
            .map(cfg => ({ cfg, el: svgEl.querySelector(`#${cfg.id}`) as SVGGraphicsElement }))
            .filter(item => item.el !== null);

        if (existingPieces.length === 0) {
            setIsExporting(false);
            return;
        }

        existingPieces.forEach((item, index) => {
            const isLast = index === existingPieces.length - 1;
            setTimeout(() => {
                renderStandalonePiece(item.el, item.cfg.name, isLast);
            }, index * 500);
        });
    };

    return (
        <main className="min-h-screen bg-[#000000] text-white selection:bg-[#9a759c] selection:text-white relative flex flex-col justify-between">
            <LoadingScreen isLoading={isLoading} />

            {/* ヘッダー */}
            <header className="relative isolate min-h-[640px] sm:min-h-[450px] overflow-hidden bg-[#7B83A2]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />

                {/* モバイル表示 (スマホで女の子イラストを大きく目立たせる構成) */}
                <div className="flex flex-col items-center justify-between sm:hidden h-full min-h-[640px] pt-6 px-4 relative z-20 overflow-hidden">
                    <div className="flex flex-col items-center text-center w-full z-20">
                        <div className="relative h-20 w-[290px] mb-1">
                            <Image
                                src="/images/logo-text.png"
                                alt="Pattern Studio"
                                fill
                                priority
                                className="object-contain"
                            />
                        </div>
                        <p className="text-xs tracking-[0.2em] text-[#f0edf5] whitespace-nowrap opacity-90">
                            あなただけの型紙を作る
                        </p>
                    </div>

                    {/* 女の子イラスト：高さを 430px → 540px に拡大し、より大きく存在感ある表示に */}
                    <div className="relative w-full h-[480px] flex justify-center items-end pointer-events-none -mt-4">
                        <Image
                            src="/images/header-doll.gif"
                            alt="ドールのイラスト"
                            width={640}
                            height={600}
                            unoptimized
                            priority
                            className="h-[520px] xs:h-[550px] w-auto max-w-[130%] object-contain object-bottom -mb-1 drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
                        />
                    </div>
                </div>

                {/* デスクトップ表示 */}
                <div className="hidden sm:flex relative w-full h-full min-h-[450px] px-10 lg:px-16 items-end justify-between overflow-hidden">
                    <Image
                        src="/images/header-doll.gif"
                        alt="ドールのイラスト"
                        width={580}
                        height={540}
                        unoptimized
                        priority
                        className="absolute -bottom-8 left-2 lg:left-12 z-10 h-[460px] lg:h-[500px] w-auto object-contain object-bottom pointer-events-none"
                    />

                    <div className="relative z-20 ml-auto flex flex-col items-end pb-24 lg:pb-28 text-right pr-6 lg:pr-12">
                        <p className="mb-3 text-sm lg:text-base tracking-[0.25em] text-[#f0edf5] whitespace-nowrap">
                            あなただけの型紙を作る
                        </p>
                        <div className="relative h-36 w-[460px] lg:h-44 lg:w-[620px]">
                            <Image
                                src="/images/logo-text.png"
                                alt="Pattern Studio"
                                fill
                                priority
                                className="object-contain object-right"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <div>
                <section className="mx-auto max-w-6xl px-6 py-12 sm:px-10">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
                        <div className="w-full flex justify-center">
                            <SelectField
                                label="カテゴリ"
                                value={category}
                                options={["Tシャツ", "ワンピース", "ワンピース(上下切替)", "スカート", "ボトムス"]}
                                onChange={setCategory}
                            />
                        </div>

                        <div className="w-full flex justify-center">
                            <div className="flex flex-col items-center justify-center">
                                <span className="mb-2 block h-4 text-center text-xs tracking-[0.2em] text-white">
                                    写真
                                </span>
                                <div className="relative w-full max-w-[280px] h-[40px] flex items-center justify-center">
                                    <div className="absolute bottom-[4px] left-[22px] right-0 h-[2px] bg-gradient-to-r from-[#663b19] via-[#48280f] to-transparent pointer-events-none z-0" />
                                    <div className="absolute left-0 -bottom-[1px] z-10 h-[36px] w-[36px] pointer-events-none">
                                        <Image
                                            src="/images/ookiibara.png"
                                            alt=""
                                            fill
                                            className="object-contain"
                                        />
                                    </div>

                                    <label className="relative z-20 w-full pl-11 pr-6 pb-1 flex items-center justify-center cursor-pointer">
                                        <span className="truncate text-sm font-light text-white">
                                            {fileName || "アップロード"}
                                        </span>
                                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 pb-1 text-[9px] text-[#c59c52]">
                                            ▼
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex justify-center">
                            <SelectField
                                label="大きさ"
                                value={size}
                                options={["10cmぬい", "15cmぬい", "20cmぬい", "ねんどろいどどーる", "MDD", "DD"]}
                                onChange={handleSizeChange}
                            />
                        </div>

                        <div className="w-full flex justify-center">
                            <SelectField
                                label="バスト"
                                value={bust}
                                options={getBustOptions()}
                                disabled={size !== "DD" && size !== "MDD"}
                                useAltIcon
                                onChange={setBust}
                            />
                        </div>

                        <div className="w-full flex justify-center">
                            <SelectField
                                label="縫い代"
                                value={seamAllowance}
                                options={["5mm", "7mm", "10mm", "なし"]}
                                onChange={setSeamAllowance}
                            />
                        </div>

                        <div className="w-full flex justify-center">
                            <SelectField
                                label="生地のタイプ"
                                value={fabricType}
                                options={["ニット・伸縮生地", "布帛・非伸縮"]}
                                useAltIcon
                                onChange={setFabricType}
                            />
                        </div>

                        <div className="w-full flex justify-center sm:col-span-2 lg:col-span-1">
                            <SelectField
                                label="用紙サイズ / 出力オプション"
                                value={paperOption}
                                options={[
                                    "パーツ個別出力（推奨・自動分割対応）",
                                    "A4等倍", 
                                    "A3等倍（大型ドール推奨）", 
                                    "B4等倍"
                                ]}
                                onChange={setPaperOption}
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-start">
                        <button
                            type="button"
                            onClick={() => setIsGenerated(true)}
                            className="group relative p-[1px] transition-transform active:scale-[0.98]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa771c] transition-opacity group-hover:opacity-100 opacity-80" />
                            <div className="relative flex h-[38px] w-[180px] items-center justify-center bg-[#000000] px-6 transition group-hover:bg-[#000000]/80">
                                <span className="text-sm font-light tracking-[0.25em] text-[#f5ebd7] group-hover:text-white">
                                    {isGenerated ? "再生成" : "生成"}
                                </span>
                            </div>
                        </button>
                    </div>
                </section>

                <section className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-10 sm:px-10 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="flex flex-col space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center space-x-2">
                                <span className="text-neutral-400">表示モード:</span>
                                <button
                                    type="button"
                                    onClick={() => setViewMode("overlay")}
                                    className={`px-2.5 py-1 rounded border transition ${
                                        viewMode === "overlay" ? "border-[#d7ae5d] text-[#e4bf70] bg-[#1a1714]" : "border-neutral-700 text-neutral-400 hover:text-white"
                                    }`}
                                >
                                    完成シルエット（写真に重ねる）
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode("pattern")}
                                    className={`px-2.5 py-1 rounded border transition ${
                                        viewMode === "pattern" ? "border-[#d7ae5d] text-[#e4bf70] bg-[#1a1714]" : "border-neutral-700 text-neutral-400 hover:text-white"
                                    }`}
                                >
                                    平置き型紙（パーツ展開）
                                </button>
                            </div>

                            {previewImage && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const img = new window.Image();
                                        img.src = previewImage;
                                        img.onload = () => autoFitImageAnalysis(img);
                                    }}
                                    className="px-2.5 py-1 rounded border border-[#d7ae5d]/70 text-[#f5ebd7] bg-[#1f1b14] hover:bg-[#2a241b] transition active:scale-95"
                                >
                                    🪄 写真に合わせて自動位置調整
                                </button>
                            )}
                        </div>

                        <div className={`relative aspect-square max-h-[580px] min-h-[360px] overflow-hidden border border-[#333333] bg-white shadow-2xl`}>
                            {isGenerated && viewMode === "pattern" && previewImage && (
                                <div className="absolute bottom-4 right-4 h-24 w-24 overflow-hidden rounded border border-neutral-300 bg-white p-1 shadow-md z-30 pointer-events-none">
                                    <div className="relative h-full w-full">
                                        <Image
                                            src={previewImage}
                                            alt="元写真"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className={`w-full h-full custom-scrollbar ${viewMode === "overlay" ? "flex items-center justify-center" : "overflow-auto"}`}>
                                {isGenerated ? (
                                    <div className={`relative ${viewMode === "overlay" ? "w-full h-full flex items-center justify-center" : "min-w-max min-h-max flex items-center justify-center"}`}>
                                        {viewMode === "overlay" && previewImage && (
                                            <div className="absolute inset-0 z-0 p-4 flex items-center justify-center pointer-events-none">
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        src={previewImage}
                                                        alt="服のイラスト・写真"
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className={`relative z-10 ${viewMode === "overlay" ? "w-full h-full" : ""}`}>
                                            <PatternPreviewSvg
                                                length={length}
                                                width={width}
                                                sleeve={sleeve}
                                                sleeveAngle={sleeveAngle}
                                                shoulderWidthRatio={shoulderWidthRatio}
                                                waistCurve={waistCurve}
                                                hemFlare={hemFlare}
                                                neckDepth={neckDepth}
                                                puffVolume={puffVolume}
                                                cuffWidthRatio={cuffWidthRatio}
                                                neckOffsetY={neckOffsetY}
                                                neckOffsetX={neckOffsetX}
                                                overlayZoom={overlayZoom}
                                                riseDepth={riseDepth}
                                                thighWidthRatio={thighWidthRatio}
                                                pantHemRatio={pantHemRatio}
                                                category={category}
                                                size={size}
                                                seamAllowance={seamAllowance}
                                                fabricType={fabricType}
                                                isOverlayMode={viewMode === "overlay"}
                                                hasSleeve={hasSleeve}
                                                collarType={collarType}
                                                collarScale={collarScale}
                                                svgRef={patternSvgRef}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center space-y-3 text-neutral-400">
                                        {previewImage ? (
                                            <div className="relative h-44 w-44 overflow-hidden rounded border border-neutral-200 shadow-sm">
                                                <Image
                                                    src={previewImage}
                                                    alt="アップロード画像"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-sm tracking-[0.3em] text-[#999999]">
                                                プレビュー
                                            </div>
                                        )}
                                        <p className="text-xs text-neutral-400">
                                            「生成」ボタンを押すと型紙が表示されます
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <aside className="self-start">
                        <button
                            type="button"
                            onClick={() => setIsFineTuneOpen(!isFineTuneOpen)}
                            className="relative w-full max-w-[280px] h-[40px] flex items-center text-left"
                        >
                            <div className="absolute bottom-[3px] left-[16px] right-0 h-[2px] bg-gradient-to-r from-[#966330] via-[#6d451e] to-transparent pointer-events-none z-0" />
                            <div className="absolute left-0 bottom-0 z-10 h-[32px] w-[32px] pointer-events-none">
                                <Image
                                    src="/images/tiisaibara.png"
                                    alt=""
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="relative z-20 w-full pl-11 pr-6 pb-1 flex items-center justify-between">
                                <span className="text-sm font-light tracking-[0.2em] text-white">微調整</span>
                                <span className="text-[9px] text-[#c59c52]">▼</span>
                            </div>
                        </button>

                        {isFineTuneOpen && (
                            <div className="space-y-6 pt-4 pb-6 pl-4 pr-3 mt-2 max-h-[520px] overflow-y-auto custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: '#555 transparent' }}>
                                {viewMode === "overlay" && (
                                    <div className="space-y-4 bg-[#141414] p-3 rounded border border-[#2a2a2a]">
                                        <span className="text-[11px] font-semibold tracking-wider text-[#e4bf70] block">
                                            🪄 イラスト重ね合わせ（完成シルエット調整）
                                        </span>
                                        <SliderField
                                            label="シルエット表示倍率"
                                            value={Math.round(overlayZoom * 100)}
                                            min={50}
                                            max={350}
                                            step={5}
                                            unit=" %"
                                            onChange={(val) => setOverlayZoom(val / 100)}
                                        />
                                        <div className="grid grid-cols-2 gap-2 pt-1">
                                            <SliderField
                                                label="上下位置"
                                                value={neckOffsetY}
                                                min={-80}
                                                max={80}
                                                step={1}
                                                unit=" px"
                                                onChange={setNeckOffsetY}
                                            />
                                            <SliderField
                                                label="左右位置"
                                                value={neckOffsetX}
                                                min={-50}
                                                max={50}
                                                step={1}
                                                unit=" px"
                                                onChange={setNeckOffsetX}
                                            />
                                        </div>
                                        {(category === "Tシャツ" || category.includes("ワンピース")) && hasSleeve && (
                                            <SliderField
                                                label="腕の開き角度 (外向き)"
                                                value={sleeveAngle}
                                                min={0}
                                                max={110}
                                                step={1}
                                                unit="°"
                                                onChange={setSleeveAngle}
                                            />
                                        )}
                                        <p className="text-[10px] text-neutral-400">
                                            ※イラストに重ねる時の見栄え調整です。印刷・保存される型紙の実寸寸法には一切影響しません。
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <span className="text-[11px] font-semibold tracking-wider text-[#e4bf70] border-b border-[#333] pb-1 block">
                                        ■ 基本サイズ（実寸寸法）
                                    </span>
                                    <SliderField
                                        label={category === "ボトムス" ? "総丈 (ウエスト〜裾)" : category === "スカート" ? "スカート丈" : "着丈"}
                                        value={length}
                                        min={sliderLimits.length.min}
                                        max={sliderLimits.length.max}
                                        unit=" cm"
                                        onChange={setLength}
                                    />
                                    <SliderField
                                        label={category === "ボトムス" || category === "スカート" ? "ウエスト幅" : "身幅"}
                                        value={width}
                                        min={sliderLimits.width.min}
                                        max={sliderLimits.width.max}
                                        unit=" cm"
                                        onChange={setWidth}
                                    />

                                    {(category === "Tシャツ" || category.includes("ワンピース")) && (
                                        <SliderField
                                            label="肩幅 (狭め 〜 ドロップショルダー)"
                                            value={Math.round(shoulderWidthRatio * 100)}
                                            min={80}
                                            max={130}
                                            step={2}
                                            unit=" %"
                                            onChange={(val) => setShoulderWidthRatio(val / 100)}
                                        />
                                    )}

                                    {(category === "Tシャツ" || category.includes("ワンピース")) && (
                                        <div className="pt-2 pb-2">
                                            <div className="flex flex-col space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs tracking-[0.1em] text-[#d8cfd8]">袖のタイプ</span>
                                                    <div className="flex space-x-1.5">
                                                        {["あり", "なし"].map(opt => (
                                                            <button
                                                                key={opt}
                                                                onClick={() => setHasSleeve(opt === "あり")}
                                                                className={`px-3 py-1 text-[11px] font-medium rounded transition-colors ${hasSleeve === (opt === "あり") ? "bg-[#d7ae5d] text-black" : "bg-[#222] text-[#888] hover:bg-[#333]"}`}
                                                            >
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs tracking-[0.1em] text-[#d8cfd8]">襟の形</span>
                                                    <div className="flex space-x-1.5">
                                                        {["襟なし", "角襟", "丸襟"].map(opt => (
                                                            <button
                                                                key={opt}
                                                                onClick={() => setCollarType(opt)}
                                                                className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${collarType === opt ? "bg-[#d7ae5d] text-black" : "bg-[#222] text-[#888] hover:bg-[#333]"}`}
                                                            >
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {(category === "Tシャツ" || category.includes("ワンピース")) && hasSleeve && (
                                        <SliderField
                                            label="袖丈"
                                            value={sleeve}
                                            min={sliderLimits.sleeve.min}
                                            max={sliderLimits.sleeve.max}
                                            unit=" cm"
                                            onChange={setSleeve}
                                        />
                                    )}
                                </div>

                                {category === "ボトムス" && (
                                    <div className="space-y-4 pt-2">
                                        <span className="text-[11px] font-semibold tracking-wider text-[#e4bf70] border-b border-[#333] pb-1 block">
                                            ■ パンツ・シルエット調整
                                        </span>
                                        <SliderField
                                            label="股上の深さ"
                                            value={riseDepth}
                                            min={0}
                                            max={8}
                                            step={1}
                                            unit=" 段階"
                                            onChange={setRiseDepth}
                                        />
                                        <SliderField
                                            label="太もも（渡り幅）のゆとり"
                                            value={Math.round(thighWidthRatio * 100)}
                                            min={80}
                                            max={180}
                                            step={5}
                                            unit=" %"
                                            onChange={(val) => setThighWidthRatio(val / 100)}
                                        />
                                        <SliderField
                                            label="裾幅 (スキニー 〜 ワイド)"
                                            value={Math.round(pantHemRatio * 100)}
                                            min={60}
                                            max={200}
                                            step={5}
                                            unit=" %"
                                            onChange={(val) => setPantHemRatio(val / 100)}
                                        />
                                    </div>
                                )}

                                {category !== "ボトムス" && (
                                    <div className="space-y-4 pt-2">
                                        <span className="text-[11px] font-semibold tracking-wider text-[#e4bf70] border-b border-[#333] pb-1 block">
                                            ■ シルエット・デザイン調整
                                        </span>
                                        {category !== "スカート" && (
                                            <SliderField
                                                label="ウエストのくびれ"
                                                value={waistCurve}
                                                min={0}
                                                max={10}
                                                step={1}
                                                unit=" 段階"
                                                onChange={setWaistCurve}
                                            />
                                        )}
                                        <SliderField
                                            label="裾の広がり（フレア）"
                                            value={hemFlare}
                                            min={0}
                                            max={10}
                                            step={1}
                                            unit=" 段階"
                                            onChange={setHemFlare}
                                        />
                                        {category !== "スカート" && hasSleeve && (
                                            <>
                                                <SliderField
                                                    label="パフスリーブ（袖山の膨らみ）"
                                                    value={puffVolume}
                                                    min={0}
                                                    max={10}
                                                    step={1}
                                                    unit=" 段階"
                                                    onChange={setPuffVolume}
                                                />
                                                <SliderField
                                                    label="袖口の広がり（ベルスリーブ）"
                                                    value={Math.round(cuffWidthRatio * 100)}
                                                    min={60}
                                                    max={220}
                                                    step={5}
                                                    unit=" %"
                                                    onChange={(val) => setCuffWidthRatio(val / 100)}
                                                />
                                            </>
                                        )}
                                        {category !== "スカート" && (
                                            <SliderField
                                                label="襟ぐりの深さ"
                                                value={neckDepth}
                                                min={1}
                                                max={5}
                                                step={1}
                                                unit=" 段階"
                                                onChange={setNeckDepth}
                                            />
                                        )}
                                        {category !== "スカート" && collarType !== "襟なし" && (
                                            <SliderField
                                                label="襟の大きさ"
                                                value={Math.round(collarScale * 100)}
                                                min={50}
                                                max={200}
                                                step={5}
                                                unit=" %"
                                                onChange={(val) => setCollarScale(val / 100)}
                                            />
                                        )}
                                    </div>
                                )}

                                <p className="text-[11px] leading-5 text-neutral-400">
                                    ※ スライダーで型紙寸法の微調整を行えます。
                                </p>
                            </div>
                        )}
                    </aside>
                </section>

                {/* ダウンロード & クラウド保存・読込セクション */}
                <section className="mx-auto max-w-6xl px-6 pb-12 sm:px-10 flex flex-wrap items-center justify-between gap-6 border-b border-[#222] pb-10 mb-10">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center space-x-1.5 bg-[#141414] p-1 rounded border border-[#333]">
                            {(["JPEG", "PNG", "SVG", "PRINT"] as const).map((fmt) => (
                                <button
                                    key={fmt}
                                    type="button"
                                    disabled={isExporting}
                                    onClick={() => setExportFormat(fmt)}
                                    className={`px-3 py-1.5 text-xs tracking-wider rounded transition disabled:opacity-50 disabled:cursor-not-allowed ${
                                        exportFormat === fmt 
                                        ? "bg-[#d7ae5d] text-black font-semibold shadow" 
                                        : "text-neutral-400 hover:text-white"
                                    }`}
                                >
                                    {fmt === "PRINT" ? "印刷 (PDF)" : fmt}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            disabled={isExporting}
                            onClick={handleDownload}
                            className={`group relative p-[1px] transition-transform ${
                                isExporting ? "opacity-60 cursor-not-allowed" : "active:scale-[0.98]"
                            }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa771c] transition-opacity group-hover:opacity-100 opacity-80" />
                            <div className="relative flex h-[38px] min-w-[190px] items-center justify-center bg-[#000000] px-5 transition group-hover:bg-[#000000]/80">
                                <span className="text-xs font-light tracking-[0.2em] text-[#f5ebd7] group-hover:text-white flex items-center space-x-2">
                                    {isExporting && (
                                        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-solid border-[#f5ebd7] border-r-transparent mr-2" />
                                    )}
                                    <span>
                                        {isExporting
                                            ? "書き出し中..."
                                            : exportFormat === "PRINT"
                                            ? "印刷 / PDF保存"
                                            : `${exportFormat} を保存`}
                                    </span>
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* クラウド操作ボタン */}
                    <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                        <button
                            type="button"
                            disabled={isSaving}
                            onClick={handleSaveToCloud}
                            className="px-4 py-2.5 rounded border border-[#d7ae5d]/70 bg-[#1a1714] hover:bg-[#252019] text-xs tracking-wider text-[#f5ebd7] transition flex items-center space-x-2 disabled:opacity-50 shadow-sm active:scale-95"
                        >
                            <span>{isSaving ? "保存中..." : "☁️ 型紙をクラウド保存"}</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleOpenLoadModal}
                            className="px-4 py-2.5 rounded border border-neutral-700 bg-[#161616] hover:bg-[#252525] text-xs tracking-wider text-neutral-300 hover:text-white transition flex items-center space-x-2 active:scale-95"
                        >
                            <span>📂 履歴から読込</span>
                        </button>
                    </div>
                </section>

                <SewingGuideSection category={category} collarType={collarType} />

                <NoticeSection />
            </div>

            {/* クラウド履歴読込モーダル */}
            {isLoadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#121212] border border-[#333] rounded-xl p-6 max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="flex justify-between items-center border-b border-[#262626] pb-3 mb-4">
                            <div className="flex items-center space-x-2.5">
                                <span className="text-base">📂</span>
                                <h3 className="text-sm font-semibold tracking-wider text-[#f5ebd7]">
                                    保存済み型紙一覧 ({size} / {category})
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsLoadModalOpen(false)}
                                className="text-neutral-400 hover:text-white text-base px-2 py-1"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="overflow-y-auto space-y-3 flex-1 pr-1 custom-scrollbar">
                            {isLoadingHistory ? (
                                <div className="flex flex-col items-center justify-center py-12 text-neutral-400 text-xs space-y-2">
                                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-[#d7ae5d] border-r-transparent" />
                                    <span>履歴を読み込み中...</span>
                                </div>
                            ) : savedPatterns.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-xs text-neutral-400">現在選択中の【{size} / {category}】で保存された型紙はありません。</p>
                                    <p className="text-[11px] text-neutral-500 mt-1">「☁️ 型紙をクラウド保存」から現在の数値を保存できます。</p>
                                </div>
                            ) : (
                                savedPatterns.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-3.5 bg-[#181818] border border-[#2b2b2b] rounded-lg flex justify-between items-center hover:border-[#d7ae5d]/60 transition"
                                    >
                                        <div className="space-y-1 mr-3 min-w-0 flex-1">
                                            {/* タイトル表示・インライン編集フォーム */}
                                            {editingId === item.id ? (
                                                <div className="flex items-center space-x-2 py-0.5">
                                                    <input
                                                        type="text"
                                                        value={editingTitleText}
                                                        onChange={(e) => setEditingTitleText(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") handleSaveRename(item.id);
                                                            if (e.key === "Escape") setEditingId(null);
                                                        }}
                                                        disabled={isRenaming}
                                                        autoFocus
                                                        className="bg-[#111] border border-[#d7ae5d]/80 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#d7ae5d] w-full"
                                                    />
                                                    <button
                                                        type="button"
                                                        disabled={isRenaming}
                                                        onClick={() => handleSaveRename(item.id)}
                                                        className="px-2 py-1 rounded bg-[#d7ae5d] text-black text-xs font-semibold hover:bg-[#e4bf70] transition shrink-0"
                                                    >
                                                        {isRenaming ? "..." : "保存"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={isRenaming}
                                                        onClick={() => setEditingId(null)}
                                                        className="px-2 py-1 text-xs text-neutral-400 hover:text-white transition shrink-0"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-2 group">
                                                    <span className="text-xs font-medium text-white tracking-wide truncate max-w-[200px] sm:max-w-[240px]">
                                                        {item.title}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStartRename(item.id, item.title)}
                                                        title="タイトルを変更"
                                                        className="opacity-60 hover:opacity-100 text-neutral-400 hover:text-[#d7ae5d] transition p-0.5"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                            <div className="text-[10px] text-neutral-400 flex items-center space-x-2 flex-wrap">
                                                <span>{new Date(item.createdAt).toLocaleDateString("ja-JP")}</span>
                                                <span>•</span>
                                                <span>縫い代: {item.seamAllowance}</span>
                                                <span>•</span>
                                                <span>{item.fabricType}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 shrink-0">
                                            {/* 共有リンクコピーボタン */}
                                            <button
                                                type="button"
                                                onClick={() => handleCopyShareLink(item.id)}
                                                title="共有リンクをコピー"
                                                className="px-2.5 py-1.5 rounded border border-neutral-700 bg-[#222] hover:bg-[#333] text-neutral-300 hover:text-white text-xs transition active:scale-95 flex items-center space-x-1"
                                            >
                                                <span>{copiedId === item.id ? "✓ コピー済" : "🔗 共有"}</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleApplyPattern(item)}
                                                className="px-3.5 py-1.5 rounded bg-[#d7ae5d] text-black text-xs font-semibold hover:bg-[#e4bf70] transition active:scale-95 shadow"
                                            >
                                                適用
                                            </button>
                                            <button
                                                type="button"
                                                disabled={deletingId === item.id}
                                                onClick={() => handleDeletePattern(item.id, item.title)}
                                                title="この型紙を削除"
                                                className="p-1.5 rounded border border-[#3a2020] bg-[#221414] text-[#e57373] hover:bg-[#341818] hover:border-[#e57373]/60 transition active:scale-90 disabled:opacity-40"
                                            >
                                                {deletingId === item.id ? (
                                                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border border-solid border-[#e57373] border-r-transparent" />
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="pt-4 border-t border-[#262626] mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsLoadModalOpen(false)}
                                className="px-4 py-1.5 text-xs text-neutral-400 hover:text-white"
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}

// useSearchParams のビルドエラーを防ぐため Suspense でラップしてエクスポート
export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#000000]" />}>
            <PatternStudioContent />
        </Suspense>
    );
}