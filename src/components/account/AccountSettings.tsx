'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Crown, 
  CreditCard, 
  Shield, 
  Bell,
  Trash2,
  Save,
  Settings
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

/**
 * Account settings and subscription management component
 */
export function AccountSettings() {
  const { t, i18n } = useTranslation();
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');

  const isPremium = user?.publicMetadata?.isPremium === true;

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await user.update({
        firstName,
        lastName,
      });
      toast.success(t('account.profile.updateSuccess'));
    } catch (error) {
      toast.error(t('account.profile.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    const confirmed = window.confirm(t('account.danger.deleteConfirm'));
    if (!confirmed) return;

    setIsLoading(true);
    try {
      await user.delete();
      toast.success(t('account.danger.deleteSuccess'));
    } catch (error) {
      toast.error(t('account.danger.deleteError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6" dir={i18n.language === 'he' ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-full">
          <Settings className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('account.title')}</h1>
          <p className="text-gray-600">{t('account.subtitle')}</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {t('account.tabs.profile')}
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            {t('account.tabs.subscription')}
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t('account.tabs.security')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t('account.tabs.notifications')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('account.profile.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('auth.fields.firstName')}</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={t('auth.fields.firstNamePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('auth.fields.lastName')}</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={t('auth.fields.lastNamePlaceholder')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.fields.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    value={user?.primaryEmailAddress?.emailAddress || ''}
                    disabled
                    className="pl-10 bg-gray-50"
                  />
                </div>
                <p className="text-xs text-gray-500">{t('account.profile.emailNote')}</p>
              </div>

              <Button 
                onClick={handleUpdateProfile}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isLoading ? t('account.profile.updating') : t('account.profile.update')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                {t('account.subscription.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${isPremium ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                    <Crown className={`h-5 w-5 ${isPremium ? 'text-yellow-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {isPremium ? t('account.subscription.premium') : t('account.subscription.free')}
                      </span>
                      <Badge variant={isPremium ? 'default' : 'secondary'}>
                        {isPremium ? t('account.subscription.active') : t('account.subscription.inactive')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {isPremium ? t('account.subscription.premiumDescription') : t('account.subscription.freeDescription')}
                    </p>
                  </div>
                </div>
              </div>

              {!isPremium ? (
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">
                  <Crown className="h-4 w-4 mr-2" />
                  {t('account.subscription.upgrade')}
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    {t('account.subscription.manageBilling')}
                  </Button>
                  <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                    {t('account.subscription.cancel')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('account.security.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                {t('account.security.changePassword')}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                {t('account.security.twoFactor')}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                {t('account.security.sessions')}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                {t('account.danger.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                {t('account.danger.description')}
              </p>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isLoading ? t('account.danger.deleting') : t('account.danger.delete')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t('account.notifications.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('account.notifications.email')}</p>
                    <p className="text-sm text-gray-600">{t('account.notifications.emailDescription')}</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('account.notifications.budget')}</p>
                    <p className="text-sm text-gray-600">{t('account.notifications.budgetDescription')}</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('account.notifications.goals')}</p>
                    <p className="text-sm text-gray-600">{t('account.notifications.goalsDescription')}</p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}