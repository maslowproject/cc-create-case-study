import React from 'react';
import { Route, Router } from 'react-router-dom';
import { connect } from 'react-redux';
import cx from 'classnames';
import { setMobileNavVisibility } from '../../reducers/Layout';
import { withRouter } from 'react-router-dom';
import LoadingScreen from 'react-loading-screen'

import Header from './Header';
import Footer from './Footer';
import SideBar from '../../components/SideBar';
import ThemeOptions from '../../components/ThemeOptions';
import MobileMenu from '../../components/MobileMenu';
/**
 * Pages
 */
import Dashboard from '../Dashboard';
import Components from '../Components';
import UserProfile from '../UserProfile';
import MapsPage from '../MapsPage';
import Forms from '../Forms';
import Charts from '../Charts';
import Calendar from '../Calendar';
import Tables from '../Tables';

import ccLogo from '../../assets/images/crown-castle-vector-logo-small.png'

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    const component = this

    setTimeout(() => component.setState({ loading: false }), 4500)
  }

  render() {
    const {
      mobileNavVisibility,
      hideMobileMenu,
      history
    } = this.props

    history.listen(() => {
      if (mobileNavVisibility === true) {
        hideMobileMenu();
      }
    })

    if (this.state.loading) {
      return <LoadingScreen
        loading={true}
        bgColor='#f1f1f1'
        spinnerColor='#9ee5f8'
        textColor='#676767'
        logoSrc={ccLogo}
      > 
      </LoadingScreen>
    }

    return (
      <div className={cx({
        'nav-open': mobileNavVisibility === true
      })}>
        <div className="wrapper">
          <div className="close-layer" onClick={hideMobileMenu}></div>
          <SideBar />

          <div className="main-panel">
            <Header />
            <Route exact path="/" component={MapsPage} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/table" component={Tables} />
          { // <Route path="/components" component={Components} />
            // <Route path="/profile" component={UserProfile} />
            // <Route path="/forms" component={Forms} />
            // <Route path="/charts" component={Charts} />
            // <Route path="/calendar" component={Calendar} />
    }
            <Footer />
          </div>
        </div>
      </div>
    )
  }
};

const mapStateToProp = state => ({
  mobileNavVisibility: state.Layout.mobileNavVisibility
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  hideMobileMenu: () => dispatch(setMobileNavVisibility(false))
});

export default withRouter(connect(mapStateToProp, mapDispatchToProps)(Main));