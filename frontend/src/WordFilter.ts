import Filter from "bad-words";

export const filter = new Filter();

const badRomanianWords = ["cur", "muie", "gaoaza", "pisat", "pizda", "coaie"];

filter.addWords(...badRomanianWords);
