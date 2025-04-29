import { zodResponseFormat } from "openai/helpers/zod";
import { ProductSchema, type Product } from '../schemas/product';
import OpenAI from 'openai';
import { logger } from "../utils/logger";

export class ExtractorService {
    private openai: OpenAI;

    constructor(openai: OpenAI) {
        this.openai = openai;
    }

    async extractProduct(url: string): Promise<Product> {
        const promptTemplate = await this.generatePromptTemplate(url)

        const completion = await this.openai.beta.chat.completions.parse({
            messages: [{ role: "user", content: promptTemplate }],
            model: "gpt-4.1-2025-04-14",
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
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Upgrade-Insecure-Requests': '1',
        };

        try {
            const response = await fetch(url, {
                headers,
                redirect: 'follow',
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch product page: ${response.status} ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('text/html')) {
                throw new Error('Response is not HTML content');
            }

            const html = await response.text();
            logger.info('Successfully fetched HTML', { url, html });

            return html;
        } catch (error) {
            logger.error('Error fetching HTML', { url, error });
            throw new Error(`Failed to fetch product page: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
