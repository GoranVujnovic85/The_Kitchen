# 📚 Project: The_Kitchen

## 👤 About the Author: Hello! I'm Goran Vujnović, a passionate junior software developer specializing in backend development, databases, and API design.If you have any questions or suggestions, feel free to contact me at goranvujnovic85@gmail.com.


## 📖 Description : This is an amazing backend project for a home kitchen that uses a RESTful API and a MySQL database. The plan is to separate the frontend and backend. The backend   will listen on one port, while the frontend will listen on another port on the server side. The frontend will be handled by an external company, while the backend will be managed by Goran.


## 🚧 Project status
- Current status: Project completed!📜


## 🛠️ Technologies 
- VS Code 💻
- JavaScript ⚡
- Sequelize 🔌
- Node.js 🌐
- Express.js 🚀
- MySQL 🗄️
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

-  The_Kitchen/
-  |-- config/
-  |   |-- database.js                              // Sequelize database configuration
-  |   |-- config.js                                // Sequelize configuration file to manage database connections across environments
-  |-- controllers/
-  |   |-- dailyMenuController.js                   // CRUD operations for DailyMenu
-  |   |-- dishController.js                        // CRUD operations for Dish
-  |   |-- orderController.js                       // CRUD operations for Order
-  |   |-- orderItemController.js                   // CRUD operations for OrderItem
-  |   |-- paymentController.js                     // CRUD operations for Payment
-  |   |-- contactMessageController.js              // CRUD operations for ContactMessage
-  |   |-- feedbackController.js                    // CRUD operations for Feedback
-  |-- migrations/
-  |   |-- 20230123000000-create-user.js            // Migration for User table
-  |   |-- 20230123000100-create-dailyMenu.js       // Migration for DailyMenu table
-  |   |-- 20230123000200-create-dish.js            // Migration for Dish table
-  |   |-- 20230123000300-create-order.js           // Migration for Order table
-  |   |-- 20230123000400-create-orderItem.js       // Migration for OrderItem table
-  |   |-- 20230123000500-create-payment.js         // Migration for Payment table
-  |   |-- 20230123000600-create-contactMessage.js  // Migration for ContactMessage table
-  |   |-- userController.js                        // CRUD operations for User
-  |   |-- 20230123000700-create-feedback.js        // Migration for Feedback table
-  |   |-- 20250201062800-create-dailyMenuDishes.js // Pivot table for DailyMenus and Dishes
-  |-- models/
-  |   |-- index.js                                 // Sequelize initialization and associations
-  |   |-- User.js                                  // User model definition
-  |   |-- DailyMenu.js                             // DailyMenu model definition
-  |   |-- Dish.js                                  // Dish model definition
-  |   |-- Order.js                                 // Order model definition
-  |   |-- OrderItem.js                             // OrderItem model definition
-  |   |-- Payment.js                               // Payment model definition
-  |   |-- ContactMessage.js                        // ContactMessage model definition
-  |   |-- Feedback.js                              // Feedback model definition
-  |-- routes/
-  |   |-- userRoutes.js                            // API routes for User
-  |   |-- dailyMenuRoutes.js                       // API routes for DailyMenu
-  |   |-- dishRoutes.js                            // API routes for Dish
-  |   |-- orderRoutes.js                           // API routes for Order
-  |   |-- orderItemRoutes.js                       // API routes for OrderItem
-  |   |-- paymentRoutes.js                         // API routes for Payment
-  |   |-- contactMessageRoutes.js                  // API routes for ContactMessage
-  |   |-- feedbackRoutes.js                        // API routes for Feedback
-  |-- seeders/
-  |   |-- mockData.json                            // JSON file with initial mock data
-  |   |-- seedDatabase.js                          // Script to seed database using mockData.json
-  |-- middlewares/
-  |   |-- authMiddleware.js                        // Authentication and authorization middleware
-  |-- utils/
-  |   |-- responseHandler.js                       // Utility for standardizing API responses
-  |-- uploads/                                     // Folder for storing dish and order images
-  |-- .env                                         // Environment variables
-  |-- .gitignore                                   // Files and folders to ignore in Git
-  |-- package.json                                 // Node.js dependencies and scripts
-  |-- package-lock.json                            // Dependency lock file
-  |-- server.js                                    // Main server file, initializes Express app


## 🏁 The first steps of the project
⚠️ **Warning:** ❗ These steps are the creator's little reminder. It will be very unreasonable for those who have not passed this project. ❗

-  ✅ Create a repository with the project name on github
-  ✅ On your local machine, open git bash
-  ✅ Enter the command: git clone  https://github.com/xxxxxxx/xxxxxxxx.git
-  ✅ Open VS code, FILE -> Open your folder with project
-  ✅ In VS code open Source Control (CTRL + SHIFT + G) and you will see your repository
-  ✅ Follow the instructions from ## Platforms: ⚙️🔧🔨
-  ✅ npx sequelize-cli init
-  ✅ Create models with migrations:
-    📌 npx sequelize-cli model:generate --name User --attributes username:string,email:string,password:string,role:string
-    📌 npx sequelize-cli model:generate --name DailyMenu --attributes date:date
-    📌npx sequelize-cli model:generate --name Dish --attributes name:string,description:string,price:float,image:string
-    📌 npx sequelize-cli model:generate --name Order --attributes userId:integer,date:date,status:string,totalPrice:float
-    📌 npx sequelize-cli model:generate --name OrderItem --attributes orderId:integer,dishId:integer,quantity:integer,price:float
-    📌 npx sequelize-cli model:generate --name Payment --attributes orderId:integer,method:string,status:string,paymentDate:date
-    📌 npx sequelize-cli model:generate --name ContactMessage --attributes name:string,email:string,subject:string,message:text,status:string
-    📌 npx sequelize-cli model:generate --name Feedback --attributes userId:integer,dishId:integer,rating:integer,comment:text
-  ✅ Test connection copy -> node -e "require('./models').sequelize.authenticate().then(() => console.log('Database connected')).catch(err => console.error('Connection failed', err));"
-  ✅ npx sequelize-cli db:migrate
-  ✅ npx sequelize migration:generate --name create-dailyMenuDishes 
-  ✅ npx sequelize db:migrate:undo:all
-  ✅ npx sequelize-cli db:migrate
-  ✅ Controller implementation
-  ✅ Rutes implementation
-  ✅ server.js implementation
-  ✅ Starts server
-    👉 node server.js
-  ✅ Seeders implementation
-    👉 npx sequelize-cli db:seed:all
-    👉 npx sequelize-cli db:seed:undo
-  ✅ npm install multer   
-  ✅ create uploads file  
-  ✅ create utils/responseHandler.js
-  ✅ npx nodemon server.js
-  ✅ Role-based access control (RBAC)
-  ✅ The order of seeding is very important

## 🏁 Adding unique restriction 
- 📌 I add unique: true to the Dish model
- 📌 npx sequelize-cli migration:generate --name add-unique-constraint-to-dish-name
- 📌 Update the newly created file --> in migration folder
- 📌 Check if there are duplicates in the mysql database  --> if they exist, you should delete them
-  👉 steps to check for duplicates : 
-       ➡️  SHOW DATABASES;
-       ➡️  USE the_kitchen;
-       ➡️  SELECT name, COUNT(*) as count
-       ➡️  FROM dishes
-       ➡️  GROUP BY name
-       ➡️  HAVING count > 1;
- npx sequelize-cli db:migrate
- 📌 I add unique: true to the email in User model
- 📌 npx sequelize-cli migration:generate --name add-unique-constraint-to-user-email
- 📌 Check if there are duplicates in the mysql database  --> if they exist, you should delete them
-  👉 steps to check for duplicates : 
-       ➡️  SHOW DATABASES;
-       ➡️  USE the_kitchen;
-       ➡️  SELECT email, COUNT(*) as count
-       ➡️  FROM Users
-       ➡️  GROUP BY email
-       ➡️  HAVING count > 1;
-       +-------------------------+-------+
-       | email                   | count |
-       +-------------------------+-------+
-       | goranvujnovic@gmail.com |     7 |
-       +-------------------------+-------+
- 📌 SELECT * FROM Users WHERE email = 'goranvujnovic@gmail.com';  --> I want to check if they have different user name, roles...
-     
-     mysql> SELECT * FROM Users WHERE email = 'goranvujnovic@gmail.com';
-     +----+----------+-------------------------+--------------------------------------------------------------+------+---------------------+---------------------+
-     | id | username | email                   | password                                                     | role | createdAt           | updatedAt           |
-     +----+----------+-------------------------+--------------------------------------------------------------+------+---------------------+---------------------+
-     |  4 | goran    | goranvujnovic@gmail.com | $2b$10$n2zNi7LNwGyKLYG2Eb5LH.yEJNNI2//XwfLvjrwpqjgSTAHul4HVa | user | 2025-03-10 12:39:59 | 2025-03-10 12:39:59 |
-     |  5 | goran    | goranvujnovic@gmail.com | $2b$10$kPctf.GBccKKeVZJYUlSb.eKdJpOW3MBDeftFvlFVcX9okB7CDc12 | user | 2025-03-10 12:40:13 | 2025-03-10 12:40:13 |
-     |  6 | goran    | goranvujnovic@gmail.com | $2b$10$D9mbX4G/GqgZH1EoUi3A.uillTaKhcuw4c26gLF2l3NUSTrq9.l4W | user | 2025-03-10 12:40:24 | 2025-03-10 12:40:24 |
-     |  8 | goran    | goranvujnovic@gmail.com | $2b$10$yN6agjk8kUQpp7mzMNH6O.P84tZ/gtFAUV7K.xfJejlhJLmcjLT8q | user | 2025-03-11 10:10:07 | 2025-03-11 10:10:07 |
-     |  9 | goran    | goranvujnovic@gmail.com | $2b$10$RZk2d/1r19ZAzsY5E6teoeWMrW557ywWIPKBYWpFU5eL2.ckSxxui | user | 2025-03-11 10:10:13 | 2025-03-11 10:10:13 |
-     | 10 | goran    | goranvujnovic@gmail.com | $2b$10$d6UvRMTkhPP6c.BaI7FGEOPl44U8vfWqC7Qj4/sAcAV0aYPFvP0pu | user | 2025-03-11 10:10:15 | 2025-03-11 10:10:15 |
-     | 11 | goran    | goranvujnovic@gmail.com | $2b$10$GQl/aq.Pt9Nu9C6W6LjBFesZFO6zGYaW0lw9UcIhr3vTXsz.7O162 | user | 2025-03-11 10:10:16 | 2025-03-11 10:10:16 |
-     +----+----------+-------------------------+--------------------------------------------------------------+------+---------------------+---------------------+
-     7 rows in set (0.00 sec)
-
- 📌 SELECT id, username, email FROM Users WHERE email = 'goranvujnovic@gmail.com';
-     
-     +----+----------+-------------------------+
-     | id | username | email                   |
-     +----+----------+-------------------------+
-     |  4 | goran    | goranvujnovic@gmail.com |
-     |  5 | goran    | goranvujnovic@gmail.com |
-     |  6 | goran    | goranvujnovic@gmail.com |
-     |  8 | goran    | goranvujnovic@gmail.com |
-     |  9 | goran    | goranvujnovic@gmail.com |
-     | 10 | goran    | goranvujnovic@gmail.com |
-     | 11 | goran    | goranvujnovic@gmail.com |
-     +----+----------+-------------------------+
-     7 rows in set (0.00 sec)
- 
- 📌 DELETE FROM Users WHERE email = 'goranvujnovic@gmail.com' AND id != 1;
- 📌 SELECT email, COUNT(*) as count FROM Users GROUP BY email HAVING count > 1;
- 📌 npx sequelize-cli db:migrate
- 📌 

## 🏁 Adding  lastlogin

- 📌 add lastLogin in user Model
- 📌 npx sequelize-cli migration:generate --name add-last-login-to-users 
- 📌 Update the newly created file --> in migration folder
- 📌 npx sequelize-cli db:migrate
- 📌
- 📌

## ✨ Conclusion
- I hope you find my projects to be educative and fun. If you encounter errors or have any improvements to make to the projects, don't be shy, go ahead and create a pull request.     -  🎉 Happy coding 🎉