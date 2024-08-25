# Step 1: Use an official Node.js image as the base image
FROM node:20.10.0

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 7: Run Prisma migrations (optional, can also be done in docker-compose)
RUN npx prisma migrate
RUN npx prisma generate

RUN npm run build

# Step 8: Expose the port the app runs on
EXPOSE 5000

# Step 9: Define the command to run the application
CMD ["npm", "run", "start:dev"]
