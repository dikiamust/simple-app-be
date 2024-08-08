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

Voluntario-Backend developed with NestJS, Typeorm & PostgreSQl.

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

cd event-management-be
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
