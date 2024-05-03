#===========================
#LCARS47 Docker Image Config
#===========================
FROM node:20-alpine
LABEL   authors="SkyeRangerDelta" \
        version="latest" \
        description="CCG Official Discord Bot" \
        vendor="Planetary Dynamics" \
        org.opencontainers.image.source="https://github.com/SkyeRangerDelta/Fishsticks" \
        org.opencontainers.image.description="The Official CCG Discord Bot"

#===========================
#Setup environment
#===========================
WORKDIR /Fishsticks
COPY package*.json ./
RUN apk --update add --no-cache python3 make g++
RUN npm ci
COPY . .

#===========================
#Set environment variables
#===========================
#Required
ENV TOKEN=YOUR_DISCORD_BOT_TOKEN
ENV RDS=YOUR_MONGO_DB_CONNECTION_STRING
ENV OPENAI_KEY=YOUR_OPENAI_API_KEY

ENV SSH_HOST_HOLO=YOUR_HOLO_HOST
ENV SSH_PORT_HOLO=YOUR_HOLO_PORT
ENV SSH_USER_HOLO=YOUR_HOLO_USER
ENV SSH_PASS_HOLO=YOUR_HOLO_PASS
ENV SSH_PKEY_HOLO=YOUR_HOLO_PKEY

#===========================
#Post & Run
#===========================

CMD ["npm", "run", "start"]