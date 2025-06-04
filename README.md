# 🪞 Mirror Mirror - Webcam AI

A magical webcam AI application that channels the enchanted Mirror from Snow White. Point your camera at anything and ask "Mirror, mirror on the wall..." to receive dramatic, poetic AI analysis with voice narration.

## ✨ Features

- **Real-time Webcam Integration**: Live video feed from your camera
- **AI Vision Analysis**: Powered by Claude 3 Opus via OpenRouter for sophisticated image understanding
- **Theatrical Responses**: AI responds in the dramatic style of the Magic Mirror from Snow White
- **Text-to-Speech**: Responses are spoken aloud using ElevenLabs high-quality voice synthesis
- **Modern UI**: Beautiful dark theme with gradient backgrounds and glassmorphism effects
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS 4, Radix UI components
- **AI Vision**: Anthropic Claude 3 Opus (via OpenRouter)
- **Text-to-Speech**: ElevenLabs API
- **Testing**: Vitest
- **Package Manager**: pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn
- Webcam access
- API keys for:
  - [OpenRouter](https://openrouter.ai/) (for Claude 3 Opus access)
  - [ElevenLabs](https://elevenlabs.io/) (for text-to-speech)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd webcam-ai
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.local` file in the root directory e.g. run `cp .example.env .env.local2`:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Start the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. Grant webcam permissions when prompted
2. Position yourself or an object in front of the camera
3. Click "Mirror, mirror on the wall..." to capture and analyze the current frame
4. Enjoy the dramatic AI analysis spoken in the voice of the Magic Mirror!

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/         # Image analysis endpoint
│   │   └── speak/           # Text-to-speech endpoint
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main application page
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── AnalysisView.tsx     # Analysis results display
│   └── WebcamView.tsx       # Webcam feed component
└── lib/
    ├── speech.ts            # Speech synthesis utilities
    └── utils.ts             # General utilities
```

## 🔧 Configuration

### OpenRouter Setup
1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Create an API key
3. Add credits to your account for Claude 3 Opus usage

### ElevenLabs Setup
1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Create an API key
3. The app uses the "Rachel" voice by default (voice ID: `21m00Tcm4TlvDq8ikWAM`)

## 🧪 Testing

Run the test suite:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

## 🏗️ Building for Production

```bash
pnpm build
pnpm start
```

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your repository to [Vercel](https://vercel.com)
2. Add your environment variables in the Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

This is a standard Next.js application and can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- Render
- AWS
- Google Cloud Platform

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | API key for OpenRouter/Claude access | Yes |
| `ELEVENLABS_API_KEY` | API key for ElevenLabs TTS | Yes |
| `NEXT_PUBLIC_APP_URL` | Your app's URL (for API referrer) | No |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI/Anthropic for powerful AI vision capabilities
- ElevenLabs for high-quality text-to-speech
- The creators of Snow White for the magical mirror inspiration
- The React and Next.js communities for excellent tooling
