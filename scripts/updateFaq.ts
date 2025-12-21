import { Env } from "@(-.-)/env";
import { writeFileSync } from "fs";
import { GristDocAPI } from "grist-api";
import { z } from "zod";

const env = Env(
  z.object({
    GRIST_API_KEY: z.string(),
  })
);

const grist = new GristDocAPI(
  "https://mjth.getgrist.com/o939NKtzq7Da/MJTH-Website-Data",
  { apiKey: env.GRIST_API_KEY }
);

const categories = (await grist.fetchTable("FAQ_Categories")) as {
  id: number;
  Name: string;
  Slug: string;
  manualSort: number;
}[];
const faqs = (await grist.fetchTable("FAQs")) as {
  id: string;
  Q: string;
  A: string;
  Category: number;
  Slug: string;
  manualSort: number;
}[];

categories.sort((a, b) => a.manualSort - b.manualSort);
faqs.sort((a, b) => a.manualSort - b.manualSort);

// Create a map of category IDs to category objects for quick lookup
const categoryMap = new Map<number, string>(
  categories.map((cat) => {
    return [cat.id, cat.Name];
  })
);

// Group FAQs by category
const faqsByCategory = new Map<number, typeof faqs>();
for (const faq of faqs) {
  const categoryId = faq.Category;
  if (categoryId) {
    if (!faqsByCategory.has(categoryId)) {
      faqsByCategory.set(categoryId, []);
    }
    faqsByCategory.get(categoryId)!.push(faq);
  }
}

// Generate markdown content
let markdownContent = "";

for (const category of categories) {
  const categoryFaqs = faqsByCategory.get(category.id) || [];
  if (categoryFaqs.length === 0) continue;

  // Add category heading
  markdownContent += `## ${category.Name}\n\n`;

  // Add FAQs in this category
  for (const faq of categoryFaqs) {
    markdownContent += `::: details <a name="${faq.Slug}"></a>${faq.Q}\n\n`;
    markdownContent += `${faq.A}\n\n:::\n\n`;
  }
}

writeFileSync("includes/faq.md", markdownContent);
console.log("FAQ data updated successfully");
