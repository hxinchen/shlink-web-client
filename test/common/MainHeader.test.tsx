import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { MainHeader } from '../../src/common/MainHeader';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithStore } from '../__helpers__/setUpTest';

describe('<MainHeader />', () => {
  const setUp = (pathname = '') => {
    const history = createMemoryHistory();
    history.push(pathname);

    return renderWithStore(
      <Router location={history.location} navigator={history}>
        <MainHeader />
      </Router>,
    );
  };

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders ServersDropdown', async () => {
    const screen = await setUp();
    await expect.element(screen.getByRole('button', { name: 'Servers' })).toBeInTheDocument();
  });

  it('keeps theme and language controls in the header', async () => {
    const screen = await setUp();
    await expect.element(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument();
    await expect.element(screen.getByRole('button', { name: 'Language' })).toBeInTheDocument();
  });
});
