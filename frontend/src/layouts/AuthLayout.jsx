export default function AuthLayout({ children }) {
  return (
    <div className='relative min-h-screen w-full flex overflow-hidden bg-gradient-to-br from-[#f9f9f9] via-[#f3f3f3] to-[#e9e9e9]'>
      {/* left panel */}
      <div className='hidden lg:flex flex-col justify-center items-start w-1/2 px-16 bg-gradient-to-br from-toyotaRed/90 via-toyotaRed/70 to-[#d51a1a] text-white relative overflow-hidden'>
        {/* decorative light blob */}
        <div className='absolute -top-40 -left-20 w-[400px] h-[400px] bg-white/20 blur-3xl' />
        <h1 className='text-5xl font-extrabold mb-6 z-10'>
          Drive Your <br /> Dream Toyota
        </h1>
        <p className='text-lg leading-relaxed text-white/90 max-w-md z-10'>
          Explore, compare, and finance cars effortlessly with <b>Kynetic</b> —
          an AI-powered experience built to make car discovery smarter.
        </p>
        <div className='absolute bottom-10 left-16 text-sm text-white/70'>
          © {new Date().getFullYear()} Kynetic
        </div>
      </div>

      {/* right panel (form area) */}
      <div className='flex items-center justify-center w-full lg:w-1/2 px-4 py-12 sm:px-6 lg:px-8 relative z-10'>
        {children}
      </div>

      {/* subtle orbs for background depth */}
      <div className='absolute -top-32 -right-32 w-[350px] h-[350px] bg-toyotaRed/10 rounded-full blur-[120px] animate-pulse-slow' />
      <div className='absolute bottom-[-200px] left-[-150px] w-[450px] h-[450px] bg-gray-400/20 rounded-full blur-[140px] animate-pulse-slower' />
    </div>
  );
}
