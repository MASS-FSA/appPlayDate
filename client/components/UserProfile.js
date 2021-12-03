import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchSingleUser, updateSingleUser } from "../store/users";

export const UserProfile = (props) => {
  const { user } = props;
  const [edit, setEdit] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    name: "",
    image: "",
    state: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    async function getUserData() {
      try {
        props.match.params.userId
          ? await props.getUser(props.match.params.userId)
          : await props.getUser(props.myId);
      } catch (error) {
        console.error(error);
      }
    }

    getUserData();
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

  function handleSubmit() {
    props.updateUser(props.match.params.userId, profileInfo);

    setEdit((prevEdit) => !prevEdit);
  }

  return (
    <div>
      {!edit ? (
        <div>
          <section className="user_profile_section">
            <div>
              <img src={user.image} height="300px" />
            </div>
            <div>
              <h3>{user.username}</h3>
              <p>{user.bio}</p>
              <div>
                <p>Email: {user.email}</p>
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
    updateUser: (userId, body) => dispatch(updateSingleUser(userId, body)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
