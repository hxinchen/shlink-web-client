import { Button } from '@shlinkio/shlink-frontend-kit';
import type { FC, PropsWithChildren } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { ErrorLayout } from './ErrorLayout';

type NotFoundProps = PropsWithChildren<{ to?: string }>;

export const NotFound: FC<NotFoundProps> = ({ to = '/', children }) => {
  const { t } = useTranslation();
  return (
    <ErrorLayout title={t('Oops! We could not find requested route.')}>
      <p>
        {t("Use your browser's back button to navigate to the page you have previously come from, or just press this button.")}
      </p>
      <br />
      <Button inline to={to} size="lg">
        {children ?? t('Home')}
      </Button>
    </ErrorLayout>
  );
};
