// Контакты и общие данные сайта. Пустые значения — ещё не заполнены владельцем.
export const site = {
  name: "Code&Rose",
  url: "", // домен, например https://codeandrose.com — нужен для canonical, hreflang и og:image
  whatsapp: "992113774505", // международный формат без плюса (+992 11 377 4505)
  telegram: "", // имя пользователя без @
  instagram: "codeanrose",
  phone: "", // как показывать и набирать, например +992 90 000 00 00
  email: "",
};

// Онлайн-диагностика: адрес сценария в n8n. enabled = false прячет кнопки (проверить можно по адресу с ?diag).
export const diag = {
  endpoint: "https://n8n.codeandrose.com/webhook/codeandrose-diag",
  enabled: false,
};

export const links = {
  whatsapp: site.whatsapp ? `https://wa.me/${site.whatsapp}` : "",
  telegram: site.telegram ? `https://t.me/${site.telegram}` : "",
  instagram: site.instagram ? `https://www.instagram.com/${site.instagram}/` : "",
  phone: site.phone ? `tel:${site.phone.replace(/[^+\d]/g, "")}` : "",
  email: site.email ? `mailto:${site.email}` : "",
};
