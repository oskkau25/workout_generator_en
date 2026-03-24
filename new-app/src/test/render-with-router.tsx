import type { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

interface RenderWithRouterOptions {
  route?: string
}

export function renderWithRouter(
  ui: React.ReactElement,
  { route = '/' }: RenderWithRouterOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren) {
    return <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
  }

  return render(ui, { wrapper: Wrapper })
}
