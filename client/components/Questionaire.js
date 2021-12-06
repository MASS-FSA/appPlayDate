import React, { useState } from "react";
import { connect } from "react-redux";
import { createUserIntake } from "../store/users";

export const Questionaire = (props) => {
  const [intake, setIntake] = useState({
    age: "",
    vaccination: false,
    favoriteColor: "",
  });

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
    try {
      props.addIntake(props.me.id, body);
      props.history.push(`/home`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="questioncontainer">
      <div className="lines" />
      <form>
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
    addIntake: (userId, body) => dispatch(createUserIntake(userId, body)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Questionaire);
