## Institute Instructor Attendance System - Wise Coding Task

This project implements an Institute Instructor Attendance System, allowing instructors to check in and out, and generating monthly reports. It was developed using a Test-Driven Development (TDD) approach, resulting in 100% controller code coverage.

**Project Links:**

- **Main Project:** [wise.jerald.dev](https://wise.jerald.dev/)
- **Swagger UI:** [wise.jerald.dev/api-docs](https://wise.jerald.dev/api-docs)

**Project Links:**

- **Main Project:** jerald.dev (placeholder)
- **Swagger UI:** jerald.dev/swagger (placeholder)

**Instructor Credentials for Testing:**
**Test User 1:**

```json
{
  "user_name": "user1",
  "password": "user1"
}
```

**Test User 2:**

```json
{
  "user_name": "user2",
  "password": "user2"
}
```

**Key Features:**

- **CheckIn/Out Functionality:** Instructors can effortlessly check in and out using `/Check/In` and `/Check/Out` endpoints, providing check-in/out day and time for accurate attendance tracking.
- **Monthly Reports:** Generate comprehensive monthly reports for all instructors using the `/Report` endpoint with the desired month as a query parameter, providing valuable insights into attendance patterns.
- **Secure Authentication:** Robust authentication with login (`/Auth/Login`) and logout (`/Auth/Logout`) functionalities ensures authorized access to instructor-specific data, safeguarding system integrity.
- **Server Health Check:** Quickly verify server uptime using the `/` endpoint to maintain confidence in system operability.
- **Additional Endpoints:**
  - `/Secure`: Confirms successful authentication, assuring authorized access for instructors.
  - `/Auth/Login`: Enables instructors to log in using their username and password for secure system entry.
  - `/Auth/Logout`: Allows instructors to log out gracefully, maintaining account security.

**Stack:**

- Node.js & Express.js for high-performance backend development.
- MySql & Sequelize ORM for efficient database management.
- dayjs for flexible date/time parsing and manipulation.
- Swagger UI for intuitive API documentation, promoting ease of use for developers and instructors.
- Jest for comprehensive unit testing and code coverage, ensuring impeccable quality.
- SuperTest for thorough API endpoints validation, guaranteeing system reliability.

**Project Setup:**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/JeraldVictor/wise-test.git
   ```

2. **Create a `.env` file:**

   - Copy the `.env.sample` file to `.env`.
   - Edit the `.env` file to provide your database credentials:
     - `DB_HOST`
     - `DB_DATABASE`
     - `DB_USER`
     - `DB_PASSWORD`

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Run migrations:**

   ```bash
   npm run migrate:up
   ```

5. **(Optional) Run migrations for testing database:**

   ```bash
   NODE_ENV=test npm run migrate:up
   ```

6. **(Optional) Seed initial data:**

   ```bash
   npm run migrate:seed
   ```

7. **Start the server:**

   ```bash
   npm start
   ```

8. **Run tests:**

   ```bash
   npm test
   ```

9. **View code coverage:**

   ```bash
   npm test --collectCoverage
   ```

**Additional Notes:**

- Ensure you have Node.js, npm, and a MySQL database server installed and configured.
- Adjust the provided instructions if your project setup differs slightly.
- Refer to the codebase for more in-depth details and implementation specifics.
