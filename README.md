# Authentication_Service

This application is a robust and secure web service built using **Node.js**, **Express.js**, and **MongoDB** with **Mongoose**. It is designed with a focus on security, user data protection, and ease of use.

## Features

The application allows users to perform **CRUD** (Create, Read, Update, Delete) operations on their data. It is equipped with several security packages such as `jsonwebtoken`, `bcrypt.js`, `express-mongo-sanitize`, `xss-clean`, `express-rate-limit`, `helmet`, and `hpp` to ensure the highest level of security.

Emails are handled using `nodemailer` with `mailtrap`, providing a reliable and efficient communication system for user interactions such as password resets.

## Environment Variables

The application uses a `.env` file for environment variables. These include:

| Variable          | Description                                  |
| ----------------- | -------------------------------------------- |
| NODE_ENV          | Environment mode (development or production) |
| PORT              | Server port                                  |
| DB_PASSWORD       | Database password                            |
| DB_URL            | Database URL                                 |
| JWT_SECRET_KEY    | Secret key for JWT                           |
| JWT_EXPIRESIN     | JWT token expiration date                    |
| COOKIE_EXPIRES_IN | Cookie expiration time                       |
| MAILTRAP_HOST     | Mailtrap host                                |
| MAILTRAP_PORT     | Mailtrap port                                |
| MAILTRAP_USERNAME | Mailtrap username                            |
| MAILTRAP_PASSWORD | Mailtrap password                            |

These variables are crucial for the application's configuration and should be set up according to your deployment environment.

## Getting Started

To start the application, navigate to the application directory and run `npm i` to install the necessary dependencies.

To run the application in development mode, use the command `npm start`. For production mode, use `npm start:prod`. The main difference between development and production modes lies in error handling - they are handled differently to provide detailed error information during development and user-friendly error messages in production.

## Conclusion

This application is a testament to modern web development practices, with a strong emphasis on security, user experience, and efficient data handling. It provides a solid foundation for any web service and can be easily extended or modified to suit your specific needs.

Please note that this is a high-level overview of the application. For detailed information about specific endpoints or features, please refer to the respective sections of the documentation, [Visit documentation](https://documenter.getpostman.com/view/25731393/2sA3BhfFGd) . If you have any questions or need further assistance, feel free to reach out (bouzairimad@gmail.com). Happy coding! 😊
