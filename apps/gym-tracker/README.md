# Зал Трекер (Gym Tracker MVP)

Русскоязычный трекер тренировок на **Expo + TypeScript**. Локальное хранение, голосовой и текстовый ввод, история по упражнениям, отчёт прогресса (рост / плато / регрессия).

## Запуск

```bash
cd apps/gym-tracker
npm install
npx expo start
```

- Web-превью: нажмите `w` или `npx expo start --web`
- iPhone без Mac: отсканируйте QR в приложении **Expo Go** (модули вроде `expo-speech-recognition` требуют **development build**, см. ниже)

## Что умеет MVP

- Запись подхода: упражнение, вес, подходы/повторы, заметки
- Голос (RU) + разбор фраз вроде «жим лёжа 80 килограмм на 8», поля можно поправить
- История с фильтром по упражнению
- Прогресс: графики веса и объёма, метки плато/регрессии/роста
- Данные в AsyncStorage, без логина; демо-семена русских упражнений

## Путь в App Store (EAS, без локального Mac)

1. Аккаунт Expo + Apple Developer
2. В каталоге приложения:

```bash
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform ios --profile production
npx eas-cli@latest submit --platform ios --profile production
```

3. Для микрофона/диктовки на устройстве соберите **development** или **production** build (не чистый Expo Go), т.к. нужен нативный модуль речи.
4. Замените `extra.eas.projectId` в `app.json` и поля submit в `eas.json`.

## Структура

- `src/app` — экраны (Expo Router)
- `src/lib/parser.ts` — разбор русских голосовых/текстовых фраз
- `src/lib/storage.ts` — AsyncStorage
- `src/lib/progress.ts` — тренды
