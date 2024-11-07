# 📋 **Payment Portal Application**

### 🚀 **Overview**

This is a full-stack web application for submitting **international payment requests**. Users can register, log in, and securely submit payment requests using **SWIFT** or other supported providers. The app provides secure user authentication and includes functionality for seamless and secure payment submissions. Additionally, it features **employer dashboards** to manage and verify payment requests and track notifications for both employers and customers.

---

## 🛠 **Features**

### **Core Features**:
- 🔐 **User Authentication**:
  - **JWT Token-based authentication** ensures secure access.
  - Password security with **hashing and salting** using **bcrypt**.

- 💳 **Payment Submission**:
  - Submit international payments using **SWIFT**.
  - Payment details include amount, currency, recipient account, and SWIFT code.

- 🛡 **Secure Communications**:
  - **HTTPS** communication for secure data transfer.
  - Protection against **common web attacks** using **Helmet.js**, **CORS**, and **Rate Limiting**.

### **Employer Dashboard**:
- View **pending payment requests** in a tabular format.
- Perform **payment verification** or **payment rejection** with automated notifications to customers.

### **Notifications System**:
- Customers receive **real-time notifications** for:
  - Payment request status updates (verified or rejected).
  - Notifications are categorized into **read** and **unread** sections for better tracking.

---

## 🔄 **Updates**

1. **Employer-Specific Features**:
   - Employers cannot create their own accounts.
   - Dedicated **employer dashboard** for managing payment requests.
   - Ability to **verify or reject payments**, with notifications sent to customers.

3. **Notifications Revamp**:
   - New tile added to customer home page to go to notificiations page.
   - **Categorization** of notifications into "read" and "unread."
   - **Real-time updates** ensure customers are kept informed about payment statuses.

5. **Enhanced Security**:
   - Full **HTTPS** integration with SSL certificates.
   - Secure handling of cookies with `HTTPOnly` and `Secure` flags.

6. **Improved User Experience**:
   - Polished frontend UI/UX for dashboards and payment submissions.
   - Added **tiles and tables** for structured and user-friendly displays.

7. **API Testing**:
   - Comprehensive **Newman and Postman tests** integrated into the CI/CD pipeline.
   - Validations for all endpoints, ensuring robust functionality and performance.

---

## 📦 **Installation Instructions**

### Prerequisites:
- [Node.js](https://nodejs.org/en/) installed
- [MongoDB](https://www.mongodb.com/) (if using MongoDB as a database)
- SSL Certificates for HTTPS setup

### Backend Setup:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ST10059601/APDSPOE3.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the `backend` directory with the following:
   ```env
   ATLAS_URI=<your-mongodb-atlas-uri>
   ```

4. **Run the backend**:
   ```bash
   npm run dev
   ```

### Frontend Setup:

1. **Navigate to the frontend**:
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the frontend**:
   ```bash
   npm start
   ```

---

## ⚙️ **Technologies Used**

### **Frontend**:
- **React.js** for building interactive user interfaces.
- **React Router DOM** for handling page navigation.

### **Backend**:
- **Node.js** and **Express.js** for server-side logic.
- **MongoDB** for user and payment data storage.
- **JWT** for secure authentication.

### **Testing**:
- **Postman** for API request testing.
- **Newman** integrated into the CI/CD pipeline for automated API testing.

### **Security**:
- **Helmet.js**: Secures HTTP headers.
- **CORS**: Manages cross-origin requests.
- **Express-Rate-Limit**: Protects against DDoS attacks.
- **bcrypt**: Secure password hashing.

---

## 📄 **Usage**

1. **Register** an account via the `/register` page.
2. **Login** to your account using `/login`.
3. **Employer Dashboard**:
   - View, verify, and reject payment requests.
4. **Customer Dashboard**:
   - Submit new payment requests.
   - View categorized notifications for updates.

---

## 🔒 **Security Features**
- **HTTPS** ensures all communications are encrypted.
- **Brute Force Protection**: Limits login attempts to prevent account hacking.
- **Session Security**: Sessions are managed securely with HTTP-only cookies.
- Protection from **XSS**, **Clickjacking**, and **SQL Injection**.

---

## 🧪 **Testing**

### **Postman and Newman**:
- **Postman Collection** includes:
  - Register Customer
  - Login Customer/Employer
  - Submit Payment Request
  - View and Verify Payment Requests

- Run the API tests locally:
  ```bash
  cd backend
  npm run newmantestingscript
  ```

![image](https://github.com/user-attachments/assets/7a770474-2c80-4a61-933f-ef0cb8c4d622)

CircleCI passing all tests.


