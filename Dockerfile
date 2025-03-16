# Build stage
FROM node:23.7-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy source code and config files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript code
RUN npm run build

# Production stage
FROM node:23.7-slim AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only and wget
RUN apt-get update && apt-get install -y wget && npm i

# Copy built files
COPY --from=builder /app/build ./build

# Copy Prisma schema and migration files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Expose port (assuming default Express port 3001)
EXPOSE 3001

# Generate Prisma client on startup and start the application
# You can add database migrations if needed
CMD ["/bin/sh", "-c", "npx prisma migrate deploy && npm start"]
