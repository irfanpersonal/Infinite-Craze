# Infinite Craze

Infinite Craze is an online store where people can buy items. There are two types of users: admins, who can add, edit, and view all items for sale, and regular users, who can purchase items and view their orders. It's super easy to use and has proper Stripe integration, as well as product verification, ensuring that no alterations on the front end can affect the pricing.

## Technologies Used

- [TypeScript](https://www.typescriptlang.org/): A powerful and flexible superset of JavaScript, bringing static typing to your projects.
- [MongoDB](https://www.mongodb.com/): A scalable and flexible NoSQL database, perfect for handling diverse data types.
- [Express](https://expressjs.com/): Fast, unopinionated, minimalist web framework for Node.js, making server-side development a breeze.
- [Node.js](https://nodejs.org/en): JavaScript runtime built on Chrome's V8 JavaScript engine, ideal for server-side scripting.
- [React](https://react.dev/): A JavaScript library for building dynamic and interactive user interfaces.

## Setup Instructions

1st - Download the project

2nd - Run the following command "npm install"

3rd - Change directory into the src/client folder and run "npm install". 

4th - Create a .env file in the root of the src/client folder and add the following 
key value pair: REACT_APP_STRIPE_PUBLISHABLE_KEY

5th - Run "npm run build" in the src/client folder to create a production ready application

6th - Now create a .env file in the root of your entire project with the following key value pairs: MONGO_URI, JWT_SECRET, JWT_LIFETIME, CLOUD_NAME, CLOUD_API_KEY,
CLOUD_API_SECRET, and STRIPE_SECRET_KEY

Note: The cloud values must be from Cloudinary, which is where we host our images. 

7th - Type the following command "npm run start" to start application

DONE
