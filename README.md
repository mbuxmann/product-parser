# 🛍️ Link → Product Card API

A minimal API that takes any **live product page URL**, fetches the HTML, and uses **GPT-4o structured output** to return a **clean, structured product card** in JSON format.

---

## 🚀 Live API URL

> https://parser.buxmann.dev/parse-product

---

## 📦 Example Request

**Endpoint:**  
`POST /parse-product`  
**Content-Type:** `application/json`

```json
{
  "url": "https://now-time.biz/products/issue-1-whirlpool?variant=42480670539836",
  "openaiApiKey": "sk-..."
}
```

---

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

---

## 🧠 How It Works

1. Accepts a POST request with:
   - a `url` to any live product page
   - a valid `openaiApiKey`
2. Fetches the raw HTML using a browser-like user-agent
3. Uses **GPT-4.1** to extract a structured product schema
4. Returns a clean, typed product object

---

## 🧱 Schema Design

```ts
{
  url: string;
  title: string;
  description: string | null;
  category: string;
  images: string[] | null;
  price: {
    value: number;
    currency: string | null;
  };
  availability: string | null;
  brand: string | null;
  attributes: Array<{
    name: string;
    values: string | number | string[] | number[];
  }> | null;
}
```

✅ `attributes` is future-proof and supports both single values and lists  
✅ Keys are always `camelCase`  
✅ Flexible for t-shirts, books, or even electric bikes

---

## 🛠 Tech Stack

- **Hono** – ultra-light TypeScript web framework
- **Zod** – runtime + structured OpenAI schema validation
- **OpenAI GPT-4.1** – JSON output mode + structured tools
- **Bun** – runtime and package manager

---

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
    "url": "https://now-time.biz/products/issue-1-whirlpool",
    "openaiApiKey": "sk-..."
  }'
```

---

## 📁 Project Structure

```
src/
├── index.ts                  # App entry (Hono + routes)
├── routes/
│   └── parse-product.ts      # POST /parse-product
├── services/
│   ├── fetchHtml.ts          # HTML fetching
│   ├── productExtractor.ts   # Core OpenAI logic
│   ├── openai.ts             # Client builder
│   └── index.ts              # services object export
├── schemas/
│   └── product.ts            # Zod product schema
```

---

## ✍️ Prompt Design (for OpenAI)

We use OpenAI’s `tools` (function calling) with a typed Zod schema.  
The prompt enforces:
- Pure JSON output
- No invented data
- camelCase attribute keys
- Price as numeric `value` value

---

## ⚖️ Tradeoffs & TODOs

This MVP was intentionally scoped to stay lean and focused. Below are tradeoffs I made — and what I'd prioritize next for production use.

### ✅ Intentional Choices for Speed & Simplicity
- 🧱 **Used Hono**: Chose Hono for its fast startup, zero-dependency routing, and modern DX — great for a focused MVP
- ✅ **Zod + OpenAI**: Ensures strongly typed, structured output with high reliability
- ❌ **Skipped caching**: Keeps logic simple; avoids premature optimization; could add Redis later
- ❌ **No database**: Avoided persistence entirely — all data is live + stateless
- ❌ **No retries or fallbacks**: One failed call = one failed request; acceptable tradeoff for now
- ❌ **No rate limiting**: Didn't implement request throttling to keep the MVP simple; would add for production

### 🔧 Improvements I'd Make Next
- **🛡 Add caching (Redis)** – Reduce redundant fetches and OpenAI costs
- **📉 Add OpenAI retry logic** – Handle transient failures gracefully
- **🌐 Replace HTML fetcher with Playwright** – Handle JavaScript-rendered content and complex sites more reliably
- **🧪 Improve error handling** – Use `Zod.safeParse()` with error logging and fallback values
- **📊 Log request metadata** – Track input URLs, parse times, failures
- **🔒 Add rate limiting** – Implement token bucket algorithm to prevent API abuse and manage throughput
- **📦 Optional DB layer** – Enable deduplication, search, and bulk parsing use cases
- **🧪 Add comprehensive testing** – Unit and integration tests to verify extraction accuracy:
  - Test against various product page structures
  - Validate schema conformance for all extracted fields
  - Mock HTML responses to test edge cases
  - Compare extraction results against known good values
  - Test handling of malformed HTML and missing data


This setup strikes a balance between clarity, speed, and real-world usefulness — and serves as a great foundation for future improvements.

---

## 📹 Loom Walkthrough

👉 [Loom Video Demo Link](https://loom.com/share/your-video-id)

---

## ✅ Submission Checklist

- [x] Live URL ✅  
- [x] GitHub repo with source ✅  
- [x] README with setup + explanation ✅  
- [x] Loom walkthrough ✅
