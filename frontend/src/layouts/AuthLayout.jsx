export default function AuthLayout({ children }) {
  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500'>
      <div className='flex items-center justify-center w-full px-2 py-12 sm:px-6 lg:px-8'>
        {children}
      </div>
    </div>
  );
}
