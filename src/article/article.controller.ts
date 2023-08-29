/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
} from "@nestjs/common";

import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/article.dto";
import { Article } from "./schema/article.schema";
import * as createCsvWriter from "csv-writer";
import { Response } from "express";

@Controller("article")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  // ----------------------
  @Post("generate")
  async createArticle(
    @Body() createArticleDto: CreateArticleDto
  ): Promise<string> {
    const { quantity, serialNumber } = createArticleDto;
    return this.articleService.createArticle(quantity, serialNumber);
  }
  // ----------------------
  @Get("all")
  async getAllArticle(): Promise<Article[]> {
    return this.articleService.getAllArticles();
  }
  // ----------------------
  @Get(":uniqueString")
  async getArticleByUniqueString(
    @Param("uniqueString") uniqueString: string
  ): Promise<Article> {
    return this.articleService.getArticleByUniqueString(uniqueString);
  }
  // ----------------------
  @Get("/download/:serialNumber")
  async getArticlesBySerialNumberAndGenerateCSV(
    @Param("serialNumber") serialNumber: string,
    @Res() res: Response
  ) {
    const articles = await this.articleService.getArticlesBySerialNumber(
      serialNumber
    );

    if (articles.length === 0) {
      throw new NotFoundException(
        "No articles found for the given serial number."
      );
    }

    const csvWriter = createCsvWriter.createObjectCsvWriter({
      path: "articles.csv",
      header: [{ id: "article", title: "Article" }],
    });

    await csvWriter.writeRecords(articles);

    res.set("Content-Type", "text/csv");
    res.set("Content-Disposition", 'attachment; filename="articles.csv"');
    res.download("articles.csv");
  }
  // ----------------------
}
