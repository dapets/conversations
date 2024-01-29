import { faker } from "@faker-js/faker";

const sampleUsers: { username: string }[] = [];

for (let index = 0; index < 20; index++) {
  sampleUsers.push({ username: faker.person.fullName() });
}

export { sampleUsers };

export const sampleChatHistory = {
  from: "Benni",
  messages: [
    {
      date: new Date(),
      message: "Hi :)",
    },
    {
      date: new Date(),
      message: "Morning :)",
    },
    {
      date: new Date(),
      message: "Evening :)",
    },
    {
      date: new Date(),
      message: "Night :)",
    },
  ],
};
