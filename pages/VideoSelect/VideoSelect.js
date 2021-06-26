import React, { Component } from 'react';
import {StyleSheet, TouchableOpacity, FlatList, View, Image, BackHandler} from 'react-native';
import {
    Container, Content, Text, Header, Body, Title, Right,
    Left, Spinner, Segment, Icon, Button, Footer, FooterTab, ActionSheet, Toast
} from 'native-base';
import SearchView from "../../components/SearchBox/SearchView";
import {NavigationActions} from "react-navigation";
import { Col, Row } from "react-native-easy-grid";
import checkIcon from "../../assets/check_gray.png";
import checkIconCompleted from "../../assets/check_orange-1.png";
import checkIconCompletedMentor from "../../assets/check_green.png";
import {
    setFirstRunParam,
    toggleSelectMode,
    toggleTutorialCompleteStatus,
    loadTutorialData,
    addToPlayList,
    loadPlayListData,
    showFooter,
    setSearchView,
    toggleTutorialCompleteStatusSingle,
    downloadTutorials,
    downloadTutorialsStatusReset,
} from "../../components/Store/actions";
import ModalFullScreen, { modalTypes } from "../../components/ModalFullScreen/ModalFullScreen";

class MyThumbnailItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPressItem(this.props.id,this.props.isViewable);
    };

    _onPressComplete = () => {
        this.props.onPressItemComplete(this.props.id,this.props.isViewable);
    };


    render() {

        const {tnWidth,tnHeight,downloaded,selected,completed} = this.props;

        return (
            <Col style={{
                flex:1,
                marginBottom:15,
                //opacity:(this.props.isViewable)?1:0.5
                }}
            >


                <Row>
                    <Col >

                        <View style={{
                            height: tnHeight, width: tnWidth,
                            alignSelf:"center",

                        }}>
                            <TouchableOpacity style={{flex:1, alignItems:"flex-start",justifyContent:"flex-start",}} activeOpacity={0.8} onPress={this._onPress}>
                            <Image
                                style={{
                                    height: tnHeight, width: tnWidth,
                                    borderColor:"#5c96f5", borderRadius:10, borderWidth:(selected)?3:1,
                                    alignSelf:"center",
                                    opacity:(selected)?0.6:1


                                }}
                                source={{uri:this.props.thumbnail}}
                                />

                            </TouchableOpacity>


                            {
                                (parseInt(completed)===2) ?
                                    <TouchableOpacity style={styles.iconCompleted} activeOpacity={0.8} onPress={this._onPressComplete}>
                                        <Image
                                            style={{width:20,height:20}}
                                            source={checkIconCompletedMentor}

                                        />
                                    </TouchableOpacity>
                                    :
                                    (parseInt(completed)===1) ?
                                        <TouchableOpacity style={styles.iconCompleted} activeOpacity={0.8} onPress={this._onPressComplete}>
                                            <Image
                                                style={{width:20,height:20}}
                                                source={checkIconCompleted}

                                            />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity style={styles.iconCompleted} activeOpacity={0.8} onPress={this._onPressComplete}>
                                            <Image
                                                style={{width:20,height:20}}
                                                source={checkIcon}

                                            />
                                        </TouchableOpacity>
                            }
                        {(downloaded)?
                            <Icon name="md-download" style={styles.iconDownloaded} />
                            :null
                         /*
                             <Icon name="md-cloud" style={styles.iconDownloaded} />
                         */

                        }




                        </View>



                            <Text style={[styles.listItemText,(selected)?{color:"#5c96f5", fontFamily:"Montserrat-Medium"}:{}]}>
                                {this.props.title}
                            </Text>




                        <Text style={styles.listItemSubText}>
                            {this.props.subText}
                        </Text>
                    </Col>
                </Row>


            </Col>
        );
    }
}


class MyListItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPressItem(this.props.id,this.props.isViewable);
    };

    render() {

        const selected = (this.props.selected);

        return (

                <TouchableOpacity style={{flex:1, height:50}} activeOpacity={0.8} onPress={this._onPress}>


                    <Row>

                        <Col size={70} style={{justifyContent:"center"}} >

                            <Text style={[styles.listItemText1,(selected)?{color:"#5c96f5", fontFamily:"Montserrat-Medium"}:{}]}>
                                {this.props.title}
                            </Text>
                            <Text style={styles.listItemSubText1}>{this.props.subText}</Text>

                        </Col>

                        <Col size={20}>
                            <Row style={{alignItems:"center"}}>
                            <Text style={styles.listItemSubText2}>
                                {this.props.views+" views"}
                            </Text>
                            </Row>
                        </Col>

                        <Col size={10} >
                            <Row style={{alignItems:"center"}}>
                                {
                                    (parseInt(this.props.completed)===2) ?

                                        <Image
                                            style={styles.iconCompletedList}
                                            source={checkIconCompletedMentor}

                                        />
                                        :
                                        (parseInt(this.props.completed)===1) ?
                                            <Image
                                                style={styles.iconCompletedList}
                                                source={checkIconCompleted}

                                            />
                                            :
                                            <Image
                                                style={styles.iconCompletedList}
                                                source={checkIcon}

                                            />
                                }
                            </Row>
                        </Col>


                    </Row>

                </TouchableOpacity>

        );
    }
}



export default class VideoSelect extends Component<{}> {

    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            loading: true,
            userSelected: [],
            selected: (new Map(): Map<string, boolean>),
            viewType:"thumbnail",
            tutorialVideos:{
                apparatus:"video1.mp4",
            },
            dismissTutorial:false,
            modalVisible:false,
            modalContent:modalTypes.warmUpTutorial,
            modalData:false,
            isSelectMode:false,
            isAllSelected:false,
            isSortingData:false,
        };

        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.backHandler)
        );

    }

    async componentDidMount(){


        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.backHandler)
        );
        const {params} = this.props.navigation.state;

        if(params.showTutorial){
/*             const navigateAction = NavigationActions.navigate({
                routeName:"VideoPlayer",
                params:{
                    video:params.video,
                    singleVideo:true
                }
             });
            this.props.navigation.dispatch(navigateAction);*/
        }



        await this.loadTutorialData(params.categoryId);

        const {isSelectMode} = this.props.screenProps.state;

        if(isSelectMode!==undefined){
            this.setState({
                isSelectMode: isSelectMode,
            });
        }

    }

    async componentWillReceiveProps(nextProps){

        if(nextProps.screenProps.downloadTutorialsStatus==="completed"){
/*            Toast.show({
                text: "Videos successfully downloaded.",
                position: 'top',
                buttonText: 'OK',
                duration:3000,
                type:"success"
            });*/
            await this.props.screenProps.dispatch(downloadTutorialsStatusReset());
            this.updateTutorialDownloaded();
        }

        if(nextProps.screenProps.videoViewCountChanged.id!==this.props.screenProps.videoViewCountChanged.id ||
            nextProps.screenProps.videoViewCountChanged.count!==this.props.screenProps.videoViewCountChanged.count){

            this.updateViewCount(nextProps.screenProps.videoViewCountChanged);
        }

        //console.log(nextProps.screenProps.tutorialCompleteChanged.category_id,nextProps.navigation.state.params.categoryId);
        //console.log(nextProps.screenProps.tutorialCompleteChanged.tutorials,this.props.screenProps.tutorialCompleteChanged.tutorials);


        if(parseInt(nextProps.screenProps.tutorialCompleteChanged.category_id)===parseInt(nextProps.navigation.state.params.categoryId)){

            if(JSON.stringify(nextProps.screenProps.tutorialCompleteChanged.tutorials)
                !==JSON.stringify(this.props.screenProps.tutorialCompleteChanged.tutorials)){
                this.updateTutorialCompleted(nextProps.screenProps.tutorialCompleteChanged.tutorials);
            }

        }


    }


    componentWillUnmount() {

        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();

    }

    backHandler = ()=> {

        let returnValue = false;
        if(this.props.screenProps.searchView.video){
            returnValue = true;
            this.props.screenProps.dispatch(setSearchView("video",false)).then(()=>{
                this.props.screenProps.dispatch(showFooter());
            });
        } else
            if(this.props.screenProps.state.isSelectMode){
                returnValue = true;
                this.toggleSelectMode().catch(()=>console.log);
            }

        return returnValue;
    };


    updateTutorialCompleted = (tutorialCompleted)=>{

        const updatedData = this.state.tutorialData.map((item)=>{
            const tutorialItemIndex = tutorialCompleted.findIndex((tutorial)=>(tutorial.tutorial_id===item.tutorial_id));
            const tutorialItem =  tutorialCompleted[tutorialItemIndex];
            item.completed = tutorialItem.completed;
            return item;
        });

        this.setState({tutorialData:updatedData});

    };

    updateTutorialDownloaded = ()=>{
        const downloadedTutorialIds = this.props.screenProps.downloadedTutorials.map((item)=>{
            return item.split("-")[0];
        });
        const updatedData = this.state.tutorialData.map((item)=>{
            if(downloadedTutorialIds.includes(item.tutorial_id)){item.downloaded=true}
            return item;
        });

        this.setState({tutorialData:updatedData});

    };


    updateViewCount = (videoViewCountChanged)=>{

        const updatedData = this.state.tutorialData.map((item)=>{
            if(item.tutorial_id===videoViewCountChanged.id){
                item.view_count = videoViewCountChanged.count;
            }
            return item;
        });

        this.setState({tutorialData:updatedData});

    };

    loadTutorialData = (categoryId)=>{

        this.setState({
            loading:true,
        },async ()=>{
            const {dispatch} = this.props.screenProps;
            let dismissTutorial = true;
            //await dispatch(getFirstRunParam("warmUpTutorial")).then((result)=>(result)?dismissTutorial=false:dismissTutorial=true);
            await dispatch(loadTutorialData(categoryId)).then(
                (tutorialData)=>{
                    if(tutorialData){
                        if(!tutorialData.error){
                            this.setState({isSortingData:true},()=>{
                                const sortedTutorials = this.sortTutorials(tutorialData);
                                this.setState({
                                    tutorialData:sortedTutorials,
                                    dismissTutorial,
                                    loading:false,
                                    showBackBtn:!(categoryId===0),
                                    isSortingData:false
                                });
                            });

                        }
                    }
                }
            );
            if(!dismissTutorial)this.showModal();
        });

    };

    showModal = ()=>{

        this.setState({
            modalVisible:true
        });

    };

    dismissModal = ()=>{

        this.setState({
            modalVisible:false
        });

    };

    nextModalAction = async (modal)=>{

        switch(modal.currentModal){

            case modalTypes.warmUpTutorial:

                const {dispatch} = this.props.screenProps;
                await dispatch(setFirstRunParam({warmUpTutorial:false}));

                if(modal.action==="SKIP"){
                    this.setState({
                        dismissTutorial:true
                    },()=>{

                    });

                } else
                if(modal.action==="WATCH"){

                    this.setState({
                        dismissTutorial:true
                    },()=>{
                        this.showTutorialVideo(this.state.tutorialVideos.gradesUpperLimit,()=>this.nextModalAction({currentModal:"APPARATUS_TUTORIAL",action:"SKIP",dismiss:modal.dismiss}));
                    });


                }
                break;

            default:
                break;


        }


        this.dismissModal();


    };


    showTutorialVideo = (video:String, closeAction=false)=>{

        const navigateAction = NavigationActions.navigate({
            routeName:"VideoPlayer",
            params:{video,singleVideo:true,closeAction},
        });
        this.props.navigation.dispatch(navigateAction);

    };


    toggleSelectMode = async ()=>{


        this.setState({
            isSelectMode:!this.state.isSelectMode,
            selected:  (new Map(): Map<string, boolean>)
        },()=>{
            this.props.screenProps.dispatch(toggleSelectMode());
        });


    };


    addToPlayList = (showAll:Boolean=false)=>{

        const {dispatch} = this.props.screenProps;
        const {addToPlayListId} = this.props.screenProps.state;

        dispatch(loadPlayListData(false,"playlist_id,name,auto_download","caller3")).then((playListData)=>{

            const playLists = playListData.items;

            const  firstPlayList = (addToPlayListId)?playLists.filter((item)=>{
                return item.id===addToPlayListId
            }).map((item)=>{
                return { text: item.name, icon: "list", iconColor: "#5c96f5", id:item.id }
            })[0]:false;

            let BUTTONS;

            if(firstPlayList&&!showAll){
                BUTTONS = [firstPlayList,{ text: "Show All Playlists", icon: "list", iconColor: "#5c96f5" }];
            } else {
                BUTTONS = playLists.map((item)=>{
                    return { text: item.name, icon: "list", iconColor: "#5c96f5", id:item.id }
                });
            }

            BUTTONS.push({ text: "Cancel", icon: "close", iconColor: "#666" });

            const CANCEL_INDEX = BUTTONS.length-1;

            ActionSheet.show(
                {
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                    title: "Add To Playlist"
                },
                buttonIndex => {
                    if(buttonIndex!==CANCEL_INDEX){
                        const selectedPlayList = (playListData.items)?playListData.items.filter((item)=>(item.id=BUTTONS[buttonIndex].id))[0]:false;
                        const selectedTutorials = this.state.tutorialData.filter((item)=>(this.state.selected.has(item.tutorial_id)));
                        this.setState({
                            isSelectMode:false,
                            selected: (new Map(): Map<string, boolean>)
                        },()=>{
                            if(firstPlayList&&!showAll){
                                if(buttonIndex===0){
                                    dispatch(addToPlayList(selectedPlayList.id,selectedTutorials)).then(()=>{
                                        if(selectedPlayList.auto_download){
                                            const tutorialVideos = selectedTutorials.map((item)=>item.video);
                                            dispatch(downloadTutorials(tutorialVideos));
                                        }
                                    }).catch((e)=>console.log(e));
                                } else if (buttonIndex===1){
                                    this.addToPlayList(true);
                                }
                            } else {
                                dispatch(addToPlayList(selectedPlayList.id,selectedTutorials)).then(()=>{
                                    if(selectedPlayList.auto_download){
                                        const tutorialVideos = selectedTutorials.map((item)=>item.video);
                                        dispatch(downloadTutorials(tutorialVideos));
                                    }
                                }).catch((e)=>console.log(e));
                            }
                        });

                    }

                }
             )
        });


    };


    updateTutorialComplete = ()=>{

        const {params} = this.props.navigation.state;
        const {dispatch} =  this.props.screenProps;
        let isAllSelectedCompleted = true;

        this.state.tutorialData.forEach((tutorial)=>{
            if((this.state.selected.get(tutorial.tutorial_id)===true)){
                if(parseInt(tutorial.completed)===0){isAllSelectedCompleted=false}
            }
        });

        const updatedData = this.state.tutorialData.map((tutorial)=>{
            if(isAllSelectedCompleted){
                if((parseInt(tutorial.completed)>0)&&(this.state.selected.get(tutorial.tutorial_id)===true)){
                    tutorial.completed = 0;
                }
            } else {
                tutorial.completed = (parseInt(tutorial.completed)===0)?
                    (this.state.selected.get(tutorial.tutorial_id)===true)?
                        (parseInt( tutorial.completed)===2)?2:1
                        :
                        0
                    :
                    (parseInt( tutorial.completed)===2)?2:1;
            }

            return tutorial;
        });

        this.setState({isSortingData:true},()=> {

            const sortedTutorials = this.sortTutorials(updatedData);
            this.setState({
                tutorialData:sortedTutorials,
                selected: (new Map(): Map<string, boolean>),
                isSelectMode:false,
                isSortingData:false,
            },()=>{
                dispatch(toggleTutorialCompleteStatus(updatedData,params.categoryId));
            });

        });


    };


    downloadTutorials = ()=>{

        const {dispatch} =  this.props.screenProps;
        const storageUse =(this.props.screenProps.downloadedTutorialsSize)?this.props.screenProps.downloadedTutorialsSize:0;
        const limitSize = (this.props.screenProps.storageLimit)?this.props.screenProps.storageLimit:-1;

        if(storageUse<limitSize || limitSize===-1){
            const selectedTutorials = this.state.tutorialData.filter((item)=>{
                return (this.state.selected.has(item.tutorial_id));
            }).map((item)=>(item.video));
            dispatch(downloadTutorials(selectedTutorials));
        } else {
            console.log("Max Storage Limit Reached: "+storageUse+" / "+limitSize);
            Toast.show({
                text: "Storage limit exceeded. Please free up some space to download videos.",
                position: 'top',
                buttonText: 'OK',
                duration:5000,
                type:"warning"
            });

        }

        this.setState({
            isSelectMode:false,
            selected: (new Map(): Map<string, boolean>)
        },()=>{
            dispatch(toggleSelectMode());
        });



    };

    toggleSelectAllTutorials = ()=>{

        const selected = new Map();
        this.state.tutorialData.forEach((item)=>{
            selected.set(item.tutorial_id, !this.state.isAllSelected);
        });
        this.setState((state)=>({selected,isAllSelected:!state.isAllSelected}));

    };

    sortTutorials = (data)=>{
        //return (this.state.viewType==="list")?this.sortTutorialsByViews(data):this.sortTutorialsByComplete(data);
        return (this.state.viewType==="list")?this.sortTutorialsByViews(data):this.sortTutorialsAlphabetical(data);
    };

    sortTutorialsByViews = (tutorialData)=>{
        return tutorialData.sort(function(a, b) {
            return (b.view_count < a.view_count) ? -1 : (b.view_count > a.view_count) ? 1 : 0;
        });
    };


    sortTutorialsAlphabetical = (tutorialData)=>{
        return tutorialData.sort(function(a, b) {
            return (a.name.toUpperCase() < b.name.toUpperCase()) ? -1 : (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : 0;
        });
    };

    sortTutorialsByComplete = (data)=>{
        const tutorialData = this.sortTutorialsAlphabetical(data);
        const completedTutorials = tutorialData.filter((tutorial)=>(!!tutorial.completed));
        const tutorials = tutorialData.filter((tutorial)=>(!tutorial.completed));
        return (completedTutorials.length>0)?[...completedTutorials,...tutorials]:tutorialData;
    };

    _onRefresh() {
        this.setState({refreshing: true},()=>{
            this.setState({refreshing: false});
        });

    }



    _keyExtractor = (item, index) => item.tutorial_id;

    _onPressItem = (index, item) => {

        if(this.state.isSelectMode){

            this.setState((state) => {
                const selected = new Map(state.selected);
                selected.set(item.tutorial_id, !selected.get(item.tutorial_id));
                return {selected};
            });



        } else {

            const {params} = this.props.navigation.state;
            const navigateAction = NavigationActions.navigate({
                routeName: 'VideoPlayer',
                params: {
                    apparatus:params.apparatus,
                    grade:params.grade,
                    playListData:this.state.tutorialData,
                    selectedIndex:index,
                },
            });

            this.props.navigation.dispatch(navigateAction);

        }

    };

    _onPressItemComplete = (index, item) => {

        if(!this.state.isSelectMode){
            const {params} = this.props.navigation.state;
            const {dispatch} =  this.props.screenProps;
            const updatedData = this.state.tutorialData.map((tutorial)=>{
                if(tutorial.tutorial_id===item.tutorial_id){
                   if(parseInt(tutorial.completed)>0){
                       tutorial.completed = 0;
                   } else {
                       tutorial.completed = 1;
                   }

                }
                return tutorial;
            });



            this.setState({tutorialData:updatedData},()=>{
                dispatch(toggleTutorialCompleteStatusSingle(updatedData,params.categoryId)).then(()=>{
                    //console.log(this.state.tutorialData);
                });
            });
        }


    };

    _renderItem = ({item, index}) => {
        const deviceHeight = this.props.screenProps.dimensions.height;
        const thumbnail = (item.video.length>0)?item.video[0].s3_image:null;
        return (
            <MyThumbnailItem
                id={item.tutorial_id}
                onPressItem={()=>this._onPressItem(index, item)}
                onPressItemComplete={()=>this._onPressItemComplete(index, item)}
                completed={item.completed}
                title={item.name}
                subText={(item.type==="supported")?"supported":""}
                thumbnail={thumbnail}
                selectedThumbnail={thumbnail}
                selected={!!this.state.selected.get(item.tutorial_id)}
                tnWidth={(deviceHeight<640)?92:100}
                tnHeight={(deviceHeight<640)?86:98}
                downloaded={item.downloaded}

            />)

    };

    _renderItemList = ({item, index}) => {
        return (
            <MyListItem
                id={item.tutorial_id}
                onPressItem={()=>this._onPressItem(index, item)}
                completed={item.completed}
                title={item.name}
                views={(item.view_count)?item.view_count:0}
                subText={(item.type==="supported")?"supported":""}
                selected={!!this.state.selected.get(item.tutorial_id)}

            />)

    };

    _renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#ddd",
                }}
            />
        );
    };

    _onSegmentPress = (viewType)=> {

        if(viewType!==this.state.viewType){
            this.setState({viewType, isSortingData:true},()=>{
                this.sortTutorials(this.state.tutorialData);
                this.setState({isSortingData:false});
            });
        }



    };


    render() {

        const {params} = this.props.navigation.state;
        const {dispatch} =  this.props.screenProps;
        const {isAllSelected} = this.state;


        return (

                <Container style={styles.mainContainer}>
                    <Header style={{ paddingTop:0}}>
                        <Left style={{ flex:2 }}>
                            <TouchableOpacity onPress={() => {
                                if(this.state.isSelectMode){
                                    this.toggleSelectAllTutorials(isAllSelected);
                                } else {
                                    this.props.navigation.goBack();
                                }
                            }}>

                                {
                                    (this.state.isSelectMode)?
                                        <Text style={{color:"#fff", fontFamily:"Montserrat-SemiBold", fontSize:13}}>
                                            {(isAllSelected)?"Deselect All":"Select All"}
                                        </Text>
                                        :
                                        <Icon name="md-arrow-back" style={{fontSize: 30, color:"#fff"}} />
                                }

                            </TouchableOpacity>
                        </Left>

                        <Body style={{ flex: 6,  justifyContent: 'center', alignItems: 'center' }}>
                        <Title>{params.apparatus+" (Grade "+params.grade+")"}</Title>
                        </Body>

                        <Right style={{ flex: 2 }}>
                            <TouchableOpacity activeOpacity={0.7} onPress={()=>this.toggleSelectMode()}>
                            <Text style={{color:"#fff", fontFamily:"Montserrat-SemiBold", fontSize:13}}>
                                {(this.state.isSelectMode)?"Cancel":"Select"}
                            </Text>
                            </TouchableOpacity>
                        </Right>
                    </Header>
                    <SearchView
                        style={{top:0, position:"absolute"}}
                        dispatch={this.props.screenProps.dispatch}
                        screen="video"
                        showSearchOverlay={this.props.screenProps.searchView.video}
                        navigation={this.props.navigation}
                    />
                    <ModalFullScreen
                        modalVisible={this.state.modalVisible}
                        dismissModal={this.dismissModal}
                        nextAction={this.nextModalAction}
                        transparent={false}
                        modalContent={this.state.modalContent}
                        modalData={this.state.modalData}
                    />
                    <Segment>

                        {
                            (this.state.viewType==="thumbnail")?
                                <Button
                                    first
                                    active
                                    onPress={()=>this._onSegmentPress("thumbnail")}
                                    style={{
                                        paddingTop:0
                                    }}
                                >
                                    <Icon name='apps' style={styles.segmentIconSelected} />
                                </Button>
                                :
                                <Button
                                    first
                                    onPress={()=>this._onSegmentPress("thumbnail")}
                                    style={{
                                            paddingTop:0
                                        }}
                                >
                                    <Icon name='apps' style={styles.segmentIcon} />
                                </Button>
                        }

                        {
                            (this.state.viewType==="thumbnail")?
                                <Button last
                                        onPress={()=>this._onSegmentPress("list")}
                                        style={{
                                            paddingTop:0
                                        }}
                                >
                                    <Icon name='menu' style={styles.segmentIcon} />
                                </Button>
                                :
                                <Button last
                                        active
                                        onPress={()=>this._onSegmentPress("list")}
                                        style={{
                                            paddingTop:0
                                        }}
                                >
                                    <Icon name='menu' style={styles.segmentIconSelected} />
                                </Button>
                        }



                    </Segment>
                    <Content
/*                        refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />}*/
                    >
                        {this.state.loading? <Spinner color="#5c96f5" /> :
                            (this.state.viewType==="thumbnail")?
                            <FlatList
                                key={"tn-view"}
                                data={this.state.tutorialData}
                                extraData={this.state}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItem}
                                numColumns={3}
                                style={{paddingTop:15, marginLeft:10, marginRight:10}}
                            />
                                :
                                <FlatList
                                    key={"list-view"}
                                    data={this.state.tutorialData}
                                    extraData={this.state}
                                    keyExtractor={this._keyExtractor}
                                    renderItem={this._renderItemList}
                                    style={{paddingTop:15, marginLeft:20, marginRight:0}}
                                    ItemSeparatorComponent={this._renderSeparator}
                                />
                        }
                    </Content>
                    {
                        (this.state.isSelectMode)&&
                        <Footer>
                            <FooterTab>
                                <Button vertical onPress={()=>{
                                    this.downloadTutorials();
                                }}>
                                    <Icon name="ios-download" style={{fontSize: 30,}} />
                                    <Text style={{fontSize:10}}>Download</Text>
                                </Button>
                                <Button vertical onPress={()=>{
                                    this.updateTutorialComplete();
                                }}>
                                    <Icon name="ios-checkmark-circle-outline" style={{fontSize: 30,}} />
                                    <Text style={{fontSize:10}}>Completed</Text>
                                </Button>
                                <Button vertical onPress={()=>{
                                    this.addToPlayList();
                                }}>
                                    <Icon name="ios-add-circle-outline" style={{fontSize: 30,}} />
                                    <Text style={{fontSize:10}}>Add</Text>

                                </Button>

                            </FooterTab>
                        </Footer>
                    }
                </Container>

        );
    }
}


const styles = StyleSheet.create({
    mainContainer:{
      backgroundColor:"#fff",

    },
    listItemText:{
        fontSize:12,
        textAlign:"center",
        fontFamily:"Montserrat-Regular",
        width:86,
        alignSelf:"center"
    },
    listItemText1:{
        fontSize:16,
        textAlign:"left",
        fontFamily:"Montserrat-Regular",
    },
    listItemSubText:{
        fontSize:11,
        textAlign:"center",
        fontFamily:"Montserrat-SemiBold",
        color:"#999",
        flex:1,
    },
    listItemSubText1:{
        fontSize:11,
        textAlign:"left",
        fontFamily:"Montserrat-SemiBold",
        color:"#999",
    },
    listItemSubText2:{
        fontSize:11,
        textAlign:"left",
        fontFamily:"Montserrat-Regular",
        color:"#5c96f5",
        flex:1,
        paddingLeft:10,
    },
    iconCompleted:{
        position:"absolute",
        width:30,
        height:30,
        top:3,
        right:3,
        alignItems:"flex-end",
    },
    iconDownloaded:{
        position:"absolute",
        fontSize:24,
        color:"#999",
        top:1,
        left:3,
        alignItems:"flex-end",
    },
    iconCompletedList:{
        width:20,
        height:20,

    },
    segmentIcon:{
        color:"#5c96f5",


    },
    segmentIconSelected:{
        color:"#fff",




    },
    segmentButtons:{
        //borderRadius:5,
        //borderWidth:1,
    }
});
