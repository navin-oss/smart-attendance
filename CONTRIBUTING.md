# Contributing to Smart Attendance

Thanks for your interest in contributing to Smart Attendance as part of GirlScript Summer of Code (GSSoC) 2025! We're excited to build with you.

## 📜 Code of Conduct

Please read and follow our [Code of Conduct](https://github.com/nem-web/smart-attendance/blob/main/CODE_OF_CONDUCT.md). Be respectful, helpful, and inclusive.

## 🧰 Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.8 or higher)
- [Git](https://git-scm.com/)

### Fork and Clone

1. **Fork this repository** by clicking the "Fork" button at the top right of this page.

2. **Clone your fork locally:**

   ```bash
   git clone https://github.com/<your-username>/smart-attendance.git
   cd smart-attendance
   ```

3. **Add upstream remote:**

   ```bash
   git remote add upstream https://github.com/nem-web/smart-attendance.git
   ```

### Local Development Setup

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

#### Backend Setup

```bash
cd backend
pip install -r requirements.txt
# Or install dependencies manually:
# pip install fastapi uvicorn pillow pydantic
python main.py
```

The backend API will be available at `http://localhost:8000`

## 🚀 Making Contributions

### 1. Find an Issue

- Browse the [Issues](https://github.com/nem-web/smart-attendance/issues) page
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue saying you'd like to work on it
- Wait to be assigned before starting work

### 2. Create a Branch

Create a new branch for your contribution:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - for new features
- `fix/` - for bug fixes
- `docs/` - for documentation changes
- `refactor/` - for code refactoring

### 3. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Comment your code where necessary
- Test your changes locally

#### Frontend Guidelines

- Use React functional components and hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Run linter before committing: `npm run lint`

#### Backend Guidelines

- Follow PEP 8 style guide for Python code
- Add appropriate error handling
- Document API endpoints with proper docstrings
- Test API endpoints manually or with automated tests

### 4. Commit Your Changes

Write clear and meaningful commit messages:

```bash
git add .
git commit -m "feat: add student search functionality"
# or
git commit -m "fix: resolve attendance marking bug"
# or
git commit -m "docs: update README with setup instructions"
```

Commit message format:
- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 5. Push Your Changes

```bash
git push origin your-branch-name
```

### 6. Create a Pull Request

1. Go to your fork on GitHub
2. Click "Compare & Pull Request"
3. Fill in the PR template with:
   - **Description**: What changes did you make?
   - **Related Issue**: Link the issue number (e.g., "Fixes #123")
   - **Screenshots**: If applicable, add before/after screenshots
   - **Testing**: Describe how you tested your changes

4. Submit the pull request

## 📋 Pull Request Guidelines

- Keep PRs focused on a single issue or feature
- Update documentation if needed
- Ensure your code is properly tested
- Add screenshots for UI changes
- Link the related issue in your PR description
- Be responsive to review comments
- Keep your PR up to date with the main branch

## 🔄 Keeping Your Fork Updated

Regularly sync your fork with the upstream repository:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## 💡 Contribution Ideas

Not sure where to start? Here are some ideas:

- 🐛 Fix bugs or issues
- ✨ Add new features
- 📝 Improve documentation
- 🎨 Enhance UI/UX
- ♿ Improve accessibility
- 🧪 Add tests
- 🔧 Optimize performance
- 🌐 Add internationalization support

## 🆘 Need Help?

- Check out the [learn.md](./learn.md) file for detailed Git and GitHub tutorials
- Open a discussion in the Issues tab
- Reach out to maintainers
- Join our community channels (if available)

## ✅ Code Review Process

1. A maintainer will review your PR
2. They may request changes or ask questions
3. Make requested changes and push updates
4. Once approved, your PR will be merged
5. Congratulations! 🎉 You're now a contributor!

## 🏆 Recognition

All contributors will be recognized in our project. Your contributions, no matter how small, are valued and appreciated!

## 📜 License

By contributing to Smart Attendance, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Smart Attendance! Together, we're building something amazing! 🚀
