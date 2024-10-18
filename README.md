<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://joshuarbarnhart.com/meal-planner">
    <img src="public/titleOpt.svg" alt="Title Logo" width="256" height="256">
  </a>

<h3 align="center">Munchlify - A Meal Planner App</h3>

  <p align="center">
    This is a meal planning application built using the full-stack framework Remix. It allows users to select recipes and add them to chosen days on a calendar to make a meal plan.
    <br />
    <br />
    <a href="https://joshuarbarnhart.com/meal-planner">View Demo</a>
    ·
    <a href="https://github.com/jrbarnhart/meal-planner-fullstack/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

My goal with this project was to implement a full-stack application that included basic CRUD operations, and then to deploy it to a VPS using my own domain.

I chose Remix for my framework primarily because I liked its clear separation between server and client code. In your routes all server code is run in special functions like Loader or Action. I also found its documentation to be concise, clear, and accurate which weighed heavily into my decision.

## Features

- **Recipe Library:** Browse and select recipes from the default options.
- **Custom Recipes:** Add your own recipes with custom ingredients and instructions.
- **Meal Planning:** Assign recipes to days on the calendar to create meal plans.
- **User Accounts:** Create an account to back up data on the server for access across different devices.
- **Preview Option:** Use local storage to test out the application without creating an account (with reduced performance and data reliability).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

- **Remix**
- **TypeScript**
- **Tailwind CSS**
- **Shadcn UI Components**
- **Zod**
- **Bcryptjs**
- **Prisma ORM**
- **Postgres**

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these steps:

### Prerequisites

If you want to use the application outside of Preview Mode then you must have your own PostgreSQL server and appropriate connection string.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/jrbarnhart/meal-planner-fullstack.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Add a .env file in the root directory and add your own evnironment variables to the file.
   ```sh
   # Used for session management
    SESSION_SECRET="yourarbitrarysecret"
   # Used to connect to PostgreSQL database
    DATABASE_URL="postgresql://postgresuser:postgrespassword@localhost:5432/databasename"
   # Used to create a default user to add default recipes to DB
    DEFAULT_USER_PASSWORD="arbitraryPassword"
   ```
4. Apply Prisma schema to your Postgres database
   ```sh
    npx prisma migrate dev
   ```
5. Optionally, add the default recipes to the database
   ```sh
    node populateDb.mjs
   ```
6. Start the dev server
   ```sh
   npm run dev
   ```
7. Navigate to the address in the terminal using your web browser

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

[My Portfolio](https://joshuarbarnhart.com)

[LinkedIn](https://linkedin.com/in/joshuarbarnhart)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

