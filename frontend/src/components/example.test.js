
import { act } from 'react-dom/test-utils'

let div

beforeEach(() => {
  div = document.createElement('div')
  document.body.appendChild(div)
})

afterEach(() => {
  document.body.removeChild(div)
  div = null
})

test('Board renders without crashing', () => {
  act(() => {

  })
})
