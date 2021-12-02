import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import AllEvents from './components/AllEvents';
import { Login, Signup } from './components/AuthForm';
import Chat from './components/Chat';
import CreateEvent from './components/CreateEvent';
import Home from './components/Home';
import Questionaire from './components/Questionaire';
import SingleEvent from './components/SingleEvent';
import UserPage from './components/UserPage';
import PlacesTest from './components/placesTest';
import { me } from './store';

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
            <Route exact path='/home' component={Home} />
            <Route exact path='/events' component={AllEvents} />
            <Route exact path='/user' component={UserPage} />
            <Route exact path='/events/create' component={CreateEvent} />
            <Route exact path='/events/:id' component={SingleEvent} />
            <Route path='/questionaire' component={Questionaire} />
            <Route exact path='/placesTest' component={PlacesTest} />
          </Switch>
        ) : (
          <Switch>
            <Route path='/' exact component={Login} />
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />
            <Route exact path='/user' component={UserPage} />
            <Route path='/chat' component={Chat} />
            <Route path='/questionaire' component={Questionaire} />
            <Route exact path='/placesTest' component={PlacesTest} />
          </Switch>
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
