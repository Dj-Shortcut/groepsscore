# -------- BUILD STAGE --------
FROM node:20-alpine AS build

WORKDIR /app

# Install ALL deps (incl dev → tsc)
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Compile TypeScript → dist/
RUN npm run build


# -------- RUNTIME STAGE --------
FROM node:20-alpine

WORKDIR /app

# Alleen runtime deps
COPY package*.json ./
RUN npm install --omit=dev

# Neem enkel gecompileerde JS mee
COPY --from=build /app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/server.js"]
