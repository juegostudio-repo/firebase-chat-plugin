var Observable =  require('rxjs/Rx').Observable;
var getChannelIdForUser = require('./get-channelid');

function receiveMessage(otherUserId)
{
  var channelId = getChannelIdForUser(otherUserId, this.user.channelList);
  return new Observable((observer)=>{
    if(!channelId){ 
      observer.error({ success: false, errorMessage:" There is no channel " }) 
    }
    else{
      var order = 'negativetimestamp';
      this.db.ref('/channel/' + channelId + '/messages').orderByChild(order).limitToFirst(1)
      .on('value',res => observer.next(res.val()))
    }
  });
}

module.exports = receiveMessage;

  // receiveMessage(otherUserId) 
  // {
  //   return new Observable((observer) => {
  //     this.getChatList().then(res => {
  //       var channelId = this.getChannelIdForUser(otherUserId, res);
  //       if(!channelId){ 
  //         observer.error({ success: false, errorMessage:" There is no channel " }) 
  //       }
  //       else{
  //         var order = 'negativetimestamp';
  //         this.db.list('/channel/' + channelId + '/messages', {
  //           query: {
  //             orderByChild: order,
  //             limitToFirst: 1
  //           }
  //         }).subscribe(res => observer.next(res))
  //       }
  //     });
  //   })
  // }