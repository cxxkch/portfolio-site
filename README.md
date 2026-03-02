# 🎬 Studio Portfolio + Firebase

Сайт-портфолио с админ-панелью и облачной базой данных Firebase.  
Все данные (отзывы, работы, контакты) хранятся в облаке и видны всем посетителям.

---

## 📋 Полная пошаговая инструкция

### Шаг 1 — Установи Node.js

Скачай и установи: https://nodejs.org (версия LTS)

Проверь:
```
node -v
npm -v
```

---

### Шаг 2 — Создай Firebase проект (бесплатно)

Это займёт 3-5 минут:

1. Зайди на https://console.firebase.google.com
2. Войди через Google-аккаунт
3. Нажми **«Создать проект»** (Create a project)
4. Введи любое название, например `my-portfolio`
5. Google Analytics можно **отключить** (он не нужен) → нажми **«Создать проект»**
6. Подожди ~30 секунд пока проект создастся

---

### Шаг 3 — Создай веб-приложение в Firebase

1. В консоли Firebase нажми на иконку **</>** (веб) на главной странице проекта
2. Придумай название, например `portfolio-web`
3. Галочку «Firebase Hosting» **не ставь**
4. Нажми **«Зарегистрировать приложение»**
5. Тебе покажут конфиг — **скопируй его!** Он выглядит так:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "my-portfolio-xxxxx.firebaseapp.com",
  projectId: "my-portfolio-xxxxx",
  storageBucket: "my-portfolio-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

6. Нажми **«Перейти к консоли»**

---

### Шаг 4 — Включи базу данных Firestore

1. В левом меню Firebase нажми **Firestore Database**
2. Нажми **«Создать базу данных»** (Create database)
3. Выбери режим — **Тестовый режим** (test mode) → Далее
4. Выбери ближайший регион (например `europe-west1`) → **Включить**

⚠️ **Важно:** Тестовый режим даёт полный доступ на 30 дней. После этого нужно будет настроить правила (напишу ниже).

---

### Шаг 5 — Вставь свой конфиг в проект

1. Распакуй скачанный архив `portfolio-site.zip`
2. Открой файл `src/App.jsx` в любом текстовом редакторе (или VS Code)
3. Найди в самом верху файла блок:

```javascript
const firebaseConfig = {
  apiKey: "ВСТАВЬ_СЮДА",
  authDomain: "ВСТАВЬ_СЮДА",
  ...
};
```

4. **Замени** все `"ВСТАВЬ_СЮДА"` на значения из своего конфига (шаг 3.5)

---

### Шаг 6 — Установи зависимости и проверь

Открой терминал в папке проекта:

```bash
cd portfolio-site
npm install
npm run dev
```

Открой http://localhost:5173 — сайт должен работать!  
Попробуй оставить отзыв, обнови страницу — отзыв должен сохраниться.

---

### Шаг 7 — Залей на GitHub

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/ТВОЙ_НИКНЕЙМ/portfolio-site.git
git push -u origin main
```

---

### Шаг 8 — Деплой на Vercel

1. Зайди на https://vercel.com → войди через GitHub
2. **Add New → Project** → найди `portfolio-site` → **Import**
3. Нажми **Deploy**
4. Через ~1 минуту сайт будет на URL вида `portfolio-site-xxx.vercel.app`

---

## 🔐 Админ-панель

- Кнопка **admin** — в самом низу сайта (почти невидимая)
- Пароль: `admin123`
- Сменить пароль: измени `ADMIN_PASSWORD` в `src/App.jsx`

---

## 🔒 Настрой правила безопасности Firestore

После тестового периода (30 дней) зайди в **Firebase → Firestore → Rules** и замени правила на:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /site/{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

Это даст всем доступ на чтение и запись (для отзывов). Если хочешь чтобы только ты мог редактировать через админку — нужно добавить авторизацию (могу помочь позже).

---

## ❓ FAQ

**Отзывы теперь видны всем?**  
Да! Они хранятся в облаке Firebase и отображаются у всех посетителей.

**Изменения из админки видны всем?**  
Да! Всё сохраняется в Firebase и обновляется в реальном времени.

**Это бесплатно?**  
Да. Бесплатный тариф Firebase (Spark) включает 1 ГБ хранения и 50,000 чтений/день — для портфолио этого более чем достаточно.

**Как обновить сайт после изменений?**  
Просто `git add . && git commit -m "update" && git push` — Vercel автоматически пересоберёт.
