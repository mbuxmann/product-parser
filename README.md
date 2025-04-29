# 🛍️ Link → Product Card API

A minimal API that takes any **live product page URL**, fetches the HTML, and uses **GPT-4** to return a **clean, structured product card** in JSON format.


## 🚀 Live API URL

> https://parser.buxmann.dev/parse-product


## 📦 Example Request

**Endpoint:** `POST /parse-product`  
**Content-Type:** `application/json`

```json
{
  "url": "https://now-time.biz/products/issue-1-whirlpool?variant=42480670539836",
  "openaiApiKey": "sk-..."
}
```

## ✅ Example Response

```json
{
    "product": {
        "url": "https://now-time.biz/products/issue-1-whirlpool?variant=42480670539836",
        "title": "Issue 1 Whirlpool",
        "description": "6.1oz Garment Dyed White Short Sleeve. 100% Ring Spun Cotton. Please allow 10 working days to process before shipping.",
        "category": "T-Shirt",
        "images": [
            "https://now-time.biz/cdn/shop/files/White.gif?v=1737750961",
            "https://now-time.biz/cdn/shop/files/White_Front.jpg?v=1737750961",
            "https://now-time.biz/cdn/shop/files/White_Back.jpg?v=1737750961"
        ],
        "price": {
            "value": 40,
            "currency": "USD"
        },
        "availability": "Out of Stock",
        "brand": "Now-Time",
        "attributes": [
            {
                "name": "sizeOptions",
                "values": [
                    "S",
                    "M",
                    "L",
                    "XL",
                    "XXL"
                ]
            },
            {
                "name": "material",
                "values": "100% Ring Spun Cotton"
            },
            {
                "name": "colorOptions",
                "values": [
                    "White"
                ]
            },
            {
                "name": "weightOz",
                "values": 6.1
            }
        ]
    }
}
```

## 🧪 Local Development

```bash
bun install
bun run dev
```

You can test it locally using `curl` or Postman:

```bash
curl -X POST http://localhost:3000/parse-product \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://now-time.biz/products/issue-1-whirlpool?variant=42480670539836",
    "openaiApiKey": "sk-..."
  }'
```

## 🧱 Extraction Design

### Prompt Description

```
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
```

### Parsing strategy
- Uses OpenAI's beta.chat.completions.parse with GPT-4
- Leverages Zod schema validation through zodResponseFormat
- Ensures type safety and schema compliance at runtime
- Handles HTML fetching with browser-like headers for better compatibility

### Schema Design
```ts
z.object({
    url: z.string().describe("The original URL of the product page. Must be a valid URL."),
    title: z.string().describe("The name of the product, without extra branding or marketing language."),
    description: z.string().describe("A short description of the product, if available. Keep it factual and concise.").nullable(),
    category: z.string().describe("The product category, like T-Shirt, Electronics, Book, etc."),
    images: z.array(z.string().describe("A direct link to a product image URL.")).describe("An array of product image URLs, if available.").nullable(),
    price: z.object({
        value: z.number().describe("The numeric price value of the product, without currency symbols."),
        currency: z.string().describe("The currency of the price, like USD, EUR, etc.").nullable()
    }).describe("The price information for the product."),
    availability: z.string().describe("The availability status of the product, e.g., 'In Stock', 'Out of Stock'.").nullable(),
    brand: z.string().describe("The brand or manufacturer name, if available.").nullable(),
    attributes: z.array(
        z.object({
            name: z.string().describe("The attribute name in camelCase format, e.g., colorOptions, sizeOptions, material, engineSize, etc."),
            values: z.union([
                z.string().describe("A single string value."),
                z.number().describe("A single numeric value."),
                z.array(z.string()).describe("An array of string values."),
                z.array(z.number()).describe("An array of numeric values.")
            ]).describe("The value(s) of the attribute.")
        })
    ).describe("A list of attributes where each attribute has a name and corresponding value(s).").nullable(),
})
```

## ⚖️ Tradeoffs & TODOs

This MVP was intentionally scoped to stay lean and focused. Below are tradeoffs I made — and what I'd prioritize next for production use.

### Intentional Choices for Speed & Simplicity
- 🧱 **Used Hono**: Chose Hono for its fast startup, zero-dependency routing, and modern DX — great for a focused MVP
- ✅ **Zod + OpenAI**: Ensures strongly typed, structured output with high reliability
- ❌ **Skipped caching**: Keeps logic simple; avoids premature optimization; could add Redis later
- ❌ **No database**: Avoided persistence entirely — all data is live + stateless
- ❌ **No retries or fallbacks**: One failed call = one failed request; acceptable tradeoff for now
- ❌ **No rate limiting**: Didn't implement request throttling to keep the MVP simple; would add for production

### Improvements I'd Make Next
- **Add caching (Redis)** – Reduce redundant fetches and OpenAI costs
- **Add OpenAI retry logic** – Handle transient failures gracefully
- **Optimize HTML scraping** – Extract only required elements to reduce token usage
- **Replace HTML fetcher with Playwright** – Handle JavaScript-rendered content and complex sites more reliably
- **Improve error handling** – Use `Zod.safeParse()` with error logging and fallback values
- **Log request metadata** – Track input URLs, parse times, failures
- **Add rate limiting** – Implement token bucket algorithm to prevent API abuse
- **Optional DB layer** – Enable deduplication, search, and bulk parsing use cases
- **Add comprehensive testing** – Unit and integration tests to verify extraction accuracy:
  - Test against various product page structures
  - Validate schema conformance for all extracted fields
  - Mock HTML responses to test edge cases
  - Compare extraction results against known good values
  - Test handling of malformed HTML and missing data

This setup strikes a balance between clarity, speed, and real-world usefulness — and serves as a great foundation for future improvements.

Some side notes:
1. Since the API isn't currently used for comparing products, a database isn't strictly necessary. But if filtering and querying are needed in the future, adding a DB would make sense.

2. When building products, I generally prefer using third-party services or open-source tools over building homegrown solutions from scratch—though it depends on the context. I believe it's more valuable to get a product to market quickly and validate it, rather than spending time overengineering something that may never be used. In this particular case, I likely would have explored using an open-source tool like Firecrawl, which already handles many of the extraction and rendering challenges I’d otherwise need to build myself.

## 📹 Loom Walkthrough

👉 [Loom Video Demo Link](https://loom.com/share/your-video-id)

## 🧠 How It Works

1. Accepts a POST request with:
   - a `url` to any live product page
   - a valid `openaiApiKey`
2. Fetches the raw HTML using native fetch API
3. Uses **GPT-4** to extract a structured product schema
4. Returns a clean, typed product object

✅ `attributes` is future-proof and supports both single values and lists  
✅ Keys are always `camelCase`  
✅ Flexible for t-shirts, books, or even electric bikes

## 🛠 Tech Stack

- **Hono** – ultra-light TypeScript web framework
- **Zod** – runtime + structured OpenAI schema validation
- **OpenAI GPT-4** – JSON output mode + structured tools
- **Node.js** – runtime
- **Bun** – package manager

## 📁 Project Structure

```
src/
├── index.ts                  # App entry (Hono + routes)
├── routes/
│   └── parse-product.ts      # POST /parse-product
├── services/
│   ├── extractor.ts         # Product extraction + HTML fetching
│   └── index.ts             # services object export
├── schemas/
│   └── product.ts           # Zod product schema
├── utils/
│   └── logger.ts            # Logging utilities
```

## ✅ Submission Checklist

- [x] Live URL ✅  
- [x] GitHub repo with source ✅  
- [x] README with setup + explanation ✅  
- [x] Loom walkthrough ✅
