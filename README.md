# 📚 Project: The_Kitchen


## 📖 Description : This is an amazing backend project for a home kitchen that uses a RESTful API and a MySQL database. The plan is to separate the frontend and backend. The backend   will listen on one port, while the frontend will listen on another port on the server side. The frontend will be handled by an external company, while the backend will be managed by GOLDEN BOYS.


## 🚧 Project status
- Current status: In development!📜


## 🛠️ Technologies 
- VS Code 💻
- JavaScript ⚡
- Sequelize 🔌
- Node.js 🌐
- Express.js 🚀
- MySQL 🗄️
- Thunder Client/Postman 🌩️


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


## 📜 License
- license free ⚖️


## 🤝 Contributes
- They are welcome! 🙌


## 📺 Display
- POST /:       http://localhost: 👁️ 
- GET  /:       http://localhost: 🔍
- GET  /:       http://localhost: 👁️ 
- PUT  /:       http://localhost: 🔍
- DELETE /:     http://localhost: 👁️ 


## 📝 Input Template ✏️✏️✏️

     

## 📂 Project Structure

SUC_A_NICE_A_DAY/
|-- node_modules/             // Node.js modules (auto-generated)
|-- config/
|   |-- database.js           // Sequelize database configuration
|-- controllers/              // Folder for controllers
|-- migrations/               // Folder for database migrations
|-- models/                   // Folder for Sequelize models
|-- routes/                   // Folder for API routes
|-- seeders/                  // Folder for database seeding
|-- middlewares/              // Folder for middleware functions
|-- utils/                    // Folder for utility scripts
|-- .env                      // Environment variables
|-- .gitignore                // Files and folders to ignore in Git
|-- package.json              // Node.js dependencies and scripts
|-- package-lock.json         // Dependency lock file
|-- README.md                 // Project documentation
|-- server.js                 // Main server file, initializes Express app



## 🏁 The first steps of the project

📌 Create a repository with the project name on github
📌 On your local machine, open git bash
📌 Enter the command: git clone  https://github.com/xxxxxxx/xxxxxxxx.git
📌 Open VS code, FILE -> Open your folder with project
📌 In VS code open Source Control (CTRL + SHIFT + G) and you will see your repository
📌 Follow the instructions from ## Platforms: ⚙️🔧🔨
📌 npx sequelize-cli init
📌 Create models with migrations:
✏️   npx sequelize-cli model:generate --name User --attributes username:string,email:string,password:string,role:string
✏️   npx sequelize-cli model:generate --name DailyMenu --attributes date:date
✏️   npx sequelize-cli model:generate --name Dish --attributes name:string,description:string,price:float,image:string
✏️   npx sequelize-cli model:generate --name Order --attributes userId:integer,date:date,status:string,totalPrice:float
✏️   npx sequelize-cli model:generate --name OrderItem --attributes orderId:integer,dishId:integer,quantity:integer,price:float
✏️   npx sequelize-cli model:generate --name Payment --attributes orderId:integer,method:string,status:string,paymentDate:date
✏️   npx sequelize-cli model:generate --name ContactMessage --attributes name:string,email:string,subject:string,message:text,status:string
✏️   npx sequelize-cli model:generate --name Feedback --attributes userId:integer,dishId:integer,rating:integer,comment:text
📌 Test connection with DB: copy -> node -e "require('./models').sequelize.authenticate().then(() => console.log('Database connected')).catch(err => console.error('Connection failed', err));"
📌 npx sequelize-cli db:migrate
