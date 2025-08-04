# 🖥️ Hacker Terminal Simulator

A realistic terminal simulator with a cyberpunk aesthetic, built with React, TypeScript, and Vite. Experience the thrill of being a hacker with authentic terminal commands and immersive sound effects.

## ✨ Features

### 🔐 Authentic Boot Sequence
- Realistic BIOS boot screen with typing animation
- Matrix-style login interface
- Skip option with spacebar for faster access

### 💻 Terminal Experience
- Fully functional command-line interface
- Real-time typing sound effects
- Blinking cursor animation
- Command history persistence
- Auto-scrolling terminal output

### 🎮 Available Commands
- `help` - Display all available commands
- `ls` - List directory contents
- `pwd` - Show current directory
- `whoami` - Display current user
- `date` - Show current date and time
- `ps` - List running processes
- `netstat` - Show network connections
- `hack` - Initialize hacking tools
- `matrix` - Enter the Matrix
- `skills` - View your skill tree
- `cat [file]` - Display file contents
- `uname` - System information
- `clear` - Clear terminal screen
- `exit` - Logout from system

### 🎵 Audio Features
- Typing sound effects
- Login confirmation sounds
- Enter key feedback
- Error notification beeps

### 💾 Persistence
- Command history saved per user
- Resume your session anytime
- Local storage integration

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hackersimulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Audio**: Web Audio API
- **Persistence**: localStorage

## 🎨 Customization

### Adding New Commands

Edit `src/utils/commands.ts` to add new commands:

```typescript
case 'your-command':
  return [
    'Your command output line 1',
    'Your command output line 2'
  ];
```

### Modifying the Boot Sequence

Update the `bootSequence` array in `src/components/LoginScreen.tsx`:

```typescript
const bootSequence = [
  'Your custom boot message',
  'Another line...',
  // ... more lines
];
```

### Customizing Styles

The project uses Tailwind CSS. Modify classes in components or update `tailwind.config.js` for global changes.

## 🎯 Usage Tips

- **Skip Boot**: Press `SPACEBAR` during boot sequence to skip/speed up
- **Command History**: Your commands are saved per username
- **Sound Effects**: Enjoy realistic typing and system sounds
- **Skills**: Check your hacker skills with the `skills` command
- **Matrix Mode**: Try the `matrix` command for a special surprise

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Linting

The project uses ESLint with TypeScript support. Run linting with:

```bash
npm run lint
```
---

**Happy Hacking! 🚀**

*Enter the Matrix and explore the digital underground...*
