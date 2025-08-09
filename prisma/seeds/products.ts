import { PrismaClient } from "../../app/generated/prisma";

// Sample reviews data for products
const sampleReviews = [
  {
    rating: 5,
    title: "Excellent quality!",
    comment:
      "Amazing product, highly recommended. Great value for money and excellent build quality.",
  },
  {
    rating: 4,
    title: "Very good",
    comment:
      "Good product overall. Fast delivery and as described. Would buy again.",
  },
  {
    rating: 5,
    title: "Love it!",
    comment:
      "Perfect! Exactly what I was looking for. Great customer service too.",
  },
  {
    rating: 4,
    title: "Good purchase",
    comment: "Satisfied with the quality. Good packaging and quick shipping.",
  },
  {
    rating: 3,
    title: "Average",
    comment:
      "It's okay, does the job but nothing special. Could be better for the price.",
  },
  {
    rating: 5,
    title: "Outstanding!",
    comment:
      "Exceeded my expectations. Top quality material and excellent finish.",
  },
  {
    rating: 4,
    title: "Recommended",
    comment: "Good value product. Works as expected and arrived on time.",
  },
  {
    rating: 5,
    title: "Perfect!",
    comment:
      "Couldn't be happier with this purchase. Will definitely shop here again.",
  },
];

// Helper function to get random reviews for a product
function getRandomReviews(count: number = 3) {
  const shuffled = [...sampleReviews].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const productsData = [
  {
    title: "Premium Wireless Headphones",
    desc: "High-quality wireless headphones with noise cancellation and superior sound quality. Perfect for music lovers and professionals.",
    slug: "premium-wireless-headphones",
    price: 299.99,
    compare_price: 399.99,
    cost_price: 150.0,
    sku: "PWH001",
    quantity: 50,
    is_active: true,
    is_featured: true,
    category_slug: "accessories",
    images: [
      {
        url: "/images/sample-products/headphones-1.jpg",
        alt: "Premium Wireless Headphones - Front View",
        sort_order: 1,
      },
      {
        url: "/images/sample-products/headphones-2.jpg",
        alt: "Premium Wireless Headphones - Side View",
        sort_order: 2,
      },
    ],
  },
  {
    title: "Organic Cotton T-Shirt",
    desc: "Comfortable and sustainable organic cotton t-shirt. Soft fabric with excellent fit and breathability.",
    slug: "organic-cotton-tshirt",
    price: 29.99,
    compare_price: 39.99,
    cost_price: 15.0,
    sku: "OCT001",
    quantity: 100,
    is_active: true,
    is_featured: true,
    category_slug: "mens-clothing",
    images: [
      {
        url: "/images/sample-products/tshirt-1.jpg",
        alt: "Organic Cotton T-Shirt - White",
        sort_order: 1,
      },
    ],
  },
  {
    title: "Smart Fitness Watch",
    desc: "Advanced fitness tracking with heart rate monitoring, GPS, and smartphone connectivity. Perfect for active lifestyle.",
    slug: "smart-fitness-watch",
    price: 199.99,
    compare_price: 249.99,
    cost_price: 100.0,
    sku: "SFW001",
    quantity: 25,
    is_active: true,
    is_featured: true,
    category_slug: "accessories",
    images: [
      {
        url: "/images/sample-products/watch-1.jpg",
        alt: "Smart Fitness Watch - Black",
        sort_order: 1,
      },
    ],
  },
  {
    title: "Leather Crossbody Bag",
    desc: "Stylish and practical leather crossbody bag. Handcrafted with premium materials and attention to detail.",
    slug: "leather-crossbody-bag",
    price: 89.99,
    compare_price: 119.99,
    cost_price: 45.0,
    sku: "LCB001",
    quantity: 30,
    is_active: true,
    is_featured: true,
    category_slug: "accessories",
    images: [
      {
        url: "/images/sample-products/bag-1.jpg",
        alt: "Leather Crossbody Bag - Brown",
        sort_order: 1,
      },
    ],
  },
  {
    title: "Running Sneakers",
    desc: "Lightweight running sneakers with advanced cushioning and breathable mesh upper. Ideal for daily runs and workouts.",
    slug: "running-sneakers",
    price: 129.99,
    compare_price: 159.99,
    cost_price: 65.0,
    sku: "RS001",
    quantity: 75,
    is_active: true,
    is_featured: true,
    category_slug: "footwear",
    images: [
      {
        url: "/images/sample-products/sneakers-1.jpg",
        alt: "Running Sneakers - Gray/Blue",
        sort_order: 1,
      },
    ],
  },
  {
    title: "Casual Denim Jeans",
    desc: "Classic fit denim jeans made from premium cotton. Comfortable and durable for everyday wear.",
    slug: "casual-denim-jeans",
    price: 79.99,
    compare_price: 99.99,
    cost_price: 40.0,
    sku: "CDJ001",
    quantity: 60,
    is_active: true,
    is_featured: false,
    category_slug: "mens-clothing",
    images: [
      {
        url: "/images/sample-products/jeans-1.jpg",
        alt: "Casual Denim Jeans - Blue",
        sort_order: 1,
      },
    ],
  },
  {
    title: "Yoga Leggings",
    desc: "High-performance yoga leggings with moisture-wicking fabric and four-way stretch. Perfect for yoga and fitness.",
    slug: "yoga-leggings",
    price: 49.99,
    compare_price: 69.99,
    cost_price: 25.0,
    sku: "YL001",
    quantity: 40,
    is_active: true,
    is_featured: false,
    category_slug: "activewear",
    images: [
      {
        url: "/images/sample-products/leggings-1.jpg",
        alt: "Yoga Leggings - Black",
        sort_order: 1,
      },
    ],
  },
  {
    title: "Winter Jacket",
    desc: "Warm and waterproof winter jacket with insulated lining. Designed for cold weather protection and style.",
    slug: "winter-jacket",
    price: 179.99,
    compare_price: 229.99,
    cost_price: 90.0,
    sku: "WJ001",
    quantity: 20,
    is_active: true,
    is_featured: false,
    category_slug: "mens-clothing",
    images: [
      {
        url: "/images/sample-products/jacket-1.jpg",
        alt: "Winter Jacket - Navy",
        sort_order: 1,
      },
    ],
  },
];

export async function seedProducts(prisma: PrismaClient) {
  console.log("🌱 Seeding products...");

  // First, get the user who will be the creator
  const user = await prisma.user.findFirst({
    where: { email: "admin@example.com" },
  });

  if (!user) {
    console.error("❌ Admin user not found. Please seed users first.");
    return;
  }

  // Get all users for creating reviews
  const allUsers = await prisma.user.findMany();

  // Clear existing products, images, and reviews
  await prisma.review.deleteMany({});
  await prisma.image.deleteMany({});
  await prisma.product.deleteMany({});

  for (const productData of productsData) {
    // Find the category
    const category = await prisma.category.findUnique({
      where: { slug: productData.category_slug },
    });

    if (!category) {
      console.error(`❌ Category ${productData.category_slug} not found`);
      continue;
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        title: productData.title,
        desc: productData.desc,
        slug: productData.slug,
        price: productData.price,
        compare_price: productData.compare_price,
        cost_price: productData.cost_price,
        sku: productData.sku,
        quantity: productData.quantity,
        is_active: productData.is_active,
        is_featured: productData.is_featured,
        created_by: user.id,
        category_id: category.id,
      },
    });

    // Create images for the product
    for (const imageData of productData.images) {
      await prisma.image.create({
        data: {
          url: imageData.url,
          alt: imageData.alt,
          sort_order: imageData.sort_order,
          product_id: product.id,
        },
      });
    }

    // Create fake reviews for the product
    const reviewCount = Math.floor(Math.random() * 4) + 2; // 2-5 reviews per product
    const reviews = getRandomReviews(reviewCount);

    for (let i = 0; i < reviews.length && i < allUsers.length; i++) {
      const reviewData = reviews[i];
      const reviewUser = allUsers[i % allUsers.length]; // Cycle through users

      await prisma.review.create({
        data: {
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment,
          is_verified: Math.random() > 0.3, // 70% chance of being verified
          is_approved: true, // All fake reviews are approved
          user_id: reviewUser.id,
          product_id: product.id,
        },
      });
    }

    console.log(`✅ Created product: ${productData.title}`);
  }

  console.log("✅ Products seeded successfully");
}
