'use client'

import Link from 'next-intl/link';
import { usePathname } from 'next/navigation';

const LocaleSwitcher = ({ locale }: { locale: string | undefined}) => {
  const getOtherLocale = () => {
    return locale === 'en' ? 'fr' : 'en';
  };

  const route = usePathname();
  
  const getCleanRoute = (route: string) => {
    return route.replace(/^\/(fr|en)\b/, '');
  };

  const cleanRoute = route === `/${locale}` ? '/' : getCleanRoute(route);

  return (
    <div className="relative z-10 flex items-center justify-center space-x-2">
      <p>Select Language</p>
      <Link
        href={cleanRoute}
        locale={getOtherLocale()}
        className="px-3 py-1 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        {getOtherLocale()}
      </Link>
    </div>
  );
};

export default LocaleSwitcher;
