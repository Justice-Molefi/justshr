# JustShr

JustShr is a real-time collaborative text editor designed to enable seamless teamwork. It allows users to create accounts, log in securely, and join sessions where changes made in the text editor are instantly shared with all participants using WebSockets. This project demonstrates a full-stack implementation with Angular on the frontend and Spring Boot on the backend.

## Features

- **User Authentication**: 
  - Sign up and log in to receive a JWT token for secure API requests.
- **Dashboard**:
  - View all sessions you are a part of after logging in.
- **Real-Time Collaboration**:
  - Join a session and collaborate with other users in a shared text editor.
  - Changes are synchronized across all users in real-time using WebSockets.
- **Frontend**:
  - Built with Angular for a dynamic and responsive user interface.
- **Backend**:
  - API powered by Spring Boot to handle user authentication, session management, and WebSocket communication.

## Technologies Used

### Frontend
- **Angular**
- **TypeScript**
- **HTML5**
- **CSS3**

### Backend
- **Spring Boot**
- **Java 17**
- **JWT (JSON Web Tokens)**
- **WebSockets using STOMP(SIMPLE TEXT ORIENTED MESSAGING PROTOCOL)**

### Database
- **MySQL**

## Installation

### Prerequisites
1. Install [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) for the Angular frontend.
2. Install [Java JDK 17](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html) for the Spring Boot backend.
3. Install [Maven](https://maven.apache.org/) for managing backend dependencies.
4. Install [MySQL](https://www.mysql.com/) and set up a database for the project.

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Justice-Molefi/justshr.git
   cd justshr/just-shr-api
   ```
2. Configure the database:
   - Update the `application.properties` file with your MySQL credentials:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     spring.jpa.hibernate.ddl-auto=update
     ```
   > **Note**: Using environment variables for sensitive data like database credentials is recommended for better security. Refer to [Spring Boot External Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config) for guidance.
3. Configure jwt secret
    - Update the `application.properties` file with your jwt secret:
     ```properties
     jwt.secret=(your 256 bits secret here)
     ```
     > **Note**: Using environment variables for sensitive data like database credentials is recommended for better security.
4. Build and run the Spring Boot application:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
5. Access the backend API at `http://localhost:8080`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd justshr/just-shr-ui
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Angular application:
   ```bash
   ng serve
   ```
4. Access the frontend at `http://localhost:4200`.

## Usage

1. **Sign Up**:
   - Create an account.
     ![Image](https://github.com/user-attachments/assets/03df6e6b-ebaa-41a5-beb3-ae5c4e1d736d)
2. **Log In**:
   - Use your credentials to log in, recieve jwt token and access the dashboard.
     ![Image](https://github.com/user-attachments/assets/a4581e5b-8239-4f86-857c-9288dc84dcd8)
3. **Dashboard**:
   - View all the sessions you are part of.
     ![Image](https://github.com/user-attachments/assets/9600fdd3-4744-443b-981d-7681b14b6bf8)
4. **Join a Session**:
   - Select a session to collaborate with others in real-time using the shared text editor.
     ![Image](https://github.com/user-attachments/assets/4d461c8f-a93a-4d4c-bfa7-1ec50aba53c6)
     ![Image](https://github.com/user-attachments/assets/f850954d-9302-4978-b437-26d1e11c7229)

## API Endpoints

### Authentication
- `POST /api/v1/auth/register`: Register a new user.
- `POST /api/v1/auth/login`: Authenticate and receive a JWT token.
- `POST /api/v1/auth/logout`: logout.
- `POST /api/v1/auth/verify-token`: verify client jwt token.

### Sessions
- `GET /api/v1/session`: Fetch all sessions the user is part of.
- `GET /api/v1/session/{id}`: get a single session.
- `POST /api/v1/session`: Save a session to the database. This endpoint expects a session object in the request body.
- `POST /api/v1/session/addMember` : Add a user to the session. This endpoint expects a user email and the session id in the request body.
- `PUT /api/v1/session/updateDescription/{sessionId}` : Update the session description. This endpoint expects a description string in the request body.
- `DELETE /api/v1/session/{sessionId}` : Delete a session.

### WebSockets
- Real-time updates are managed via WebSocket connections to `/ws`.
- Connection Endpoint `ws://hostname/session-content`
- Topics
   - Subscribe to `/topic/editor-content/` for realtime updates.
- Application Messages
   - Send updates to `/app/editor-content`
     
## Future Enhancements

- Add role-based access control.
- Add unit and integration tests for both frontend and backend.
- Add voice chat inside a session
- Make use of refresh tokens on the auth layer

## Contributing

Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or collaborations, reach out at [nkopane.mj@gmail.com].

