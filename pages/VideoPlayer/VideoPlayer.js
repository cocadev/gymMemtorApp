import React, { Component } from 'react';
import {
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    FlatList,
    ActivityIndicator,
    StatusBar,
    BackHandler
} from 'react-native';
import {Badge, Icon, Segment, Button, Left, Body, Title, Right, Header} from 'native-base';
import Video from "react-native-video";
import { Col, Row, Grid } from "react-native-easy-grid";
import KeepAwake from 'react-native-keep-awake';
import Orientation from 'react-native-orientation';
import RNFetchBlob from 'rn-fetch-blob';
import GoogleCast, { CastButton } from 'react-native-google-cast'
import {
    loadPlayListTutorialData,
    videoViewCount,
    addRecentViewedVideo,
    toggleTutorialCompleteStatusSingle, showFooter,
} from "../../components/Store/actions";
import checkIcon from "../../assets/check_gray.png";
import checkIconCompleted from "../../assets/check_orange-1.png";
import checkIconCompletedMentor from "../../assets/check_green.png";
import playIcon from "../../assets/video-player/btn-play.png";
import pauseIcon from "../../assets/video-player/btn-pause.png";
import repeatIcon from "../../assets/video-player/btn-repeat.png";
import repeatIconDisabled from "../../assets/video-player/btn-repeat-disabled.png";
import repeatIcon1x from "../../assets/video-player/btn-repeat-1x.png";
import repeatIcon4x from "../../assets/video-player/btn-repeat-4x.png";
import repeatIcon8x from "../../assets/video-player/btn-repeat-8x.png";
import hdIcon from "../../assets/video-player/btn-hd.png";
import commentaryIcon from "../../assets/video-player/commentary.png";
import {NavigationActions} from "react-navigation";
//import fullScreenIcon from "../../assets/video-player/btn-fullscreen.png";
//import fullScreenExitIcon from "../../assets/video-player/btn-fullscreen-exit.png";

export const deviceHeight = Dimensions.get("window").height;
export const deviceWidth = Dimensions.get("window").width;
export const platform = Platform.OS;
export const isIphoneX =
    platform === "ios" &&
    (deviceHeight >= 812) && (deviceWidth >= 375);




class MyListItem extends React.PureComponent {
    _onPress = (id:string,video:Array,index:Number) => {
        this.props.onPressItem(id,video,index);
    };



    render() {

        const isPortrait = () => {
            const dim = Dimensions.get('screen');
            return dim.height >= dim.width;
        };


        const normalListItem = <TouchableOpacity activeOpacity={0.7} onPress={()=>this._onPress(this.props.id,this.props.video,this.props.index)}>
            <Grid>

                <Row style={{height:48, alignItems:"center"}}>
                    <Col size={1} style={{alignItems:"center"}}>

                        <Text style={{color:"#fff", fontFamily:"Montserrat-Light",}}>
                            { (this.props.index + 1 )}
                        </Text>

                    </Col>
                    <Col size={6}>
                        <Text style={{color:"#fff", fontFamily:"Montserrat-Light",}}>
                            {this.props.name}
                        </Text>
                        {
                            (this.props.supported)&&<Text style={{color:"#777", fontFamily:"Montserrat-Light"} }>{"Supported"}</Text>
                        }

                    </Col>
                    <Col size={1} style={{alignItems:"flex-end", paddingRight:10}}>
                        {
                            (this.props.downloaded) ?
                                <Icon name='md-download' style={{color:"#ccc"}} />
                                :
                                <Icon name='md-cloud' style={{color:"#ccc"}} />
                        }

                    </Col>
                </Row>
            </Grid>
        </TouchableOpacity>;


        const playingListItem =
            <Grid>
                <Row style={{height:48, alignItems:"center"}}>
                    <Col size={1} style={{alignItems:"center"}}>

                        <TouchableOpacity activeOpacity={0.7} onPress={()=>this._onPress(this.props.id,this.props.video)}>


                        {
                            (!this.props.paused)?
                                <Image style={{width:28,height:28, tintColor:"#5c96f5"}} source={playIcon}/>
                                :
                                <Image style={{width:16,height:16, tintColor:"#5c96f5" }} source={pauseIcon}/>
                        }

                         </TouchableOpacity>

                    </Col>
                    <Col size={6}>
                        <Text style={{color: "#5c96f5", fontFamily:"Montserrat-Light",}}>
                           {this.props.name}
                        </Text>
                        {
                            (this.props.supported)&&
                            <Text style={{color:"#777", fontFamily:"Montserrat-Light"} }>{"Supported"}</Text>
                        }


                    </Col>
                    <Col size={1} style={{alignItems:"flex-end", paddingRight:10}}>
                        {
                            (this.props.downloaded) ?
                                <Icon name='md-download' style={{color:"#5c96f5"}} />
                                :
                                <Icon name='md-cloud' style={{color:"#5c96f5"}} />
                        }
                    </Col>
                </Row>
            </Grid>;




        return (


            (this.props.selected) ?
                playingListItem
                :
                normalListItem



        );
    }
}

export default class VideoPlayer extends Component<{}> {


    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props) {
        super(props);

        this.repeatModes = {xn:-1,x0:0,x1:1,x4:4,x8:8};
        this.repeatModesArray = [this.repeatModes.xn,this.repeatModes.x1,this.repeatModes.x4,this.repeatModes.x8,this.repeatModes.x0];
        this.repeatIcons = [repeatIcon,repeatIcon1x,repeatIcon4x,repeatIcon8x,repeatIconDisabled];
        const {dirs} = RNFetchBlob.fs;
        this.tutorialsDownloadDir = dirs.DocumentDir+"/tutorials";


        this.state = {
            rate: 1,
            volume: 1,
            muted: false,
            resizeMode: 'contain',
            duration: "0:00",
            currentTime: "0:00",
            paused: false,
            controlsVisible:true,
            headerVisible:true,
            selected: (new Map(): Map<string, boolean>),
            selectedVideo:false,
            selectedVideoIndex:false,
            selectedVideoFile:false,
            selectedVideoItem:{title:"",s3_path:""},
            isPlayListDataLoading:true,
            isVideoLoading:true,
            //isCommentaryOn:this.props.screenProps.commentaryOnDefault,
            isCommentaryOn:false,
            isCompleted:false,
            isSingleVideo:false,
            isClosing:false,
            isSupportedSelected:true,
            isSupported:false,
            hasSupportedUnsupported:[false,false],
            hasCommentedUncommented:[false,false],
            singleVideoFile:false,
            isRepeatOn:true,
            repeatMode:0,
            repeatModeCount:0,
            isHdOn:true,
            isLandscape:"",
            isCastConnected:false,
            isCastingModeOn:false,
            isCastingPaused:true,
            isCasting:false,
            playListData:[],
            renderDeviceWidth:deviceWidth,
            videoQuality:"hd",
            gradeOfTutorial:"",
            parsedFiles:{
                hd:{
                    supported:{
                        commented:false,
                        uncommented:false
                    },
                    unsupported:{
                        commented:false,
                        uncommented:false
                    }
                },
                sd:{
                    supported:{
                        commented:false,
                        uncommented:false
                    },
                    unsupported:{
                        commented:false,
                        uncommented:false
                    }
                }

            },
        };

        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.backHandler)
        );


    }

    componentWillMount() {
        // The getOrientation method is async. It happens sometimes that
        // you need the orientation at the moment the JS runtime starts running on device.
        // `getInitialOrientation` returns directly because its a constant set at the
        // beginning of the JS runtime.

        const initial = Orientation.getInitialOrientation();
        if (initial === 'PORTRAIT') {
            // do something
        } else {
            // do something else
        }


    }


    async componentDidMount() {


        const {params} = this.props.navigation.state;
        const selectedVideoIndex = (params.selectedIndex)?params.selectedIndex:0;
        const {dispatch} = this.props.screenProps;
        const {downloadedTutorials} = this.props.screenProps;

        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.backHandler)
        );

        const isCastConnected = (await GoogleCast.getCastState()==="Connected");
        this.registerGoogleCastListeners();

        Orientation.addOrientationListener(this._orientationDidChange);

        if(params){
            if (params.singleVideo){
                Orientation.lockToLandscape();
                //Orientation.unlockAllOrientations();
                this.setState({
                    isSingleVideo:true,
                    singleVideoFile:params.video,
                    isPlayListDataLoading:false,
                    selectedVideo:"1",
                    selectedVideoIndex:0,
                    selectedVideoFile:encodeURI(params.video),
                    isCastConnected,
                    isCastingModeOn:isCastConnected,
                    controlsVisible:false,
                    headerVisible:false ,
                });
            } else {

                let initialPlayListData = (params.playListData)?params.playListData:await dispatch(loadPlayListTutorialData(params.id));
                if(initialPlayListData.items){initialPlayListData=initialPlayListData.items}

                const playListData = this.getDownloadedTutorials(initialPlayListData);

                const isDownloaded = playListData[selectedVideoIndex].downloaded;
                const isCompleted = playListData[selectedVideoIndex].completed;

                const hasCommentedUncommented = (playListData.length>0)?this.getHasCommentedUncommented(playListData[selectedVideoIndex].video):[false,false];
                const hasSupportedUnsupported = (playListData.length>0)?this.getHasSupportedUnsupported(playListData[selectedVideoIndex].video):[false,false];
                const isSupported = hasSupportedUnsupported[0];

                const selectedVideo = playListData[selectedVideoIndex].tutorial_id;
                const gradeOfTutorial =  (playListData[selectedVideoIndex].grade)?playListData[selectedVideoIndex].grade:"";

                const parsedFiles = this.getVideoFiles(playListData[selectedVideoIndex].video);
                const initialState = this.getInitialVideoFileToPlay(parsedFiles,playListData[selectedVideoIndex].type);
                const selectedVideoItem = initialState.initialFile;

                const selectedVideoFile = (!isDownloaded)?encodeURI(selectedVideoItem.s3_path)
                    :this.tutorialsDownloadDir+"/"+selectedVideoItem.video_id+"-"+selectedVideoItem.code+".mp4";

                this.setState({
                    isSingleVideo:false,
                    isPlayListDataLoading:false,
                    isCompleted,
                    isSupported,
                    isSupportedSelected:initialState.isSupported,
                    isCommentaryOn:initialState.isCommented,
                    hasSupportedUnsupported,
                    hasCommentedUncommented,
                    playListData,
                    selectedVideo,
                    selectedVideoIndex,
                    selectedVideoFile,
                    gradeOfTutorial,
                    selectedVideoItem,
                    parsedFiles,
                    isCastConnected,
                    isCastingModeOn:isCastConnected,

                },()=>{
                    this.castVideo({
                        title: selectedVideoItem.title,
                        mediaUrl: selectedVideoItem.s3_path,
                    });/*
                    console.log(
                        "playlistData:",
                        playListData,
                    );
                    console.log(
                        "playing:",
                        selectedVideoItem,
                        this.state.selectedVideoFile
                    );*/

                });



                dispatch(videoViewCount(playListData[selectedVideoIndex].tutorial_id)).then(()=>{
                    dispatch(addRecentViewedVideo(playListData[selectedVideoIndex]));
                });


            }

        }


    }


    async componentWillUnmount(){

        KeepAwake.deactivate();
        Orientation.removeOrientationListener(this._orientationDidChange);
        Orientation.unlockAllOrientations();

        this.unRegisterGoogleCastListeners();

        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();

        this.setState({
            playListData:[],
            isPlayListDataLoading:true,
            selectedVideo:false,
            selectedVideoIndex:false,
            selectedVideoFile:false,
        });

    }


    registerGoogleCastListeners = ()=> {
        const events = `
      SESSION_STARTING SESSION_STARTED SESSION_START_FAILED SESSION_SUSPENDED
      SESSION_RESUMING SESSION_RESUMED SESSION_ENDING SESSION_ENDED
    `.trim().split(/\s+/);
        events.forEach(event => {
            GoogleCast.EventEmitter.addListener(GoogleCast[event], ()=>this.castListener(event,arguments));
        });
        GoogleCast.EventEmitter.addListener(GoogleCast.MEDIA_PLAYBACK_STARTED, ({mediaStatus}) =>this.castListener("MEDIA_PLAYBACK_STARTED",mediaStatus));
        GoogleCast.EventEmitter.addListener(GoogleCast.MEDIA_PLAYBACK_ENDED, ({mediaStatus}) =>this.castListener("MEDIA_PLAYBACK_ENDED",mediaStatus));
        GoogleCast.EventEmitter.addListener(GoogleCast.MEDIA_STATUS_UPDATED, ({mediaStatus})=>this.castListener("MEDIA_STATUS_UPDATED",mediaStatus));
    };

    unRegisterGoogleCastListeners = ()=> {
        const events = `
      SESSION_STARTING SESSION_STARTED SESSION_START_FAILED SESSION_SUSPENDED
      SESSION_RESUMING SESSION_RESUMED SESSION_ENDING SESSION_ENDED
    `.trim().split(/\s+/);

        events.forEach(event => {
            GoogleCast.EventEmitter.removeListener(GoogleCast[event], ()=>this.castListener(event,arguments));
        });
        GoogleCast.EventEmitter.removeListener(GoogleCast.MEDIA_PLAYBACK_STARTED, ({mediaStatus}) =>this.castListener("MEDIA_PLAYBACK_STARTED",mediaStatus));
        GoogleCast.EventEmitter.removeListener(GoogleCast.MEDIA_PLAYBACK_ENDED, ({mediaStatus}) =>this.castListener("MEDIA_PLAYBACK_ENDED",mediaStatus));
        GoogleCast.EventEmitter.removeListener(GoogleCast.MEDIA_STATUS_UPDATED, ({mediaStatus})=>this.castListener("MEDIA_STATUS_UPDATED",mediaStatus));
        //GoogleCast.endSession();
    };



    castListener = (event,args)=>{
        switch (event) {
            case "SESSION_STARTING":
                this.setState({isCastingModeOn:true},()=>{
                    //console.log("castingModeOn")
                });
                break;
            case "SESSION_STARTED":
                //console.log(this.state.selectedVideoItem);
                if(this.state.selectedVideoItem.s3_path){
                    this.castVideo({
                        title: this.state.selectedVideoItem.title,
                        mediaUrl: this.state.selectedVideoItem.s3_path,
                    });
                }
                this.setState({isCastConnected:true,isCastingModeOn:true},()=>{
                    //console.log("castDevice Connected")
                });
                break;
            case "SESSION_ENDING":
                this.setState({isCastingModeOn:false},()=>{
                   // console.log("castingModeOff")
                });
                break;
            case "SESSION_ENDED":
                this.setState({isCastConnected:false,isCastingModeOn:false},()=>{
                    //console.log("castDevice UnConnected")
                });
                break;
            case "MEDIA_PLAYBACK_ENDED":
                this.onEnd({castPlayerState:args.playerState});

                //console.log("MEDIA_PLAYBACK_ENDED:", args.playerState);
                break;
            case "MEDIA_STATUS_UPDATED":
                const isCastingPaused = !(args.playerState===2);
                if(this.state.isCastingPaused!==isCastingPaused){
                   // console.log("isCastingPaused:",isCastingPaused);
                    this.setState({isCastingPaused});
                }
                //console.log("MEDIA_STATUS_UPDATED:", args.playerState);
                break;
            default:
                break;

        }
        //console.log(event, args)
    };



    castVideo(video){

        if(this.state.isCastConnected){

            //this.setState({isCastingPaused:false});
            GoogleCast.castMedia(video);

            //console.log("cast:",video);

            //GoogleCast.launchExpandedControls();

            /*GoogleCast.castMedia(
                {
                    title: "Designing For Google Cast",
                    subtitle: "Fusce id nisi turpis. Praesent viverra bibendum semper. Donec tristique, orci sed semper lacinia, quam erat rhoncus massa, non congue tellus est quis tellus. Sed mollis orci venenatis quam scelerisque accumsan. Curabitur a massa sit amet mi accumsan mollis sed et magna. Vivamus sed aliquam risus. Nulla eget dolor in elit facilisis mattis. Ut aliquet luctus lacus. Phasellus nec commodo erat. Praesent tempus id lectus ac scelerisque. Maecenas pretium cursus lectus id volutpat.",
                    studio: "Google IO - 2014",
                    duration: 333,
                    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/mp4/DesigningForGoogleCast.mp4",
                    imageUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/images/480x270/DesigningForGoogleCast2-480x270.jpg",
                    posterUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/images/780x1200/DesigningForGoogleCast-887x1200.jpg",
                }
            );*/
        } else {
            //console.log("cast device not connected");
        }


    }


    getVideoFiles = (video)=>{



        let parsedVideoFile = {
                hd:{
                    supported:{
                        commented:false,
                        uncommented:false
                    },
                    unsupported:{
                        commented:false,
                        uncommented:false
                    }
                },
                sd:{
                    supported:{
                        commented:false,
                        uncommented:false
                    },
                    unsupported:{
                        commented:false,
                        uncommented:false
                    }
                }
        };


        video.forEach((videoFile)=>{

            const {commented, supported, quality} = videoFile;
            const isSupported = (supported==="supported");
            const isCommented = (commented==="commented");
            const isHd = (quality==="hd");
            const caseStr = [isHd,isSupported,isCommented].join();

            switch(caseStr){

                //HD
                    //Supported
                        //Commented
                case "true,true,true":
                    parsedVideoFile.hd.supported.commented = videoFile;
                    break;

                        //UnCommented
                case "true,true,false":
                    parsedVideoFile.hd.supported.uncommented = videoFile;
                    break;

                    //UnSupported
                        //Commented
                case "true,false,true":
                    parsedVideoFile.hd.unsupported.commented = videoFile;
                    break;

                        //UnCommented
                case "true,false,false":
                    parsedVideoFile.hd.unsupported.uncommented = videoFile;
                    break;

                //SD
                case "false,true,true":
                    parsedVideoFile.sd.supported.commented = videoFile;
                    break;

                case "false,true,false":
                    parsedVideoFile.sd.supported.uncommented = videoFile;
                    break;

                case "false,false,true":
                    parsedVideoFile.sd.unsupported.commented = videoFile;
                    break;

                case "false,false,false":
                    parsedVideoFile.sd.unsupported.uncommented = videoFile;
                    break;
                default:
                    break;
            }

        });



        return parsedVideoFile;

    };



    backHandler = ()=> {

        let returnValue = true;
        const {params} = this.props.navigation.state;

        if(this.state.isSingleVideo){
/*            const backAction = NavigationActions.back({
                key: this.props.navigation.state.key,
            });
            this.props.navigation.dispatch(backAction);*/
        } else {
            if(params.closeAction){
                this.setState({isClosing:true},()=>{
                    const navigateAction = NavigationActions.navigate(params.closeAction);
                    this.props.navigation.dispatch(navigateAction);
                });

            } else {
                const backAction = NavigationActions.back({
                    key: this.props.navigation.state.key,
                });
                this.props.navigation.dispatch(backAction);
            }
        }



        return returnValue;
    };



    _orientationDidChange = (orientation) => {

        console.log(orientation,Dimensions.get("window").width,Dimensions.get("window").height);

        const {params} = this.props.navigation.state;
        const {isClosing} = this.state;
        const {singleVideo} = params;
        if(singleVideo && !isClosing){
            Orientation.lockToLandscape();
        }

        this.setState({
            isLandscape:(orientation==="LANDSCAPE"),
            controlsVisible:(orientation!=="LANDSCAPE"),
            headerVisible:(orientation!=="LANDSCAPE"),
            renderDeviceWidth:Dimensions.get("window").width,
            renderDeviceHeight:Dimensions.get("window").height,
        });

    };


    getDownloadedTutorials = (playListData)=>{

        const {downloadedTutorials} = this.props.screenProps;
        return playListData.map((tutorial)=>{
            const fileName = tutorial.video[0].video_id+"-"+tutorial.video[0].code+".mp4";
            return {
                ...tutorial,
                downloaded:downloadedTutorials.filter((item)=>(item===fileName)).length>0
            }
        });
    };



    getHasCommentedUncommented = (videoList)=>{

        let hasCommentedUncommented = [false,false];
        if(videoList.length>1){
            videoList.forEach((item)=>{
                if(item.commented==="commented"){ hasCommentedUncommented[0]=true; }
                else if(item.commented==="uncommented"){ hasCommentedUncommented[1]=true; }
            });
        } else {
            if(videoList[0].commented==="commented"){ hasCommentedUncommented[0]=true; }
            else if(videoList[0].commented==="uncommented"){ hasCommentedUncommented[1]=true; }
        }

        return hasCommentedUncommented;

    };



    getHasSupportedUnsupported = (videoList)=>{

        let hasSupported = [false,false];
        if(videoList.length>1){
            videoList.forEach((item)=>{
                if(item.supported==="supported"){ hasSupported[0]=true; }
                else if(item.supported==="unsupported"){ hasSupported[1]=true; }
            });
        } else {
            if(videoList[0].supported==="supported"){ hasSupported[0]=true; }
            else if(videoList[0].supported==="unsupported"){ hasSupported[1]=true; }
        }

        return hasSupported;

    };

    video: Video;



    onBuffer = (data) => {
        this.setState({
            isVideoLoading:data,
            //paused:true,
        });
        //console.log("onBuffer:",data);
    };

    onLoadStart = (data) => {
        //console.log("onLoadStart:",data);
    };


    onLoad = (data) => {

        KeepAwake.activate();

        let durationTotalSeconds;
        let durationTotalMinutes;
        const duration = parseInt(data.duration);

        if(duration>=60){
            durationTotalMinutes = Math.floor(duration/60);
            durationTotalSeconds = duration%60;
            durationTotalSeconds = (durationTotalSeconds<10)?
                "0"+durationTotalSeconds.toString()
                :
                durationTotalSeconds.toString();
        } else {
            durationTotalMinutes = "00";
            durationTotalSeconds = Math.ceil(duration);
            durationTotalSeconds = (durationTotalSeconds<10)?
                "0"+durationTotalSeconds.toString()
                :
                durationTotalSeconds.toString();
        }


        const playRate = Object.assign({},{rate:this.state.rate});

        this.setState({
            duration: durationTotalMinutes+":"+durationTotalSeconds,
            isVideoLoading:false,
            paused:false,
            rate:1,
        },()=>{
            this.setState({rate:playRate.rate});
        });
    };

    onProgress = (data) => {

        let durationTotalSeconds;
        let durationTotalMinutes;
        const duration = parseInt(data.currentTime);

        if(duration>=60){
            durationTotalMinutes = Math.floor(duration/60);
            durationTotalSeconds = duration%60;
            durationTotalSeconds = (durationTotalSeconds<10)?
                "0"+durationTotalSeconds.toString()
                :
                durationTotalSeconds.toString();
        } else {
            durationTotalMinutes = "00";
            durationTotalSeconds = Math.ceil(duration);
            durationTotalSeconds = (durationTotalSeconds<10)?
                "0"+durationTotalSeconds.toString()
                :
                durationTotalSeconds.toString();
        }

        this.setState({
            currentTime: durationTotalMinutes+":"+durationTotalSeconds,
        });
    };

    onEnd = async(e) => {

        //console.log("repeatMode:",this.state.repeatMode);
        const castPlayerState = (e)?e.castPlayerState:0;

        if(this.repeatModesArray[this.state.repeatMode]===this.repeatModes.x0){
            this.setState({paused:true});
        } else {

            let repeatEnded=false;
            this.setState((state)=>{

                let nextCount;
                    if(this.repeatModesArray[state.repeatMode]===this.repeatModes.xn){
                        repeatEnded = false;
                        nextCount=1;
                    } else {
                        nextCount = (state.repeatModeCount===this.repeatModesArray[state.repeatMode]-1)?0:state.repeatModeCount+1;
                        //console.log("repeatModeCount:",state.repeatModeCount);
                        //console.log("nextCount:",nextCount);
                        repeatEnded = (nextCount===0);
                    }


                    //console.log("repeatModeCount:",state.repeatModeCount);
                    //console.log("repeatMode:",state.repeatMode);
                    //console.log("this.repeatModesArray[state.repeatMode]:",this.repeatModesArray[state.repeatMode]);
                    return {paused:true, repeatModeCount:nextCount}
                    return {paused:true, repeatModeCount:nextCount}
                },async ()=>{

                    //console.log("isRepeatEnded:",repeatEnded);

                    if(repeatEnded){
                        if(this.state.playListData.length>1){
                            if(this.state.isCastingModeOn){
                                if(castPlayerState===1){
                                    await this.playNextVideo();
                                }
                            } else {
                                await this.playNextVideo();
                            }


                        } else {
                            this.setState({paused:true});
                        }
                    } else {
                        if(this.state.isCastingModeOn){
                            await this.playNextVideo(true);
                        }
                        this.setState({paused:false})
                    }
            });
        }

    };

    onAudioBecomingNoisy = () => {
/*        this.setState({ paused: true });
        KeepAwake.deactivate();*/
    };

    onAudioFocusChanged = (event: { hasAudioFocus: boolean }) => {
/*        this.setState({ paused: !event.hasAudioFocus },()=>{
            if(this.state.paused){
                KeepAwake.deactivate();
            } else {
                KeepAwake.activate();
            }
        })*/
    };

    getCurrentTimePercentage() {
        if (this.state.currentTime > 0) {
            return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
        }
        return 0;
    };

    renderRateControl = (rate)=> {
        const isSelected = (this.state.rate === rate);

        return (
            <TouchableOpacity onPress={() => { this.setState({ rate }) }}>
                <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
                    {rate}x
                </Text>
            </TouchableOpacity>
        );
    };

    onFullScreenPress = ()=>{

        if(!this.state.isLandscape){
            this.setState({
                isLandscape:true,
                controlsVisible:false,
                headerVisible:false,
            },()=>{
                Orientation.lockToLandscape();
            });

        } else {
            this.setState({
                isLandscape:false,
                controlsVisible:true,
                headerVisible:true,
            },()=>{
                Orientation.lockToPortrait();

                setTimeout(async ()=>{
                    Orientation.unlockAllOrientations();

                },2000);
            });

        }



    };

    onRepeatPress = ()=>{
        this.setState((state)=>{
            let nextRepeatMode = state.repeatMode;
            if(nextRepeatMode===this.repeatModesArray.length-1){
                nextRepeatMode = 0;
            } else {
                nextRepeatMode++;
            }
            return {
                repeatModeCount:0,
                repeatMode:nextRepeatMode,
                isRepeatOn:(this.repeatModesArray[nextRepeatMode]!==this.repeatModes.x0)
            }
        });

    };



    onSupportedToggle = (isSupportedSelected)=>{

        const isSupported = (!this.state.isSupportedSelected===true)?"supported":"unsupported";
        let canToggle = false;
        let isCommentaryOn;

        if( (this.state.parsedFiles[this.state.videoQuality][isSupported].commented!==false) &&
            (this.state.parsedFiles[this.state.videoQuality][isSupported].uncommented!==false) ){
            canToggle=true;
            isCommentaryOn=this.state.isCommentaryOn;
        } else
        if((this.state.parsedFiles[this.state.videoQuality][isSupported].commented!==false)){
            canToggle=true;
            isCommentaryOn=true;
        } else
        if((this.state.parsedFiles[this.state.videoQuality][isSupported].uncommented!==false)){
            canToggle=true;
            isCommentaryOn=false;
        }

        if(canToggle){
            this.setState({isSupportedSelected,isCommentaryOn},()=>{
                this.setPlayerVideoFile().catch((e)=>{ console.log(e);});
            });
        }

    };

    onCommentaryToggle = ()=>{

        const isSupported = (this.state.isSupportedSelected===true)?"supported":"unsupported";
        const isCommented = (!this.state.isCommentaryOn===true)?"commented":"uncommented";
        const canToggle = this.state.parsedFiles[this.state.videoQuality][isSupported][isCommented];

        if(canToggle){
            this.setState({isCommentaryOn:!this.state.isCommentaryOn},()=>{
                this.setPlayerVideoFile().catch((e)=>{ console.log(e);});
            });

        }

    };


    onVolumePress = ()=>{


        this.setState({
            volume:(this.state.volume>0)?0:1
        });

    };


    onHdPress = ()=>{

        this.setState({
            isHdOn:!this.state.isHdOn
        });

    };


    playPauseOnPress = ()=> {

        const paused = !this.state.paused;
        const isVideoLoading = (paused)?false:this.state.isVideoLoading;
        this.setState({ paused, isVideoLoading,isCastingPaused:paused });
        if(paused){
            KeepAwake.deactivate();
        } else {
            KeepAwake.activate();
        }

        if(this.state.isCastingModeOn){
            if(paused){
                //console.log("cast Pause");
                GoogleCast.pause();
            } else {
                //console.log("cast Play");
                GoogleCast.play();
            }
        }

    };




    videoOnPress = ()=>{

        Orientation.getOrientation((err, orientation) => {
            if (orientation === 'LANDSCAPE') {
                this.setState((state)=>({
                    controlsVisible:!state.controlsVisible,
                    headerVisible:!state.headerVisible,
                }));
            } else {
                this.playPauseOnPress();

            }
        });


    };

    onCompletedPress = ()=>{


        const {dispatch} =  this.props.screenProps;
        const updatedData = this.state.playListData.map((tutorial)=>{
            if(tutorial.tutorial_id===this.state.playListData[this.state.selectedVideoIndex].tutorial_id){
                tutorial.completed = (tutorial.completed>0)?0:1;
            }
            return tutorial;
        });
        this.setState((state)=>({
            isCompleted:(parseInt(state.isCompleted)>0)?0:1
        }),()=>{
            dispatch(toggleTutorialCompleteStatusSingle(updatedData,updatedData[0].category)).then((result)=>{
                //console.log(result);
            });
        });

    };


    playNextVideo = async (repeat=false)=>{


        const selectedVideoIndex = (repeat===true)?this.state.selectedVideoIndex:(this.state.selectedVideoIndex!==this.state.playListData.length-1)?this.state.selectedVideoIndex+1:0;

       // console.log("playNextVideo - repeat:",repeat, "selectedVideoIndex:",selectedVideoIndex);

        const playListData = this.state.playListData;
        const selectedVideo = playListData[selectedVideoIndex].tutorial_id;
        const isDownloaded = playListData[selectedVideoIndex].downloaded;
        const isCompleted = playListData[selectedVideoIndex].completed;
        const hasCommentedUncommented = (playListData.length>0)?this.getHasCommentedUncommented(playListData[selectedVideoIndex].video):[false,false];
        const hasSupportedUnsupported = (playListData.length>0)?this.getHasSupportedUnsupported(playListData[selectedVideoIndex].video):[false,false];
        const isSupported = hasSupportedUnsupported[0];

        const parsedFiles = this.getVideoFiles(playListData[selectedVideoIndex].video);
        const nextVideoState = this.getInitialVideoFileToPlay(parsedFiles,playListData[selectedVideoIndex].type);
        const selectedVideoItem = nextVideoState.initialFile;
        const gradeOfTutorial =  (playListData[selectedVideoIndex].grade)?playListData[selectedVideoIndex].grade:"";


        const selectedVideoFile = (!isDownloaded)?encodeURI(selectedVideoItem.s3_path)
            :this.tutorialsDownloadDir+"/"+selectedVideoItem.video_id+"-"+selectedVideoItem.code+".mp4";



        this.setState({
            isVideoLoading:true,
            //paused:true,
        },()=>{
            this.setState({
                isCompleted,
                isSupported,
                isSupportedSelected:nextVideoState.isSupported,
                isCommentaryOn:nextVideoState.isCommented,
                hasCommentedUncommented,
                hasSupportedUnsupported,
                selectedVideo,
                selectedVideoIndex,
                selectedVideoFile,
                selectedVideoItem,
                gradeOfTutorial,
                parsedFiles,
                rate:1,
            },()=>{
                this.castVideo( {
                    title: selectedVideoItem.title,
                    mediaUrl: selectedVideoItem.s3_path,
                });
     /*           console.log(
                    "playing:",
                    selectedVideoItem,
                    this.state.selectedVideoFile
                );*/
            });
        });
    };


    getInitialVideoFileToPlay = (parsedFiles,isDefaultSupported=false,commentaryOnDefault=this.state.isCommentaryOn)=>{

        let initialFile = false;
        let isSupported = false;
        let isCommented = false;


        if(isDefaultSupported==="supported"){
            if(commentaryOnDefault){
                if( parsedFiles[this.state.videoQuality].supported.commented ){
                    initialFile = parsedFiles[this.state.videoQuality].supported.commented;
                    isSupported = true;
                    isCommented = true;
                } else
                if( parsedFiles[this.state.videoQuality].supported.uncommented ){
                    initialFile = parsedFiles[this.state.videoQuality].supported.uncommented;
                    isSupported = true;
                } else
                if( parsedFiles[this.state.videoQuality].unsupported.commented ){
                    initialFile = parsedFiles[this.state.videoQuality].unsupported.commented;
                    isCommented = true;
                } else
                if( parsedFiles[this.state.videoQuality].unsupported.uncommented ){
                    initialFile = parsedFiles[this.state.videoQuality].unsupported.uncommented
                }
            } else {
                if( parsedFiles[this.state.videoQuality].supported.uncommented ){
                    initialFile = parsedFiles[this.state.videoQuality].supported.uncommented;
                    isSupported = true;
                } else
                if( parsedFiles[this.state.videoQuality].supported.commented ){
                    initialFile = parsedFiles[this.state.videoQuality].supported.commented;
                    isSupported = true;
                    isCommented = true;
                }else
                if( parsedFiles[this.state.videoQuality].unsupported.uncommented ){
                    initialFile = parsedFiles[this.state.videoQuality].unsupported.uncommented
                } else
                if( parsedFiles[this.state.videoQuality].unsupported.commented ){
                    initialFile = parsedFiles[this.state.videoQuality].unsupported.commented;
                    isCommented = true;
                }
            }

        } else {

            if(commentaryOnDefault){
                if( parsedFiles[this.state.videoQuality].unsupported.commented ){
                    initialFile = parsedFiles[this.state.videoQuality].unsupported.commented;
                    isCommented = true;
                }else
                if( parsedFiles[this.state.videoQuality].supported.commented ){
                    initialFile = parsedFiles[this.state.videoQuality].supported.commented;
                    isSupported = true;
                    isCommented = true;
                } else
                if( parsedFiles[this.state.videoQuality].unsupported.uncommented ){
                    initialFile = parsedFiles[this.state.videoQuality].unsupported.uncommented
                } else
                if( parsedFiles[this.state.videoQuality].supported.uncommented ){
                    initialFile = parsedFiles[this.state.videoQuality].supported.uncommented;
                    isSupported = true;
                }
            } else {
                if( parsedFiles[this.state.videoQuality].unsupported.uncommented ){
                    initialFile = parsedFiles[this.state.videoQuality].unsupported.uncommented
                } else
                if( parsedFiles[this.state.videoQuality].unsupported.commented ){
                    initialFile = parsedFiles[this.state.videoQuality].unsupported.commented;
                    isCommented = true;
                }else
                if( parsedFiles[this.state.videoQuality].supported.uncommented ){
                    initialFile = parsedFiles[this.state.videoQuality].supported.uncommented;
                    isSupported = true;
                } else
                if( parsedFiles[this.state.videoQuality].supported.commented ){
                    initialFile = parsedFiles[this.state.videoQuality].supported.commented;
                    isSupported = true;
                    isCommented = true;
                }
            }



        }

        return {initialFile,isSupported,isCommented};

    };


    getNextVideoFileToPlay = (parsedFiles,isSupportedSelected=this.state.isSupportedSelected,isCommentaryOn=this.state.isCommentaryOn)=>{

        let isSupported = (isSupportedSelected===true)?"supported":"unsupported";
        let isCommented = (isCommentaryOn===true)?"commented":"uncommented";
        let nextFile = parsedFiles[this.state.videoQuality][isSupported][isCommented];

        if(!nextFile){
            isCommented = (isCommentaryOn!==true)?"commented":"uncommented";
            isSupported = (isSupportedSelected===true)?"supported":"unsupported";
            nextFile = parsedFiles[this.state.videoQuality][isSupported][isCommented];

            if(!nextFile){
                isCommented = (isCommentaryOn===true)?"commented":"uncommented";
                isSupported = (isSupportedSelected!==true)?"supported":"unsupported";
                nextFile = parsedFiles[this.state.videoQuality][isSupported][isCommented];

                if(!nextFile){
                    isCommented = (isCommentaryOn!==true)?"commented":"uncommented";
                    isSupported = (isSupportedSelected!==true)?"supported":"unsupported";
                    nextFile = parsedFiles[this.state.videoQuality][isSupported][isCommented];
                }

            }

        }

        return {nextFile, isSupported:(isSupported==="supported"), isCommented:(isCommented==="commented")};

    };



    setPlayerVideoFile = async(playListData=this.state.playListData,selectedVideo=this.state.selectedVideo,selectedVideoIndex=this.state.selectedVideoIndex)=>{


        const isDownloaded = playListData[selectedVideoIndex].downloaded;
        const isCompleted = playListData[selectedVideoIndex].completed;
        const hasCommentedUncommented = (playListData.length>0)?this.getHasCommentedUncommented(playListData[selectedVideoIndex].video):[false,false];
        const hasSupportedUnsupported = (playListData.length>0)?this.getHasSupportedUnsupported(playListData[selectedVideoIndex].video):[false,false];
        const isSupported = hasSupportedUnsupported[0];

        const parsedFiles = this.getVideoFiles(playListData[selectedVideoIndex].video);
        const nextVideoState = this.getNextVideoFileToPlay(parsedFiles);
        const selectedVideoItem = nextVideoState.nextFile;
        const gradeOfTutorial =  (playListData[selectedVideoIndex].grade)?playListData[selectedVideoIndex].grade:"";

        const selectedVideoFile = (!isDownloaded)?encodeURI(selectedVideoItem.s3_path)
            :this.tutorialsDownloadDir+"/"+selectedVideoItem.video_id+"-"+selectedVideoItem.code+".mp4";

        this.setState({
            isVideoLoading:true,
            //paused:true,
        },()=>{
            this.setState({
                isCompleted,
                isSupported,
                hasCommentedUncommented,
                hasSupportedUnsupported,
                selectedVideo,
                selectedVideoIndex,
                selectedVideoFile,
                gradeOfTutorial,
                selectedVideoItem,
                rate:1,
            },()=>{
                this.castVideo( {
                    title: selectedVideoItem.title,
                    mediaUrl: selectedVideoItem.s3_path,
                });
/*                console.log(
                    "playing:",
                    selectedVideoItem,
                    this.state.selectedVideoFile,
                    "isSupportedSelected:",
                    this.state.isSupportedSelected,
                    "isCommentaryOn:",
                    this.state.isCommentaryOn
                );*/
            });
        });

    };


    _renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#111",
                }}
            />
        );
    };

    _keyExtractor = (item,index) => item.tutorial_id;

    _onPressItem = (id: string, video:Array, selectedVideoIndex:Number) => {

        if(id!==this.state.selectedVideo){

            this.setState({
                isVideoLoading:true,
                //paused:true,
            },async ()=>{
                const {dispatch} = this.props.screenProps;
                dispatch(videoViewCount(id)).then(()=>{
                    dispatch(addRecentViewedVideo(this.state.playListData[selectedVideoIndex]));
                });

                const playListData = this.state.playListData;
                const selectedVideo = id;
                const isDownloaded = playListData[selectedVideoIndex].downloaded;
                const isCompleted = playListData[selectedVideoIndex].completed;
                const hasCommentedUncommented = (playListData.length>0)?this.getHasCommentedUncommented(playListData[selectedVideoIndex].video):[false,false];
                const hasSupportedUnsupported = (playListData.length>0)?this.getHasSupportedUnsupported(playListData[selectedVideoIndex].video):[false,false];
                const isSupported = hasSupportedUnsupported[0];

                const parsedFiles = this.getVideoFiles(playListData[selectedVideoIndex].video);
                const nextVideoState = this.getInitialVideoFileToPlay(parsedFiles,playListData[selectedVideoIndex].type);
                const selectedVideoItem = nextVideoState.initialFile;
                const gradeOfTutorial =  (playListData[selectedVideoIndex].grade)?playListData[selectedVideoIndex].grade:"";

                const selectedVideoFile = (!isDownloaded)?encodeURI(selectedVideoItem.s3_path)
                    :this.tutorialsDownloadDir+"/"+selectedVideoItem.video_id+"-"+selectedVideoItem.code+".mp4";

                this.setState({
                    isCompleted,
                    isSupported,
                    hasCommentedUncommented,
                    hasSupportedUnsupported,
                    isSupportedSelected:nextVideoState.isSupported,
                    isCommentaryOn:nextVideoState.isCommented,
                    selectedVideo,
                    selectedVideoIndex,
                    selectedVideoFile,
                    gradeOfTutorial,
                    selectedVideoItem,
                    parsedFiles,

                },()=>{
                    this.castVideo( {
                        title: selectedVideoItem.title,
                        mediaUrl: selectedVideoItem.s3_path,
                    });
                    console.log(
                        "playing:",
                        selectedVideoItem,
                        this.state.selectedVideoFile,
                    );
                });

            });
        } else {
            this.playPauseOnPress();
        }




    };

    _renderItem = ({item,index}) => {

        return (
            <MyListItem
                id={item.tutorial_id}
                index={index}
                onPressItem={this._onPressItem}
                selected={(this.state.selectedVideo===item.tutorial_id)}
                name={item.name}
                supported={(item.type==="supported")}
                downloaded={item.downloaded}
                paused={this.state.paused}
                video={item.video}
            />)

    } ;

    _onLayout = (event)=>{

        //console.log(event.nativeEvent.layout.width>event.nativeEvent.layout.height,event.nativeEvent.layout.width,event.nativeEvent.layout.height);
        if(this.state.isSingleVideo){
            this.setState({
                isLandscape:true,
                renderDeviceWidth:Dimensions.get("window").width,
                renderDeviceHeight:Dimensions.get("window").height,
            });

        } else {

            if(event.nativeEvent.layout.width>event.nativeEvent.layout.height){
                this.setState({
                    isLandscape:true,
                    controlsVisible:false,
                    headerVisible:false,
                    renderDeviceWidth:Dimensions.get("window").width,
                    renderDeviceHeight:Dimensions.get("window").height,
                });
            } else {
                this.setState({
                    isLandscape:false,
                    controlsVisible:true,
                    headerVisible:true,
                    renderDeviceWidth:Dimensions.get("window").width,
                    renderDeviceHeight:Dimensions.get("window").height,
                });
            }

        }



    };



    render() {

        const renderVideoHeight = this.state.renderDeviceHeight-96;
        const renderVideoWidth =  Math.ceil((renderVideoHeight*16)/9);
        const renderVideoLeft =  (this.state.isSingleVideo)?0:Math.floor((this.state.renderDeviceWidth-renderVideoWidth)/2);
        const durationText = this.state.currentTime + " / " + this.state.duration;
        const {params} = this.props.navigation.state;

        const SingleVideoHeader =  ()=><View style={ [styles.videoPlayerHeaderSingle,(this.state.headerVisible)?{display:"flex"}:{display:"none"}] }>
            <StatusBar hidden />
            <TouchableOpacity
                    style={{width:80, height:50, alignItems:"center",justifyContent:"center"}}
                    onPress={() => {
                        this.setState({isClosing:true},()=>{
                            Orientation.lockToPortrait();
                            if(params.closeAction){ params.closeAction(); }
                            this.props.navigation.goBack();
                        });

                    }}
                >
                    <Text style={styles.videoPlayerHeaderTextLeft}>Close</Text>
            </TouchableOpacity>



            <View style={{flex:1, flexDirection:"column", alignItems:"center", justifyContent:"center"}}>


            </View>
            <View style={{flex:1, flexDirection:"column", alignItems:"center", justifyContent:"center"}}>

            </View>
        </View>;


        return (


            <View style={{flex:1}}>

                {
                    (isIphoneX)&&
                    <Header style={{
                        paddingTop:0,
                        marginTop:0,
                        height:20,
                    }}>
                        <Left style={{ flex: 1 }}>
                        </Left>

                        <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
                        <Title></Title>
                        </Body>

                        <Right style={{ flex: 1 }}>

                        </Right>
                    </Header>
                }


                {
                    (this.state.isSingleVideo||this.state.isPlayListDataLoading) ? <SingleVideoHeader/>:null
                }

                {
                    (!this.state.isPlayListDataLoading) ?


                        <View style={(this.state.isSingleVideo) ? styles.containerSingleVideo : styles.container}
                              onLayout={this._onLayout}>


                            {
                                (!this.state.isSingleVideo)&&
                                    <View
                                        style={[styles.videoPlayerHeader, (this.state.headerVisible) ? {display: "flex"} : {display: "none"}]}>



                                        <View style={{ flexDirection:"row", backgroundColor:"#444",width:"100%", height:"50%", }}>

                                            <View style={{
                                                flex: 1,
                                                flexDirection: "column",
                                                alignItems: "flex-start",
                                                justifyContent: "center"
                                            }}>
                                                <TouchableOpacity
                                                    style={{
                                                        flex:1,
                                                        alignItems:"center",
                                                        justifyContent:"center",
                                                        width:64,

                                                    }}
                                                    onPress={() => {
                                                        //Orientation.lockToPortrait();
                                                        const {params} = this.props.navigation.state;
                                                        if(params.closeAction){ params.closeAction(); }
                                                        this.props.navigation.goBack();
                                                    }}
                                                >
                                                    <Text style={styles.videoPlayerHeaderTextLeft}>Close</Text>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{
                                                flex: 2,
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}>


                                                {
                                                    (!params.name)?
                                                        (params.apparatus&&params.grade)?
                                                            <View style={{
                                                                flex: 1,
                                                                flexDirection: "row",
                                                                alignItems: "center",
                                                                justifyContent: "center",

                                                            }}>


                                                                <Text style={styles.videoPlayerHeaderTextCenter}>{params.apparatus+" - Grade"}</Text>


                                                                <Badge style={styles.headerBadge}>
                                                                    <Text style={{fontWeight: "bold"}}>{params.grade}</Text>
                                                                </Badge>

                                                            </View>
                                                            :
                                                            <View style={{
                                                                flex: 1,
                                                                flexDirection: "row",
                                                                alignItems: "center",
                                                                justifyContent: "center",

                                                            }}>


                                                            </View>
                                                        :
                                                        <View style={{
                                                            flex: 1,
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            justifyContent: "center"
                                                        }}>

                                                            <Text style={styles.videoPlayerHeaderTextCenter}>{params.name}</Text>


                                                        </View>
                                                }



                                            </View>
                                            <View style={{
                                                flex: 1,
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}>
                                                <CastButton style={{
                                                    height: 24,
                                                    width: 24,
                                                    alignSelf: 'flex-end',
                                                    tintColor: 'white',
                                                    marginRight:10,
                                                }}/>
                                            </View>

                                        </View>



                                        <View style={{flex:1, flexDirection:"row"}}>
                                            <View style={{
                                                flex: 1,
                                                flexDirection: "column",
                                                alignItems: "flex-start",
                                                justifyContent: "center"
                                            }}>
                                                <Text style={{color:"#fff", paddingLeft:12}}>{this.state.gradeOfTutorial}</Text>
                                            </View>
                                            <View style={{
                                                flex: 1,
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}>
                                                {

                                                    (
                                                        (this.state.parsedFiles[this.state.videoQuality].supported.commented!==false) ||
                                                        (this.state.parsedFiles[this.state.videoQuality].supported.uncommented!==false)
                                                    ) &&
                                                    (
                                                        (this.state.parsedFiles[this.state.videoQuality].unsupported.commented!==false) ||
                                                        (this.state.parsedFiles[this.state.videoQuality].unsupported.uncommented!==false)
                                                    ) ?
                                                        <Segment style={{backgroundColor:"#222", width:200,  }}>
                                                            {
                                                                <Button first active={this.state.isSupportedSelected!==true} style={{ borderTopLeftRadius:5,borderBottomLeftRadius:5, width:90, paddingLeft:0, paddingRight:0, justifyContent:"center"}}
                                                                        onPress={()=>{
                                                                            if(this.state.isSupportedSelected===true){
                                                                                this.onSupportedToggle(false);
                                                                            }
                                                                        }}
                                                                >
                                                                    <Text style={{fontSize:12, color:(this.state.isSupportedSelected!==true)?"#fff":"#999",}}>Unsupported</Text>
                                                                </Button>
                                                            }

                                                            <Button last active={this.state.isSupportedSelected===true} style={
                                                                {borderTopRightRadius:5,borderBottomRightRadius:5, width:90, paddingLeft:0, paddingRight:0, justifyContent:"center"}
                                                            }
                                                                    onPress={()=>{
                                                                        if(!this.state.isSupportedSelected){
                                                                            this.onSupportedToggle(true);
                                                                        }

                                                                    }}
                                                            >
                                                                <Text style={{fontSize:12, color:(this.state.isSupportedSelected===true)?"#fff":"#999"}}>Supported</Text>
                                                            </Button>
                                                        </Segment>
                                                    :
                                                        null


                                                }

                                            </View>
                                            <View style={{
                                                flex: 1,
                                                flexDirection: "column",
                                                alignItems: "flex-end",
                                                justifyContent: "center",
                                                paddingRight:8,
                                            }}>
                                                <Image style={{
                                                    width: 28,
                                                    height: 28,
                                                    tintColor: (this.state.isHdOn) ? "#ccc" : "#666"
                                                }} source={hdIcon}/>
                                            </View>
                                        </View>

                                    </View>

                            }


                            <View style={
                                (this.state.isLandscape) ?
                                    (this.state.headerVisible) ?
                                        [styles.videoPlayerContainerFullScreen, {
                                            width: renderVideoWidth,
                                            height: renderVideoHeight,
                                            left: renderVideoLeft
                                        }]
                                        :
                                        styles.videoPlayerContainerFullScreen
                                    :
                                    styles.videoPlayerContainer

                            }>

                                <TouchableOpacity
                                    style={(this.state.isLandscape) ? styles.videoFullScreen : styles.videoNormalScreen}
                                    activeOpacity={1}
                                    onPress={this.videoOnPress}
                                >

                                    <Video
                                        ref={(ref: Video) => {
                                            this.video = ref
                                        }}
                                        source={{uri: this.state.selectedVideoFile}}
                                        style={(this.state.isLandscape) ? styles.videoScreenFull : styles.videoScreen}
                                        rate={this.state.rate}
                                        paused={(this.state.isCastingModeOn)?true:this.state.paused}
                                        volume={this.state.volume}
                                        muted={this.state.muted}
                                        resizeMode={this.state.resizeMode}
                                        onBuffer={this.onBuffer}
                                        onLoadStart={this.onLoadStart}
                                        onLoad={this.onLoad}
                                        onProgress={this.onProgress}
                                        onEnd={this.onEnd}
                                        onAudioBecomingNoisy={this.onAudioBecomingNoisy}
                                        onAudioFocusChanged={this.onAudioFocusChanged}
                                        repeat={this.state.isRepeatOn}
                                        progressUpdateInterval={1000}
                                    />
                                    <View
                                        style={[styles.videoPlayerPlayIcon, (this.state.paused) ? {display: "flex"} : {display: "none"}]}>
                                        {

                                            (this.state.isCastingModeOn)?
                                                (this.state.isCastingPaused) ?
                                                    <Image style={{width: 64, height: 64, tintColor: "#5c96f5"}}
                                                           source={playIcon}/>
                                                        :
                                                        <Image style={{width: 42, height: 42, tintColor: "#5c96f5"}}
                                                             source={pauseIcon}/>
                                                            :
                                            (this.state.isVideoLoading) ?
                                                <ActivityIndicator size="large" color={"#5c96f5"}/>
                                                :
                                                (this.state.paused) ?
                                                <Image style={{width: 64, height: 64, tintColor: "#5c96f5"}}
                                                       source={playIcon}/>
                                                    :
                                                        null
                                        }

                                    </View>

                                </TouchableOpacity>


                            </View>


                            <View
                                style={[styles.videoPlayerControllerContainer, (this.state.controlsVisible) ? {display: "flex"} : {display: "none"}]}>

                                <View style={styles.controls}>

                                    <View style={styles.generalControls}>
                                        <View style={styles.fullScreenControl}>
                                            <TouchableOpacity activeOpacity={0.6} onPress={this.playPauseOnPress}>
                                                <Image style={{
                                                    width: (this.state.paused) ? 16 : 28,
                                                    height: (this.state.paused) ? 16 : 28,
                                                    marginLeft: (this.state.paused) ? 6 : 0,
                                                    marginRight: (this.state.paused) ? 6 : 0,
                                                    tintColor: "#ccc"
                                                }} source={(this.state.paused) ? pauseIcon : playIcon}/>
                                            </TouchableOpacity>
{/*                                            <TouchableOpacity activeOpacity={0.6} onPress={this.onFullScreenPress}>
                                                <Image style={{width: 28, height: 28, tintColor: "#666"}}
                                                       source={(this.state.isLandscape) ? fullScreenExitIcon : fullScreenIcon}/>
                                            </TouchableOpacity>*/}

                                            <View style={styles.durationControl}>
                                                <Text style={{color: "#fff", fontSize: 11}}>
                                                    {durationText}
                                                </Text>
                                            </View>
                                            <View style={styles.repeatControl}>
                                                {
                                                    (!this.state.isSingleVideo)&&
                                                    <TouchableOpacity activeOpacity={0.6} onPress={this.onRepeatPress}>
                                                        <Image style={{
                                                            width: 28,
                                                            height: 28,
                                                        }} source={this.repeatIcons[this.state.repeatMode]}/>
                                                    </TouchableOpacity>
                                                }

                                            </View>

                                            {
                                                (!this.state.isSingleVideo && !this.state.isCommentaryOn)&&
                                                <TouchableOpacity style={{marginLeft:10, height:24,}} onPress={() => {
                                                    const nextRate = (this.state.rate===1)?0.5:(this.state.rate===0.5)?0.25:1;
                                                    this.setState({ rate:nextRate }) ;
                                                }}>
                                                    <Text style={{ fontWeight:'normal', fontSize:16, color:"#fff"  }}>
                                                        { (this.state.rate===0.5)?"1/2":(this.state.rate===0.25)?"1/4":"1" }x
                                                    </Text>
                                                </TouchableOpacity>
                                            }


                                        </View>


                                        {
                                            (!this.state.isSingleVideo)&&
                                            <View style={styles.hdControl}>
                                                {
                                                    (
                                                        (this.state.parsedFiles[this.state.videoQuality].supported.commented!==false)||
                                                        (this.state.parsedFiles[this.state.videoQuality].unsupported.commented!==false)
                                                    )&&
                                                        <View style={styles.commentaryControl}>
                                                            <TouchableOpacity
                                                                activeOpacity={0.6} onPress={this.onCommentaryToggle}
                                                            >
                                                                <Image style={{
                                                                    width: 28,
                                                                    height: 28,
                                                                    tintColor: (this.state.isCommentaryOn) ? "#ccc" : "#666"
                                                                }} source={commentaryIcon}/>
                                                            </TouchableOpacity>
                                                        </View>
                                                }

                                                <TouchableOpacity onPress={this.onCompletedPress} >
                                                    <Image style={{width: 28, height: 28,}}
                                                           source={(parseInt(this.state.isCompleted)===2)?checkIconCompletedMentor:(parseInt(this.state.isCompleted)===1)?checkIconCompleted:checkIcon}/>
                                                </TouchableOpacity>


                                            </View>
                                        }






                                    </View>

                                </View>
                            </View>


                            {
                                (this.state.isSingleVideo) ?
                                    null
                                    :
                                    <FlatList
                                        data={this.state.playListData}
                                        keyExtractor={this._keyExtractor}
                                        renderItem={this._renderItem}
                                        ItemSeparatorComponent={this._renderSeparator}
                                        style={{
                                            width: "100%",
                                            flex: 1,
                                            height: "100%",
                                            backgroundColor: "#444",
                                            display: (!this.state.isLandscape) ? "flex" : "none"
                                        }}
                                    />

                            }


                        </View>


                        :

                        <View style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#444",
                            width: "100%"
                        }}>
                            <ActivityIndicator size="large" color="#5c96f5"/>
                        </View>


                }
            </View>
        )
    }
}


const videoHeight = Math.ceil((deviceWidth*9)/16);
const headerHeight = 96;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#444',
        paddingTop:20
    },
    containerSingleVideo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },

    videoPlayerHeaderSingle:{
        width:"100%",
        height:Math.ceil(headerHeight/2),
        backgroundColor:"#222",
        flexDirection:"column",
    },
    videoPlayerHeader:{
        width:"100%",
        height:headerHeight,
        backgroundColor:"#222",

        flexDirection:"column",
    },
    headerBadge:{
        backgroundColor: '#fff',
        height:20,
        marginTop:Math.ceil(((headerHeight/2)-20)/2),
        marginLeft:5
    },

    videoPlayerHeaderTextLeft:{
        color:"#fff",
        fontFamily:"Montserrat-SemiBold",
    },
    videoPlayerHeaderTextCenter:{
        color:"#fff",
        fontFamily:"Montserrat-SemiBold",

    },

    videoPlayerContainer:{
        width:"100%",
        height:videoHeight,
        backgroundColor:"#000",
        flexDirection:"row",
        alignItems:"flex-start",
        justifyContent:"flex-start",


    },

    videoPlayerContainerFullScreen:{
        width:"100%",
        height:"100%",
        backgroundColor:"#000",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",

    },

    videoPlayerControllerContainer:{
        width:"100%",
        height:48

    },

    videoPlayerControllerContainerFullScreen:{
        width:"100%",
        height:48

    },

    videoPlayerPlayIcon:{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        alignItems:"center",
        justifyContent:"center",

    },

    videoNormalScreen:{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height:videoHeight,
        backgroundColor:"#000"
    },

    videoFullScreen:{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height:"100%",
        width:"100%",
        backgroundColor:"#000"
    },

    videoScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height:"100%",
        width:"100%",

    },

    videoScreenFull: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height:"100%",
        width:"100%",

    },
    controls: {
        backgroundColor: 'rgba(0,0,0,0.9)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingLeft:10,
        paddingRight:10,
        borderTopWidth: 1,
        borderTopColor: "#000",
    },
    progress: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 3,
        overflow: 'hidden',
    },
    innerProgressCompleted: {
        height: 20,
        backgroundColor: '#cccccc',
    },
    innerProgressRemaining: {
        height: 20,
        backgroundColor: '#2C2C2C',
    },
    generalControls: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
        paddingTop: 10,
        paddingBottom: 10,

    },
    rateControl: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },

    resizeModeControl: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullScreenControl:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    durationControl:{
        marginLeft:15,

    },
    repeatControl:{
        marginLeft:15,
    },
    volumeControl: {
        marginRight:15,

    },
    hdControl:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    commentaryControl:{
        marginRight:(deviceHeight<640)?5:15,
        alignItems:"center",
        justifyContent:"center"
    },
    controlOption: {
        alignSelf: 'center',
        fontSize: 11,
        color: 'white',
        paddingLeft: 2,
        paddingRight: 2,
        lineHeight: 12,
    },
    trackingControls:{

    },
    containerCast: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        height:300,
    },
    chromecastAround: {
        fontWeight: 'bold',
    },
    button: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 2,
        backgroundColor: '#42A5F5'
    },
    textButton: {
        color: 'white',
        fontWeight: 'bold',
    },
    chromecastButton: {
        backgroundColor: '#EC407A',
        marginVertical: 10,
    },
    disconnectButton: {
        marginVertical: 10,
        backgroundColor: '#f44336',
    },
    controlButton: {
        marginVertical: 10,
        backgroundColor: '#689F38'
    }
});