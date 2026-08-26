import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

const DEFAULT_GROUPS = [
  "Gia đình",
  "Bạn bè",
  "Công việc",
  "Xã hội / Cộng đồng",
  "Người mới quen",
];

const DEFAULT_TAGS = [
  "Anh trai",
  "Chị gái",
  "Bạn thân",
  "Bạn cũ",
  "Đối tác",
  "Đồng nghiệp",
  "Mentor",
  "Người cùng ngành",
  "Khách hàng",
  "Nhà cung cấp",
  "Nhà đầu tư",
  "Đối tác tiềm năng",
  "Người có ảnh hưởng",
  "Người kết nối",
  "Hàng xóm",
];

const DEFAULT_HELP_TOPICS = [
  "Amazon",
  "Kinh doanh",
  "Marketing",
  "Logistics",
  "Tài chính",
  "Đầu tư",
  "Pháp lý",
  "Công nghệ",
  "Cuộc sống",
  "Giáo dục",
  "Sức khỏe",
  "Có thể giới thiệu người khác",
  "Kinh nghiệm kinh doanh",
  "Nguồn hàng",
  "Kết nối",
  "Tư vấn",
];

async function main() {
  const email = process.env.SEED_USER_EMAIL;
  const password = process.env.SEED_USER_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "Thiếu SEED_USER_EMAIL / SEED_USER_PASSWORD trong biến môi trường.",
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  for (const name of DEFAULT_GROUPS) {
    await db.group.upsert({ where: { name }, update: {}, create: { name } });
  }

  for (const name of DEFAULT_TAGS) {
    await db.tag.upsert({ where: { name }, update: {}, create: { name } });
  }

  for (const name of DEFAULT_HELP_TOPICS) {
    await db.helpTopic.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Seed hoàn tất.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
