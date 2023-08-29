import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Article extends Document {
  @Prop()
  article: string;

  @Prop()
  serialNumber: string;

  @Prop()
  uniqueString: string;

  @Prop({ default: 0 })
  requestCount: number;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
