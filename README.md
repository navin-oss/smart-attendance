# 🎓 Smart Attendance System

A modern, intelligent attendance management system built with facial recognition capabilities. This system helps educational institutions automate their attendance tracking process, making it faster, more accurate, and easier to manage.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **📸 Facial Recognition Attendance**: Mark attendance using facial recognition technology through webcam
- **👨‍🏫 Teacher Dashboard**: Comprehensive dashboard showing attendance statistics and trends
- **📊 Real-time Analytics**: View total students, today's attendance, and average attendance rates
- **👥 Student Management**: View and manage student records with attendance percentages
- **⚠️ At-Risk Student Detection**: Automatically identifies students with low attendance
- **🎨 Theme Support**: Multiple theme options (Light, Dark, Soft) for better user experience
- **🔐 Teacher Authentication**: Secure login system for teachers
- **📱 Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0**: Modern UI library for building interactive user interfaces
- **React Router DOM**: Client-side routing
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Webcam**: Access device camera for capturing images

### Backend
- **FastAPI**: High-performance Python web framework
- **Uvicorn**: Lightning-fast ASGI server
- **Pillow (PIL)**: Image processing library
- **CORS Middleware**: Cross-origin resource sharing support

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) and npm
- **Python** (v3.8 or higher)
- **pip** (Python package manager)
- A modern web browser with webcam support

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/nem-web/smart-attendance.git
cd smart-attendance
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (recommended)
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install fastapi uvicorn pillow python-multipart

# Run the backend server
python main.py
```

The backend server will start on `http://localhost:8000`

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will start on `http://localhost:5173`

## 💻 Usage

### For Teachers

1. **Access the Application**: Open your browser and navigate to `http://localhost:5173`

2. **View Dashboard**: 
   - See total students count
   - Check today's attendance
   - Monitor average attendance percentage
   - Identify at-risk students

3. **Mark Attendance**:
   - Click on "Mark Attendance" button
   - Allow camera access when prompted
   - Position students in front of the camera
   - Click "Capture" to take a photo
   - Click "Send to Server" to process and mark attendance
   - The system will detect and identify students automatically

4. **View Student List**:
   - Click on "Student List" to see all registered students
   - View individual attendance percentages
   - Access student details

5. **Change Theme**:
   - Use the theme dropdown in the navigation bar
   - Choose between Light, Dark, or Soft themes

## 📁 Project Structure

```
smart-attendance/
├── backend/
│   └── main.py                 # FastAPI backend server
├── frontend/
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/            # Images and resources
│   │   ├── pages/             # React page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MarkAttendance.jsx
│   │   │   ├── StudentList.jsx
│   │   │   └── TeacherLogin.jsx
│   │   ├── renderer/          # UI components
│   │   ├── theme/             # Theme configuration
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Application entry point
│   │   └── index.css          # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── postcss.config.js
├── README.md
└── learn.md                    # Contributor guide
```

## 📡 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. Teacher Login
```http
POST /api/login
```

**Request Body:**
```json
{
  "email": "teacher@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "ok": true,
  "token": "fake-jwt-token"
}
```

#### 2. Get Students List
```http
GET /api/students
```

**Response:**
```json
[
  {
    "roll": "2101",
    "name": "Ravi Kumar",
    "attendance": 72
  },
  {
    "roll": "2045",
    "name": "Asha Patel",
    "attendance": 71
  }
]
```

#### 3. Mark Attendance
```http
POST /api/attendance/mark
```

**Request Body:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response:**
```json
{
  "ok": true,
  "detected": [
    {
      "roll": "2101",
      "name": "Ravi Kumar"
    },
    {
      "roll": "2122",
      "name": "Mira Singh"
    }
  ],
  "count": 2
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Learn.md](./learn.md) file for detailed contribution guidelines.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes: `git commit -m "Add: your feature description"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Create a Pull Request

### Development Guidelines

- Follow the existing code style
- Write clear commit messages
- Test your changes before submitting
- Update documentation as needed
- Add comments for complex logic

## 🔒 Security Note

⚠️ **Important**: The current implementation uses stub authentication and in-memory data storage for demonstration purposes. For production use, you should:

- Implement proper authentication with JWT tokens
- Use a real database (PostgreSQL, MongoDB, etc.)
- Add proper face recognition implementation (using libraries like face_recognition, dlib, or DeepFace)
- Implement proper error handling and validation
- Add rate limiting and security headers
- Use HTTPS in production

## 🔮 Future Enhancements

- [ ] Implement real facial recognition using ML models
- [ ] Add database integration (PostgreSQL/MongoDB)
- [ ] Implement JWT-based authentication
- [ ] Add attendance reports and export functionality
- [ ] Email notifications for low attendance
- [ ] Mobile app version
- [ ] Multi-class support
- [ ] QR code-based attendance as backup option
- [ ] Integration with LMS systems

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🌐 Live Demo

Check out the UI design preview: [https://app.banani.co/preview/n08pleRdJIZY](https://app.banani.co/preview/n08pleRdJIZY)

## 📞 Support

If you encounter any issues or have questions:

- Open an issue on GitHub
- Check the [Learn.md](./learn.md) file for contribution guidelines
- Join our community discussions

## 👥 Authors

- **nem-web** - [GitHub Profile](https://github.com/nem-web)

---

Made with ❤️ for better education management
