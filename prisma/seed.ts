import { PrismaClient, Role, FeatureType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  // ── Admin user ────────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL ?? 'admin@admin.com';
  const password = process.env.ADMIN_PASSWORD ?? 'Admin1234!';
  const name = process.env.ADMIN_NAME ?? 'Admin';

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { role: Role.admin },
    create: { email, password: hashed, name, role: Role.admin },
  });
  console.log(`Admin user seeded: ${email}`);

  // ── Uploads directory ─────────────────────────────────────────
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  // ── Hero section ──────────────────────────────────────────────
  await prisma.section.upsert({
    where: { key: 'hero' },
    update: {},
    create: {
      key: 'hero',
      type: 'hero',
      title: 'SOLID WOOD PRODUCTS',
      background: '/uploads/hero-bg.png',
      content: {
        subtitle: 'Oak, beech, ash from',
        highlight: '1700 CZK per m3',
        buttons: [{ label: 'Order', href: '#order', variant: 'primary' }],
      },
      images: [
        '/uploads/hero-img-1.png',
        '/uploads/hero-img-2.png',
        '/uploads/hero-img-3.png',
      ],
      order: 1,
      isActive: true,
    },
  });
  console.log('Hero section seeded');

  // ── Our Work section ──────────────────────────────────────────
  await prisma.section.upsert({
    where: { key: 'our-work' },
    update: {},
    create: {
      key: 'our-work',
      type: 'carousel',
      title: 'Our Work',
      content: {
        carousel: [
          { src: '/uploads/our-work-1.png', order: 1 },
          { src: '/uploads/our-work-2.png', order: 2 },
          { src: '/uploads/our-work-3.png', order: 3 },
        ],
      },
      images: [],
      order: 2,
      isActive: true,
    },
  });
  console.log('Our Work section seeded');

  // ── Advantages section ───────────────────────────────────────
  await prisma.section.upsert({
    where: { key: 'advantages' },
    update: {},
    create: {
      key: 'advantages',
      type: 'advantages',
      title: 'ADVANTAGES WORKING WITH US',
      content: {
        advantages: [
          { text: 'In-house carpentry production',                                          order: 1 },
          { text: 'We only treat wood with environmentally friendly and safe products',     order: 2 },
          { text: 'Prices from the manufacturer, no extra charges',                        order: 3 },
        ],
        buttons: [
          { label: 'Receive a consultation', href: '#consultation', variant: 'primary' },
        ],
      },
      images: ['/uploads/advantages-img.png'],
      order: 3,
      isActive: true,
    },
  });
  console.log('Advantages section seeded');

  // ── About Us section ─────────────────────────────────────────
  await prisma.section.upsert({
    where: { key: 'about-us' },
    update: {},
    create: {
      key: 'about-us',
      type: 'about',
      title: 'ABOUT US',
      content: {
        company: 'BIO CWT',
        description:
          'We manufacture solid wood products according to individual drawings. We make chairs, armchairs, wardrobes, beds and much more in our own workshop, equipped with all the necessary industrial equipment.',
      },
      images: [
        '/uploads/about-img-1.png',
        '/uploads/about-img-2.png',
        '/uploads/about-img-3.png',
      ],
      order: 4,
      isActive: true,
    },
  });
  console.log('About Us section seeded');

  // ── Any Questions section ─────────────────────────────────────
  await prisma.section.upsert({
    where: { key: 'any-questions' },
    update: {},
    create: {
      key: 'any-questions',
      type: 'contact',
      title: 'ANY QUESTIONS?',
      content: {
        text: 'Write to us and we will be sure to answer all your questions and give you a comprehensive consultation.',
      },
      images: ['/uploads/questions-img.png'],
      order: 5,
      isActive: true,
    },
  });
  console.log('Any Questions section seeded');

  // ── Wood products ─────────────────────────────────────────────
  const woods = [
    {
      name: 'Oak',
      slug: 'oak',
      image: '/uploads/wood-oak.png',
      features: [
        { content: 'Durability',        type: FeatureType.positive, sortOrder: 1 },
        { content: 'Beautiful texture', type: FeatureType.positive, sortOrder: 2 },
        { content: 'Water resistance',  type: FeatureType.positive, sortOrder: 3 },
        { content: 'Expensive',         type: FeatureType.negative, sortOrder: 4 },
      ],
    },
    {
      name: 'Buk',
      slug: 'buk',
      image: '/uploads/wood-buk.png',
      features: [
        { content: 'Durability',      type: FeatureType.positive, sortOrder: 1 },
        { content: 'Hard to handle',  type: FeatureType.negative, sortOrder: 2 },
      ],
    },
    {
      name: 'Ash',
      slug: 'ash',
      image: '/uploads/wood-ash.png',
      features: [
        { content: 'Durability',      type: FeatureType.positive, sortOrder: 1 },
        { content: 'Hard to handle',  type: FeatureType.negative, sortOrder: 2 },
      ],
    },
  ];

  for (const wood of woods) {
    const { features, ...woodData } = wood;

    const record = await prisma.wood.upsert({
      where: { slug: woodData.slug },
      update: { name: woodData.name, image: woodData.image },
      create: woodData,
    });

    // Replace features on every seed run so they stay in sync
    await prisma.woodFeature.deleteMany({ where: { woodId: record.id } });
    await prisma.woodFeature.createMany({
      data: features.map((f) => ({ ...f, woodId: record.id })),
    });

    console.log(`Wood seeded: ${record.name}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
