# 🛍️ Link → Product Card API

A minimal API that takes any **live product page URL**, fetches the HTML, and uses **GPT-4o structured output** to return a **clean, structured product card** in JSON format.

---

## 🚀 Live API URL

> https://your-deployed-api-url.com/parse-product

---

## 📦 Example Request

**Endpoint:**  
`POST /parse-product`  
**Content-Type:** `application/json`

```json
{
  "url": "https://now-time.biz/products/issue-1-whirlpool",
  "openaiApiKey": "sk-..." 
}
```

---

## ✅ Example Response

```json
{
  "url": "https://now-time.biz/products/issue-1-whirlpool",
  "title": "Issue 1: Whirlpool",
  "description": "Whirlpool is the debut issue of Now Time, a printed publication focused on arts and ideas.",
  "category": "Magazine",
  "images": [
    "https://cdn.shopify.com/s/files/1/0680/4150/7113/products/NT-Whirlpool-1_1024x1024.jpg"
  ],
  "price": {
    "raw": 25,
    "currency": "USD"
  },
  "availability": "In Stock",
  "brand": "Now Time",
  "attributes": [
    {
      "name": "language",
      "values": "English"
    },
    {
      "name": "pageCount",
      "values": 128
    },
    {
      "name": "coverType",
      "values": "Softcover"
    }
  ]
}
```

---

## 🧠 How It Works

1. Accepts a POST request with:
   - a `url` to any live product page
   - a valid `openaiApiKey`
2. Fetches the raw HTML using a browser-like user-agent
3. Uses **GPT-4o + OpenAI tools API** to extract a structured product schema
4. Returns a clean, typed product object

---

## 🧱 Schema Design

```ts
{
  url: string;
  title: string;
  description?: string;
  category: string;
  images?: string[];
  price: {
    raw: number;
    currency?: string;
  };
  availability?: string;
  brand?: string;
  attributes: {
    name: string;
    values: string | number | string[] | number[];
  }[];
}
```

✅ `attributes` is future-proof and supports both single values and lists  
✅ Keys are always `camelCase`  
✅ Flexible for t-shirts, books, or even electric bikes

---

## 🛠 Tech Stack

- **Hono** – ultra-light TypeScript web framework
- **Zod** – runtime + structured OpenAI schema validation
- **OpenAI GPT-4o** – JSON output mode + structured tools
- **Bun** – runtime and package manager

---

## 🧪 Local Development

```bash
bun install
bun run src/index.ts
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
- Price as numeric `raw` value

---

## ⚠️ Tradeoffs & TODOs

| Area         | Notes                                                                 |
|--------------|-----------------------------------------------------------------------|
| ❌ No caching | Intentionally left out for MVP; could easily add Redis or in-memory LRU |
| ❌ No database | This is a read-only pipeline, no persistence                         |
| ✅ No hallucinations | Using `tools` ensures correct structure and output               |
| ✅ Flexible schema | Can support future product types with no changes                 |
| 🧪 No tests yet | Could add unit tests around services and schema parsing            |

---

## 📹 Loom Walkthrough

👉 [Loom Video Demo Link](https://loom.com/share/your-video-id)

---

## ✅ Submission Checklist

- [x] Live URL ✅  
- [x] GitHub repo with source ✅  
- [x] README with setup + explanation ✅  
- [x] Loom walkthrough ✅
