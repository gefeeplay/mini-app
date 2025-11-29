# Stage 1: Build the Vue app
FROM node:22 as build-stage

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build


# Stage 2: Production server
FROM node:22-slim as production-stage

WORKDIR /app

RUN npm install -g serve

COPY --from=build-stage /app/dist ./dist

# Создаем non-root пользователя
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]