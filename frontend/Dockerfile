FROM node:20

WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]