import React, { Fragment, useState, useEffect } from 'react'
// import "../../assets/css/style.css";
import './chatbot.css'
import chatIconWhite from './icon/ionc-chatboat-white.svg'
import chatIcon from './icon/ionc-chatboat.svg'

// import chatIconWhite from "aws-amplify-lex-chatbot/dist/ionc-chatboat-white-bhfaftWg.svg";
// import chatIcon

const ChatBot = (props) => {
  const [message, setMessage] = useState('')
  const AWS = window.AWS
  AWS.config.region = props.region // Region
  //   AWS.config.region = process.env.AWS_CHATBOT_REGION;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    // Provide your Pool Id here
    IdentityPoolId: props.AWS_IdentityPoolId
    // IdentifyPoolId: process.env.AWS_CHATBOT_IDENTIFY_POOL_ID,
  })

  var lexruntime = new AWS.LexRuntime()
  var lexUserId = 'chatbot-demo' + Date.now()
  var sessionAttributes = {}
  function showHideChat() {
    var x = document.getElementById('chatboatBox')
    if (x.style.display === 'none') {
      x.style.display = 'block'
    } else {
      x.style.display = 'none'
    }
  }

  function pushChat() {
    // if there is text to be sent...
    var wisdomText = document.getElementById('wisdom')
    if (message && message !== '' && message.trim().length > 0) {
      // disable input to show we're sending it
      var wisdom = message.trim()
      wisdomText.value = ''
      wisdomText.locked = true

      // send it to the Lex runtime
      var params = {
        botAlias: '$LATEST',
        botName: 'BookTrip_dev',
        // botName: "TestingBot_dev",

        inputText: wisdom,
        userId: lexUserId,
        sessionAttributes: sessionAttributes
      }
      showRequest(wisdom)
      lexruntime.postText(params, function (err, data) {
        if (err) {
          console.log(err, err.stack)
          showError('Error:  ' + err.message + ' (see console for details)')
        }
        if (data) {
          // capture the sessionAttributes for the next cycle
          sessionAttributes = data.sessionAttributes
          // show response and/or error/dialog status
          showResponse(data)
        }
        // re-enable input
        wisdomText.value = ''
        wisdomText.locked = false
      })
    }
    // we always cancel form submission
    return false
  }

  function showRequest(daText) {
    var conversationDiv = document.getElementById('conversation')
    var requestPara = document.createElement('P')
    requestPara.className = 'userRequest'
    requestPara.appendChild(document.createTextNode(daText))
    conversationDiv.appendChild(requestPara)
    conversationDiv.scrollTop = conversationDiv.scrollHeight
  }

  function showError(daText) {
    var conversationDiv = document.getElementById('conversation')
    var errorPara = document.createElement('P')
    errorPara.className = 'lexError'
    errorPara.appendChild(document.createTextNode(daText))
    conversationDiv.appendChild(errorPara)
    conversationDiv.scrollTop = conversationDiv.scrollHeight
  }

  function showResponse(lexResponse) {
    console.log(lexResponse)
    var conversationDiv = document.getElementById('conversation')
    var responsePara = document.createElement('P')
    responsePara.className = 'lexResponse'
    // console.log('mansur', lexResponse);
    if (lexResponse.message) {
      responsePara.appendChild(document.createTextNode(lexResponse.message))
      responsePara.appendChild(document.createElement('br'))
      //const data = responsePara.createElement('div');
    }
    if (lexResponse.dialogState === 'ReadyForFulfillment') {
      responsePara.appendChild(document.createTextNode('Ready for fulfillment'))
      // TODO:  show slot values
    } else {
      //responsePara.appendChild(document.createTextNode());
    }
    conversationDiv.appendChild(responsePara)
    // let data = document.createElement("div");
    // data.innerHTML = `<p>Hi Mansur</p>`;
    //data.appendChild(document.createTextNode());
    // conversationDiv.appendChild(data);
    conversationDiv.scrollTop = conversationDiv.scrollHeight
  }

  return (
    <Fragment>
      <div
        id={'chatboatIcon'}
        style={{
          position: 'fixed',
          bottom: props.Iconbottom ? props.Iconbottom : '15px',
          right: props.Iconright ? props.Iconright : '15px',
          width: props.Iconwidth ? props.Iconwidth : '50px',
          height: props.Iconheight ? props.Iconheight : '50px',
          borderRadius: '50%',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
          zIndex: '2',
          backgroundColor: props.IconbackgroundColor
            ? props.IconbackgroundColor
            : `linear-gradient(
              270deg,
              rgba(0, 163, 218, 1) 0%,
              rgba(6, 98, 147, 1) 100%
            )`,
          backgroundImage: props.IconbackgroundImage
            ? `url(${props.IconbackgroundImage})`
            : `url(${chatIconWhite})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: props.IconbackgroundSize
            ? props.IconbackgroundSize
            : '28px',
          cursor: 'pointer'
        }}
        onClick={() => {
          showHideChat()
        }}
      ></div>
      <div
        className='chatboat'
        id='chatboatBox'
        style={{
          display: 'none'
        }}
      >
        <div
          className={`chatboat-header ${
            props.headerStyle ? props.headerStyle : ''
          }`}
          style={{
            backgroundColor: props.headerBackgroundColor
              ? props.headerBackgroundColor
              : `linear-gradient(
            270deg,
            rgba(0, 163, 218, 1) 0%,
            rgba(6, 98, 147, 1) 100%
          )`,
            background: props.headerIcon
              ? `background: #ffffff ${props.headerIcon} no-repeat center center`
              : `background: #ffffff url(${chatIcon}) no-repeat center center`
          }}
        >
          <h1>
            {props.chatBotHeaderText ? props.chatBotHeaderText : 'Chatbot'}
          </h1>
          <p>Online</p>
          <div
            className='btnChatClose'
            onClick={() => {
              showHideChat()
            }}
          >
            x
          </div>
        </div>
        <div id='conversation'></div>
        <form
          id='chatform'
          onSubmit={(e) => {
            e.preventDefault()
            return pushChat()
          }}
        >
          <input
            type='text'
            id='wisdom'
            size='80'
            onChange={(e) => {
              setMessage(e.target.value)
            }}
            value={message}
            placeholder='Enter your message...'
          />
        </form>
      </div>
    </Fragment>
  )
}

export default ChatBot
