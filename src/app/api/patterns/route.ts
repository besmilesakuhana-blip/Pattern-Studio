import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET: 保存済み型紙の一覧取得 (最新10件) または 単一型紙の取得 (ID指定・共有URL用)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        // 単一型紙の取得 (共有URL・パーマリンク用)
        if (id) {
            const pattern = await prisma.pattern.findUnique({
                where: { id },
            });
            if (!pattern) {
                return NextResponse.json({ error: "指定された型紙が見つかりません" }, { status: 404 });
            }
            return NextResponse.json(pattern, { status: 200 });
        }

        // 一覧取得
        const category = searchParams.get("category");
        const size = searchParams.get("size");

        const where: Record<string, string> = {};
        if (category) where.category = category;
        if (size) where.size = size;

        const patterns = await prisma.pattern.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: 10,
        });

        return NextResponse.json(patterns, { status: 200 });
    } catch (error) {
        console.error("Fetch Error:", error);
        return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
    }
}

// POST: パラメータ保存
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, category, size, bust, fabricType, seamAllowance, parameters } = body;

        if (!category || !size || !parameters) {
            return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
        }

        const newPattern = await prisma.pattern.create({
            data: {
                title: title || `${size}の${category}`,
                category,
                size,
                bust: bust || null,
                fabricType: fabricType || "ニット・伸縮生地",
                seamAllowance: seamAllowance || "5mm",
                parameters,
            },
        });

        return NextResponse.json(newPattern, { status: 201 });
    } catch (error) {
        console.error("Save Error:", error);
        return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
    }
}

// PATCH: 型紙タイトルの更新（リネーム）
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, title } = body;

        if (!id || !title?.trim()) {
            return NextResponse.json({ error: "IDおよびタイトル名は必須です" }, { status: 400 });
        }

        const updatedPattern = await prisma.pattern.update({
            where: { id },
            data: { title: title.trim() },
        });

        return NextResponse.json(updatedPattern, { status: 200 });
    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: "タイトルの更新に失敗しました" }, { status: 500 });
    }
}

// DELETE: 型紙の削除
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "削除するIDが指定されていません" }, { status: 400 });
        }

        await prisma.pattern.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: "削除が完了しました" }, { status: 200 });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: "削除処理に失敗しました" }, { status: 500 });
    }
}