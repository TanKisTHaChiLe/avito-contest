# Mogeo Project

<div align="center">

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![MobX](https://img.shields.io/badge/MobX-State%20Management-FF9955?logo=mobx)
![Chakra UI](https://img.shields.io/badge/Chakra%20UI-Component%20Library-319795?logo=chakraui)
![Docker](https://img.shields.io/badge/Docker-Containers-2496ED?logo=docker)

</div>

Современное веб-приложение, построенное на стеке React/TypeScript, для модерации объявлений.

## Технологии

- **Фронтенд:** React 18, TypeScript
- **Маршрутизация:** React Router
- **Управление состоянием:** MobX
- **HTTP-клиент:** Axios
- **UI-библиотека:** Chakra UI
- **Тестирование:** Jest
- **Сборка:** Vite

## Быстрый старт

### Запуск с помощью Docker (Рекомендуется)

Это самый простой способ запустить проект.

1.  **Клонируйте репозиторий:**
    ```bash
    git clone https://github.com/TanKisTHaChiLe/avito-contest.git
    cd avito-contest
    ```

2.  **Настройте переменные окружения:**
    *   В корне проекта создайте файл `.env` и скопируйте в него содержимое из `.env.example`:
        ```bash
        cp .env.example .env
        ```
    *   В директории `frontend/` создайте файл `.env` и скопируйте в него содержимое из `frontend/.env.example`:
        ```bash
        cd frontend
        cp .env.example .env
        cd ..
        ```
    *   При необходимости отредактируйте значения в созданных `.env` файлах.

3.  **Запустите приложение:**
    ```bash
    docker-compose up
    ```
    Приложение будет доступно по адресу: [**https://localhost:3000**](https://localhost:3000)

### Локальный запуск (для разработки)

Если вы хотите запустить проект без Docker.

1.  **Убедитесь, что у вас установлены Node.js (рекомендуемая версия LTS) и npm.**

2.  **Установите зависимости:**
    ```bash
    cd frontend
    npm install
    ```

3.  **Настройте переменные окружения:**
    *   В директории `frontend/` создайте файл `.env` и скопируйте в него содержимое из `.env.example`.

4.  **Настройте порт (опционально):**
    *   По умолчанию приложение запускается на порту, указанном в Vite. Если вам нужно его изменить, отредактируйте файл `frontend/vite.config.ts` (по умолчанию там указан адрес для docker, в файле указано на что его надо заменить):
    ```typescript
    // vite.config.ts
    export default defineConfig({
      // ... другие настройки
      server: {
        port: 3000, // Измените на нужный вам порт
      },
    });
    ```

5.  **Запустите сервер для разработки:**
    ```bash
    npm run dev
    ```
    Приложение будет доступно по адресу, который указан в терминале (`http://localhost:3000`).

## Тестирование

Проект покрыт unit-тестами с использованием Jest.

- **Что покрыто:**
  - Сторы (MobX)
  - Три основные страницы приложения

- **Запуск тестов:**
  ```bash
  cd frontend
  npm run test
