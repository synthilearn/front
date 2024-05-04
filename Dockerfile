FROM node:21-alpine3.18 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:prod

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/build /etc/nginx/html

COPY /synthilearn/fullchain.pem /etc/nginx/ssl-cert.crt
COPY /synthilearn/privkey.pem /etc/nginx/ssl-cert.key

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
