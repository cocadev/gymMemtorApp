import React, { Component } from 'react';
import {View, ActivityIndicator, Dimensions, ImageBackground} from 'react-native';
import * as actions from "./actions";
import * as effects from "./effects";
import sigInBg from "../../assets/signin-bg-support.png";
import RNFetchBlob from "rn-fetch-blob";
import {NavigationActions} from "react-navigation";

export default class Store extends Component{

    constructor(props) {
        super(props);

        this.dispatch = this.dispatch.bind(this);

        let user = {};

        const initialState = {
            API:{
                server:"http://api.gymnasticsmentor.com",
                elasticSearchServer:"http://api.gymnasticsmentor.com",
                loginPath:"/user/login",
                registerPath:"/user/register",
                verifyPath:"/user/verify?basic_return=true",
                userCategoryPath:"/user/me/category",
                userPath:"/user/me",
                tutorialCompletedPath:"/user/completed",
                tutorialCountsPath:"/category/counts",
                apparatusSelectPath:"/user/apparatus",
                categoryPath:"/user/category",
                tutorialPath:"/tutorial",
                iconImagePath:"http://admin.gymnasticsmentor.com/assets/icon",
                iconUnselectedPath:"/unselected",
                iconSelectedPath:"/selected",
                playListPath:"/user/playlist",
                playListTutorialPath:"/playlist",
                playListDuplicatePath:"/clone",
                performancePath:"/user/performance",
                viewCountPath:"/user/viewcount",
                searchPath:"/search/?query=",
                notificationsPath:"/notification",
                reportPath:"/user/report",
            },
            dimensions:{
                width:0,
                height:0
            },
            isUserLoggedIn:!!(user),
            token:false,
            localStorageKey:"@gymMentor:AppData",
            Login:{
                loginRedirect:false,
                loginError:false
            },
            Register:{
                registerRedirect:false,
                registerError:false
            },
            FirstRun:{
                activationCode:true,
                termsConditions:true,
                appTutorial:true,
                deSelectApparatus:true,
                apparatusGeneralTutorial:true,
                gradesGeneralTutorial:true,
                gradesUpperLimit:true,
                apparatusTutorial:true,
                gradeTutorial:true,
                warmUpTutorial:true,
            },
            Videos:{
                isSelectMode:false,
                isPlaylistUpdated:false,
                addToPlayListId:false,
            },
            Notifications: [],
            PerformanceData:[],
            pushNotificationData: {},
            pushNotificationUserId: "",
            hideFooter:false,
            PlayLists:[],
            RecentVideos:[],
            changedState:false,
            appInitComplete:false,
            selectedUpperGrade:10,
            selectedApparatus:[],
            ApparatusSelect:{
                allApparatus:[],
                selectedApparatus:[],
            },
            cleanInit:false,
            currentNavigationTab:0,
            searchView:{
                home:false,
                apparatus:false,
                grade:false,
                video:false,
            },
            downloadWifiOnly:true,
            downloadedTutorials:[],
            downloadedTutorialsSize:0,
            downloadTutorialsStatus:null,
            storageLimit:-1,
            allowNotifications:true,
            videoViewCountChanged:{id:0,count:0},
            tutorialCompleteChanged:false,
            commentaryOnDefault:true,


        };


        this.state = Object.assign({},initialState);


    }

    componentDidMount(){

        if(this.state.cleanInit){
            this.cleanInit().catch((error)=>console.log(error));
        } else {
            this.init().catch((error)=>console.log(error));
        }

    }


    componentWillReceiveProps(nextProps) {

        const {pushNotificationUserId} = nextProps;
        if (pushNotificationUserId) {
            if (pushNotificationUserId !== this.state.pushNotificationUserId) {
                this.setState({pushNotificationUserId});
            }
        }

        if (nextProps.pushNotifications.length > 0) {
            const lastNotification = nextProps.pushNotifications[nextProps.pushNotifications.length - 1];
            this.dispatch(actions.updateNotifications(nextProps.pushNotifications)).then(()=>{
                    if (lastNotification.onOpen) {
                        /* const productId = parseInt(lastNotification.product_id);
                        if (productId > 0) {
                            this.setState({pushNotificationData: lastNotification});
                        }*/
                    }
            }).catch((error) => error);

        }
    }



    backHandler = ()=> {

        let returnVal = false;

        switch (this.state.currentNavigationTab){
            case 0:
                if(this.state.searchView.home){
                    this.setState((state)=>({hideFooter:false,searchView:{
                            ...state.searchView,
                            home:false,
                        }}));
                }
                returnVal = true;
                break;
            case 1:

                if(this.state.searchView.apparatus){
                    this.setState((state)=>({hideFooter:false,searchView:{
                            ...state.searchView,
                            apparatus:false,
                        }}));
                    returnVal = true;
                } else
                if(this.state.searchView.grade){
                    this.setState((state)=>({hideFooter:false,searchView:{
                            ...state.searchView,
                            grade:false,
                        }}));
                    returnVal = true;
                } else
                if(this.state.searchView.video){
                    this.setState((state)=>({hideFooter:false,searchView:{
                            ...state.searchView,
                            video:false,
                        }}));
                    returnVal = true;
                }
                break;
            default:
                break;
        }


        return returnVal;

    };

    async dispatch(action){

        //console.log("action:",action);

        let dispatchResult = false;

        switch (action.type) {
            case actions.NAVIGATE:
                effects.navigate(action.navigation,action.routeName,action.reset).catch((error)=>console.log(error));
                break;
            case actions.USER_LOGIN:
                effects.userLogin(this.state,action.userData).then(
                        async (state)=>{
                            const {token} = state;
                            const {loginRedirectScreen} = state.Login;

                            await effects.setLocalData(this.state.localStorageKey,state).then(async()=>{
                                if(loginRedirectScreen==="Home"){
                                    if(token){
                                        const notificationData = await effects.loadNotifications(state);
                                        const categoryDataResult = await effects.loadCategoryData(state);
                                        this.setState({...categoryDataResult,Notifications:[...notificationData]},async ()=>{
                                            await this.props.appDispatch(actions.appLoginComplete())
                                        });
                                        //await this.props.appDispatch(actions.appLoginComplete()).then(()=>this.setState({...categoryDataResult,Notifications:[...notificationData]}))

                                    } else {
                                        this.setState(state);
                                    }

                                } else {
                                    this.setState(state);
                                }

                                this.dispatch(actions.getDownloadedTutorials()).catch((e)=>console.log(e));
                            });
                        }
                );
                break;
            case actions.USER_LOGOUT:
                effects.userLogout(this.state).then(
                    (state)=>{
                        this.setState(state,async ()=>{
                           await this.props.appDispatch(actions.appLogOutComplete());
                            this.setState({ appInitComplete:true });
                        });
                    }
                );
                break;
            case actions.USER_REGISTER:
                await effects.userRegister(this.state,action.userData).then(
                    async(registerResult)=>{
                        this.setState(registerResult);
/*                        await effects.userLogin(registerResult, {
                            username:registerResult.User.email,
                            password:registerResult.User.password,
                        }).then(async(state)=>{
                                const {token} = state;
                                if(token){
                                    const notificationData = await effects.loadNotifications(state);
                                    const categoryDataResult = await effects.loadCategoryData(state);
                                    //await this.props.appDispatch(actions.appLoginComplete()).then(()=>this.setState({...categoryDataResult,Notifications:[...notificationData]}))
                                    this.setState({...categoryDataResult,Notifications:[...notificationData]});
                                } else {
                                    this.setState(state);
                                }
                                await effects.setLocalData(this.state.localStorageKey,state).then(()=>{
                                    this.dispatch(actions.getDownloadedTutorials()).catch((e)=>console.log(e));
                                });
                        });*/


                    }
                );
                break;
            case actions.RESET_VALIDATE_FORM:
                effects.resetValidateForm(this.state, action.formName).then(
                    (state)=>{
                        //console.log(state);
                        //this.setState(state,()=>console.log(this.state));
                    }
                );
                break;
                case actions.VALIDATE_FORM:
                effects.validateForm(this.state,action.formData).then(
                    (state)=>{
                        this.setState(state);
                    }
                );
                break;
            case actions.VERIFY_USER:
                effects.verifyUser(this.state,action.verifyData).then(
                    (state)=>{
                        this.setState(state,async()=>{
                            const notificationData = await effects.loadNotifications(state);
                            const categoryDataResult = await effects.loadCategoryData(state);
                            await this.props.appDispatch(actions.appLoginComplete()).then(()=>this.setState({...categoryDataResult,Notifications:[...notificationData]}));
                            await effects.setLocalData(this.state.localStorageKey,state).then(()=>{
                                this.dispatch(actions.getDownloadedTutorials()).catch((e)=>console.log(e));
                            });

                        });
                    }

                );
                break;

            case actions.GET_USER_PROFILE:
                await effects.getUserProfile(this.state).then(
                    (result)=>{
                        dispatchResult = result;
                    }
                );
                break;
            case actions.GET_MEMBERSHIP_STATUS:
                await effects.getMembershipStatus(this.state).then(
                    (result)=>{
                        dispatchResult = result;
                    }
                );
                break;


            case actions.LOAD_CATEGORY_DATA:
                await effects.loadCategoryData(this.state).then(
                    async (state)=>{
                        dispatchResult = state;
                        this.setState(state);
                    }

                );
                break;
            case actions.GET_CATEGORY_DATA:
                await effects.getCategoryData(this.state,action.categoryId).then(
                    async (result)=>{
                        dispatchResult = result;
                    }
                );
                break;
            case actions.GET_APPARATUS_DATA:
                await effects.getApparatusData(this.state).then(
                    async (result)=>{
                        dispatchResult = result;
                    }
                );
                break;
            case actions.LOAD_TUTORIAL_DATA:
                await effects.loadTutorialData(this.state,action.categoryId).then(
                    async (result)=>{
                        dispatchResult = result;
                        if(result.error){
                            if(result.error==="invalid_token"){
                                await effects.refreshToken(this.state,this.state.token).then((result)=>{
                                    dispatchResult = result;
                                    if(result.status){
                                        if(result.status==="REFRESH_TOKEN_INVALID"){
                                            dispatchResult = {error:"REFRESH_TOKEN_INVALID"}
                                        }
                                    }
                                });
                            } else {
                                dispatchResult = result;
                            }
                        }

                    }
                );

                break;
            case actions.LOAD_PERFORMANCE_DATA:
                await effects.loadPerformanceData(this.state).then(
                    async (result)=>{
                        await this.setState(result);
                        dispatchResult = result.PerformanceData;
                    }
                );
                break;
            case actions.GET_TUTORIAL_COUNTS:
                await effects.getTutorialCounts(this.state).then(
                    async (result)=>{
                        dispatchResult = result;
                    }
                );
                break;
            case actions.GET_GRADES:
                await effects.getGrades(this.state, action.categoryId).then(
                    async (result)=>{
                        dispatchResult = result;
                    }
                );
                break;
            case actions.SET_GRADE_UPPER_LEVEL:
                await effects.setGradeUpperLevel(this.state, action.param).then(
                    async (state)=>{
                        await this.setState(state);
                        await effects.setLocalData(this.state.localStorageKey,state);
                        dispatchResult = {success:true};
                    }
                );
                break;
            case actions.SET_SELECTED_APPARATUS:
                await effects.setSelectedApparatus(this.state, action.selectedApparatus).then(
                    async (state)=>{
                        await this.setState(state);
                        await effects.setLocalData(this.state.localStorageKey,state);
                        dispatchResult = {success:true};
                    }
                );
                break;
            case actions.SET_FIRST_RUN_PARAM:
                await effects.setFirstRunParam(this.state, action.param).then(
                    async (state)=>{
                        this.setState(state);
                        await effects.setLocalData(this.state.localStorageKey,state);

                    }
                );
                break;
            case actions.GET_FIRST_RUN_PARAM:
                await effects.getFirstRunParam(this.state, action.param).then(
                    async (result)=>{
                        dispatchResult = result;
                    }
                );
                break;
            case actions.LOAD_PLAYLIST_DATA:
                await effects.loadPlayListData(this.state, action.playListId, action.fields, action.caller).then(
                    async (result)=>{
                        if(result.PlayLists){
                            await this.setState(result);
                            dispatchResult = result.PlayLists.user;
                        } else {
                            dispatchResult = result;
                        }
                    }
                );
                break;
            case actions.LOAD_PLAYLIST_TUTORIAL_DATA:
                await effects.loadPlayListTutorialData(this.state, action.playListId).then(
                    async (result)=>{
                        if(result.PlayLists){
                            await this.setState(result);
                            dispatchResult = result.PlayLists.mentor;
                        } else {
                            dispatchResult = result;
                        }

                    }
                );
                break;
            case actions.GET_PLAYLIST_BY_ID:
                await effects.getPlayListById(this.state, action.playListId).then(
                    async (result)=>{
                        dispatchResult = result;
                    }
                );
                break;
            case actions.GET_PLAYLIST_BY_TYPE:
                await effects.getPlayListByType(this.state, action.playListType).then(
                    async (result)=>{
                        dispatchResult = result;
                    }
                );
                break;
            case actions.CREATE_PLAYLIST:
                await effects.createPlayList(this.state).then(
                    async (result)=>{
                        await this.setState(result);
                        dispatchResult = result.PlayLists.user.items[0];
                    }
                );
                break;
            case actions.DUPLICATE_PLAYLIST:
                await effects.duplicatePlayList(this.state, action.playListId).then(
                    async (resultDuplicate)=>{
                        await this.setState(resultDuplicate.state);
                        dispatchResult = resultDuplicate.playlist;
                    }
                );
                break;
            case actions.DELETE_PLAYLIST:
                await effects.deletePlayList(this.state, action.playListId).then(
                    async (result)=>{
                        await this.setState(result);
                        dispatchResult = await effects.getPlayListByType(this.state,"user");
                    }
                );
                break;
            case actions.ADD_TO_PLAYLIST_SELECT:
                await effects.addToPlayListSelect(this.state, action.playListId).then(
                    async (result)=>{
                        await this.setState(result);
                    }
                );
                break;
            case actions.ADD_TO_PLAYLIST:
                await effects.toggleSelectMode(this.state).then(
                    async (resultSelectMode)=>{
                        await this.setState(resultSelectMode,async ()=>{
                            await effects.addToPlayList(this.state, action.playListId, action.tutorials).then(
                                async (resultAdd)=>{
                                    this.setState((state)=>{
                                        return {
                                        ...resultAdd,
                                        Videos:{
                                            ...state.Videos,
                                            isPlaylistUpdated:true
                                        },
                                        PlayLists:{
                                            ...state.PlayLists,
                                            isSelectMode:state.Videos.isSelectMode,
                                        },
                                    }},()=>{
                                        console.log(this.state.Videos,this.state.hideFooter);
                                    });

                                }
                            );
                        });

                });

                break;
            case actions.UPDATE_PLAYLIST:
                await effects.updatePlaylist(this.state, action.playListData).then(
                    (result)=>{
                        this.setState(result);
                    }
                );
                break;
            case actions.TOGGLE_SELECT_MODE:
                await effects.toggleSelectMode(this.state).then(
                    (result)=>{
                        this.setState(result);
                    }
                );
                break;
            case actions.TOGGLE_TUTORIAL_COMPLETE_STATUS:

                await effects.toggleSelectMode(this.state).then(
                    async (result)=>{
                        await this.setState(result,async ()=>{
                            await effects.toggleTutorialCompleteStatus(this.state,action.selectedTutorials,action.categoryId).then(
                                async (resultTutorial)=>{
                                    this.setState((state)=>({
                                        ...resultTutorial,
                                        Videos:{...state.Videos}
                                    }),()=>{
                                        //console.log(this.state.Videos,this.state.hideFooter);
                                        this.dispatch(actions.loadPerformanceData()).catch((e)=>console.log(e));
                                    });
                                }
                            );

                        });
                    }
                );


                break;
            case actions.TOGGLE_TUTORIAL_COMPLETE_STATUS_SINGLE:
                await effects.toggleTutorialCompleteStatus(this.state,action.selectedTutorials,action.categoryId).then(
                    async (resultTutorial)=>{
                        dispatchResult = resultTutorial;
                        this.setState({
                            tutorialCompleteChanged:resultTutorial
                        },()=>{
                            this.dispatch(actions.loadPerformanceData()).catch((e)=>console.log(e));
                        });
                    }
                );
                break;
            case actions.VIDEO_VIEW_COUNT:
                await effects.videoViewCount(this.state,action.videoId).then(
                    (result)=>{
                        this.setState(result);
                    }
                );
                break;

            case actions.DO_SEARCH:
                await effects.doSearch(this.state,action.searchText, action.offset,action.poffset).then(
                    async (result)=>{
                        dispatchResult = result;
                    }
                );
                break;

            case actions.HIDE_FOOTER:
                await effects.hideFooter(this.state).then(
                    (result)=>{
                        this.setState(result);
                    }
                );
                break;

            case actions.SHOW_FOOTER:
                await effects.showFooter(this.state).then(
                    (result)=>{
                        this.setState(result);
                    }
                );
                break;

            case actions.ADD_RECENT_VIEWED_VIDEO:
                await effects.addRecentViewedVideo(this.state, action.video).then(
                    (result)=>{
                        this.setState(result);
                    }
                );
                break;

            case actions.GET_RECENT_VIEWED_VIDEOS:
                await effects.getRecentViewedVideos(this.state, action.video).then(
                    async (result)=>{
                        dispatchResult = result;
                    }
                );
                break;

            case actions.SET_CURRENT_NAVIGATION_TAB:
                await effects.setCurrentNavigationTab(this.state, action.index).then(
                    (result)=>{
                        this.setState(result);
                    }
                );
                break;


            case actions.SET_SEARCH_VIEW:
                await effects.setSearchView(this.state, action.screen, action.value).then(
                    (result)=>{
                        this.setState(result);
                    }
                );
                break;

            case actions.GET_DOWNLOADED_TUTORIALS:
                await effects.getDownloadedTutorials(this.state).then(
                    async (result)=>{
                        this.setState(result,()=>{
                            effects.setLocalData(this.state.localStorageKey,result).catch((e)=>console.log(e));
                        });
                    }
                );
                break;

            case actions.UPDATE_DOWNLOADED_TUTORIALS:

                await effects.getDownloadedTutorials(this.state).then((result)=>{
                    this.setState((state)=>{
                        return {
                            downloadedTutorials:[...state.downloadedTutorials,action.tutorial],
                            downloadTutorialsStatus:"downloading",
                            downloadedTutorialsSize:result.downloadedTutorialsSize,
                        }
                    },()=>{
                        //console.log('File saved:', action.tutorial, this.state.downloadedTutorials);
                    });
                }).catch((e)=>console.log(e));

                break;
            case actions.DOWNLOAD_TUTORIALS:

                const {dirs} = RNFetchBlob.fs;
                const tutorialsDir = dirs.DocumentDir+"/tutorials";
                let downloadStartedCount = 0;
                let downloadCompletedCount = 0;

                if( (this.state.downloadedTutorialsSize<this.state.storageLimit) || (this.state.storageLimit === -1)){

                    action.tutorials.forEach((tutorialVideos)=>{

                        tutorialVideos.forEach((video)=>{
                            const fileName = video.video_id+"-"+video.code+".mp4";
                            const isDownloaded = this.state.downloadedTutorials.filter((item)=>(item===fileName)).length>0;
                            if(!isDownloaded){
                                downloadStartedCount++;
                                RNFetchBlob
                                    .config({
                                        path : tutorialsDir + '/' + fileName
                                    })
                                    .fetch('GET', encodeURI(video.s3_path), {
                                    }).progress({ count : 10, interval:1000 }, (received, total) => {
                                    //console.log("Download Progress - "+tutorialsDir + '/' + fileName+" :", Math.ceil((received / total)*100))
                                })
                                    .then(async () => {
                                        downloadCompletedCount++;
                                        console.log("Downloaded:"+downloadCompletedCount+"/"+downloadStartedCount);
                                        await this.dispatch(actions.updateDownloadedTutorials(fileName)).catch((e)=>console.log(e));
                                        if(downloadCompletedCount===downloadStartedCount){
                                            this.dispatch(actions.downloadTutorialsCompleted(downloadCompletedCount)).catch((e)=>console.log(e))
                                        }
                                    }).catch((e)=>{
                                    downloadCompletedCount++;
                                    if(downloadCompletedCount===downloadStartedCount){
                                        this.dispatch(actions.downloadTutorialsCompleted(downloadCompletedCount)).catch((e)=>console.log(e))
                                    }
                                    console.log("Downloaded:"+downloadCompletedCount+"/"+downloadStartedCount);
                                    //console.log("Download Error - "+tutorialsDir + '/' + fileName+" : ",encodeURI(video.s3_path)," : ",e)
                                });
                            } else {
                                console.log("Already Downloaded : "+fileName);
                            }

                        })
                    });

                } else {

                    console.log("Max Storage Limit Reached: "+this.state.downloadedTutorialsSize+" / "+this.state.storageLimit);

                }


                break;

            case actions.DOWNLOAD_TUTORIALS_COMPLETED:
                this.setState({ downloadTutorialsStatus:"completed" },()=>{
                    //console.log("Download Completed: ",action.count+" videos downloaded.");
                });
                break;

            case actions.DOWNLOAD_TUTORIALS_STATUS_RESET:
                this.setState({ downloadTutorialsStatus:null });
                break;

            case actions.TOGGLE_ALLOW_NOTIFICATIONS:
                await effects.toggleAllowNotifications(this.state).then(
                    async (result)=>{
                        this.setState(result,()=>{
                            effects.setLocalData(this.state.localStorageKey,this.state).catch((e)=>console.log(e));
                        });
                    }
                );
                break;

            case actions.TOGGLE_COMMENTARY_ON_DEFAULT:
                await effects.toggleCommentaryOnDefault(this.state).then(
                    async (result)=>{
                        this.setState(result,()=>{
                            effects.setLocalData(this.state.localStorageKey,this.state).catch((e)=>console.log(e));
                        });
                    }
                );
                break;

            case actions.NOTIFICATION_RECEIVED:
                await effects.notificationReceived(this.state, action.notificationData).then(
                    async (state) => {
                        console.log(action.notificationData);
                        await this.setState(state, async () => {
                            await effects.setLocalData(this.state.localStorageKey, this.state);
                        });
                    }
                );
                break;
            case actions.GET_NOTIFICATIONS:
                await effects.getNotifications(this.state).then(
                    async (result) => {
                        dispatchResult = result;
                    }
                );
                break;
            case actions.LOAD_NOTIFICATIONS:
                await effects.loadNotifications(this.state).then(
                    async (result) => {
                        await effects.setLocalData(this.state.localStorageKey,{...this.state,Notifications:[...result]});
                        dispatchResult = result;
                    }
                );
                break;
            case actions.UPDATE_NOTIFICATIONS:
                await effects.updateNotifications(this.state, action.notificationData).then(
                    async (state) => {
                        await this.setState(state, async () => {
                            console.log("notificationSetLocalData");
                            await effects.setLocalData(this.state.localStorageKey, this.state);
                        });
                    }
                );
                break;
            case actions.DELETE_NOTIFICATION:
                await effects.deleteNotification(this.state, action.notificationId).then(
                    async (state) => {
                        await this.setState(state, async () => {
                            await effects.setLocalData(this.state.localStorageKey, this.state);
                        });
                    }
                );
                break;

            case actions.TOGGLE_DOWNLOAD_WIFI_ONLY:
                await effects.toggleDownloadWifiOnly(this.state).then(
                    async (result)=>{
                        this.setState(result,()=>{
                            effects.setLocalData(this.state.localStorageKey,this.state).catch((e)=>console.log(e));
                        });
                    }
                );
                break;

            case actions.SET_STORAGE_LIMIT:
                await effects.setStorageLimit(this.state, action.limitSize).then(
                    async (result)=>{
                        this.setState(result,()=>{
                            effects.setLocalData(this.state.localStorageKey,this.state).catch((e)=>console.log(e));
                        });
                    }
                );
                break;


            case actions.GET_STORAGE_LIMIT_USE:
                await effects.getStorageLimitUse(this.state).then(
                    async (result)=>{
                        dispatchResult = result;
                    }
                );
                break;

            case actions.DELETE_DOWNLOADED_VIDEOS:
                await effects.deleteDownloadedVideos(this.state, action.ids).then(
                    async (result)=>{
                        this.setState(result);
                    }
                );
                break;

            case actions.SEND_REPORT:
                await effects.sendReport(this.state, action.report).then(
                    async (result)=>{
                        dispatchResult = result;
                    }
                );
                break;

            case actions.PROFILE_OPEN_APPARATUS_DESELECT:
                this.setState({hideFooter:true},()=>{
                    action.navigation.navigate("ProfileApparatusDeSelect");
                });
                break;

            case actions.PROFILE_CLOSE_APPARATUS_DESELECT:
                this.setState({hideFooter:false},()=>{
                    action.navigation.goBack();
                });
                break;

            case actions.PROFILE_OPEN_GRADES_SELECT:
                this.setState({hideFooter:true},()=>{
                    action.navigation.navigate("ProfileGradesSelect",{params:{apparatus:null}});
                });
                break;

            case actions.PROFILE_CLOSE_GRADES_SELECT:
                this.setState({hideFooter:false},()=>{
                    action.navigation.goBack();
                });
                break;



            default:
                break;

        }

        if(dispatchResult)return dispatchResult;

    }

    async cleanInit(){
        await effects.setLocalData(this.state.localStorageKey,this.state).then(
            ()=>this.setState({
                appInitComplete:true,
                dimensions:{
                    width:Dimensions.get("window").width,
                    height:Dimensions.get("window").height
                }
            })
        ).catch(
            (error)=>console.log(error)
        )
    }

    async init(){

        console.log("App Init...");

        await effects.getLocalData(this.state.localStorageKey).then(
            async (localStorageData)=>{
                console.log("CurrentLocalStorageData:",localStorageData);
                if(!localStorageData){
                    console.log("NoLocalStorageData");
                    // NEW INSTALL - FIRST RUN
                    await effects.setLocalData(this.state.localStorageKey,this.state).then(
                        ()=>this.setState({
                            appInitComplete:true,
                            dimensions:{
                                width:Dimensions.get("window").width,
                                height:Dimensions.get("window").height
                            }})
                    ).catch(
                        (error)=>console.log(error)
                    )
                } else {
                    if(localStorageData.token && localStorageData.API){
                        await effects.checkToken(localStorageData,localStorageData.token).then(async (response)=>{
                            if(response.status==="TOKEN_VALID" || response.status==="TOKEN_REFRESHED"){

                                effects.loadCategoryData(response.state).then(
                                    (categoryDataResult)=>{
                                       if(categoryDataResult.hasOwnProperty("categoryData")){
                                           this.setState({
                                               ...categoryDataResult,
                                               appInitComplete:true,
                                               dimensions:{
                                                   width:Dimensions.get("window").width,
                                                   height:Dimensions.get("window").height
                                               }
                                           }, ()=>{
                                               this.props.appDispatch(actions.appLoginComplete()).catch((e)=>console.log(e));
                                               this.dispatch(actions.getDownloadedTutorials()).catch((e)=>console.log(e));

                                           } );

                                       } else {
                                           console.log("Error - loadCategoryData: No Data");
                                           this.setState({
                                               ...response.state,
                                               appInitComplete:true,
                                               dimensions:{
                                                   width:Dimensions.get("window").width,
                                                   height:Dimensions.get("window").height
                                               }
                                           });
                                       }
                                    }

                                );


                            } else {
                                effects.getInitialScreen(localStorageData).then(
                                    (screen)=>{
                                        this.setState( (state)=>{
                                            return {
                                                appInitComplete: true,
                                                FirstRun:localStorageData.FirstRun,
                                                Login: {
                                                    ...state.Login,
                                                    loginRedirectScreen: screen,
                                                },
                                                dimensions:{
                                                    width:Dimensions.get("window").width,
                                                    height:Dimensions.get("window").height
                                                }
                                            }
                                        }
                                            , ()=>{
                                                this.dispatch(actions.getDownloadedTutorials()).catch((e)=>console.log(e));
                                                console.log("Init Complete:",this.state);
                                            });
                                    }
                                );
                            }
                        });
                    } else {
                        console.log("NoTokenOnLocalStorage");

                            this.setState({
                                    appInitComplete: true,
                                    FirstRun:localStorageData.FirstRun,
                                    dimensions:{
                                        width:Dimensions.get("window").width,
                                        height:Dimensions.get("window").height
                                    }},()=>{

                                        this.dispatch(actions.getDownloadedTutorials()).catch((e)=>console.log(e));
                                        console.log("Init Complete:",this.state);
                                    }
                            );
                    }



                }

            }
        ).catch((error)=>console.log(error));


    }



    render() {

        const {changedState} = this.state;
        const {dimensions} = this.state;
        const {FirstRun} = this.state;
        const {currentNavigationTab} = this.state;
        const {searchView} = this.state;
        const {downloadWifiOnly} = this.state;
        const {downloadedTutorials} = this.state;
        const {downloadedTutorialsSize} = this.state;
        const {downloadTutorialsStatus} = this.state;
        const {storageLimit} = this.state;
        const {allowNotifications} = this.state;
        const {Notifications} = this.state;
        const {PerformanceData} = this.state;
        const {videoViewCountChanged} = this.state;
        const {tutorialCompleteChanged} = this.state;
        const {selectedApparatus} = this.state;
        const {commentaryOnDefault} = this.state;

        return (

             (this.state.appInitComplete) ?
                    this.props.children && React.cloneElement(this.props.children,{
                        screenProps: {
                            state:(changedState)?this.state[changedState]:this.state["Login"],
                            isUserLoggedIn:this.state.isUserLoggedIn,
                            selectedUpperGrade:this.state.selectedUpperGrade,
                            dispatch:this.dispatch,
                            backHandler:this.backHandler,
                            actions:actions,
                            dimensions,
                            FirstRun,
                            changedState,
                            hideFooter:this.state.hideFooter,
                            currentNavigationTab,
                            searchView,
                            downloadWifiOnly,
                            downloadedTutorials,
                            downloadedTutorialsSize,
                            downloadTutorialsStatus,
                            storageLimit,
                            allowNotifications,
                            Notifications,
                            PerformanceData,
                            videoViewCountChanged,
                            tutorialCompleteChanged,
                            selectedApparatus,
                            commentaryOnDefault,
                            apparatusSelectionChanged:this.state.ApparatusSelect.selectedApparatus.map((item)=>item.category_id).join(",")
                        }

                    })
                 :
                 <View style={{flex:1, alignItems:"center", justifyContent:"center", backgroundColor:"#fff"}}>
                     <ImageBackground source={sigInBg}
                                      style={{
                                          flex: 1,
                                          flexDirection:'row',
                                          alignItems:'center',
                                          justifyContent:'center',
                                          width:"100%",
                                          height:"100%",
                                          elevation:0,
                                      }}
                                      imageStyle={{resizeMode: 'cover'}}
                     >

                     <ActivityIndicator  size="large" color="#5c96f5" />
                     </ImageBackground>
                 </View>

        );
    }


}
