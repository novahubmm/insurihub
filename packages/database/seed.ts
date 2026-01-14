import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@insurihub.com' },
    update: {},
    create: {
      email: 'admin@insurihub.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      tokenBalance: 10000,
      isVerified: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample users
  const users = [
    {
      email: 'sarah.johnson@example.com',
      name: 'Sarah Johnson',
      role: 'AGENT' as const,
      tokenBalance: 500,
    },
    {
      email: 'michael.chen@example.com',
      name: 'Michael Chen',
      role: 'CUSTOMER' as const,
      tokenBalance: 200,
    },
    {
      email: 'emily.davis@example.com',
      name: 'Emily Davis',
      role: 'CUSTOMER' as const,
      tokenBalance: 150,
    },
    {
      email: 'john.smith@example.com',
      name: 'John Smith',
      role: 'AGENT' as const,
      tokenBalance: 300,
    },
  ];

  const createdUsers = [];
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash('password123', 12);
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: hashedPassword,
        isVerified: true,
      },
    });
    createdUsers.push(user);
    console.log('✅ User created:', user.email);
  }

  // Create sample posts
  const posts = [
    {
      title: 'Understanding Auto Insurance Claims Process',
      content: 'Here\'s a comprehensive guide on how to handle auto insurance claims efficiently. The key is to document everything properly and communicate clearly with all parties involved. Start by taking photos of the accident scene, gathering witness information, and contacting your insurance company immediately.',
      category: 'AUTO' as const,
      authorId: createdUsers[0].id, // Sarah Johnson
      status: 'APPROVED' as const,
      tokenCost: 15,
      likes: 24,
      comments: 8,
    },
    {
      title: 'Health Insurance Trends 2024',
      content: 'The health insurance landscape is evolving rapidly. Here are the top trends to watch this year, including telehealth coverage expansion, personalized premium pricing based on health data, and increased focus on mental health benefits.',
      category: 'HEALTH' as const,
      authorId: createdUsers[1].id, // Michael Chen
      status: 'APPROVED' as const,
      tokenCost: 20,
      likes: 45,
      comments: 12,
    },
    {
      title: 'Life Insurance for Young Professionals',
      content: 'Many young professionals overlook life insurance, but it\'s crucial to start early. Term life insurance offers affordable protection, and the younger you are when you apply, the lower your premiums will be throughout the policy term.',
      category: 'LIFE' as const,
      authorId: createdUsers[3].id, // John Smith
      status: 'APPROVED' as const,
      tokenCost: 18,
      likes: 32,
      comments: 6,
    },
    {
      title: 'Property Insurance for Small Business Owners',
      content: 'Small business owners need comprehensive property insurance to protect their investments. This includes coverage for buildings, equipment, inventory, and business interruption. Don\'t forget about cyber liability coverage in today\'s digital world.',
      category: 'BUSINESS' as const,
      authorId: createdUsers[0].id, // Sarah Johnson
      status: 'PENDING' as const,
      tokenCost: 25,
      likes: 0,
      comments: 0,
    },
  ];

  for (const postData of posts) {
    const post = await prisma.post.create({
      data: postData,
    });
    console.log('✅ Post created:', post.title);
  }

  // Create sample agent package
  const agentPackage = await prisma.agentPackage.create({
    data: {
      name: 'Professional Agent Package',
      description: 'Complete package for insurance agents with CRM tools and premium features',
      monthlyTokens: 1000,
      price: 99.99,
      features: [
        'Customer Management CRM',
        'Advanced Analytics',
        'Priority Support',
        'Custom Branding',
        'API Access',
      ],
      isActive: true,
    },
  });

  console.log('✅ Agent package created:', agentPackage.name);

  // Create sample token transactions
  for (const user of createdUsers) {
    await prisma.tokenTransaction.create({
      data: {
        type: 'PURCHASE',
        amount: user.tokenBalance,
        description: 'Initial token allocation',
        userId: user.id,
      },
    });
  }

  console.log('✅ Token transactions created');

  // Create sample chats
  const chat = await prisma.chat.create({
    data: {
      isGroup: false,
      participants: {
        create: [
          { userId: createdUsers[0].id }, // Sarah
          { userId: createdUsers[1].id }, // Michael
        ],
      },
    },
  });

  // Create sample messages
  await prisma.message.createMany({
    data: [
      {
        content: 'Hi Sarah! I have a question about auto insurance coverage.',
        type: 'TEXT',
        chatId: chat.id,
        senderId: createdUsers[1].id, // Michael
        receiverId: createdUsers[0].id, // Sarah
      },
      {
        content: 'Of course! I\'d be happy to help. What specific aspect would you like to know about?',
        type: 'TEXT',
        chatId: chat.id,
        senderId: createdUsers[0].id, // Sarah
        receiverId: createdUsers[1].id, // Michael
      },
      {
        content: 'I\'m particularly interested in comprehensive coverage options and how they differ from collision coverage.',
        type: 'TEXT',
        chatId: chat.id,
        senderId: createdUsers[1].id, // Michael
        receiverId: createdUsers[0].id, // Sarah
      },
    ],
  });

  console.log('✅ Sample chat and messages created');

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('Admin: admin@insurihub.com / admin123');
  console.log('Agent: sarah.johnson@example.com / password123');
  console.log('Customer: michael.chen@example.com / password123');
  console.log('Customer: emily.davis@example.com / password123');
  console.log('Agent: john.smith@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });