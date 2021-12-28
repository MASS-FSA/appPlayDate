import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  checkFriendStatus,
  fetchSingleUser,
  sendFriendRequest,
  updateFriendStatus,
} from "../store/users";
import Blocked from "./Blocked";

export const OthersProfile = ({
  user,
  getUser,
  match,
  myId,
  history,
  checkStatus,
  status,
  friendRequest,
  blockUser,
}) => {
  const [block, setBlock] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    name: "",
    image: "",
    state: "",
    email: "",
    bio: "",
    createdAt: "",
  });

  useEffect(() => {
    if (Number(match.params.userId) === Number(myId))
      history.push(`/myProfile`);
    else {
      getUser(match.params.userId);
      checkStatus(match.params.userId);
    }
  }, []);

  useEffect(() => {
    setProfileInfo((prevState) => {
      return {
        ...prevState,
        username: user.username || "",
        image: user.image || "",
        state: user.state || "",
        email: user.email || "",
        bio: user.bio || "",
        createdAt: user.createdAt || "",
      };
    });
  }, [user]);

  function handleAddFriend() {
    friendRequest(user.id);
  }

  function statusSetter() {
    switch (status) {
      case `none`:
        return <button onClick={() => handleAddFriend()}>Add</button>;
      case `pending`:
        return <h4>Friend Request Pending...</h4>;
      case `declined`:
        return <h4>Friend Request Declined 🤣</h4>;
      case `accepted`:
        return <h4>Already Friends!</h4>;
      case `blocked`:
        return setBlock(true);

      default:
        break;
    }
  }

  function handleBlock(event) {
    event.preventDefault();

    blockUser(user.id, event.target.value);
  }

  return (
    <div>
      {block ? (
        <Blocked />
      ) : (
        <div>
          <section className="user_profile_section">
            <div className="leftright">
              <div className="leftsideContainer">
                <img src={profileInfo.image} height="150px" />
                <p>Member Since: {profileInfo.createdAt?.slice(0, 10)}</p>
              </div>
              <div className="rightsideContainer">
                <h3>{profileInfo.username}</h3>
                <p className="hideoverflow">{profileInfo.bio}</p>
                <div>
                  <p className="hideoverflow">Email: {profileInfo.email}</p>
                  <p>State: {profileInfo.state}</p>
                </div>
              </div>
            </div>
          </section>
          <div className="buttoncontainer">
            <button value="blocked" onClick={(e) => handleBlock(e)}>
              Block
            </button>
            {statusSetter()}
          </div>
          <div className="bottomProfileContainer">
            <div className="bottomR">
              <legend>Questionaire</legend>
              <h4>Child Age : {profileInfo.intake?.age}</h4>
              <h4>Favorite Color : {profileInfo.intake?.favoriteColor}</h4>
              <h4>
                Vaccinated : {profileInfo.intake?.vaccination ? `Yes` : `No`}
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.users.singleUser,
    myId: state.auth.id,
    status: state.users.status,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: (userId) => dispatch(fetchSingleUser(userId)),
    checkStatus: (friendId) =>
      dispatch(checkFriendStatus(friendId)),
    friendRequest: (friendId) =>
      dispatch(sendFriendRequest(friendId)),
    blockUser: (friendId, status) =>
      dispatch(updateFriendStatus(friendId, status)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OthersProfile);
