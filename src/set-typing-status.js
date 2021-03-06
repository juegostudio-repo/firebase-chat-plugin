
var getChannelIdForUser = require('./get-channelid');

function setIsTypingStatus(otherUserId, htmlTagId) 
{
  var tag = document.getElementById(htmlTagId);
  tag.addEventListener("focusin", () => {
   
    updateTypingIndicator(this, true, otherUserId)
    .catch(err => console.log(err));
  });

  tag.addEventListener("focusout", () => {
   
    updateTypingIndicator(this, false, otherUserId)
    .catch(err => console.log(err));
  });
 
}

function updateTypingIndicator(self, typingStatus, otherUserId)
{
    return new Promise((resolve, reject) => {
      var channelType = 'one2one';
      var channelId = getChannelIdForUser(otherUserId, self.user.channelList, channelType);
      var members;
      var isTyping;
      if(channelId) 
      {
        self.db.ref('/channel/'+channelId).once('value').then((snapshot)=> {
            snapshot.forEach((childSnapshot) => {
              if(childSnapshot.getKey() === "members") 
              {
                members = childSnapshot.val();
              }
            });
            if(members[0].uid === self.user.uid && members[1].uid === otherUserId) {
              isTyping = typingStatus;
            }
            if(members[0].uid === otherUserId && members[1].uid === self.user.uid) {
              isTyping = typingStatus;
            }
            members.forEach((member, i) => {
              if(member.uid === self.user.uid) {
                self.db.ref('/channel/' + channelId + '/members/'+ i +'/typingIndicator').set(isTyping);
              }
            });
        });
        resolve({ success: true, successMessage: "Typing status assigned succesfully"});
      }
      else 
      {
        reject({ success: false, errorMessage: "There is no channel established"});
      }
  });
}
module.exports = setIsTypingStatus;