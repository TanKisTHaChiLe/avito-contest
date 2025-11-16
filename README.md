## Запуск приложения

> Для запуска приложения достаточно в основной директории проекта запустить команду:

copy
```
copy .env.example .env
copy frontend/.env.example frontend/.env
docker-compose up
```
### Сайт будет доступен на https://localhost:3000

> [!NOTE]
> Локальный запуск так же возможен. Для этого нужно изменить строчку порта в папке frontend, в конфигурационном файле - vite.config.ts
>
