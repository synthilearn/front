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

# Копируем собранное приложение из предыдущего образа в директорию Nginx
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/build /etc/nginx/html

# Копируем SSL сертификат и ключ внутрь контейнера
COPY /synthilearn/fullchain.pem /etc/nginx/ssl-cert.crt
COPY /synthilearn/privkey.pem /etc/nginx/ssl-cert.key

# Настройка Nginx для использования SSL
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Экспонируем порт 80 и 443, на которых будет доступно приложение
EXPOSE 80
EXPOSE 443

# Команда для запуска Nginx
CMD ["nginx", "-g", "daemon off;"]
