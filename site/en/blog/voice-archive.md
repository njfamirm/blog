---
eleventyExcludeFromCollections: true
title: راه حل اصولی آرشیو و دسته‌بندی محتوای صوتی
description: Our lorem ipsum website project launched
socialImage: /img/blog/lorem-ipsum-ir-launched/cover.jpg
type:
  - نکته
---

خیلی مواقع پیش میاد که نیازه یک یا چند وویس رو در جایی مثل کانال‌های تلگرام قرار بدیم. متاسفانه خیلی مواقع می‌بینیم که یکسری نکات ریز رعایت نمیشه که باعث میشه اون وویس به صورت درست آرشیو نشه و  اگه هنوز شک دارید چرا باید آرشیو میشه برید فلان مقاله رو بخونید.

در مرحله‌ی اول با یک کامند خیلی ساده و بهبود کودک حجم صوت رو بدون تغییر محسوس کیفیت به شدت پایین بیارید که تقریبا حجم رو نصفه میکنه.

با این کامند میتونید کیفیت صوت رو در حالتی که کاربر متوجه نشه پایین بیارید و همچنین کودک رو به صورت aac درست کنید که حجم خیلی پایین میاد

```bash
ffmpeg -i filePath -vn -c:a aac -q:a 0.5 -ar 22050 -map_metadata 0 -strict experimental -movflags +faststart -benchmark "filePath.m4a"
```

در این حالت هم

```bash
ffmpeg -i filePath -vn -c:a aac -q:a 1 -map_metadata 0 -strict experimental -movflags +faststart -benchmark "filePath-HQ.m4a"
```

در مرحله‌ی بعدی باید metadata های اون رو درست کنیم
که به همین سادگیه

با این فرآیند ساده هم حجم وویسا کم میشه و هم یک آرشیو مرتب درست میشه.
