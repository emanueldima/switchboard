import React from 'react';
import ReactDOM from 'react-dom';
import {compose, applyMiddleware, createStore} from 'redux';
import {connect, Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {withRouter, BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import Modal from 'react-modal';

import {clientPath} from './constants';
import rootReducers from './actions/reducers';
import * as actions from './actions/actions';

import {NavBar} from './components/NavBar';
import {FooterContainer} from './containers/FooterContainer';
import {MainContainer} from './containers/MainContainer';
import {InputContainer} from './containers/InputContainer';
import {AllToolsContainer} from './containers/AllToolsContainer';
import {AlertsContainer} from './containers/AlertsContainer';
import {AboutContainer, HelpContainer} from './containers/HelpContainers';


// polyfill for IE11
if (!window.origin) {
    const loc = window.location;
    window.origin = loc.protocol + "//" + loc.hostname + (loc.port ? ':' + loc.port: '');
}

function middleware() {
    if (process.env.NODE_ENV === 'production') {
        return applyMiddleware(thunk);
    }
    const rde = window.__REDUX_DEVTOOLS_EXTENSION__;
    const devTools = (rde && rde()) || (f => f);
    return compose(applyMiddleware(thunk), devTools);
}
const store = createStore(rootReducers, middleware());


Modal.setAppElement("#reactapp");


class FrameComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="bodycontainer">
                <NavBar history={this.props.history} mode={this.props.mode}/>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            {this.props.children}
                        </div>
                    </div>
                </div>
                <AlertsContainer/>
            </div>
        );
    }
}
const Frame = withRouter(connect(state=>({mode:state.mode}), ()=>({}))(FrameComponent));


class Application extends React.Component {
    constructor(props) {
        super(props);

        this.props.history.listen((location, action) => {
            if (action === 'POP') {
                store.dispatch(actions.)
                console.log({location, action});
            }
            _paq.push(['setCustomUrl', window.location.href]);
            _paq.push(['trackPageView']);
        });

        store.dispatch(actions.fetchApiInfo());
        store.dispatch(actions.fetchAllTools());
        store.dispatch(actions.fetchMediatypes());
        store.dispatch(actions.fetchLanguages());

        if (window.SWITCHBOARD_DATA) {
            const data = window.SWITCHBOARD_DATA;
            if (data.popup) {
                store.dispatch(actions.setMode('popup'));
            }
            if (data.errorMessage) {
                store.dispatch(actions.showResourceError(data.errorMessage));
            } else if (data.fileInfoID) {
                store.dispatch(actions.fetchAsyncResourceState(data.fileInfoID));
            }
            delete window.SWITCHBOARD_DATA;
        }

        // // load a text file by default for testing
        // store.dispatch(require("./actions/actions").uploadLink({
        //     url:'https://b2drop.eudat.eu/s/ekDJNz7fWw69w5Y', origin:'b2drop'}))
    }

    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Frame>
                        <Switch>
                            <Route exact path={clientPath.root}>
                                <MainContainer/>
                            </Route>
                            <Route exact path={clientPath.input}>
                                <InputContainer tab={0}/>
                            </Route>
                            <Route exact path={clientPath.inputurl}>
                                <InputContainer tab={1}/>
                            </Route>
                            <Route exact path={clientPath.inputtext}>
                                <InputContainer tab={2}/>
                            </Route>
                            <Route exact path={clientPath.tools}>
                                <AllToolsContainer/>
                            </Route>
                            <Route exact path={clientPath.help} component={HelpContainer} />
                            <Route exact path={clientPath.about} component={AboutContainer} />
                            <Route component={NotFound} />
                        </Switch>
                    </Frame>
                    { store.getState().mode === 'popup' ?
                        false : // no footer in popup mode
                        <FooterContainer />
                    }
                </BrowserRouter>
            </Provider>
        );
    }
}

const NotFound = () => (
    <div>This page is not found!</div>
);

ReactDOM.render(<Application />, document.getElementById('reactapp'));
