# Setup Instructions

To set up this project locally:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd talavera-stock-trading-app
   ```

2. Set up the environment:
   - Install global dependencies:
     ```bash
     npm install -g vite nodemon
     ```
   
   - Install backend dependencies:
     ```bash
     cd backend
     npm install
     ```
   
   - Install frontend dependencies:
     ```bash
     cd frontend
     npm install
     ```

3. Run the application:
   - Development mode (separate terminals):
     ```bash
     # Terminal 1: Backend
     cd backend
     npm run dev
     
     # Terminal 2: Frontend
     cd frontend
     npm run dev
     ```
   
   - Production mode (Docker):
     ```bash
     docker-compose up --build
     ```

4. Access the application:
   - Development: http://localhost:5173 (frontend), http://localhost:3000 (backend)
   - Production: http://localhost

## Troubleshooting

### Command not found errors
- For "vite: command not found": `npm install -g vite`
- For "nodemon: command not found": `npm install -g nodemon`

### Build issues
- If the frontend build fails with "Could not resolve './api'", make sure the api.js file exists in the frontend/src directory.

### Docker issues
- Ensure Docker and Docker Compose are installed
- Check the NGINX configuration if you encounter routing problems 