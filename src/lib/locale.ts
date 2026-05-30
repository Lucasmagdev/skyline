export type Locale = "en" | "pt-BR";

export function detectLocaleFromLanguages(languages: readonly string[]): Locale {
  return languages.some((language) => language.toLowerCase().startsWith("pt")) ? "pt-BR" : "en";
}
