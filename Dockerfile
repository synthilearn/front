# Используем официальный образ Node.js как базовый образ
FROM node:21-alpine3.18 as build

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock, если используется Yarn) в контейнер
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы из текущей директории (включая src, public и прочее) в контейнер
COPY . .

# Собираем приложение
RUN npm run build:prod

# Используем образ Nginx как базовый образ для запуска React-приложения
FROM nginx:alpine

# Копируем собранное приложение из предыдущего образа в директорию, откуда Nginx будет его обслуживать
COPY --from=build /app/build /usr/share/nginx/html

# Экспонируем порт 80, на котором будет доступно приложение
EXPOSE 80

# Команда для запуска Nginx
CMD ["nginx", "-g", "daemon off;"]

