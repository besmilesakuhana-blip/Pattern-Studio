import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET: 保存済み型紙の一覧取得 (ownerTokenで端末ごとに分離) または 単一型紙の取得 (共有URL用)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const ownerToken = searchParams.get("ownerToken");

        // 1. 単一型紙の取得 (共有URL・パーマリンク用：誰でも閲覧可能)
        if (id) {
            const pattern = await prisma.pattern.findUnique({
                where: { id },
            });
            if (!pattern) {
                return NextResponse.json({ error: "指定された型紙が見つかりません" }, { status: 404 });
            }
            return NextResponse.json(pattern, { status: 200 });
        }

        // 2. 一覧取得：端末トークンが無い場合は他人の履歴を見せないため空配列を返す
        if (!ownerToken) {
            return NextResponse.json([], { status: 200 });
        }

        const category = searchParams.get("category");
        const size = searchParams.get("size");

        // 自分の端末トークン (ownerToken) に一致するものだけを抽出
        const where: Record<string, string> = { ownerToken };
        if (category) where.category = category;
        if (size) where.size = size;

        const patterns = await prisma.pattern.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: 20,
        });

        return NextResponse.json(patterns, { status: 200 });
    } catch (error) {
        console.error("Fetch Error:", error);
        return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
    }
}

// POST: パラメータ保存 (端末トークン ownerToken を紐付けて保存)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, category, size, bust, fabricType, seamAllowance, parameters, ownerToken } = body;

        if (!category || !size || !parameters || !ownerToken) {
            return NextResponse.json({ error: "必須項目または端末トークンが不足しています" }, { status: 400 });
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
                ownerToken, // 端末トークンを保存
            },
        });

        return NextResponse.json(newPattern, { status: 201 });
    } catch (error) {
        console.error("Save Error:", error);
        return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
    }
}

// PATCH: 型紙タイトルの更新（本人の端末トークンか検証）
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, title, ownerToken } = body;

        if (!id || !title?.trim() || !ownerToken) {
            return NextResponse.json({ error: "ID、タイトル、および端末トークンが必要です" }, { status: 400 });
        }

        // 保存元の端末トークンと一致するか確認
        const existing = await prisma.pattern.findUnique({ where: { id } });
        if (!existing || existing.ownerToken !== ownerToken) {
            return NextResponse.json({ error: "編集権限がありません" }, { status: 403 });
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

// DELETE: 型紙の削除（本人の端末トークンか検証）
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const ownerToken = searchParams.get("ownerToken");

        if (!id || !ownerToken) {
            return NextResponse.json({ error: "削除IDおよび端末トークンが不足しています" }, { status: 400 });
        }

        // 保存元の端末トークンと一致するか確認
        const existing = await prisma.pattern.findUnique({ where: { id } });
        if (!existing || existing.ownerToken !== ownerToken) {
            return NextResponse.json({ error: "削除権限がありません" }, { status: 403 });
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