import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'বিদ্যুৎ ও ইলেকট্রিক কাজ', key: 'ELECTRICAL' },
    { name: 'পাইপ ও প্লাম্বিং', key: 'PLUMBING' },
    { name: 'এসি, ফ্রিজ ও ইলেকট্রনিক্স', key: 'AC_REFRIGERATOR_REPAIR' },
    { name: 'কাঠের কাজ ও আসবাবপত্র', key: 'CARPENTRY_FURNITURE' },
    { name: 'রঙ ও পেইন্টিং', key: 'PAINTING' },
    { name: 'গৃহ পরিষ্কার ও ডিপ ক্লিনিং', key: 'HOME_CLEANING' },
    { name: 'বাগান ও গাছপালা পরিচর্যা', key: 'GARDENING_LANDSCAPING' },
    { name: 'কীটপতঙ্গ নিয়ন্ত্রণ', key: 'PEST_CONTROL' },
    { name: 'ওয়াশিং মেশিন ও গৃহস্থালী যন্ত্রপাতি', key: 'HOME_APPLIANCE_REPAIR' },
    { name: 'বাড়ি স্থানান্তর ও প্যাকিং', key: 'MOVING_PACKING' },
    { name: 'বিল্ডিং ও সিভিল নির্মাণ', key: 'CONSTRUCTION' },
    { name: 'গাড়ি মেরামত ও ওয়াশিং', key: 'AUTO_REPAIR_WASH' },
    { name: 'ফটোগ্রাফি ও ভিডিওগ্রাফি', key: 'PHOTOGRAPHY' },
    { name: 'পার্টি প্ল্যানিং ও ইভেন্ট', key: 'EVENT_PLANNING' },
    { name: 'ইন্টারনেট ও টিভি সেটআপ', key: 'INTERNET_TV_SETUP' },
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