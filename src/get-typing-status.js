var Observable =  require('rxjs/Rx').Observable;
var getChannelIdForUser = require('./get-channelid');

function getIsTypingStatus(otherUserId) 
{
  return new Observable((observer) => {
    var channelType = 'one2one';
    var channelId = getChannelIdForUser(otherUserId, this.user.channelList, channelType);
    if(channelId) 
    {
      this.db.ref('/channel/'+channelId).on('value',(snapshot)=> {
          var members;
          snapshot.forEach((childSnapshot) => {
            if(childSnapshot.getKey() === "members") 
            {
              members = childSnapshot.val();
            }
          });
          members.forEach((member) => {
            if(member.uid === otherUserId) {
              if(member.typingIndicator !== undefined )
                var result = { otherUserId, typingIndicator: member.typingIndicator };
              else
                var result = { success: false, errorMessage:" There is no typing indicator set" };
             
              observer.next(result);
            }
          });
      });
    }
    else 
    {
      observer.error({ success: false, errorMessage:" There is no channel " }) 
    }
  });
}

module.exports = getIsTypingStatus;