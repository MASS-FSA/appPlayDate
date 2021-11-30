import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchMessages } from "../store/chat";
import Channel from "./chat_components/Channel";

const Chat = (props) => {
    
    //let [] = useState(0)
    console.log(props)
    useEffect(()=> {
        //useDispatch(fetchMessages)
        async function callmessages(){
            try{   

                await props.getMessages()

            }catch(error){
                throw(error)
            }
        }

        callmessages()
    },[])
    //console.log(props)
    return(
        <div className="chatcontainer">
            <h1> Chat </h1>
            <div className="ChatParent">
                <div className="sidebar">
                    <div className="channel"> <Channel /></div>
                    <div className="directmessage"> direct Message</div>
                </div>
            <div className="Chat">
                <div className="newmessage"></div>
            </div>
        </div>
        </div>
        
    )

}

const mapStateToProps = state => {
    return{
        messages: state.chat.messages
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        getMessages: () => dispatch(fetchMessages())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Chat)