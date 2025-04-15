import { ReadOnlyAdminUser } from "@/types/ReadOnlyAdminUser";

const sampleReadOnlyAdminUsers: ReadOnlyAdminUser[] = [
  {
    id: "admin1",
    firstName: "Jane",
    lastName: "Doe",
    email: "anedoe@gmail.com",
    mobileNumber: "908.123.1234 (SMS On)",
    smsActive: true,
  },
  {
    id: "admin2",
    firstName: "John",
    lastName: "Smith",
    email: "johnsmith@email.com",
    mobileNumber: "555.987.6543 (SMS Off)",
    smsActive: false,
  },
];

export { sampleReadOnlyAdminUsers };
