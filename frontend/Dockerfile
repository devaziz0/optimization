FROM node:13.8-alpine3.11

WORKDIR /app

COPY ./frontend/package.json package.json
COPY ./frontend/package-lock.json package-lock.json

EXPOSE 3000
CMD ["npm", "start"]
