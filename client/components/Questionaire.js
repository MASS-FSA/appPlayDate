import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createUserIntake, updateSingleUser } from "../store/users";
import { OpenStreetMapProvider } from "leaflet-geosearch";
// learn constant hook for this later
let provider;

export const Questionaire = (props) => {
  const [intake, setIntake] = useState({
    age: "",
    vaccination: false,
    favoriteColor: "",
    address: "",
  });

  useEffect(() => {
    if (!provider) provider = new OpenStreetMapProvider();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setIntake((prevInfo) => {
      return {
        ...prevInfo,
        [name]: value,
      };
    });
  }

  async function handleSubmit(body) {
    if (body.age === "") return alert(`Please add child's age`);
    const userLocation = { address: body.address };
    try {
      const [{ x, y }] = await parseAddress(userLocation.address);
      userLocation.homeLatitude = y.toFixed(7);
      userLocation.homeLongitude = x.toFixed(7);
      props.updateUser(userLocation);
      props.addIntake(body);
      props.history.push(`/home`);
    } catch (error) {
      console.error(error);
    }
  }

  async function parseAddress(address) {
    const results = await provider.search({ query: address });
    return results;
  }

  return (
    <div className="questioncontainer">
      <div className="lines" />
      <form>
        <label>Address</label>
        <input name="address" value={intake.address} onChange={handleChange} />
        <br />
        <label>What is your child's age?</label>
        <input name="age" value={intake.age} onChange={handleChange} />
        <br />
        <label>Are you and your child vaccinated?</label>
        <select
          name="vaccination"
          value={intake.vaccination}
          onChange={handleChange}
        >
          <option value={false}>False</option>
          <option value={true}>True</option>
        </select>
        <br />
        <label>What is your favorite color?</label>
        <input
          name="favoriteColor"
          value={intake.favoriteColor}
          onChange={handleChange}
        />
        <br />
        <button
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(intake);
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    me: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addIntake: (body) => dispatch(createUserIntake(body)),
    updateUser: (body) => dispatch(updateSingleUser(body)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Questionaire);
