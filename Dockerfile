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

# Копируем SSL сертификат и ключ внутрь контейнера
COPY ssl-cert.crt /etc/nginx/ssl-cert.crt
COPY ssl-cert.key /etc/nginx/ssl-cert.key

# Настройка Nginx для использования SSL
RUN sed -i 's/#include \/etc\/nginx\/conf.d\/default.conf;/include \/etc\/nginx\/conf.d\/default.conf;/g' /etc/nginx/nginx.conf
RUN echo "server {" >> /etc/nginx/conf.d/default.conf
RUN echo "    listen 443 ssl;" >> /etc/nginx/conf.d/default.conf
RUN echo "    ssl_certificate /etc/nginx/ssl-cert.crt;" >> /etc/nginx/conf.d/default.conf
RUN echo "    ssl_certificate_key /etc/nginx/ssl-cert.key;" >> /etc/nginx/conf.d/default.conf
RUN echo "    server_name _;" >> /etc/nginx/conf.d/default.conf
RUN echo "    location / {" >> /etc/nginx/conf.d/default.conf
RUN echo "        root /usr/share/nginx/html;" >> /etc/nginx/conf.d/default.conf
RUN echo "        index index.html index.htm;" >> /etc/nginx/conf.d/default.conf
RUN echo "        try_files \$uri \$uri/ /index.html;" >> /etc/nginx/conf.d/default.conf
RUN echo "    }" >> /etc/nginx/conf.d/default.conf
RUN echo "}" >> /etc/nginx/conf.d/default.conf

# Экспонируем порт 443, на котором будет доступно приложение
EXPOSE 443

# Команда для запуска Nginx
CMD ["nginx", "-g", "daemon off;"]
