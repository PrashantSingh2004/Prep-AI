# Use official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (only production deps)
RUN npm install --production

# Copy the rest of the server code
COPY . .

# Expose port (Render automatically maps this)
EXPOSE 5000

# Define environment variables placeholder (to be overridden by deployment dashboard)
ENV NODE_ENV=production
ENV PORT=5000

# Specify the command to run the application
CMD ["node", "index.js"]
