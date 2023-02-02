import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.comment) { 
        handleClickComment(e.target.dataset.comment)
    }
    else if(e.target.dataset.sendBtn) {
        sendNewReply(e.target.dataset.sendBtn)
    }
    else if(e.target.dataset.deleteBtn) {
        deleteTweet(e.target.dataset.deleteBtn)
    } 
    else if(e.target.dataset.deleteReply) {
        deleteReply(e.target.dataset.deleteReply)
    }
})

function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(tweetId){ 
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        
        tweetsData.unshift({
            handle: `@Edgar93`,
            profilePic: `images/edgar02.jpg`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        
    render()
    tweetInput.value = ''
    }
    
}

function handleClickComment(tweetId) {
    
    const targetTweetObj = tweetsData.filter(function(tweet) {
        return tweet.uuid === tweetId
    })[0]
    
    targetTweetObj.wantComment = !targetTweetObj.wantComment
    render()
    
    const commentArea = document.getElementById(`comment-area-${tweetId}`)
    commentArea.classList.remove('hidden')
}

function sendNewReply(tweetId) {
    const targetTweetObj = tweetsData.filter(function(tweet) {
        return tweet.uuid === tweetId
    })[0]
    
    let replyText = document.getElementById(`text-${tweetId}`).value
    
    let newReplyObj = {
            handle: `@Edgar93`,
            profilePic: `images/edgar02.jpg`,
            likes: 0,
            retweets: 0,
            tweetText: replyText,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        }
    
    targetTweetObj.replies.unshift(newReplyObj)   
    render()
}

function deleteTweet(tweetId) {
    tweetsData.forEach((tweet, index) => {
        if(tweet.uuid === tweetId) {
            tweetsData.splice(index, 1)
        }
    })
    render()
}

function deleteReply(replyId) {

    tweetsData.forEach((tweet) => {
        tweet.replies.forEach((replyObj, index) => {
            if(replyObj.uuid === replyId) {
                tweet.replies.splice(index, 1)
            }
        })
    })
    
    render()
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                
                let replyUuid = uuidv4()
                
                repliesHtml+=`
<div class="tweet-reply delete-parent">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
            <span class="tweet-detail delete-option hidden">
                <i id="reply-${replyUuid}" data-delete-reply="${replyUuid}" class="fa-solid fa-trash"></i>
            </span>
        </div>
</div>
`           
            reply.uuid = replyUuid
            })
        }
        
        let addComment = ''
        let deleteOption = ''
        
        if(tweet.wantComment) {
            addComment = `
                <hr>
                <div class="tweet-input-area reply-area">
                    <img src="images/edgar02.jpg" class="profile-pic">
                    <textarea placeholder="Reply..." id="text-${tweet.uuid}"></textarea>
                </div>
                <button class="reply-btn" data-send-btn="${tweet.uuid}">Send</button>
            `
        }
        
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text" data-comment="${tweet.uuid}">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span id="delete-option-${tweet.uuid}" class="tweet-detail hidden">
                    <i class="fa-solid fa-trash" data-delete-btn="${tweet.uuid}"></i>
                </span>
            </div>   
        </div>            
    </div>
    <div id="comment-area-${tweet.uuid}" class="comment hidden">${addComment}</div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
    
    const myTweetsArr = tweetsData.filter(function(myTweet){
        return myTweet.handle === '@Edgar93'
    })

    if(myTweetsArr) {
        myTweetsArr.forEach((tweetObj) => {
            document.getElementById(`delete-option-${tweetObj.uuid}`).classList.remove('hidden')
        })
    }
    
    let targetReplyObj = tweetsData.map((tweet) => {
        let targetReplyObj = tweet.replies.filter((replyObj) => {
            return replyObj.handle === '@Edgar93'
        })
        return targetReplyObj
    })
    
    if(targetReplyObj) {
        targetReplyObj.forEach((tweetArr) => {
            tweetArr.forEach((tweetObj) => {
                document.getElementById(`reply-${tweetObj.uuid}`).parentElement.classList.remove('hidden')
            })
        })
    }
}

render()

