import React, { Component } from 'react';
import { StyleProvider, Root, Container } from 'native-base';
import getTheme from './native-base-theme/components';
import platform from './native-base-theme/variables/platform';
import Store from "./components/Store/Store";
import {APP_LOGIN_COMPLETE, APP_LOGOUT_COMPLETE} from "./components/Store/actions";
//import {AppContainer, AppContainerLoggedIn, getCurrentRoute } from "./components/AppNavigator/AppNavigator";
import {AppNavigator, AppNavigatorLoggedIn, getCurrentRoute } from "./components/AppNavigator/AppNavigator";
import OneSignal from 'react-native-onesignal';
import {checkDuplicateNotification} from "./components/Store/effects";


export default class App extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            route:"",
            prevRoute:"",
            isUserLoggedIn:false,
            isReady:false,
            pushNotificationData: {
                userId: "",
                pushToken: "",
                receivedNotificationData: {},
            },
            Notifications: [],

        };
    }

    async componentWillMount() {

        OneSignal.setLogLevel(7, 0);
        let requiresConsent = false;
        OneSignal.setRequiresUserPrivacyConsent(requiresConsent);
        OneSignal.init("ba096896-989e-4dd7-a5f2-f97e248f9b8a", {kOSSettingsKeyAutoPrompt : true});
        OneSignal.setLocationShared(true);
        OneSignal.inFocusDisplaying(2);
    }

    componentDidMount() {

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
        OneSignal.addEventListener('emailSubscription', this.onEmailRegistrationChange);
        OneSignal.configure();

/*        OneSignal.getPermissionSubscriptionState((subscriptionState) => {
            console.log(subscriptionState);
        });*/
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
        OneSignal.removeEventListener('emailSubscription', this.onEmailRegistrationChange);
    }

    onEmailRegistrationChange = (registration)=> {
        console.log("onEmailRegistrationChange: ", registration);
    };

    onReceived = (notification)=> {
        console.log("Notification received: ", notification);

        const receivedNotificationData = {
            ...notification.payload.additionalData,
            message: notification.payload.body,
            title: notification.payload.title,
            id: notification.payload.notificationID,
            onOpen: false,
        };

        const pushNotificationData = {
            receivedNotificationData,
            ...this.state.pushNotificationData,

        };

        if (!checkDuplicateNotification(receivedNotificationData.id, this.state.Notifications)) {
            this.setState({
                Notifications: [
                    receivedNotificationData,
                    ...this.state.Notifications,
                ]
            });
        }

    };

    onOpened = (openResult)=> {

        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);

        const {notification} = openResult;
        const receivedNotificationData = {
            ...notification.payload.additionalData,
            message: notification.payload.body,
            title: notification.payload.title,
            id: notification.payload.notificationID,
            onOpen: true,
        };

        if (!checkDuplicateNotification(receivedNotificationData.id, this.state.Notifications)) {
            this.setState((state)=>({
                Notifications: [
                    receivedNotificationData,
                    ...state.Notifications,
                ]
            }));
        }

    };

    onIds = (device)=> {
        //console.log('Device info: ', device);
        if (!this.state.pushNotificationData.userId) {
            const {userId} = device;
            const {pushToken} = device;
            this.setState({
                pushNotificationData: {
                    ...this.state.pushNotificationData,
                    userId,
                    pushToken,
                }
            });
        }
    };

    appDispatch = async (action)=>{

        switch (action.type) {
            case APP_LOGIN_COMPLETE:
                this.setState({isUserLoggedIn:true});
                break;
            case APP_LOGOUT_COMPLETE:
                this.setState({isUserLoggedIn:false});
                break;
            default:
                break;

        }
        return true;
    };

    navStateAction = (prevState, currentState)=> {

        const prevScreen = getCurrentRoute(prevState);
        const currentScreen = getCurrentRoute(currentState);

        if(prevScreen.routeName!==currentScreen.routeName){
/*            this.setState({
                route:currentScreen,
                prevRoute:prevScreen,
            });*/
        }

    };


    render() {

    return (
        <StyleProvider  style={getTheme(platform)}>
            <Root>
                <Container>
                <Store
                    appDispatch={this.appDispatch}
                    pushNotificationUserId={this.state.pushNotificationData.userId}
                    pushNotifications={this.state.Notifications}
                >
                    {
                        (this.state.isUserLoggedIn)?
                            <AppNavigatorLoggedIn
                                onNavigationStateChange={(prevState, currentState)=>this.navStateAction(prevState, currentState)}
                                uriPrefix="/gymmentor"
                            />
                            :
                            <AppNavigator
                                onNavigationStateChange={(prevState, currentState)=>this.navStateAction(prevState, currentState)}
                                uriPrefix="/gymmentor"
                            />
                    }

                </Store>
                </Container>
            </Root>
        </StyleProvider>
    );
  }
}

