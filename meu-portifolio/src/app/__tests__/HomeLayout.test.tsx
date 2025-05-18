import React from 'react';
import { render } from '@testing-library/react';
import Home from '../page';

// Mock dos componentes que podem causar problemas nos testes
jest.mock('../components/Header', () => {
  return function MockHeader() {
    return <div data-testid="mock-header">Header Mock</div>;
  };
});

jest.mock('../components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="mock-footer">Footer Mock</div>;
  };
});

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />);
    // O teste passa se a renderização não lançar exceções
  });

  // Adicione mais testes específicos conforme necessário, por exemplo:
  // it('displays the correct title', () => {
  //   render(<Home />);
  //   expect(screen.getByRole('heading', { name: /seu nome/i })).toBeInTheDocument();
  // });
}); 