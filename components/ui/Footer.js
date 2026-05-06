export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-secondary/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <span className="font-heading font-bold text-xl text-white">
              Marketplace
            </span>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Marketplace Platform. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
