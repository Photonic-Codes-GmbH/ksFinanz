FROM node:20.11.1

# Angular Frontend Part
WORKDIR /app/frontend

COPY ./frontend .

RUN npm install
RUN npm run build

# Nest Backend Part
WORKDIR /app/backend

COPY ./backend .

RUN npm install
RUN npm run build

CMD npm run typeorm:run-migrations; npm run start:prod
