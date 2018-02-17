'use strict';

window.onload = function () {
  var content = document.getElementById('messages');
  var messageForm = document.getElementById('messageForm');
  var currentChannelURL = '/channels/testChannel';

  var lastReceivedTimeStamp = 0;

  function updateMessages() {
    fetch(currentChannelURL + '?latestTimestamp=' + lastReceivedTimeStamp, {
      method: 'GET'
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      if (data.length > 0) {
        data.sort(function (a, b) {
          return a.timestamp - b.timestamp;
        });
        data.forEach(function (msg) {
          content.innerHTML += '<br/><span class="message"><span class="message--user">' + msg.user + ': </span>' + msg.text + '</span>';
        });
        lastReceivedTimeStamp = data[data.length - 1].timestamp;
      }
    });
  }

  messageForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var messageText = document.getElementById('message_text').value;
    var messageUser = document.getElementById('message_user').value;

    fetch(currentChannelURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'message_text=' + messageText + '&user=' + messageUser
    });
    e.preventDefault();
  });

  // Setup our update loop
  setInterval(function () {
    updateMessages();
  }, 500);
};
