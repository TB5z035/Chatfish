import { unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { postAgreeAddGroup } from './friend/agreeAddGroup'
import { postAgreeAddFriend } from './friend/agreeAddFriend'
import { postAddFriend } from './friend/addFriend'
import { postAddGroup } from './friend/addGroup'
import { requireFriendList } from './message/requireFriendList'
import { postDeleteFriend } from './friend/deleteFriend'
import { postLeaveGroup } from './friend/leaveGroup'
import { postDisagreeAddFriend } from './friend/refuseFriend'
import { postDisagreeAddGroup } from './friend/refuseGroup'
import { postModifyInfo } from './info/modifyInfo'
import { postEnterChat } from './message/enterChat'
import { postUploadMessage } from './message/uploadMessage'
import { postRecallMessage } from './message/recallMessage'
import { fetchGroupMember } from './message/fetchGroupMember'

function fetchMock(url, suffix = '') {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        json: () =>
          Promise.resolve({
            state: 200
          })
      })
    }, 0)
  )
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

beforeAll(() => {
  jest.spyOn(global, 'fetch').mockImplementation(fetchMock)
})

afterAll(() => {
  global.fetch.mockClear()
})

let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container)
  container.remove()
  container = null
})

it('useStaleRefresh hook runs correctly', async () => {
  act(() => {
    postAgreeAddGroup('haha', 'a')
  })
  await act(() => sleep(300))
})

it('useStaleRefresh hook runs correctly', async () => {
  act(() => {
    postAgreeAddFriend('haha', 'a')
  })
  await act(() => sleep(300))
})

it('useStaleRefresh hook runs correctly', async () => {
  act(() => {
    postAddFriend('haha', 'a')
  })
  await act(() => sleep(300))
})

it('useStaleRefresh hook runs correctly', async () => {
  act(() => {
    postAddGroup(0, 'haha', 'a', 'd')
  })
  await act(() => sleep(300))
})

it('useStaleRefresh hook runs correctly', async () => {
  act(() => {
    requireFriendList('haha')
  })
  await act(() => sleep(300))
})

it('useStaleRefresh hook runs correctly', async () => {
  act(() => {
    postDeleteFriend('haha', 'haha')
  })
  await act(() => sleep(300))
})

it('useStaleRefresh hook runs correctly', async () => {
  act(() => {
    postLeaveGroup('haha', 'haha')
  })
  await act(() => sleep(300))
})

it('useStaleRefresh hook runs correctly', async () => {
  act(() => {
    postDisagreeAddFriend('haha', 'haha')
  })
  await act(() => sleep(300))
})

it('useStaleRefresh hook runs correctly', async () => {
  act(() => {
    postDisagreeAddGroup('haha', 'haha', 'haha')
  })
  await act(() => sleep(300))
})

it('useStaleRefresh hook runs correctly', async () => {
  act(() => {
    postModifyInfo('haha', 'haha', 'haha')
  })
  await act(() => sleep(300))
})

it('useStaleRefresh hook runs correctly', async () => {
  act(() => {
    postEnterChat('haha', 'haha', 'haha')
  })
  await act(() => sleep(300))
})

it('useStaleRefresh hook runs correctly', async () => {
  act(() => {
    fetchGroupMember('haha', 'haha')
  })
  await act(() => sleep(300))
})

it('useStaleRefresh hook runs correctly', async () => {
  act(() => {
    postRecallMessage('haha', 'haha', 'haha')
  })
  await act(() => sleep(300))
})

it('useStaleRefresh hook runs correctly', async () => {
  act(() => {
    postUploadMessage('haha')
  })
  await act(() => sleep(300))
})
