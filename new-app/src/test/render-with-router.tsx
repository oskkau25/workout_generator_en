import type { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

interface RenderWithRouterOptions {
  route?: string
  path?: string
}

export function renderWithRouter(
  ui: React.ReactElement,
  { route = '/', path }: RenderWithRouterOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <MemoryRouter initialEntries={[route]}>
        {path ? (
          <Routes>
            <Route path={path} element={children} />
          </Routes>
        ) : (
          children
        )}
      </MemoryRouter>
    )
  }

  return render(ui, { wrapper: Wrapper })
}
