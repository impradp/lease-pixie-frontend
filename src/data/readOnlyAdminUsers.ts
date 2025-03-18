import { ReadOnlyAdminUser } from "@/types/ReadOnlyAdminUser";

const sampleReadOnlyAdminUsers: ReadOnlyAdminUser[] = [
  {
    id: "admin1",
    name: "Jane Doe",
    email: "anedoe@gmail.com",
    phone: "908.123.1234 (SMS On)",
  },
  {
    id: "admin2",
    name: "John Smith",
    email: "johnsmith@email.com",
    phone: "555.987.6543 (SMS Off)",
  },
];

export { sampleReadOnlyAdminUsers };
