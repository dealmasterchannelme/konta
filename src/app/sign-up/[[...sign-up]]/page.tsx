import { SignUp } from '@clerk/nextjs';

/**
 * Sign up page using Clerk authentication
 */
export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Join Konta Today
          </h2>
          <p className="text-gray-600">
            Start managing your budgets intelligently
          </p>
        </div>
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-lg border-0",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}