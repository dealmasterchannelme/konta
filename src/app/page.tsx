import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PiggyBank, 
  Target, 
  BarChart3, 
  Shield, 
  Zap, 
  Download,
  ArrowRight,
  CheckCircle 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Landing page for Konta application
 */
export default function HomePage() {
  const { t, i18n } = useTranslation();
  const features = [
    {
      icon: Target,
      title: t('landing.features.goalTracking.title'),
      description: t('landing.features.goalTracking.description'),
    },
    {
      icon: BarChart3,
      title: t('landing.features.importExport.title'),
      description: t('landing.features.importExport.description'),
    },
    {
      icon: Shield,
      title: t('landing.features.security.title'),
      description: t('landing.features.security.description'),
    },
    {
      icon: Zap,
      title: t('landing.features.speed.title'),
      description: t('landing.features.speed.description'),
    },
  ];

  return (
    <div className="min-h-screen bg-white" dir={i18n.language === 'he' ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <PiggyBank className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">{t('landing.brand')}</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in">
                <Button variant="ghost">{t('landing.nav.signIn')}</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  {t('landing.nav.getStarted')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-blue-50 inline-flex items-center px-4 py-2 rounded-full text-blue-600 text-sm font-medium mb-8">
            <Zap className="h-4 w-4 mr-2" />
            {t('landing.hero.tagline')}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('landing.hero.title.part1')}
            <span className="text-blue-600 block">{t('landing.hero.title.part2')}</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('landing.hero.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8">
                {t('landing.hero.startButton')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="h-12 px-8">
                {t('landing.hero.signInButton')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('landing.benefits.title')}
              </h2>
              <div className="space-y-4">
                {[
                  t('landing.benefits.items.unlimited'),
                  t('landing.benefits.items.import'),
                  t('landing.benefits.items.export'),
                  t('landing.benefits.items.track'),
                  t('landing.benefits.items.secure'),
                  t('landing.benefits.items.responsive'),
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/sign-up">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    {t('landing.benefits.button')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">$15,000</div>
                    <div className="text-sm text-gray-600">{t('landing.demo.emergencyFund')}</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4 text-center">
                    <PiggyBank className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">$5,200</div>
                    <div className="text-sm text-gray-600">{t('landing.demo.vacationFund')}</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">78%</div>
                    <div className="text-sm text-gray-600">{t('landing.demo.progress')}</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4 text-center">
                    <Download className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">Export</div>
                    <div className="text-sm text-gray-600">{t('landing.demo.export')}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('landing.cta.description')}
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary" className="h-12 px-8">
              {t('landing.cta.button')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <PiggyBank className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">{t('landing.brand')}</span>
            </div>
            <div className="text-gray-400 text-sm">
              {t('landing.footer.copyright')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}