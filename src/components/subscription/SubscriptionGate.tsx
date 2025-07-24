'use client';

import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Check, Zap, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

interface SubscriptionGateProps {
  children: React.ReactNode;
  feature?: string;
  showUpgrade?: boolean;
}

/**
 * Component that gates premium features behind subscription
 */
export function SubscriptionGate({ children, feature, showUpgrade = true }: SubscriptionGateProps) {
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  
  const isPremium = user?.publicMetadata?.isPremium === true;

  if (isPremium) {
    return <>{children}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  return (
    <div className="flex items-center justify-center p-8" dir={i18n.language === 'he' ? 'rtl' : 'ltr'}>
      <Card className="w-full max-w-md text-center shadow-xl border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            {t('subscription.gate.title')}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {feature ? t('subscription.gate.featureDescription', { feature }) : t('subscription.gate.description')}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            {[
              t('subscription.benefits.unlimited'),
              t('subscription.benefits.priority'),
              t('subscription.benefits.advanced'),
              t('subscription.benefits.support')
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link href="/subscription">
              <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-medium h-12 rounded-xl transition-all duration-200 transform hover:scale-[1.02]">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  {t('subscription.gate.upgradeButton')}
                </div>
              </Button>
            </Link>
          </div>

          <p className="text-xs text-gray-500">
            {t('subscription.gate.moneyBack')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}