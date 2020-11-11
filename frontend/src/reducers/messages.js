const messages = (state = initialState, action) => {
  let newList = [...state]
  let j = 0
  const len = newList.length
  switch (action.type) {
    case 'DELETE_FRIEND':
      for (; j < len; j++) {
        if (newList[j].isGroup === 0 && newList[j].user === action.friendName) {
          newList.splice(j, 1)
          break
        }
      }
      return newList
    case 'DELETE_GROUP':
      for (; j < len; j++) {
        if (newList[j].isGroup === 1 && newList[j].user === action.groupName) {
          newList.splice(j, 1)
          break
        }
      }
      return newList
    case 'ADD_FRIEND':
      return [
        ...state,
        { user: action.friendName, message_list: [], isGroup: 0 }
      ]
    case 'ADD_GROUP':
      return [
        ...state,
        { user: action.groupName, message_list: [], isGroup: 1 }
      ]
    case 'SET_MESSAGE_LIST':
      newList = action.messageList
      newList.sort((a, b) => {
        if (a.message_list.length === 0) {
          if (b.message_list.length === 0) {
            return 0
          } else return 1
        } else if (b.message_list.length === 0) {
          return -1
        } else {
          return (
            Date.parse(b.message_list.slice(-1)[0].time) -
            Date.parse(a.message_list.slice(-1)[0].time)
          )
        }
      })
      return newList
    case 'NEW_MESSAGE_SEND':
      for (; j < len; j++) {
        if (
          newList[j].user === action.receiver &&
          newList[j].isGroup === action.isGroup
        ) {
          const temp = newList[j]
          newList.splice(j, 1)
          temp.message_list.push({
            from: action.author,
            content: action.message,
            time: new Date().getTime(),
            mtype: action.mtype
          })
          newList.unshift(temp)
        }
      }
      return newList
    case 'NEW_MESSAGE_RECEIVE':
      for (; j < len; j++) {
        if (
          (newList[j].isGroup === 1 &&
            action.isGroup === 1 &&
            newList[j].user === action.group) ||
          (newList[j].isGroup === 0 &&
            action.isGroup === 0 &&
            newList[j].user === action.author)
        ) {
          const temp = newList[j]
          newList.splice(j, 1)
          temp.message_list.push({
            from: action.author,
            content: action.message,
            time: new Date().getTime(),
            mtype: action.mtype
          })
          newList.unshift(temp)
        }
      }
      return newList
    default:
      return state
  }
}

const initialState = [
  // { user: 'testusertestusertest
  // usertestusertestusertestusert
  // // estusertestusertestuser', isGroup: 1, message_list: [] },
  // {
  //   user: 'testuser',
  //   isGroup: 1,
  //   message_list: [
  //     {
  //       from: 'Bob', // sender of this message
  //       time: 1603430942584, // number of milliseconds from 1970.1.1
  //       content:
  //         'https://wzf2000-1.oss-cn-hangzhou.aliyuncs.com/ChatFish/image/1604743644455Groundhog.Day.1993.2160p.BluRay.x265.HDR.mUHD-FRDS%20%5BAVC%20480p%5D.mp4',
  //       mtype: 'abnormal',
  //       id: 'i am the id of a message'
  //     }
  //   ]
  // },
  // {
  //   user: 'testuser1',
  //   isGroup: 0,
  //   message_list: [
  //     {
  //       from: 'Bob', // sender of this message
  //       time: 1603430942584, // number of milliseconds from 1970.1.1
  //       content:
  //         'https://wzf2000-1.oss-cn-hangzhou.aliyuncs.com/ChatFish/image/1604760255995Alan%20Walker%20-%20Fade%20%5B%E9%AB%98%E8%B4%A8%E9%87%8F%5D%20%5B%E9%AB%98%E8%B4%A8%E9%87%8F%5D%20%5B%E9%AB%98%E8%B4%A8%E9%87%8F%5D.wav',
  //       mtype: 'abnormal',
  //       id: 'i am the id of a message'
  //     },
  //     {
  //       from: 'Bob', // sender of this message
  //       time: 1603430942584, // number of milliseconds from 1970.1.1
  //       content:
  //         'https://wzf2000-1.oss-cn-hangzhou.aliyuncs.com/ChatFish/image/1604760189337Threads.jpg',
  //       mtype: 'abnormal',
  //       id: 'i am the id of a message'
  //     }
  //   ]
  // }
  // { user: 'testuser', isGroup: 1, message_list: [] },
  // { user: 'testuser', isGroup: 1, message_list: [] },
  // { user: 'testuser', isGroup: 1, message_list: [] },
  // { user: 'testuser1', isGroup: 1, message_list: [] },
  // { user: 'testuser', isGroup: 1, message_list: [] },
  // { user: 'Alice', isGroup: 0, message_list: [{ mtype: 'normal', time: '2020-10-28T06:20:52.148Z', from: 'Alice', content: 'hello' }], userInfo: { username: 'Alice', nickname: 'nic2k', email: '' } },
  // { isGroup: 1, userInfo: { username: 'sdked', nickname: 'nickegout', email: '' }, userMap: { 2345: { nickname: '2345nick', email: '' }, 1234: { nickname: '1234nick', email: '' }, tianbeiwen: { nickname: 'tianbeiwennick', email: '' } }, user: 'sdked', message_list: [{ mtype: 'normal', time: '2020-10-28T06:20:52.149Z', from: '2345', content: 'hello' }, { mtype: 'normal', time: '2020-10-28T06:41:50.812Z', from: '1234', content: 'hello' }, { mtype: 'normal', time: '2020-10-28T06:45:36.608Z', from: '1234', content: 'asdgas' }, { mtype: 'normal', time: '2020-10-28T07:05:52.492Z', from: '2345', content: 'tiana' }] }
  // { user: 'testuser', isGroup: 1, message_list: [] },
  // { user: 'testuser', isGroup: 1, message_list: [] },
  // { user: 'testuser', isGroup: 1, message_list: [] },
  // { user: 'testuser', isGroup: 1, message_list: [] },
  // { user: 'testuser', isGroup: 1, message_list: [] },
  // { user: 'testuser', isGroup: 1, message_list: [] },
  // { user: 'testuser', isGroup: 1, message_list: [] }
]

export default messages
