import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import AllEvents from './components/AllEvents';
import { Login, Signup } from './components/AuthForm';
import Chat from './components/Chat';
import CreateEvent from './components/CreateEvent';
import Questionaire from './components/Questionaire';
import SingleEvent from './components/SingleEvent';
import UserPage from './components/UserPage';
import Places from './components/places';
import SinglePlaceDetailedView from './components/SinglePlaceDetailedView';
import UserProfile from './components/UserProfile';
import { me } from './store';
import OthersProfile from './components/OthersProfile';
import CreateChannel from './components/chat_components/CreateChannel';

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const { isLoggedIn } = this.props;

    return (
      <div>
        {isLoggedIn ? (
          <Switch>
            <Route exact path='/home' component={UserPage} />

            <Route exact path='/events' component={AllEvents} />

            <Route exact path='/events/create' component={CreateEvent} />
            <Route exact path='/events/:id' component={SingleEvent} />
            <Route path='/questionaire' component={Questionaire} />
            <Route exact path='/places' component={Places} />
            <Route
              exact
              path='/place/view'
              component={SinglePlaceDetailedView}
            />
            <Route path='/chat' component={Chat} />
            <Route exact path='/profile/:userId' component={OthersProfile} />
            <Route exact path='/myProfile' component={UserProfile} />
            <Route exact path='/channels/create' component={CreateChannel} />
            <Redirect to="/home" />
          </Switch>
        ) : (
          <Switch >
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />
            <Redirect to="/login" />
          </Switch >
        )}
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadInitialData() {
      dispatch(me());
    },
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));
