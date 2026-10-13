# Сайт Code&Rose

Одностраничный сайт на Astro, русская (`/`) и английская (`/en/`) версии.

## Где что лежит

- `src/i18n/ru.ts`, `src/i18n/en.ts` — все тексты сайта.
- `src/config.ts` — контакты (WhatsApp, Telegram, Instagram, телефон, почта) и домен. Кнопка контакта появляется на сайте, когда её поле заполнено.
- `src/assets/` — картинки. Astro сам сжимает их под размер экрана.
- `src/components/Site.astro` — разметка страницы.
- `src/styles/global.css` — оформление, в конце блок для телефонов и планшетов.
- `src/scripts/motion.ts` — анимации (GSAP).

## Команды

```bash
npm run dev
```

Локальный просмотр на http://localhost:4321.

```bash
npm run deploy:preview
```

Сборка и выкладка пробной версии на https://shrb2704-del.github.io/code-rose-site/. В пробной версии стоит запрет на индексацию поисковиками.

## Переезд на свой домен

Вписать домен в `url` в `src/config.ts`, собрать командой `npm run build` без переменных `BASE_PATH` и `PUBLIC_NOINDEX` и выложить папку `dist` на хостинг.
