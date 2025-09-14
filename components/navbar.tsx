import Link from "next/link"
import Image from "next/image"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 relative">
          <Link
            href="https://www.incantodynamics.com"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
          >
            <Image
              src="/INCANTO-LOGO.jpg"
              alt="Incanto Dynamics Logo"
              width={200}
              height={200}
              className="w-34 h-16 hover:opacity-80 transition-opacity"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 absolute right-4 top-1/2 transform -translate-y-1/2">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Programs
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-foreground hover:text-primary absolute right-4 top-1/2 transform -translate-y-1/2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}
