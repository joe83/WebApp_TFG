import {combineReducers} from 'redux';

let initialState = {
    chat: {},
    modules: {
        chat: false,
        news: false,
        publishNew: false,
        management: false,
        main: false,
        users:false
    },
    currentChat: null,
    myself: null,
    remoteUsers: null,
    remoteUsersTyping: {},
    userTyping: {
        typing: false,
        chat: null,
    },
    news: null,
    alertMessages: null
};

function chatUpdate(state = initialState.chat, action) {
    switch (action.type) {
        case 'NEW_MESSAGE':
            let newChat = JSON.parse(JSON.stringify(state));

            if (newChat[action.msg.chatId] === undefined) {
                newChat[action.msg.chatId] = [action.msg];
            } else {
                newChat[action.msg.chatId].splice(0, 0, action.msg);
            }

            return newChat;

        case 'UPDATE_CHAT_HISTORY':
            let chatUpdate = JSON.parse(JSON.stringify(state));

            chatUpdate[action.chatId] = action.chatMsgs;

            return chatUpdate;

        default:
            return state;

    }
}


function setRemoteUsers(state = initialState.remoteUsers, action) {
    switch (action.type) {
        case 'SET_REMOTE_USERS':
            let newState = JSON.parse(JSON.stringify(state));

            newState = action.users;

            return newState;

        default:
            return state;

    }
}

function alertManager(state = initialState.alertMessages, action) {
    switch (action.type) {
        case 'DELETE_ALERTS':
            let newState = JSON.parse(JSON.stringify(state));
            newState = null;
            return newState;

        case 'NEW_ALERT':
            let newState2 = JSON.parse(JSON.stringify(state));
            newState2 = action.msg;
            return newState2;
        default:
            return state;

    }


}

function setNews(state = initialState.news, action) {
    switch (action.type) {
        case 'SET_NEWS':
            let newState = JSON.parse(JSON.stringify(state));
            newState = action.news;
            return newState;
        default:
            return state;

    }

}

function renderModules(state = initialState.modules, action) {
    switch (action.type) {
        case 'SHOW_CHAT':
            let newState = JSON.parse(JSON.stringify(state));
            newState.chat = action.dismiss;
            return newState;

        default:
            return state;

    }
}

function setUser(state = initialState.myself, action) {
    switch (action.type) {
        case 'SET_USER':
            return action.user;
        default:
            return state;

    }
}

function setCurrentChat(state = initialState.currentChat, action) {
    switch (action.type) {
        case 'SET_CURRENT_CHAT':
            let newState = JSON.parse(JSON.stringify(state));

            newState = {
                chatId: action.chatId,
                username: action.username
            }
            return newState;

        default:
            return state;

    }
}

function isUserTyping(state = initialState.userTyping, action) {
    switch (action.type) {
        case 'USER_TYPING':

            let newState = JSON.parse(JSON.stringify(state));

            newState.chatId = action.chatId;
            newState.typing = action.typing;

            return newState;
        default:
            return state;

    }
}

function remoteUsersTyping(state = initialState.remoteUsersTyping, action) {

    switch (action.type) {
        case 'REMOTE_USER_TYPING':

            // console.log(action);

            let newState = JSON.parse(JSON.stringify(state));

            newState[action.chat] = {
                chat: action.userId,
                typing: action.typing,

            };

            return newState;

        default:
            return state;

    }

}

let GlobalState = combineReducers({
    chat: chatUpdate,
    modules: renderModules,
    myself: setUser,
    currentChat: setCurrentChat,
    userTyping: isUserTyping,
    remoteUsers: setRemoteUsers,
    remoteUsersTyping: remoteUsersTyping,
    news: setNews,
    alertMessages: alertManager
});

export default GlobalState;
