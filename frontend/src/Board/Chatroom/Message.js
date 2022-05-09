import React from 'react'
import './Message.css'
import {
  ListItem,
  Box,
  Paper,
  Avatar,
  ButtonBase,
  Button,
  Card
} from '@material-ui/core'
import DoneIcon from '@material-ui/icons/Done'
import DoneAllIcon from '@material-ui/icons/DoneAll'
import PropTypes from 'prop-types'
import md5 from 'crypto-js/md5'
import images from './Images'
import GetAppIcon from '@material-ui/icons/GetApp'
import Cookies from 'js-cookie'

const handleDownload = async (fileID) => {
  try {
    const OSS = require('ali-oss')
    const client = new OSS({
      region: '*',
      accessKeyId: '*',
      accessKeySecret: '*',
      bucket: '*'
    })
    const result = await client.get('ChatFish/image/' + fileID)
    const FileSaver = require('file-saver')
    const blob = new Blob([result['content']])
    FileSaver.saveAs(blob, fileID.split('/').pop())
  } catch (e) {
    console.log(e)
  }
}

export default class Message extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      direction:
        props.message.from === Cookies.get('username') ? 'row-reverse' : 'row',
      // 'row-reverse',
      // direction : 'row',
      message: props.message,
      showTime: true,
      isGroup: props.isGroup,
      isRead: props.isRead,
      isShow: props.isShow
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.isRead !== prevState.isRead ||
      nextProps.isShow !== prevState.isShow
    ) {
      return Object.assign({}, prevState, {
        isRead: nextProps.isRead,
        isShow: nextProps.isShow
      })
    }
    return null
  }

  render() {
    return this.state.isShow ? (
      <>
        <ListItem className={'root'} disableGutters>
          {(() => {
            switch (this.state.message.mtype) {
              case 'gInit':
              case 'gWelcome':
                return (
                  <Box display="flex" justifyContent="center" width="100%">
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      // flexGrow={1}
                      flexDirection={this.state.direction}
                      // className={'listBox'}
                      bgcolor="#EFEFEF"
                      color="#8F8F8F"
                      borderRadius={5}
                      margin={1}
                      maxWidth="50%"
                    >
                      <Box
                        maxWidth="60%"
                        aria-multiline
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {this.state.message.content}
                      </Box>
                    </Box>
                  </Box>
                )

              default:
                return (
                  <Box
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    flexGrow={1}
                    flexDirection={this.state.direction}
                    // className={'listBox'}
                  >
                    <Box className={'avatarBox'}>
                      <Avatar
                        src={
                          'https://www.gravatar.com/avatar/' +
                          md5(this.state.message.userInfo.email).toString() +
                          '?d=robohash'
                        }
                      />
                    </Box>
                    <Box className={'paperBox'}>
                      <Paper>
                        <ButtonBase
                          onClick={() => {
                            if (
                              (this.state.message.mtype === 'normal' ||
                                this.state.message.mtype === 'emoji') &&
                              this.state.direction === 'row-reverse'
                            ) {
                              this.props.recall(
                                this.state.isGroup,
                                this.state.message.id
                              )
                            }
                          }}
                          style={{ maxWidth: '100%' }}
                        >
                          <Box className={'textBox'}>
                            <Box
                              className={'textSender'}
                              // display={this.state.showTime ? 'block' : 'none'}
                            >
                              {this.state.message.userInfo.nickname + ':'}
                            </Box>
                            {(() => {
                              switch (this.state.message.mtype) {
                                case 'normal':
                                  return (
                                    <Box className={'text'}>
                                      {this.state.message.content}
                                    </Box>
                                  )
                                case 'emoji':
                                  return (
                                    <Box className={'emoji'}>
                                      <img
                                        className="imgSticker"
                                        src={images[this.state.message.content]}
                                        alt="sticker"
                                      />
                                    </Box>
                                  )
                                case 'media':
                                  switch (
                                    [...this.state.message.content.split('.')]
                                      .pop()
                                      .toLowerCase()
                                  ) {
                                    case 'mp4':
                                    case 'm4v':
                                    case 'mov':
                                    case 'flv':
                                      return (
                                        <Box className={'videoBox'}>
                                          <video
                                            controls="controls"
                                            crossOrigin="anonymous"
                                            src={this.state.message.content}
                                            style={{
                                              maxHeight: '100%',
                                              maxWidth: '100%'
                                            }}
                                          >
                                            Your browser does not support the
                                            video element.
                                          </video>
                                        </Box>
                                      )

                                    case 'mp3':
                                    case 'wav':
                                    case 'ogg':
                                      return (
                                        <Box className={'musicBox'}>
                                          <audio
                                            controls="controls"
                                            src={this.state.message.content}
                                            style={{
                                              maxHeight: '100%',
                                              maxWidth: '100%'
                                            }}
                                          >
                                            Your browser does not support the
                                            audio element.
                                          </audio>
                                        </Box>
                                      )

                                    case 'jpg':
                                    case 'jpeg':
                                    case 'png':
                                    case 'bmp':
                                    case 'gif':
                                      return (
                                        <Card className={'pictureBox'}>
                                          <img
                                            src={this.state.message.content}
                                            style={{
                                              maxHeight: '100%',
                                              maxWidth: '100%'
                                            }}
                                            alt="img"
                                          />
                                        </Card>
                                      )
                                    default:
                                      return (
                                        <Button
                                          variant="outlined"
                                          style={{ textTransform: 'none' }}
                                          endIcon={<GetAppIcon />}
                                          onClick={() => {
                                            handleDownload(
                                              decodeURI(
                                                this.state.message.content.slice(
                                                  62
                                                )
                                              )
                                            )
                                          }}
                                        >
                                          {decodeURI(
                                            this.state.message.content.slice(76)
                                          )}
                                        </Button>
                                      )
                                  }
                                default:
                                  break
                              }
                            })()}
                            <Box
                              display={this.state.showTime ? 'flex' : 'none'}
                              className={'stateBox'}
                            >
                              <Box className={'textTime'}>
                                {new Date(
                                  this.state.message.time
                                ).toLocaleString()}
                              </Box>
                              <Box className={'stateIconBox'}>
                                {this.state.direction === 'row-reverse' ? (
                                  this.state.isRead ? (
                                    <DoneAllIcon className={'stateIcon'} />
                                  ) : (
                                    <DoneIcon className={'stateIcon'} />
                                  )
                                ) : null}
                              </Box>
                            </Box>
                          </Box>
                        </ButtonBase>
                      </Paper>
                    </Box>
                  </Box>
                )
            }
          })()}
        </ListItem>
      </>
    ) : (
      <>
        <ListItem className={'root'} disableGutters>
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="flex-start"
            flexGrow={1}
            flexDirection={this.state.direction}
            className={'listBox'}
          >
            <Box className={'avatarBox'}>
              <Avatar
                src={
                  'https://www.gravatar.com/avatar/' +
                  md5(this.state.message.userInfo.email).toString() +
                  '?d=robohash'
                }
              />
            </Box>
            <Box className={'paperBox'}>
              <Paper>
                <Box className={'textBox'}>
                  {this.state.message.userInfo.nickname + '撤回了一条消息'}
                </Box>
              </Paper>
            </Box>
          </Box>
        </ListItem>
      </>
    )
  }
}

Message.propTypes = {
  message: PropTypes.object,
  isRead: PropTypes.bool,
  isGroup: PropTypes.number,
  isShow: PropTypes.bool,
  recall: PropTypes.func
}
