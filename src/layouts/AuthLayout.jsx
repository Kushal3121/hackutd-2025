export default function AuthLayout({ children }) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-8'>
        {children}
      </div>
    </div>
  );
}
