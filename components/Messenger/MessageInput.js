import React from 'react'
import styled from 'styled-components'

const Textarea = styled.textarea`
  border: 0;
  display: block;
  padding: 0 10px;
  width: 100%;
  resize:none;
  outline: none;
  background: #eee;
  border-radius: 20px;
`

const Flexend = styled.div`
  display: flex;
  align-items: flex-end;
`

const Button = styled.button`
  width: 60px;
  color: #209cee !important;
  background: transparent !important;
  font-weight: bold;
`

const InputContainer = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
  background: #fff;
  border-top: 1px solid gray;
`

const ImagePreview = styled.div`
  bottom: 50px;
  position: absolute;
  padding: 20px;
  background-color: #fff;
  img {
    max-width: 50%;
    border: 1px solid #888;
    padding: 3px;
    max-height: 200px;
  }

  a {
    position: absolute;
    top: 15px;
    left: 10px;
  }
`

const autosize = () => {
  const el = document.querySelector('#msg-input')
  setTimeout(() => {
    el.style.cssText = 'height:auto; padding:0'
    el.style.cssText = 'height:' + el.scrollHeight + 'px'
  })
}

const MessageInput = ({
  message,
  setField,
  sendMessage,
  changeFile,
  preview,
  removeFile,
  disabledSend
}) => (
  <InputContainer className='columns is-mobile'>
    {
      preview && (
        <ImagePreview className='column is-12'>
          <img src={preview} alt='preview image' />
          <a className='delete is-medium' onClick={removeFile} />
        </ImagePreview>
      )
    }
    <Flexend className='column is-2'>
      <div className='file'>
        <label className='file-label'>
          <input className='file-input' type='file' name='resume' accept='image/*'
            onChange={changeFile}
            id={`file-input`}
          />
          <Button
            className={`button`}
            type={`button`}
            onClick={() => document.querySelector('#file-input').click()}
          >
            <i className='far fa-image fa-lg' />
          </Button>
        </label>
      </div>
    </Flexend>
    <div className='column is-10'>
      <div className='field has-addons'>
        <div className='control is-expanded'>
          <Textarea
            id='msg-input'
            rows='2'
            className='is-fullwidth'
            placeholder='Type a message'
            value={message}
            onChange={e => setField('message', e.target.value)}
            onKeyDown={autosize}
          />
        </div>
        <Flexend className='is-4'>
          <Button
            className='button'
            disabled={disabledSend}
          >
            {message.trim().length || preview ? (
              <span>send</span>
            ) : (
              <span>
                <i className='far fa-thumbs-up fa-lg' />
              </span>
            )}
          </Button>
        </Flexend>
      </div>
    </div>
  </InputContainer>
)

export default MessageInput
