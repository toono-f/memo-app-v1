"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getArticles() {
  return await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
  });
}

export async function createArticle(title: string, content: string) {
  return await prisma.article.create({
    data: { title, content },
  });
}

export async function updateArticle(
  id: number,
  title: string,
  content: string
) {
  return await prisma.article.update({
    where: { id },
    data: { title, content },
  });
}

export async function deleteArticle(id: number) {
  return await prisma.article.delete({
    where: { id },
  });
}
