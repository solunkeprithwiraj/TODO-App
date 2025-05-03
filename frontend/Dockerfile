FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variables
ENV REACT_APP_API_URL=http://localhost:5000

# Expose port 3000
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "start"]