import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const categories = [
    { name: 'পাইপ ও প্লাম্বিং', key: 'PLUMBING' },
    { name: 'বিদ্যুৎ ও ইলেকট্রিক কাজ', key: 'ELECTRICAL' },
    { name: 'এসি, ফ্রিজ ও ইলেকট্রনিক্স', key: 'AC_REFRIGERATOR_REPAIR' },
    { name: 'গৃহ পরিষ্কার ও ডিপ ক্লিনিং', key: 'HOME_CLEANING' },
    { name: 'কাঠের কাজ ও আসবাবপত্র', key: 'CARPENTRY_FURNITURE' },
  ];

  for (const category of categories) {
    await prisma.serviceCategory.upsert({
      where: { key: category.key },
      update: {},
      create: category,
    });
  }
  console.log('✅ Service Categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });