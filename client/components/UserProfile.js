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
    props.checkRequests();
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
    try {
      // make sure not to overuse OpenStreeAPI if User address already exists
      if (profileInfo.address !== "" && !props.user.address) {
        const [{ x, y }] = await parseAddress(infoObject.address);
        infoObject.homeLongitude = x.toFixed(7);
        infoObject.homeLatitude = y.toFixed(7);
      }
      props.updateUser(infoObject);

      setEdit((prevEdit) => !prevEdit);
    } catch (error) {
      console.error(error);
    }
  }

  function handleUpdateRequest(event, friendId) {
    event.preventDefault();
    props.updateRequest(friendId, event.target.value);
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
            <div className="leftright">
              <div className="leftsideContainer">
                <img src={user.image} />
                <p>Member Since: {user.createdAt?.slice(0, 10)}</p>
              </div>
              <div className="rightsideContainer">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleEdit();
                  }}
                >
                  ☰Edit
                </button>
                <h3>{user.username}</h3>
                <p className="hideoverflow">{user.bio}</p>
                <div>
                  <p className="hideoverflow">Email: {user.email}</p>
                  <p className="hideoverflow">Address: {user.address}</p>
                  <p>State: {user.state}</p>
                </div>
              </div>
            </div>
          </section>
          <div className="bottomProfileContainer">
            <div className="bottomQ">
              <legend>Questionaire</legend>
              <h4>Child Age {user.intake?.age}</h4>
              <h4>Favorite Color {user.intake?.favoriteColor}</h4>
              <h4>Vaccinated? {user.intake?.vaccination ? `Yes` : `No`}</h4>
            </div>

            {props.requests.map((request, index) => {
              return (
                <div className="bottomR" key={index}>
                  <div>
                    <h4>Request</h4>
                    <p>{request.requester.username}</p>
                  </div>
                  <img
                    src={request.requester.image}
                    height="50px"
                    onClick={() =>
                      props.history.push(`/profile/${request.requester.id}`)
                    }
                  />
                  <div className="buttoncontainer">
                    <button
                      value="accepted"
                      onClick={(e) =>
                        handleUpdateRequest(e, request.requester.id)
                      }
                    >
                      ✔️
                    </button>
                    <button
                      value="declined"
                      onClick={(e) =>
                        handleUpdateRequest(e, request.requester.id)
                      }
                    >
                      ❌
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="questioncontainer">
          <div className="lines" />
          <form>
            {/* <label>Image</label>
            <img src={profileInfo.image} /> */}
            <br />

            <input
              name="image"
              value={profileInfo.image}
              onChange={handleChange}
            />
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
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              Save
            </button>
          </form>
        </div>
      )}
      <div>
        <img id="MASSMasscot" src="https://i.imgur.com/DD4vIP9.png" alt="" />
      </div>
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
    updateUser: (body) => dispatch(updateSingleUser(body)),
    checkRequests: () => dispatch(fetchFriendRequests()),
    updateRequest: (friendId, response) =>
      dispatch(updateFriendStatus(friendId, response)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
