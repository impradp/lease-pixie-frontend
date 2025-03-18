import { PropertyUser } from "@/types/PropertyUser";

const samplePropertyUser: PropertyUser[] = [
  {
    id: "user1",
    name: "Jane Doe",
    email: "Janedoe@gmail.com",
    phone: "908.123.1234 (SMS On)",
    accessLevels: [
      {
        id: "access1",
        propertyId: "24TY",
        subLevels: [
          {
            id: "sub1-1",
            accessAvailable: ["M", "P"],
          },
          {
            id: "sub1-2",
            accessAvailable: ["L", "A"],
          },
          {
            id: "sub1-3",
            accessAvailable: ["P", "L"],
          },
        ],
      },
      {
        id: "access2",
        propertyId: "23KL",
        subLevels: [
          {
            id: "sub2-1",
            accessAvailable: ["M", "P"],
          },
          {
            id: "sub2-2",
            accessAvailable: ["L", "A"],
          },
          {
            id: "sub2-3",
            accessAvailable: ["P"],
          },
        ],
      },
    ],
  },
];

export { samplePropertyUser };
