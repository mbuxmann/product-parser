import { z } from 'zod'

export const ProductSchema = z.object({
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


export type Product = z.infer<typeof ProductSchema>