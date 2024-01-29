import { faker } from "@faker-js/faker";

const sampleUsers: { username: string }[] = [];

for (let index = 0; index < 20; index++) {
  sampleUsers.push({ username: faker.person.fullName() });
}

type SampleChatHistory = {
  author: string;
  sentOn: Date;
  messages: string[];
};

const sampleChatHistory: SampleChatHistory[] = sampleUsers.map((u) => ({
  author: u.username,
  sentOn: faker.date.recent(),
  messages: [],
}));

for (const chat of sampleChatHistory) {
  for (let i = 0; i < 20; i++) {
    chat.messages.push(
      Math.random() > 0.3
        ? faker.lorem.sentence({ min: 1, max: 12 })
        : faker.lorem.sentences()
    );
  }
}

console.log(JSON.stringify(sampleChatHistory));
console.log("******************************");
console.log(JSON.stringify(sampleUsers));

export { sampleUsers, sampleChatHistory };
