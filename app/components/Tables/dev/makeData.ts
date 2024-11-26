import { Moment } from "moment";
import { fakerID_ID as faker } from "@faker-js/faker";

export type User = {
  id: string;
  productName: string;
  stock: number;
  price: number;
  updatedBy: string;
  updatedAt: string | Date | Moment;
  subRow?: SubRows;
};

type SubRows = Omit<User, "subRow">[];

export const fakeData: User[] = [
  {
    id: "9s41rp",
    productName: "Besi Sample",
    stock: 10,
    price: 0,
    updatedAt: "",
    updatedBy: "",
    subRow: [
      {
        id: "abc1",
        productName: "Sub Besi 5cm",
        stock: 5,
        price: 0,
        updatedAt: "",
        updatedBy: ""
      },
      {
        id: "abc2",
        productName: "Sub Besi 10cm",
        stock: 5,
        price: 0,
        updatedAt: "",
        updatedBy: ""
      },
      {
        id: "abc3",
        productName: "Sub Besi 9cm",
        stock: 5,
        price: 0,
        updatedAt: "",
        updatedBy: ""
      }
    ]
  }
];

export type Person = {
  numberOfItem: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
};

export const data: Person[] = Array.from({ length: 50 }).map((_, i) => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  state: faker.location.state(),
  numberOfItem: i + 1
}));

//50 us states array
export const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "Puerto Rico"
];
