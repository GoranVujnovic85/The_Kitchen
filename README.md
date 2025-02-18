# 📚 Project: The_Kitchen


## 📖 Description: This is an amazing backend project for a home kitchen that uses a RESTful API and a MySQL database. The plan is to separate the frontend and backend. The backend will listen on one port, while the frontend will listen on another port on the server side. The frontend will be handled by an external company, while the backend will be managed by GOLDEN BOYS. The project has been added to Docker and is running in a Docker container.


## 🚧 Project status
- Current status: Project completed!📜


## 🛠️ Technologies 
- VS Code 💻
- JavaScript ⚡
- Sequelize 🔌
- Node.js 🌐
- Express.js 🚀
- MySQL 🗄️
- Docker 🐳
- Thunder Client/Postman 🌩️


## 📜 License
- MIT License ⚖️


## 🤝 Contributes
- They are welcome! 🙌


## Platforms: ⚙️🔧🔨

- `npm init -y`  
  *Initializes a new Node.js project and creates a `package.json` file with default values.*

- `npm install express sequelize mysql2 dotenv`  
  - **express**: A web framework for Node.js, used to create RESTful APIs.  
  - **sequelize**: An ORM (Object-Relational Mapping) tool for working with databases, enabling interaction with MySQL using JavaScript.  
  - **mysql2**: A MySQL driver for Node.js, providing fast and efficient connection to MySQL databases.  
  - **dotenv**: Loads environment variables from a `.env` file for managing sensitive configurations like API keys and connection strings.

- `npm install stripe nodemailer`  
  - **stripe**: A library for integrating Stripe API for payment processing.  
  - **nodemailer**: A tool for sending emails from your application.

- `npm install jsonwebtoken bcrypt`  
  - **jsonwebtoken**: Used to create and verify JSON Web Tokens (JWT) for authentication.  
  - **bcrypt**: A library for hashing passwords to enhance security.

- `npm install express-validator`  
  *A middleware for validating and sanitizing input data in Express applications.*

- `npm install --save-dev nodemon`  
  *A tool for automatically restarting the server when file changes are detected (used during development).*

- `npm install morgan cors`  
  - **morgan**: A middleware for logging HTTP requests, useful for debugging and tracking activity.  
  - **cors**: A middleware to configure Cross-Origin Resource Sharing (CORS), allowing APIs to handle requests from different origins.


## 📂 Project Structure

-The_Kitchen/
-|-- node_modules/
-|-- config/
-|   |-- database.js                              // Sequelize database configuration
-|   |-- config.js                                // Sequelize configuration file to manage database connections across environments
-|-- controllers/
-|   |-- userController.js                        // CRUD operations for User
-|   |-- dailyMenuController.js                   // CRUD operations for DailyMenu
-|   |-- dishController.js                        // CRUD operations for Dish
-|   |-- orderController.js                       // CRUD operations for Order
-|   |-- orderItemController.js                   // CRUD operations for OrderItem
-|   |-- paymentController.js                     // CRUD operations for Payment
-|   |-- contactMessageController.js              // CRUD operations for ContactMessage
-|   |-- feedbackController.js                    // CRUD operations for Feedback
-|-- migrations/
-|   |-- 20230123000000-create-user.js            // Migration for User table
-|   |-- 20230123000100-create-dailyMenu.js       // Migration for DailyMenu table
-|   |-- 20230123000200-create-dish.js            // Migration for Dish table
-|   |-- 20230123000300-create-order.js           // Migration for Order table
-|   |-- 20230123000400-create-orderItem.js       // Migration for OrderItem table
-|   |-- 20230123000500-create-payment.js         // Migration for Payment table
-|   |-- 20230123000600-create-contactMessage.js  // Migration for ContactMessage table
-|   |-- 20230123000700-create-feedback.js        // Migration for Feedback table
-|   |-- 20250201062800-create-dailyMenuDishes.js // Pivot table for DailyMenus and Dishes
-|-- models/
-|   |-- index.js                                 // Sequelize initialization and associations
-|   |-- User.js                                  // User model definition
-|   |-- DailyMenu.js                             // DailyMenu model definition
-|   |-- Dish.js                                  // Dish model definition
-|   |-- Order.js                                 // Order model definition
-|   |-- OrderItem.js                             // OrderItem model definition
-|   |-- Payment.js                               // Payment model definition
-|   |-- ContactMessage.js                        // ContactMessage model definition
-|   |-- Feedback.js                              // Feedback model definition
-|-- routes/
-|   |-- userRoutes.js                            // API routes for User
-|   |-- dailyMenuRoutes.js                       // API routes for DailyMenu
-|   |-- dishRoutes.js                            // API routes for Dish
-|   |-- orderRoutes.js                           // API routes for Order
-|   |-- orderItemRoutes.js                       // API routes for OrderItem
-|   |-- paymentRoutes.js                         // API routes for Payment
-|   |-- contactMessageRoutes.js                  // API routes for ContactMessage
-|   |-- feedbackRoutes.js                        // API routes for Feedback
-|-- seeders/
-|   |-- mockData.json                            // JSON file with initial mock data
-|   |-- seedDatabase.js                          // Script to seed database using mockData.json
-|-- middlewares/
-|   |-- authMiddleware.js                        // Authentication and authorization middleware
-|-- utils/
-|   |-- responseHandler.js                       // Utility for standardizing API responses
-|-- uploads/                                     // Folder for storing dish and order images
-|-- .env                                         // Environment variables
-|-- .gitignore                                   // Files and folders to ignore in Git
-|-- Dockerfile                                   // Dockerfile for building the Node.js application
-|-- docker-compose.yml                           // Docker Compose configuration for multi-container setup
-|-- package.json                                 // Node.js dependencies and scripts
-|-- package-lock.json                            // Dependency lock file
-|-- server.js                                    // Main server file, initializes Express app


## 🏁 The first steps of the project
⚠️ **Warning:** ❗ These steps are the creator's little reminder. It will be very unreasonable for those who have not passed this project. ❗

-💡 Create a repository with the project name on github
-💡 On your local machine, open git bash
-💡 Enter the command: git clone  https://github.com/xxxxxxx/xxxxxxxx.git
-💡 Open VS code, FILE -> Open your folder with project
-💡 In VS code open Source Control (CTRL + SHIFT + G) and you will see your repository
-💡 Follow the instructions from ## Platforms: ⚙️🔧🔨
-💡 npx sequelize-cli init
-💡 Create models with migrations:
-  ❗ npx sequelize-cli model:generate --name User --attributes username:string,email:string,password:string,role:string
-  ❗ npx sequelize-cli model:generate --name DailyMenu --attributes date:date
-  ❗ npx sequelize-cli model:generate --name Dish --attributes name:string,description:string,price:float,image:string
-  ❗ npx sequelize-cli model:generate --name Order --attributes userId:integer,date:date,status:string,totalPrice:float
-  ❗ npx sequelize-cli model:generate --name OrderItem --attributes orderId:integer,dishId:integer,quantity:integer,price:float
-  ❗ npx sequelize-cli model:generate --name Payment --attributes orderId:integer,method:string,status:string,paymentDate:date
-  ❗ npx sequelize-cli model:generate --name ContactMessage --attributes name:string,email:string,subject:string,message:text,status:string
-  ❗ npx sequelize-cli model:generate --name Feedback --attributes userId:integer,dishId:integer,rating:integer,comment:text
-💡 Test connection: copy -> node -e "require('./models').sequelize.authenticate().then(() => console.log('Database connected')).catch(err => console.error('Connection failed', err));"
-💡 npx sequelize-cli db:migrate
-💡 npx sequelize migration:generate --name create-dailyMenuDishes 
-💡 npx sequelize db:migrate:undo:all
-💡 npx sequelize-cli db:migrate
-💡 Controller implementation
-💡 Rutes implementation
-💡 server.js implementation
-💡 Starts server
-💡  👉 node server.js
-💡 Seeders implementation
-💡  👉 npx sequelize-cli db:seed:all
-💡  👉 npx sequelize-cli db:seed:undo
-💡 npm install multer   
-💡 create uploads file  
-💡 create utils/responseHandler.js
-💡 npx nodemon server.js
-💡 Role-based access control (RBAC)
-💡 The order of seeding is very important
-🌊🌊🌊  🐳  D O C K E R  🐳  🌊🌊🌊
-  💨 docker info
-  💨 docker-machine start default
-  💨 eval $(docker-machine env default)  --> set environment variables that allow you to communicate with the Docker machine called "default"
-  💨 docker-compose up --build
-  💨 docker-compose up -d
-  💨 docker-compose down
-  💨 docker stop docker-project-db-container  --> stop the existing container
-  💨 docker rm docker-project-db-container   ---> delete the existing container
-  💨 docker-compose down && docker-compose up -d  ---> reset mysql and backend
-  💨 docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' docker-project-db-container  ---> The IP address may change when you restart the containers
-  💨 docker ps
-  💨 docker exec -it docker-project-backend-container bash  ----> with this command you enter the docker container ----> inside the docker container you start migrations
-  💨 docker exec -it docker-project-db-container mysql -u root -p
-  💨 docker-compose exec docker-project-db mysql -u root -proot -e "SHOW TABLES;" the_kitchen
-  💨 docker-compose exec docker-project-db mysql -u root -proot -e "SELECT * FROM Orders;" the_kitchen
-  💨 SHOW DATABASES;
-  💨 USE the_kitchen;
-  💨 SHOW TABLES;
-  💨  exit
-🌊🌊🌊  📦 📦 📦 📦 📦 📦  🌊🌊🌊


-✨ Conclusion
-I hope you find my projects to be educative and fun. If you encounter errors or have any improvements to make to the projects, don't be shy, go ahead and create a pull request. Happy -coding ✨