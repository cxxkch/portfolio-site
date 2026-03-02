# 🎬 Studio Portfolio

Firebase (данные) + Supabase Storage (загрузка файлов).  
Загружай видео и картинки прямо через админку — без ссылок и YouTube.

---

## 📋 Пошаговая инструкция

### 1. Node.js

Скачай: https://nodejs.org (LTS)

---

### 2. Firebase (для данных — отзывы, тексты, контакты)

1. Зайди на https://console.firebase.google.com
2. Создай проект → отключи Analytics → Create
3. Нажми иконку **</>** (веб) → зарегистрируй приложение → **скопируй конфиг**
4. В левом меню → **Firestore Database** → Create database
5. Выбери режим (тестовый или production)
6. Если выбрал production — зайди в **Rules** и вставь:

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

Нажми **Publish**.

---

### 3. Supabase (для загрузки файлов — видео, картинки)

1. Зайди на https://supabase.com → Sign Up (бесплатно)
2. Нажми **New Project** → заполни название и пароль → **Create**
3. Подожди ~2 минуты пока проект создастся

**Скопируй ключи:**
4. В левом меню нажми **Settings** (⚙️) → **API**
5. Скопируй:
   - **Project URL** — это `SUPABASE_URL`
   - **anon public** key — это `SUPABASE_ANON_KEY`

**Создай бакет для файлов:**
6. В левом меню нажми **Storage** (📦)
7. Нажми **New Bucket**
8. Название: `portfolio`
9. Поставь галочку **Public bucket** ← это важно!
10. Нажми **Create bucket**

**Настрой права доступа:**
11. В Storage нажми на бакет `portfolio`
12. Сверху нажми вкладку **Policies**
13. Нажми **New Policy** → **For full customization**
14. Заполни:
    - Policy name: `allow all`
    - Allowed operations: отметь **SELECT, INSERT, UPDATE, DELETE** (все)
    - Target roles: оставь пустым
    - В поле WITH CHECK и USING напиши: `true`
15. Нажми **Review** → **Save policy**

---

### 4. Вставь ключи в проект

Открой `src/App.jsx` и замени:

**Firebase (вверху файла):**
```javascript
const firebaseConfig = {
  apiKey: "свой_ключ",
  authDomain: "свой.firebaseapp.com",
  projectId: "свой_id",
  storageBucket: "свой.appspot.com",
  messagingSenderId: "123456",
  appId: "1:123:web:abc",
};
```

**Supabase (чуть ниже):**
```javascript
const SUPABASE_URL = "https://xxxxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOi...длинный_ключ";
```

---

### 5. Запусти

```bash
cd portfolio-site
npm install
npm run dev
```

Открой http://localhost:5173 — проверь что работает.

---

### 6. GitHub + Vercel

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/ТВОЙ_НИКНЕЙМ/portfolio-site.git
git push -u origin main
```

Потом на vercel.com → Import → Deploy.

Если обновляешь существующий проект:
```bash
git add .
git commit -m "add file uploads"
git push
```

---

## 🔐 Админ-панель

- Кнопка **admin** — в самом низу сайта
- Пароль: `admin123` (сменить в `src/App.jsx` → `ADMIN_PASSWORD`)

**Что можно делать в админке:**
- 📁 Загружать видео и картинки прямо с компьютера
- ✏️ Менять названия, цены, контакты
- 📊 Настраивать графики каналов + загружать превью
- 🗑 Удалять отзывы
- 🎨 Загружать логотип, менять название студии

---

## 💰 Что бесплатно

- **Firebase Spark**: 1 ГБ Firestore, 50K чтений/день
- **Supabase Free**: 1 ГБ Storage, 50 МБ база
- **Vercel Hobby**: безлимитный деплой

Для портфолио этого хватит с запасом.
