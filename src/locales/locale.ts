import en from "./en";
import { Locale, Messages } from "./index";

const messages: Record<Locale, Messages> = {
  en,
};

export const getMessages = (locale: Locale): Messages =>
  messages[locale] || messages.en;
