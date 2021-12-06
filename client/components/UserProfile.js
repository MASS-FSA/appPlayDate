import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  fetchFriendRequests,
  fetchSingleUser,
  updateFriendStatus,
  updateSingleUser,
} from "../store/users";

import { OpenStreetMapProvider } from "leaflet-geosearch";

// learn constant hook for this later
let provider;

export const UserProfile = (props) => {
  const { user } = props;
  const [edit, setEdit] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    name: "",
    image: "",
    state: "",
    email: "",
    bio: "",
    address: "",
  });

  useEffect(() => {
    async function getUserData() {
      try {
        //Get users information
        await props.getUser(props.myId);

        // Geosearch with leaflet-geosearch
        if (!provider) provider = new OpenStreetMapProvider();
      } catch (error) {
        console.error(error);
      }
    }

    getUserData();
    props.checkRequests(props.myId);
  }, []);

  useEffect(() => {
    setProfileInfo((prevState) => {
      return {
        ...prevState,
        username: props.user.username || "",
        image: props.user.image || "",
        state: props.user.state || "",
        email: props.user.email || "",
        bio: props.user.bio || "",
        address: props.user.address || "",
      };
    });
  }, [user]);

  function handleEdit() {
    setEdit((prevEdit) => !prevEdit);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setProfileInfo((prevInfo) => {
      return {
        ...prevInfo,
        [name]: value,
      };
    });
  }

  async function handleSubmit() {
    const infoObject = { ...profileInfo };
    // make sure not to overuse OpenStreeAPI if User address already exists
    if (profileInfo.address !== "" && !props.user.address) {
      const [{ x, y }] = await parseAddress(infoObject.address);
      infoObject.homeLongitude = x.toFixed(7);
      infoObject.homeLatitude = y.toFixed(7);
    }
    props.updateUser(props.myId, infoObject);

    setEdit((prevEdit) => !prevEdit);
  }

  function handleUpdateRequest(event, friendId) {
    event.preventDefault();
    props.updateRequest(props.myId, friendId, event.target.value);
  }

  async function parseAddress(address) {
    const results = await provider.search({ query: address });
    return results;
  }

  return (
    <div>
      {!edit ? (
        <div>
          <section className="user_profile_section">
            <div className="leftsideContainer">
              <img src={user.image} />
            </div>
            <div className="rightsideContainer">
              <h3>{user.username}</h3>
              <p>{user.bio}</p>
              <div>
                <p>Email: {user.email}</p>
                <p>Address: {user.address}</p>
                <p>State: {user.state}</p>
                <p>Member Since: {user.createdAt?.slice(0, 10)}</p>
              </div>
            </div>
          </section>
          <fieldset>
            <legend>Questionaire</legend>
            <h4>Child Age {user.intake?.age}</h4>
            <h4>Favorite Color {user.intake?.favoriteColor}</h4>
            <h4>Vaccinated? {user.intake?.vaccination ? `Yes` : `No`}</h4>
          </fieldset>
        </div>
      ) : (
        <div>
          <form>
            <div>
              <img src={user.image} />
              <label>Image</label>
              <input
                name="image"
                value={profileInfo.image}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Name</label>
              <input
                name="username"
                value={profileInfo.username}
                onChange={handleChange}
              />
              <br />
              <label>User Bio</label>
              <textarea
                name="bio"
                value={profileInfo.bio}
                onChange={handleChange}
              />
              <br />
              <div>
                <label>Email</label>
                <input
                  name="email"
                  value={profileInfo.email}
                  onChange={handleChange}
                />
                <br />
                <label>Address</label>
                <input
                  name="address"
                  value={profileInfo.address}
                  onChange={handleChange}
                />
                <br />
                <label>State</label>
                <input
                  name="state"
                  value={profileInfo.state}
                  onChange={handleChange}
                />
              </div>
            </div>
          </form>
        </div>
      )}
      <button
        onClick={(e) => {
          e.preventDefault();
          edit ? handleSubmit() : handleEdit();
        }}
      >
        {edit ? `Save` : `Edit`}
      </button>
      {props.requests.map((request, index) => {
        return (
          <fieldset key={index}>
            <p>Request from {request.requester.username}</p>
            <img
              src={request.requester.image}
              height="50px"
              onClick={() =>
                props.history.push(`/profile/${request.requester.id}`)
              }
            />
            <button
              value="accepted"
              onClick={(e) => handleUpdateRequest(e, request.requester.id)}
            >
              Accept
            </button>
            <button
              value="declined"
              onClick={(e) => handleUpdateRequest(e, request.requester.id)}
            >
              Decline
            </button>
          </fieldset>
        );
      })}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.users.singleUser,
    myId: state.auth.id,
    requests: state.users.requests,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: (userId) => dispatch(fetchSingleUser(userId)),
    updateUser: (userId, body) => dispatch(updateSingleUser(userId, body)),
    checkRequests: (userId) => dispatch(fetchFriendRequests(userId)),
    updateRequest: (userId, friendId, response) =>
      dispatch(updateFriendStatus(userId, friendId, response)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
