---
name: create-visiting-card
description: Describes the procedure for creating a single-file or generated portfolio visiting card (site-vizitka). Use when the user asks how to create a visiting card, portfolio one-pager, or to document or extend the form-plus-generator workflow.
---

# Создание визитки (сайт-визитка)

Процедура двухэтапная: веб-форма ввода данных → генератор HTML с предпросмотром и скачиванием. Отдельно — standalone-версия в одном файле без внешних ссылок и без внешнего изображения аватара.

## Структура файлов проекта

| Файл | Назначение |
|------|------------|
| `form.html` | Шаг 1: форма ввода (имя, должность, описание, «О себе», контакты, загрузка фото). Данные сохраняются в `localStorage`. |
| `generator.html` | Шаг 2: читает данные из `localStorage`, собирает HTML в памяти, показывает превью в iframe, кнопка «Скачать index.html» — скачивание нового файла (существующие файлы не изменяются). |
| `index.html` | Готовая визитка с ссылками (mailto, Telegram, GitHub); аватар из `assets/nighty-portrait.png`. |
| `index-standalone.html` | Визитка в одном файле: контакты только текст (без ссылок), аватар встроен как data URL (base64) — папка `assets` не нужна при распространении. |

## Двухэтапный процесс (форма + генератор)

1. **Форма** — пользователь открывает `form.html`, заполняет поля (имя, псевдоним, должность, краткое описание, три абзаца «О себе», email, Telegram, GitHub), при желании загружает фото (сохраняется как Data URL в `localStorage`).
2. **Переход** — кнопка «Перейти к генератору →» сохраняет данные в `localStorage` и перенаправляет на `generator.html`.
3. **Генератор** — подставляет данные в шаблон, показывает превью; по «Скачать index.html» создаётся Blob и предлагается сохранить новый файл. Исходные файлы на диске не перезаписываются.

Контакты в сгенерированном HTML — ссылки (mailto, t.me, github.com). Если нужна версия без внешних ссылок — генерировать контакты как `<span class="value">` вместо `<a href="...">`.

## Standalone-версия (один файл)

- Контакты: только текст, без `href`.
- Аватар: встроен в HTML как `data:image/jpeg;base64,...` или `data:image/png;base64,...`, чтобы не требовать `assets/nighty-portrait.png`.

### Встраивание аватара в standalone

В `index-standalone.html` в блоке аватара должен быть плейсхолдер `AVATAR_B64_PLACEHOLDER` в атрибуте `src` тега `<img>` (например `src="data:image/png;base64,AVATAR_B64_PLACEHOLDER"`). Заменить плейсхолдер на base64 содержимого изображения.

**PowerShell (одной строкой):**
```powershell
$pngPath = "assets/nighty-portrait.png"; $htmlPath = "index-standalone.html"; $b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($pngPath)); $html = [IO.File]::ReadAllText($htmlPath, [Text.Encoding]::UTF8); $html = $html.Replace('AVATAR_B64_PLACEHOLDER', $b64); [IO.File]::WriteAllText($htmlPath, $html, [Text.Encoding]::UTF8)
```
Выполнять из корня проекта. Если изображение в формате JPEG, в HTML использовать `data:image/jpeg;base64,...`.

**Node.js:** скрипт `embed-standalone-avatar.js` читает `assets/nighty-portrait.png`, кодирует в base64 и заменяет в `index-standalone.html` строку `AVATAR_B64_PLACEHOLDER`. Перед повторным запуском вернуть в HTML плейсхолдер (или скрипт должен перезаписывать только значение base64 при известной разметке).

## Чек-лист создания новой визитки

- [ ] Форма: поля имя, должность, описание, «О себе» (1–3 абзаца), контакты, фото (опционально), инициал для заглушки.
- [ ] Генератор: чтение из `localStorage`, подстановка в шаблон, превью, скачивание одного HTML (аватар при наличии — Data URL).
- [ ] Standalone: копия шаблона без внешних ссылок; аватар — либо SVG с инициалом, либо встроенный base64 (плейсхолдер + скрипт/команда замены).
- [ ] Не изменять существующие файлы при «скачать» — только создавать новый файл для сохранения пользователем.

## Важно

- Генератор не перезаписывает `index.html` или `index-standalone.html` — только отдаёт новый HTML в виде скачивания.
- При большом фото возможна ошибка `QuotaExceededError` в `localStorage` — предложить уменьшить размер изображения или не загружать фото.
- Для единого файла при распространении использовать `index-standalone.html` с уже встроенным аватаром (или SVG-заглушкой).
