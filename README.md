<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Simple-App | Backend

## Table Of Contents

- [Intro](#intro)
- [Requirements](#requirements)
- [Project Structure](#project-structure)
- [Use Template](#use-template)
- [Naming Cheatsheet](#naming-cheatsheet)
- [Installation](#installation)
  - [Clone](#clone)
  - [Environment Variables](#environment-variables)
  - [Available Scripts](#available-scripts)
- [Adding a Feature](#adding-a-feature)
- [Dependencies](#dependencies)
  - [Update Dependencies](#update-dependencies)

## Intro

# Simple-App

**Simple-App** is a lightweight backend application developed using NestJS, TypeORM, and PostgreSQL. The project provides essential user management features, including authentication, user statistics, and profile management.

## Features

### Authentication

- **Sign Up & Login:**
  - **Email & Password:** Users can sign up and log in using their email and a user-defined password. Upon registration, the user will receive an email verification link.
  - **Google OAuth:** Users can sign up and log in using their Google account, bypassing the need for email verification.
  - **Facebook OAuth:** Users can sign up and log in using their Facebook account, also bypassing email verification.

### Dashboard

Once logged in, users are redirected to a personalized dashboard where they can access the following:

- **User Profile:**

  - View their username and email.

- **User List:**

  - View a list of all users registered in the application, with the following details for each user:
    - **Sign-Up Timestamp:** The date and time when the user signed up.
    - **Login Count:** The number of times the user has logged in.
    - **Logout Timestamp:** The last time the user logged out.

- **User Statistics:**
  - **Total Registered Users:** The total number of users who have signed up.
  - **Active Sessions Today:** The total number of users with active sessions today.
  - **Average Active Sessions (Last 7 Days):** The average number of users with active sessions over the last 7 days.

### Profile Management

- **Resend Email Verification Link**
- **Reset Password:** Users can reset their password using the provided form. They need to input their old password, new password, and confirm the new password.
- **Update Username:** Users can change their username.
- **Logout:** Users can securely log out from the application.

## Requirements

- [Node.js](https://nodejs.org/en/) v16.x LTS version
- [Yarn](https://yarnpkg.com/lang/en/docs/install) package manager
- [PostgreSQL](https://www.postgresql.org/download) database

## Project Structure

<details>
<summary>Expand to show the structure of this project</summary>

```sh
├───src                   # store code in here
    ├───configs           # any config is going here
    ├───database          # any database related is going here
    ├───decorators        # common decorators
    ├───entities          # common entities
    ├───enums             # common enums
    ├───guards            # any related with auth configuration
    ├───helpers           # common helpers
    ├───interceptors      # common interceptors
    ├───interfaces        # common interfaces
    ├───middlewares       # common middlewares
    ├───modules           # store specific module in here
    ├───repositories      # common repositories
    ├───response          # response module
    ├───utils             # utility folder
    └───validators        # common validators
```

</details>

## Installation

### Clone

```sh
git clone https://github.com/dikiamust/simple-app-be

cd simple-app-be
```

### Environment Variables

You can see it in the .env.example file

```sh
cp .env.example .env
```

If you want to add a new variable, don't forget to update the [nest.config file](src/configs/nest.config.ts). So, you will get the type hint when you want to use it.

More information about configuration file: [docs.nestjs.com/techniques/configuration](https://docs.nestjs.com/techniques/configuration#custom-configuration-files).

### Install Depedencies

```sh
yarn # or yarn install
```

### Available Scripts

#### Run Project

- Run development server

  ```sh
  yarn start:dev
  ```

- Build for production

  ```sh
  yarn build && yarn start:prod
  ```

#### Database Migration

In development mode, migrations are executed automatically when changes are made to the database schema. However, you can still manually generate or create migrations using the following commands:

- Generate migration

  ```sh
  yarn migration:generate
  ```

- Create migration

  ```sh
  yarn migration:create
  ```

- Run migration

  ```sh
  yarn migration:run
  ```

- Revert migration

  ```sh
  yarn migration:revert
  ```

  For more information, please visit [TypeORM migration docs](https://typeorm.io/migrations).

## Dependencies

| Name    | Description                            | Docs                                                                    |
| ------- | -------------------------------------- | ----------------------------------------------------------------------- |
| NestJS  | Base framework                         | [docs.nestjs.com](https://docs.nestjs.com)                              |
| TypeORM | ORM for manage the PostgreSQL database | [typeorm.io](https://typeorm.io)                                        |
| Swagger | API documentation                      | [docs.nestjs.com/openapi](https://docs.nestjs.com/openapi/introduction) |

### Update Dependencies

If you want to update dependency, use the following command:

```sh
yarn upgrade-interactive --latest
```

Select dependencies you want to upgrade and make sure you read the changelog of the dependency first before deciding to upgrade 🤞
