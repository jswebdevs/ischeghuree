import * as dotenv from 'dotenv';
import * as path from 'path';

// Load the correct .env file before anything else
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Use DIRECT_URL for the seed script to avoid pooler issues
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

const pool = new Pool({ 
  connectionString,
  connectionTimeoutMillis: 20000, // 20 seconds
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const pages = [
  {
    title: "About Us",
    slug: "about-us",
    content: [
      {
        type: "rich-text",
        data: {
          content: `
            <h2>Welcome to Ginag ✨</h2>
            <p>We create handmade beaded bag charms and keychains, designed to add a unique and stylish touch to your bags and everyday accessories.</p>
            <p>Each product is carefully handcrafted using high-quality beads, crystals, and durable hardware. Our focus is on custom-made designs, allowing every customer to get something that truly matches their personal style.</p>
            <h3>🧵 How we work:</h3>
            <ul>
              <li>You place an order</li>
              <li>We contact you for customization details</li>
              <li>We create your product based on your preferences</li>
              <li>Then we deliver your custom piece</li>
            </ul>
            <p>We believe in quality, creativity, and personal connection with every customer.</p>
          `
        }
      }
    ]
  },
  {
    title: "Contact Us",
    slug: "contact-us",
    content: [
      {
        type: "rich-text",
        data: {
          content: `
            <h2>Contact Us</h2>
            <p>Have questions or want a custom design? We’re here to help!</p>
            <p>📧 Email: your@email.com</p>
            <p>📱 WhatsApp: +880XXXXXXXXXX</p>
            <p>📍 Location: Your City, Country</p>
            <h3>🕒 Response Time:</h3>
            <p>We reply within 12–24 hours</p>
            <p>👉 For faster communication, please message us on WhatsApp</p>
          `
        }
      }
    ]
  },
  {
    title: "Custom Order Process",
    slug: "custom-order-process",
    content: [
      {
        type: "rich-text",
        data: {
          content: `
            <h2>How Custom Orders Work</h2>
            <p>1️⃣ Place your order on our website</p>
            <p>2️⃣ We contact you via WhatsApp or email</p>
            <p>3️⃣ You share your customization details (color, design, initials, etc.)</p>
            <p>4️⃣ We create your handmade product</p>
            <p>5️⃣ We deliver your custom order</p>
            <p><strong>⏱ Production Time:</strong> 2–5 days depending on design</p>
          `
        }
      }
    ]
  },
  {
    title: "Shipping Policy",
    slug: "shipping-policy",
    content: [
      {
        type: "rich-text",
        data: {
          content: `
            <h2>Shipping Information</h2>
            <h3>📦 Processing Time (Custom Orders):</h3>
            <p>2–5 business days</p>
            <h3>🚚 Delivery Time:</h3>
            <ul>
              <li>Local: 3–7 days</li>
              <li>International: 7–15 days</li>
            </ul>
            <p>📲 You will receive updates via WhatsApp or email</p>
          `
        }
      }
    ]
  },
  {
    title: "Return & Refund Policy",
    slug: "return-refund-policy",
    content: [
      {
        type: "rich-text",
        data: {
          content: `
            <h2>Return & Refund Policy</h2>
            <p>Since all products are custom-made, we follow this policy:</p>
            <h3>❌ No Returns or Refunds</h3>
            <ul>
              <li>Customized products cannot be returned or refunded</li>
            </ul>
            <h3>✅ Exceptions</h3>
            <p>We only offer replacement if:</p>
            <ul>
              <li>The product is damaged during delivery</li>
              <li>You received the wrong item</li>
            </ul>
            <p>📸 You must contact us within 48 hours with photos.</p>
          `
        }
      }
    ]
  },
  {
    title: "Exchange Policy",
    slug: "exchange-policy",
    content: [
      {
        type: "rich-text",
        data: {
          content: `
            <h2>Exchanges</h2>
            <p>We only replace items if they are:</p>
            <ul>
              <li>✔ Damaged</li>
              <li>✔ Incorrect</li>
            </ul>
            <p>No exchanges for custom preference changes after production.</p>
          `
        }
      }
    ]
  },
  {
    title: "Cancellation Policy",
    slug: "cancellation-policy",
    content: [
      {
        type: "rich-text",
        data: {
          content: `
            <h2>Order Cancellation</h2>
            <ul>
              <li>Orders can be canceled within 6 hours of placing the order</li>
              <li>After that, customization work may begin and cancellation is not possible</li>
            </ul>
          `
        }
      }
    ]
  },
  {
    title: "Terms of Service",
    slug: "terms-of-service",
    content: [
      {
        type: "rich-text",
        data: {
          content: `
            <h2>Terms of Service</h2>
            <p>By using our website, you agree:</p>
            <ul>
              <li>All products are handmade and customized</li>
              <li>Slight variations in design, color, or size may occur</li>
              <li>Customers must provide correct customization details</li>
              <li>Orders cannot be changed once production starts</li>
            </ul>
            <p>We are not responsible for delays caused by shipping services.</p>
          `
        }
      }
    ]
  },
  {
    title: "Privacy Policy",
    slug: "privacy-policy",
    content: [
      {
        type: "rich-text",
        data: {
          content: `
            <h2>Privacy Policy</h2>
            <p>We collect customer information such as:</p>
            <ul>
              <li>Name</li>
              <li>Email</li>
              <li>Phone number (for WhatsApp communication)</li>
              <li>Shipping address</li>
            </ul>
            <p>This information is used only for:</p>
            <ul>
              <li>✔ Order processing</li>
              <li>✔ Customization communication</li>
              <li>✔ Delivery updates</li>
            </ul>
            <p>We do not share your data with third parties.</p>
          `
        }
      }
    ]
  },
  {
    title: "FAQ",
    slug: "faq",
    content: [
      {
        type: "rich-text",
        data: {
          content: `
            <h2>Frequently Asked Questions</h2>
            <p><strong>Q: Are your products ready-made?</strong><br>No, all products are made after you place your order.</p>
            <p><strong>Q: How do I customize my order?</strong><br>We will contact you on WhatsApp after your order.</p>
            <p><strong>Q: Can I choose colors and design?</strong><br>Yes, full customization is available.</p>
            <p><strong>Q: Do you accept bulk orders?</strong><br>Yes, contact us on WhatsApp for special pricing.</p>
            <p><strong>Q: How long does it take?</strong><br>Production: 2–5 days<br>Delivery: 3–15 days depending on location</p>
          `
        }
      }
    ]
  }
];

async function main() {
  console.log('Seed started...');

  for (const page of pages) {
    await prisma.storefrontPage.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        content: page.content as any,
        status: "PUBLISHED"
      },
      create: {
        title: page.title,
        slug: page.slug,
        content: page.content as any,
        status: "PUBLISHED"
      }
    });
    console.log(`Page "${page.title}" upserted.`);
  }

  // Update Footer Links
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  if (settings) {
    const footerConfig = (settings.footerConfig as any) || {
      col1: {},
      col2: { title: "Quick Links", links: [] },
      col3: { title: "Customer Support", links: [] },
      col4: { contacts: [] }
    };

    // Column 2: Quick Links
    const col2Links = [
      { label: "About Us", href: "/about-us" },
      { label: "Custom Order Process", href: "/custom-order-process" },
      { label: "FAQ", href: "/faq" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Privacy Policy", href: "/privacy-policy" }
    ];

    // Column 3: Customer Support
    const col3Links = [
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Return & Refund Policy", href: "/return-refund-policy" },
      { label: "Exchange Policy", href: "/exchange-policy" },
      { label: "Order Cancellation", href: "/cancellation-policy" },
      { label: "Contact Us", href: "/contact-us" }
    ];

    footerConfig.col2.links = col2Links;
    footerConfig.col3.links = col3Links;

    await prisma.siteSettings.update({
      where: { id: 'singleton' },
      data: { footerConfig }
    });
    console.log('Footer configuration updated.');
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
