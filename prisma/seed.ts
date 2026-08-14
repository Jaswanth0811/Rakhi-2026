import { PrismaClient } from "@prisma/client";
import { hashCode } from "../src/lib/security";
import { DEFAULT_THEMES, DEFAULT_SONGS } from "../src/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Rakhi 2026 database...");

  // 1. Seed Themes
  for (const theme of DEFAULT_THEMES) {
    await prisma.theme.upsert({
      where: { name: theme.name },
      update: {
        description: theme.description,
        configuration: theme.configuration,
        previewImage: theme.previewImage,
      },
      create: {
        id: theme.id,
        name: theme.name,
        description: theme.description,
        configuration: theme.configuration,
        previewImage: theme.previewImage,
      },
    });
  }
  console.log("✅ Themes seeded.");

  // 2. Seed Songs
  for (const song of DEFAULT_SONGS) {
    await prisma.song.upsert({
      where: { id: song.id },
      update: {
        title: song.title,
        artist: song.artist,
        mood: song.mood,
        genre: song.genre,
        language: song.language,
        energy: song.energy,
        duration: song.duration,
        audioUrl: song.audioUrl,
        coverUrl: song.coverUrl,
      },
      create: {
        id: song.id,
        title: song.title,
        artist: song.artist,
        mood: song.mood,
        genre: song.genre,
        language: song.language,
        energy: song.energy,
        duration: song.duration,
        audioUrl: song.audioUrl,
        coverUrl: song.coverUrl,
      },
    });
  }
  console.log("✅ Songs seeded.");

  // 3. Seed Admin User
  const adminPin = process.env.ADMIN_PIN || "233014";
  const pinHash = hashCode(adminPin);
  await prisma.adminUser.upsert({
    where: { email: "admin@rakhi2026.com" },
    update: { pinHash },
    create: {
      email: "admin@rakhi2026.com",
      name: "Brother (Admin)",
      pinHash,
    },
  });
  console.log("✅ Admin user seeded.");

  // 4. Seed Sister 1: Anusha (Code: 280826)
  const anushaCode = "280826";
  const anushaCodeHash = hashCode(anushaCode);

  const existingAnusha = await prisma.sister.findFirst({
    where: { name: "Anusha" },
  });

  if (existingAnusha) {
    await prisma.sister.delete({ where: { id: existingAnusha.id } });
  }

  const anusha = await prisma.sister.create({
    data: {
      name: "Anusha",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      finalMessage:
        "Dear Anusha,\n\nYou have been my constant anchor, my funniest fight partner, and my closest confidante.\n\nNo matter how far life takes us, this Rakhi thread is a promise that I will always stand by your side, protect your smile, and cheer for your dreams.\n\nHappy Raksha Bandhan! ❤️\n\n— Your Brother",
      themeId: "warm_sunset",
      songId: "song_emotional_acoustic",
      motionStyle: "slow_emotional",
      status: "published",
      publishedAt: new Date(),
      access: {
        create: {
          codeHash: anushaCodeHash,
          isActive: true,
        },
      },
    },
  });

  // Anusha's Memories
  const memory1 = await prisma.memory.create({
    data: {
      sisterId: anusha.id,
      imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
      caption: "That unforgettable family vacation where we laughed till midnight! ✨",
    },
  });

  const memory2 = await prisma.memory.create({
    data: {
      sisterId: anusha.id,
      imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
      caption: "Our childhood festive celebrations! ❤️",
    },
  });

  // Anusha's Questions
  const q1 = await prisma.question.create({
    data: {
      sisterId: anusha.id,
      question: "Who is more annoying between us? 😂",
      type: "multiple_choice",
      displayOrder: 1,
      animationType: "typewriter",
    },
  });

  await prisma.answerOption.createMany({
    data: [
      {
        questionId: q1.id,
        label: "Me 😎",
        value: "Me 😎",
        responseMessage: "Honesty is appreciated! 😂 You definitely have your moments!",
        animationType: "funny_shake",
      },
      {
        questionId: q1.id,
        label: "You 😂",
        value: "You 😂",
        responseMessage: "I knew you'd say that! But admit it, life would be boring without me! 😜",
        animationType: "funny_shake",
      },
      {
        questionId: q1.id,
        label: "Both of us 🤝",
        value: "Both 🤝",
        responseMessage: "100% accurate! Equal partners in crime! 🤝",
        animationType: "celebration",
      },
      {
        questionId: q1.id,
        label: "Neither, we are angels 😇",
        value: "Neither 😇",
        responseMessage: "Who are we kidding here? 😇 Lie detector activated!",
        animationType: "playful",
      },
    ],
  });

  const q2 = await prisma.question.create({
    data: {
      sisterId: anusha.id,
      question: "How much do you miss our childhood fighting & banter? 😇",
      type: "rating",
      displayOrder: 2,
      animationType: "typewriter",
    },
  });

  await prisma.answerOption.create({
    data: {
      questionId: q2.id,
      label: "Rating 1-10",
      value: "rating_scale",
      responseMessage: "Those childhood fights built our unbreakable bond! ❤️",
      animationType: "emotional",
      memoryId: memory1.id,
    },
  });

  const q3 = await prisma.question.create({
    data: {
      sisterId: anusha.id,
      question: "Describe our sibling bond in one emoji! ✨",
      type: "emoji",
      displayOrder: 3,
      animationType: "typewriter",
    },
  });

  await prisma.answerOption.createMany({
    data: [
      {
        questionId: q3.id,
        label: "❤️ Pure Love",
        value: "❤️",
        responseMessage: "Unconditional love always! ❤️",
        animationType: "emotional",
      },
      {
        questionId: q3.id,
        label: "😂 Endless Laughter",
        value: "😂",
        responseMessage: "Laughter is our official sibling language! 😂",
        animationType: "happy",
      },
      {
        questionId: q3.id,
        label: "🥹 Cherished Bond",
        value: "🥹",
        responseMessage: "Always here for you, no matter what! 🥹",
        animationType: "emotional",
      },
      {
        questionId: q3.id,
        label: "😤 Drama & Chaos",
        value: "😤",
        responseMessage: "The good kind of drama that keeps us close! 😤",
        animationType: "playful",
      },
    ],
  });

  const q4 = await prisma.question.create({
    data: {
      sisterId: anusha.id,
      question: "What is one promise or memory of us you'll never forget?",
      type: "text",
      displayOrder: 4,
      animationType: "typewriter",
    },
  });

  await prisma.answerOption.create({
    data: {
      questionId: q4.id,
      label: "Text Response",
      value: "text_input",
      responseMessage: "I will hold that memory close to my heart forever. ❤️",
      animationType: "emotional",
      memoryId: memory2.id,
    },
  });

  console.log(`✅ Sister Anusha seeded with Code: ${anushaCode}`);

  // 5. Seed Sister 2: Sravani (Code: 739421)
  const sravaniCode = "739421";
  const sravaniCodeHash = hashCode(sravaniCode);

  const existingSravani = await prisma.sister.findFirst({
    where: { name: "Sravani" },
  });

  if (existingSravani) {
    await prisma.sister.delete({ where: { id: existingSravani.id } });
  }

  const sravani = await prisma.sister.create({
    data: {
      name: "Sravani",
      photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
      finalMessage:
        "Dearest Sravani,\n\nGrowing up with you has made every single day brighter and full of warmth.\n\nThank you for always listening, caring, and bringing so much light into our family.\n\nMay your life always be filled with joy, peace, and endless success.\n\nHappy Raksha Bandhan! ❤️\n\n— Your Brother",
      themeId: "soft_bloom",
      songId: "song_happy_vibes",
      motionStyle: "playful",
      status: "published",
      publishedAt: new Date(),
      access: {
        create: {
          codeHash: sravaniCodeHash,
          isActive: true,
        },
      },
    },
  });

  const sravaniMemory = await prisma.memory.create({
    data: {
      sisterId: sravani.id,
      imageUrl: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=800&q=80",
      caption: "Our favorite memory together under the bright sunshine! ☀️",
    },
  });

  const sq1 = await prisma.question.create({
    data: {
      sisterId: sravani.id,
      question: "Do you remember the secret ice cream trip we took without telling anyone? 🍦",
      type: "yes_no",
      displayOrder: 1,
      animationType: "typewriter",
    },
  });

  await prisma.answerOption.createMany({
    data: [
      {
        questionId: sq1.id,
        label: "YES ❤️",
        value: "YES",
        responseMessage: "Best ice cream ever! Secrets stay safe with us! 🤫❤️",
        animationType: "celebration",
        memoryId: sravaniMemory.id,
      },
      {
        questionId: sq1.id,
        label: "NO 😅",
        value: "NO",
        responseMessage: "How could you forget?! Time for a refresher ice cream date! 🍦",
        animationType: "funny_shake",
      },
    ],
  });

  const sq2 = await prisma.question.create({
    data: {
      sisterId: sravani.id,
      question: "On a scale of 1 to 10, how awesome is your brother? 😎",
      type: "rating",
      displayOrder: 2,
      animationType: "typewriter",
    },
  });

  await prisma.answerOption.create({
    data: {
      questionId: sq2.id,
      label: "Rating Scale",
      value: "rating_scale",
      responseMessage: "Anything below 10 is clearly a system glitch! 😂 You are awesome too!",
      animationType: "happy",
    },
  });

  console.log(`✅ Sister Sravani seeded with Code: ${sravaniCode}`);
  console.log("🎉 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
