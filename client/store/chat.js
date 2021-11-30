import axios from "axios";

const GET_MESSAGES = 'GET_MESSAGES';
const GET_CHANNELS = 'GET_CHANNELS';

const getMessages = ( messages ) => {
    return{
        type: GET_MESSAGES,
        messages
    }
}
export const _getChannels = ( channels ) => {
    return{
        type: GET_CHANNELS,
        channels
    }
}

export const fetchMessages = (userId = 1 , channelId = 1) => {
    return async(dispatch) =>{
        try{
            const {data : messages} = await axios.get(`/api/messages/${channelId}`)
            dispatch(getMessages(messages))            

        }catch(err){
            throw("error something went wrong", err)
        }
    }
}

export const getChannels = () => async dispatch => {
    console.log('I made it to the channels thunk!!!')
    try {
        const { data: channels } = await axios.get('/api/channels')
        console.log(channels)
        dispatch(_getChannels(channels));
    } catch (error) {
        console.error(error)
        next(error)
    }
}

const initialState = {
  messages: [],
  channels: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_MESSAGES:
        return {...state, messages: action.messages}  
    case GET_CHANNELS:
        return {...state, channels: action.channels}  
    default:
      return state;
  }
};