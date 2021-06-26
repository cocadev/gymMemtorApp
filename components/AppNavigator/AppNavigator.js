import React from 'react';
import { Image,Platform, Dimensions } from 'react-native';
import { Icon, Header, Footer, FooterTab, Button, Text } from 'native-base';
import { NavigationActions, createStackNavigator, createBottomTabNavigator  } from "react-navigation";
import Orientation from 'react-native-orientation';
import {setCurrentNavigationTab} from "../../components/Store/actions";

import footerIconHome from "../../assets/icon-home.png";
import footerIconVideos from "../../assets/icon-videos.png";
import footerIconPlaylists from "../../assets/icon-playlists.png";
import footerIconProfile from "../../assets/icon-profile.png";

import Home from "../../pages/Home/Home";
import ApparatusDeSelect from "../../pages/ApparatusDeSelect/ApparatusDeSelect";
import ApparatusSelect from "../../pages/ApparatusSelect/ApparatusSelect";
import GradeSelect from "../../pages/GradeSelect/GradeSelect";
import GradesLevelSelect from "../../pages/GradeSelect/GradesLevelSelect";
import VideoSelect from "../../pages/VideoSelect/VideoSelect";

import SignInImage from "../../pages/SignInImage/SignInImage";
import SignIn from "../../pages/SignIn/SignIn";
import SignUp from "../../pages/SignUp/SignUp";
import SignUpConfirm from "../../pages/SignUpConfirm/SignUpConfirm";
import SignUpAge from "../../pages/SignUpAge/SignUpAge";
import SignUpTerms from "../../pages/SignUpTerms/SignUpTerms";
import SignUpTutorial from "../../pages/SignUpTutorial/SignUpTutorial";

import VideoPlayer from "../../pages/VideoPlayer/VideoPlayer";
import Playlist from "../../pages/Playlist/Playlist";
import UserPlaylist from "../../pages/Playlist/UserPlaylist";
import PlaylistDetail from "../../pages/Playlist/PlaylistDetail";

import Profile from "../../pages/Profile/Profile";
import ProfileSettings from "../../pages/Profile/ProfileSettings";
import ProfileUserDetail from "../../pages/Profile/ProfileUserDetail";
import ProfileReport from "../../pages/Profile/ProfileReport";
import ProfileRedeem from "../../pages/Profile/ProfileRedeem";


const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const isIphoneX =
    (platform === "ios") &&
    (deviceHeight >= 812) && (deviceWidth >= 375);

export const navigationStates = {
    FIRST_RUN:'FIRST_RUN',
    ACTIVATION_CODE:'ACTIVATION_CODE',
    USER_LOGGED_IN:'USER_LOGGED_IN',
    USER_NOT_LOGGED_IN:'USER_NOT_LOGGED_IN',
};




export const getCurrentRoute = (navigationState)=> {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getCurrentRoute(route);
    }

    return route;
};


const VideosNavigation = createStackNavigator(
    {
        ApparatusSelect: {
            screen: ApparatusSelect,
            path: '/videos/apparatus',
            navigationOptions : {
                header: props => {
                    return (
                        null

                    )
                }
            }
        },
        GradeSelect: {
            screen: GradeSelect,
            path: '/videos/grade',
            navigationOptions : {
                header: props => {
                    return (
                        null

                    )
                }
            }
        },
        VideoSelect: {
            screen: VideoSelect,
            path: '/videos/select',
            navigationOptions : {
                header: props => {
                    return (
                        null

                    )
                }
            }

        }

    }

);



const PlaylistNavigation = createStackNavigator(
    {
        Playlists: {
            screen: Playlist,
            path: '/playlists/',
            navigationOptions : {
                header: props => {
                    return (
                        null

                    )
                }
            }
        },
        UserPlaylists: {
            screen: UserPlaylist,
            path: '/playlists/user',
            navigationOptions : {
                header: props => {
                    return (
                        null

                    )
                }
            }
        },
        PlaylistDetail: {
            screen: PlaylistDetail,
            path: '/playlists/detail',
            navigationOptions : {
                header: props => {
                    return (
                        null

                    )
                }
            }
        }

    }

);

const ProfileNavigation = createStackNavigator(
    {
        Profile: {
            screen: Profile,
            path: '/profile/',
            navigationOptions : {
                header: props => {
                    return (
                        null

                    )
                }
            }
        },
        ProfileSettings: {
            screen: ProfileSettings,
            path: '/profile/settings',
            navigationOptions : {
                header: props => {
                    return (
                        null

                    )
                }
            }
        },
        ProfileUserDetail: {
            screen: ProfileUserDetail,
            path: '/profile/user',
            navigationOptions : {
                header: props => {
                    return (
                        null

                    )
                }
            }
        },
        ProfileReport: {
            screen: ProfileReport,
            path: '/profile/report',
            navigationOptions : {
                header: props => {
                    return (
                        null

                    )
                }
            }
        },
        ProfileRedeem: {
            screen: ProfileRedeem,
            path: '/profile/redeem',
            navigationOptions : {
                header: props => {
                    return (
                        null

                    )
                }
            }
        },
        ProfileApparatusDeSelect: {
            screen: ApparatusDeSelect,
            path: '/profile/apparatusdeselect',
            navigationOptions : {
                header: props => {
                    return (
                        null

                    )
                }
            }
        },
        ProfileGradesSelect: {
            screen: GradesLevelSelect,
            path: '/profile/gradesselect',
            navigationOptions : {
                header: props => {
                    return (
                        null

                    )
                }
            }
        }

    }

);



const MainTabNavigation = createBottomTabNavigator({
    Home: {
        screen: Home,
        navigationOptions:{
            tabBarIcon:({ tintColor })=><Icon name="home" style={{color:tintColor}} />,

        }
    },
    Videos: {
        screen: VideosNavigation,
        navigationOptions:{
            tabBarIcon:({ tintColor })=><Icon name="play" style={{color:tintColor}} />,

        }
    },
    Playlists: {
        screen: PlaylistNavigation,
        navigationOptions:{
            tabBarIcon:({ tintColor })=><Icon name="list" style={{color:tintColor}} />
        }
    },
    Profile: {
        screen: ProfileNavigation,
        navigationOptions:{
            tabBarIcon:({ tintColor })=><Icon name="person" style={{color:tintColor}} />
        }
    }
}, {
    animationEnabled: false,
    swipeEnabled: false,
    tabBarPosition: 'bottom',
    tabBarComponent: props => {

        const {navigation} = props;
        const {state} = navigation;
        const selectedTab = state.index;

        const footerNavigation = (routeName,key)=>{
            const navigateAction = NavigationActions.navigate({
                routeName,
                key,
                params:{selectedTab:0}
            });
            //props.navigation.dispatch(navigateAction);
            props.navigation.navigate(routeName);
        };

        let isSelectMode = false;
        if (props.screenProps.changedState === "Videos") {
            isSelectMode = (props.screenProps.state.isSelectMode === true);
        } else {
            if(props.screenProps.state.isSelectMode){isSelectMode=props.screenProps.state.isSelectMode}
        }

        //console.log(props,state.index, state.routeName);

        return (

            (isSelectMode)?

                null

                :
                (!props.screenProps.hideFooter)&&
            <Footer>
                <FooterTab>
                    <Button vertical active={selectedTab === 0} style={{paddingLeft:0,paddingRight:0, paddingBottom:0}} onPress={()=>{
                        if(selectedTab !== 0){
                            footerNavigation("Home","Home");
                            Orientation.unlockAllOrientations();
                        }
                    }}>
                        <Image style={[{width: 32, height: 32, },(selectedTab === 0)?{tintColor: "#5c96f5"}:{}]}
                               source={footerIconHome}/>
                        <Text style={{fontSize:10}}>Home</Text>
                    </Button>
                    <Button vertical active={selectedTab === 1} style={{paddingLeft:0,paddingRight:0, paddingBottom:0}} onPress={()=>{
                        if(selectedTab !== 1){
                            footerNavigation("Videos","Videos");
                            Orientation.unlockAllOrientations();
                        }
                    }}>
                        <Image style={[{width: 32, height: 32, },(selectedTab === 1)?{tintColor: "#5c96f5"}:{}]}
                               source={footerIconVideos}/>
                        <Text style={{fontSize:10}}>Videos</Text>
                    </Button>
                    <Button vertical active={selectedTab === 2} style={{paddingLeft:0,paddingRight:0, paddingBottom:0}} onPress={()=>{
                        if(selectedTab !== 2){
                            footerNavigation("Playlists","Playlists");
                            Orientation.unlockAllOrientations();
                        }
                    }}>
                        <Image style={[{width: 32, height: 32, },(selectedTab === 2)?{tintColor: "#5c96f5"}:{}]}
                               source={footerIconPlaylists}/>
                        <Text style={{fontSize:10,paddingLeft:0,paddingRight:0,}}>Playlists</Text>
                    </Button>
                    <Button vertical active={selectedTab === 3} style={{paddingLeft:0,paddingRight:0, paddingBottom:0}} onPress={()=>{
                        if(selectedTab !== 3){
                            Orientation.lockToPortrait();
                            footerNavigation("Profile","Profile");
                        }
                    }}>
                        <Image style={[{width: 32, height: 32, },(selectedTab === 3)?{tintColor: "#5c96f5"}:{}]}
                               source={footerIconProfile}/>
                        <Text style={{fontSize:10}}>Profile</Text>
                    </Button>

                </FooterTab>
            </Footer>


        )
    }


});


const FirstRunNavigation = createStackNavigator({

    SignUpConfirm: {
        screen: SignUpConfirm,
    },
    SignUpAge: {
        screen: SignUpAge,
    },
    SignUpTerms: {
        screen: SignUpTerms,
    },
    SignUpTutorial: {
        screen: SignUpTutorial,
    },

    ApparatusDeSelect: {
        screen: ApparatusDeSelect,
    },

}, {

    navigationOptions:  {
        header: props => {
            return (
                (isIphoneX)?<Header style={{height:8, paddingTop:0, marginTop:0}}/>:<Header style={{height:0}}/>

            )
        }
    }


});

const SignInTabNavigation = createBottomTabNavigator({
    SignInImage: {
        screen: SignInImage,
        navigationOptions: {
            tabBarVisible: false,
        }
    },
    SignIn: {
        screen: SignIn,
        navigationOptions: {
            tabBarVisible: false,
        }
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            tabBarVisible: false,
        }
    },
    SignUpConfirm: {
        screen: SignUpConfirm,
        navigationOptions: {
            tabBarVisible: false,
        }
    },
    SignUpAge: {
        screen: SignUpAge,
        navigationOptions: {
            tabBarVisible: false,
        }
    },
    SignUpTerms: {
        screen: SignUpTerms,
        navigationOptions: {
            tabBarVisible: false,
        }
    },
    SignUpTutorial: {
        screen: SignUpTutorial,
        navigationOptions: {
            tabBarVisible: false,
        }
    },
}, {
    animationEnabled: true,
    swipeEnabled:false,
    headerMode:"screen"
});



export const AppNavigator = createStackNavigator(
    {

        Register: {
            screen: SignInTabNavigation,
            path: '/signin',
            navigationOptions : {
                header: props => {
                    return (
                        (isIphoneX)?<Header style={{height:8, paddingTop:0, marginTop:0}}/>:<Header style={{height:0}}/>

                    )
                }
            }
        },
        MainNav: {
            screen: MainTabNavigation,
            path: '/home',
            navigationOptions : {
                header: props => {

                    return (
                        (isIphoneX)?<Header style={{height:8, paddingTop:0, marginTop:0}}/>:<Header style={{height:0}}/>

                    )
                }
            }
        },
        FirstRun: {
            screen: FirstRunNavigation,
            path: '/firstrun',
            navigationOptions : {
                header: props => {
                    return (
                        (isIphoneX)?<Header style={{height:8, paddingTop:0, marginTop:0}}/>:<Header style={{height:0}}/>

                    )
                }
            }
        },

        VideoPlayer: {
            screen: VideoPlayer,
            path: '/videos/player',
            navigationOptions : {
                header: props => {
                    return (
                        null
                        //<Header style={{height:0}}/>

                    )
                }
            }
        },


    }

);


export const AppNavigatorLoggedIn = createStackNavigator(
    {
        MainNav: {
            screen: MainTabNavigation,
            path: '/home',
            navigationOptions : {
                header: props => {
                    return (
                        (isIphoneX)?<Header style={{height:8, paddingTop:0, marginTop:0}}/>:<Header style={{height:0}}/>

                    )
                }
            }
        },

        FirstRun: {
            screen: FirstRunNavigation,
            path: '/videos/deselect',
            navigationOptions : {
                header: props => {
                    return (
                        (isIphoneX)?<Header style={{height:8, paddingTop:0, marginTop:0}}/>:<Header style={{height:0}}/>

                    )
                }
            }
        },

        VideoPlayer: {
            screen: VideoPlayer,
            path: '/videos/player',
            navigationOptions : {
                header: props => {
                    return (
                        null
                        //<Header style={{height:0}}/>

                    )
                }
            }
        },



    }

);

//export const AppContainer = createAppContainer(AppNavigator);
//export const AppContainerLoggedIn = createAppContainer(AppNavigatorLoggedIn);

