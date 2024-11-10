import Image from 'next/image'
import { FaGithub } from 'react-icons/fa'

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full bg-background py-6 text-foreground">
      <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
        {/* Logo alineado a la izquierda */}
        <div className="mb-4 md:mb-0">
          <a href="/" target="_blank" rel="noopener noreferrer">
            <Image
              src="https://raw.githubusercontent.com/rafafdz/platanus-hack-landing/main/public/platanus-logo-horizontal.svg"
              alt="Platanus Logo"
              width={200}
              height={50}
              className="opacity-80 transition-opacity duration-300 hover:opacity-100"
            />
          </a>
        </div>

        <div className="text-center md:text-right">
          <p className="text-zinc-300 ">made with 💛 by 🍌</p>
          <p className="flex items-center justify-center text-sm text-zinc-400 md:justify-end">
            50% human 50% LLM
            <a
              href="https://github.com/rafafdz/hacker-vote"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 flex items-center text-primary transition-colors duration-300 hover:text-primary-foreground"
            >
              <FaGithub className="mr-1" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
