/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Article } from "./schema/article.schema";
import { Model } from "mongoose";
import * as shortid from "shortid";

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private articleModel: Model<Article>
  ) {}
  // ----------------------

  async createArticle(quantity: number, serialNumber: string): Promise<string> {
    try {
      const articles = [];

      for (let i = 0; i < quantity; i++) {
        let uniqueString = shortid
          .generate()
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, "");

        if (uniqueString.length > 10) {
          uniqueString = uniqueString.substring(0, 10);
        } else if (uniqueString.length < 10) {
          const diff = 10 - uniqueString.length;
          uniqueString = uniqueString + "0".repeat(diff);
        }

        const article = new this.articleModel({
          article: serialNumber + uniqueString,
          serialNumber,
          uniqueString,
        });
        articles.push(article);
      }
      const generatedArticles = await this.articleModel.insertMany(articles);

      if (generatedArticles.length === quantity) {
        return `Successfully created ${quantity} articles.`;
      }
    } catch (err) {
      throw new Error(`Error during the generation of articles: ${err}`);
    }
  }

  // ----------------------

  async getAllArticles(): Promise<Article[]> {
    try {
      const articles = await this.articleModel.find().exec();

      articles.forEach((article) => {
        article.requestCount = article.requestCount || 0;
      });

      return articles;
    } catch (err) {
      throw new Error(`Error retrieving articles: ${err}`);
    }
  }

  // ----------------------

  async getArticleByUniqueString(article: string): Promise<Article> {
    try {
      const updatedArticle = await this.articleModel.findOneAndUpdate(
        { article },
        { $inc: { requestCount: 1 } },
        { new: true }
      );

      if (updatedArticle) {
        return updatedArticle;
      }

      return null;
    } catch (err) {
      throw new Error(`Error retrieving article: ${err}`);
    }
  }

  // ----------------------

  async getArticlesBySerialNumber(serialNumber: string): Promise<Article[]> {
    try {
      const articles = await this.articleModel.find({ serialNumber }).exec();
      return articles;
    } catch (err) {
      throw new Error(`Error retrieving article by serial num: ${err}`);
    }
  }

  // ----------------------
}
