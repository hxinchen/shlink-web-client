import { Button } from '@shlinkio/shlink-frontend-kit';
import type { PropsWithChildren, ReactNode } from 'react';
import { Component } from 'react';
import { i18n } from '../i18n';
import { ErrorLayout } from './ErrorLayout';

type ErrorHandlerProps = PropsWithChildren<{
  location?: typeof window.location;
  console?: typeof window.console;
}>;

type ErrorHandlerState = {
  hasError: boolean;
};

export class ErrorHandler extends Component<ErrorHandlerProps, ErrorHandlerState> {
  public constructor(props: ErrorHandlerProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): ErrorHandlerState {
    return { hasError: true };
  }

  public componentDidCatch(e: Error): void {
    const { console = globalThis.console } = this.props;
    console.error(e);
  }

  public render(): ReactNode {
    const { hasError } = this.state;
    const { location = globalThis.location } = this.props;

    if (hasError) {
      return (
        <ErrorLayout title={i18n.t('Oops! This is awkward :S')}>
          <p>{i18n.t('It seems that something went wrong. Try refreshing the page or just click this button.')}</p>
          <br />
          <Button size="lg" onClick={() => location.reload()}>
            {i18n.t('Take me back')}
          </Button>
        </ErrorLayout>
      );
    }

    const { children } = this.props;
    return children;
  }
}
