import { User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { hash, genSalt } from 'bcrypt';

const prisma = new PrismaClient();

const user: User = {
  id: '233cb533-61c4-4e88-8267-2fccd39fda21',
  displayName: 'Test User',
  handle: 'testuser',
  password: 'test',
  refreshToken: null,
};

const categories = [
  'Abdominals',
  'Back',
  'Biceps',
  'Calves',
  'Chest',
  'Core',
  'Glutes',
  'Hamstrings',
  'Lats',
  'Quads',
  'Shoulders',
  'Traps',
  'Triceps',
];

const main = async () => {
  console.log('Started Seeding...');
  if (user.password) {
    const salt = await genSalt();
    user.password = await hash(user.password, salt);
  }

  await prisma.user.create({
    data: user,
  });

  categories.forEach(async (category) => {
    await prisma.workoutCategory.create({ data: { displayName: category } });
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
