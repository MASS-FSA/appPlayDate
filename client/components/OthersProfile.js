import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchSingleUser } from "../store/users";

export const OthersProfile = ({ user, getUser, match, myId, history }) => {
  const [profileInfo, setProfileInfo] = useState({
    name: "",
    image: "",
    state: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    if (Number(match.params.userId) === Number(myId))
      history.push(`/myProfile`);
    else getUser(match.params.userId);
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
      };
    });
  }, [user]);

  return (
    <div>
      <div>
        <section className="user_profile_section">
          <div>
            <img src={profileInfo.image} height="300px" />
          </div>
          <div>
            <h3>{profileInfo.username}</h3>
            <p>{profileInfo.bio}</p>
            <div>
              <p>Email: {profileInfo.email}</p>
              <p>State: {profileInfo.state}</p>
              <p>Member Since: {profileInfo.createdAt?.slice(0, 10)}</p>
            </div>
          </div>
        </section>
        <fieldset>
          <legend>Questionaire</legend>
          <h4>Child Age {profileInfo.intake?.age}</h4>
          <h4>Favorite Color {profileInfo.intake?.favoriteColor}</h4>
          <h4>Vaccinated? {profileInfo.intake?.vaccination ? `Yes` : `No`}</h4>
        </fieldset>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.users.singleUser,
    myId: state.auth.id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: (userId) => dispatch(fetchSingleUser(userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OthersProfile);
