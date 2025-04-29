import { zodResponseFormat } from "openai/helpers/zod";
import { ProductSchema, type Product } from '../schemas/product';
import OpenAI from 'openai';

export class ExtractorService {
    private openai: OpenAI;

    constructor(openai: OpenAI) {
        this.openai = openai;
    }

    async extractProduct(url: string): Promise<Product> {
        const promptTemplate = await this.generatePromptTemplate(url)

        const completion = await this.openai.beta.chat.completions.parse({
            messages: [{ role: "user", content: promptTemplate }],
            model: "gpt-4o-2024-08-06",
            response_format: zodResponseFormat(ProductSchema, "product"),
        });

        const product = completion.choices[0].message.parsed

        if (!product) {
            throw new Error("Failed to extract product")
        }

        return product
    }

    private async generatePromptTemplate(url: string): Promise<string> {
        const html = await this.fetchHtml(url)

        const promptTemplate = `\
      <instructions>
      You are an expert product data extractor. Your role is to accurately extract structured product information from a raw HTML page.
      Your output will help users view product details without reading the entire webpage.
      Prioritize accuracy, structure, and clarity.
      </instructions>
      
      <requirements>
        <requirement>The output must be in pure JSON format.</requirement>
        <requirement>The extracted product data must strictly match the schema provided below.</requirement>
        <requirement>All attribute keys must use camelCase formatting (e.g., "colorOptions").</requirement>
        <requirement>If a field is missing or not found, omit it entirely — do not invent data.</requirement>
        <requirement>Price must be extracted as a numeric value (without currency symbols).</requirement>
        <requirement>The product URL must match the provided URL.</requirement>
      </requirements>
      
      <input>
      HTML Content:
      ${html}
      
      Original URL:
      ${url}
      </input>
      `

        return promptTemplate
    }

    private async fetchHtml(url: string): Promise<string> {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Failed to fetch product page: ${response.status} ${response.statusText}`)
        }

        return await response.text()
    }
}
