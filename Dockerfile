#===========================
# Fishsticks Docker Image Config
#===========================
FROM node:24-alpine AS build

WORKDIR /Fishsticks
COPY package*.json ./
RUN apk --update add --no-cache python3 make g++
RUN npm ci --omit=dev

#===========================
# Runtime
#===========================
FROM node:24-alpine
LABEL   authors="SkyeRangerDelta" \
        version="latest" \
        description="CCG Official Discord Bot" \
        vendor="Planetary Dynamics" \
        org.opencontainers.image.source="https://github.com/SkyeRangerDelta/Fishsticks" \
        org.opencontainers.image.description="The Official CCG Discord Bot"

WORKDIR /Fishsticks

# Copy production dependencies from build stage
COPY --from=build /Fishsticks/node_modules ./node_modules
COPY . .

# Non-root user
RUN addgroup -S fishsticks && adduser -S fishsticks -G fishsticks \
    && chown -R fishsticks:fishsticks /Fishsticks
USER fishsticks

CMD ["npm", "run", "start"]
