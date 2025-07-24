'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import toast from 'react-hot-toast';

/**
 * Forgot password form component
 */
export function ForgotPasswordForm() {
  const { t, i18n } = useTranslation();
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [complete, setComplete] = useState(false);

  if (!isLoaded) {
    return null;
  }

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      setSuccessfulCreation(true);
      toast.success(t('auth.forgotPassword.emailSent'));
    } catch (err: any) {
      toast.error(t('auth.forgotPassword.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const reset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });

      if (result.status === 'complete') {
        setActive({ session: result.createdSessionId });
        setComplete(true);
        toast.success(t('auth.forgotPassword.success'));
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error(t('auth.forgotPassword.resetError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4" dir={i18n.language === 'he' ? 'rtl' : 'ltr'}>
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Lock className="text-white h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {!successfulCreation ? t('auth.forgotPassword.title') : t('auth.forgotPassword.resetTitle')}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {!successfulCreation ? t('auth.forgotPassword.subtitle') : t('auth.forgotPassword.resetSubtitle')}
          </p>
        </CardHeader>

        <CardContent>
          {!successfulCreation ? (
            <form onSubmit={create} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  {t('auth.fields.email')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.fields.emailPlaceholder')}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('auth.forgotPassword.sending')}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {t('auth.forgotPassword.sendButton')}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={reset} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                  {t('auth.verification.code')}
                </Label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t('auth.verification.codePlaceholder')}
                  className="h-12 text-center text-lg tracking-widest border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  maxLength={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  {t('auth.fields.newPassword')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.fields.newPasswordPlaceholder')}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !code || !password}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('auth.forgotPassword.resetting')}
                  </div>
                ) : (
                  t('auth.forgotPassword.resetButton')
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link 
              href="/sign-in" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('auth.backToSignIn')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}