'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Check, 
  Star, 
  Zap, 
  Shield, 
  Headphones,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

/**
 * Subscription management page
 */
export default function SubscriptionPage() {
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isPremium = user?.publicMetadata?.isPremium === true;

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // Here you would integrate with Stripe
      // For now, we'll simulate the process
      toast.success(t('subscription.upgradeSuccess'));
      router.push('/dashboard');
    } catch (error) {
      toast.error(t('subscription.upgradeError'));
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Crown,
      title: t('subscription.features.unlimited.title'),
      description: t('subscription.features.unlimited.description'),
      free: false,
      premium: true,
    },
    {
      icon: Zap,
      title: t('subscription.features.advanced.title'),
      description: t('subscription.features.advanced.description'),
      free: false,
      premium: true,
    },
    {
      icon: Shield,
      title: t('subscription.features.priority.title'),
      description: t('subscription.features.priority.description'),
      free: false,
      premium: true,
    },
    {
      icon: Headphones,
      title: t('subscription.features.support.title'),
      description: t('subscription.features.support.description'),
      free: false,
      premium: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4" dir={i18n.language === 'he' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-full text-orange-600 font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            {t('subscription.badge')}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('subscription.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subscription.subtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <Card className="relative border-2 border-gray-200">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-gray-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {t('subscription.plans.free.title')}
              </CardTitle>
              <div className="text-3xl font-bold text-gray-900 mt-4">
                {t('subscription.plans.free.price')}
              </div>
              <p className="text-gray-600 mt-2">
                {t('subscription.plans.free.description')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{t('subscription.plans.free.features.budgets')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{t('subscription.plans.free.features.basic')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{t('subscription.plans.free.features.export')}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-6"
                disabled={!isPremium}
              >
                {!isPremium ? t('subscription.plans.current') : t('subscription.plans.downgrade')}
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-2 border-gradient-to-r from-yellow-400 to-orange-500 shadow-xl">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1">
                {t('subscription.plans.premium.popular')}
              </Badge>
            </div>
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {t('subscription.plans.premium.title')}
              </CardTitle>
              <div className="text-3xl font-bold text-gray-900 mt-4">
                {t('subscription.plans.premium.price')}
                <span className="text-lg font-normal text-gray-600">
                  /{t('subscription.plans.premium.period')}
                </span>
              </div>
              <p className="text-gray-600 mt-2">
                {t('subscription.plans.premium.description')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{t('subscription.plans.premium.features.unlimited')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{t('subscription.plans.premium.features.advanced')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{t('subscription.plans.premium.features.priority')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{t('subscription.plans.premium.features.support')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{t('subscription.plans.premium.features.analytics')}</span>
                </div>
              </div>
              <Button 
                onClick={handleSubscribe}
                disabled={isLoading || isPremium}
                className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white h-12"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('subscription.upgrading')}
                  </div>
                ) : isPremium ? (
                  t('subscription.plans.current')
                ) : (
                  <div className="flex items-center gap-2">
                    {t('subscription.plans.premium.button')}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              {t('subscription.comparison.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <feature.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">{t('subscription.plans.free.title')}</p>
                      {feature.free ? (
                        <Check className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <div className="w-5 h-5 mx-auto bg-gray-200 rounded-full" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">{t('subscription.plans.premium.title')}</p>
                      {feature.premium ? (
                        <Check className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <div className="w-5 h-5 mx-auto bg-gray-200 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ or Additional Info */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {t('subscription.guarantee')}
          </p>
          <p className="text-sm text-gray-500">
            {t('subscription.contact')}
          </p>
        </div>
      </div>
    </div>
  );
}