import { PrismaClient } from "@prisma/client";
import { hashCode } from "../src/lib/security";
import { DEFAULT_THEMES, DEFAULT_SONGS } from "../src/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Rakhi 2026 database with 4-digit DDMM birthday passcodes...");

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

  // 4. Seed Sister 1: Anusha (4-Digit DDMM Passcode: 2808)
  const anushaCode = "2808";
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

  // Anusha's Memories & Questions
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
        label: "Definitely You! 😜",
        value: "you",
        responseMessage: "Hey! I am 100% innocent! 😇",
        animationType: "funny_shake",
      },
      {
        questionId: q1.id,
        label: "Me, but I'll never admit it 🤫",
        value: "me",
        responseMessage: "Aha! Truth finally revealed! 🎉",
        animationType: "celebration",
        memoryId: memory1.id,
      },
      {
        questionId: q1.id,
        label: "50-50 Equal Partners in Crime 🤝",
        value: "both",
        responseMessage: "Best crime partners forever! 💥",
        animationType: "happy",
      },
    ],
  });

  const q2 = await prisma.question.create({
    data: {
      sisterId: anusha.id,
      question: "Rate our sibling bond strength from 1 to 10 ⭐",
      type: "rating",
      displayOrder: 2,
      animationType: "typewriter",
    },
  });

  await prisma.answerOption.create({
    data: {
      questionId: q2.id,
      label: "Rating Scale",
      value: "rating_scale",
      responseMessage: "Unbreakable bond forever & always! ❤️",
      animationType: "emotional",
    },
  });

  const q3 = await prisma.question.create({
    data: {
      sisterId: anusha.id,
      question: "Pick the emoji that represents us best!",
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

  console.log(`✅ Sister Anusha seeded with DDMM Code: ${anushaCode}`);

  // 5. Seed Sister 2: Sravani (4-Digit DDMM Passcode: 0703)
  const sravaniCode = "0703";
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

  console.log(`✅ Sister Sravani seeded with DDMM Code: ${sravaniCode}`);

  // 6. Seed Sister 3: Sirisha (4-Digit DDMM Passcode: 2310)
  const sirishaCode = "2310";
  const sirishaCodeHash = hashCode(sirishaCode);

  const existingSirisha = await prisma.sister.findFirst({
    where: { name: "Sirisha" },
  });

  if (existingSirisha) {
    await prisma.sister.delete({ where: { id: existingSirisha.id } });
  }

  const sirisha = await prisma.sister.create({
    data: {
      name: "Sirisha",
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
      finalMessage:
        "Dearest Sirisha,\n\nYou bring so much laughter, love, and light into my life.\n\nOn this special day of Raksha Bandhan, I want you to know how truly special you are to me.\n\nI promise to always protect you, support your dreams, and be there whenever you need me.\n\nHappy Raksha Bandhan! ❤️\n\n— Your Brother",
      themeId: "warm_sunset",
      songId: "song_emotional_acoustic",
      motionStyle: "cinematic",
      status: "published",
      publishedAt: new Date(),
      access: {
        create: {
          codeHash: sirishaCodeHash,
          isActive: true,
        },
      },
    },
  });

  console.log(`✅ Sister Sirisha seeded with DDMM Code: ${sirishaCode}`);
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
