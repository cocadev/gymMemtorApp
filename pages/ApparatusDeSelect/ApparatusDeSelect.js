import React, { Component } from 'react';
import {StyleSheet, Image, View, TouchableOpacity, ActivityIndicator, BackHandler} from 'react-native';
import {Container, Content, Text, Button, Icon,} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import ModalFullScreen, { modalTypes } from "../../components/ModalFullScreen/ModalFullScreen";
import {NavigationActions} from "react-navigation";
import {
    getCategoryData,
    getApparatusData,
    getGrades,
    setGradeUpperLevel,
    setFirstRunParam,
    setSelectedApparatus,
    profileCloseApparatusDeselect,
} from "../../components/Store/actions";


export default class ApparatusDeSelect extends Component<{}> {

    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props) {
        super(props);
        this.state = {
            modalVisible:false,
            modalContent:modalTypes.gradesGeneralTutorial,
            modalData:false,
            gradesListData:[],
            refreshing: false,
            userSelected: [],
            selectedUpperGrade:false,
            apparatusListData:[],
            isLoading:true,
            isModalModeLoading:false,
            tutorialVideos:{
                gradesUpperLimit:"https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/parental+risk+control.mp4",
                grades:[
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+1.mp4",
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+2.mp4",
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+3.mp4",
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+4.mp4",
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+5.mp4",
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+6.mp4",
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+7.mp4",
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+8.mp4",
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+9.mp4",
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+10.mp4",
                ],
                apparatusGeneral:"video1.mp4",
            },
            sendingApparatusData:false,
        };

        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.backHandler)
        );
    }

    async componentDidMount(){

        const {dispatch} = this.props.screenProps;

        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.backHandler)
        );

        dispatch(getApparatusData()).then(
            (apparatusData)=>{
                this.preFetchImages(apparatusData.allApparatus,["imageSelected","imageUnselected"]).then(
                    dispatch(getGrades()).then(
                        (gradesListDataAll)=>{
                            const gradesListData = gradesListDataAll.filter((grade)=>{return grade.name!=="Grade 11"});
                            this.preFetchImages(gradesListData,["imageSelected","imageUnselected"]).then(
                                ()=>{
                                    this.setState({
                                        apparatusListData:apparatusData.allApparatus,
                                        userSelected:apparatusData.allApparatus.filter((item)=>!item.selected).map((item)=>(item.category_id)),
                                        modalData:apparatusData.allApparatus,
                                        gradesListData,
                                        isLoading:false,
                                    })

                                }
                            ).catch((e)=>{console.log("preFetchImages Error:",e);});

                        }
                    ).catch((e)=>{console.log("getGrades dispatch Error:",e);})
                );
            }
        ).catch((e)=>{console.log("apparatus deselect getDataError:",e);});

    }

    componentWillUnmount() {

        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();

    }


    backHandler = ()=> {

        let returnValue = false;
        if(this.props.screenProps.hideFooter){
            returnValue = true;
        }

        return returnValue;
    };

    async preFetchImages(data,keys){

        let preFetchTasks = [];
        let imageKeys = [];
        let result = {downloadedAll:false};

        data.forEach((data)=>{

            if(Array.isArray(keys)){imageKeys=keys;}
            else {imageKeys.push(keys);}
            imageKeys.forEach((key)=>{
                preFetchTasks.push(Image.prefetch(data[key]).catch(e=>console.log(e)));
            });

        });

        await Promise.all(preFetchTasks).then((results)=>{
            let downloadedAll = true;
            results.forEach((result)=>{
                if(!result){
                    downloadedAll = false;
                }
            });

            result = {downloadedAll};

        });

        return result

    }

    getColumnList = (data,colNum=1)=>{

        const resultData = [];
        let rowData = [];
        if (colNum>4)colNum=1;

        for (let i=0; i<data.length; i+=colNum) {

            rowData = [];
            rowData.push(data[i]);

            if(i<data.length-1&&colNum>1){
                rowData.push(data[i+1]);
                if(i<data.length-2&&colNum>2){
                    rowData.push(data[i+2]);
                    if(i<data.length-3&&colNum>3){
                        rowData.push(data[i+3]);
                    }
                }
            }

            if(i%colNum===0){
                resultData.push(rowData);
            }
        }

        return resultData;

    };

    getGridFromData = (data,colNum=1,userSelected)=>{

        const gridData = this.getColumnList(data,colNum);
        const deviceHeight = this.props.screenProps.dimensions.height;
        const tnContainerStyle = (deviceHeight<640)?{height: 92, width: 60}:{height: 112, width: 80};
        const tnImageStyle = (deviceHeight<640)?{height: 60, width: 60, alignSelf:"center"}:{height: 72, width: 72, alignSelf:"center"};
        const tnFontSize = (deviceHeight<640)? {fontSize:10,fontWeight:"bold"}:{fontSize:12,fontWeight:"bold"};

        const resultGrid = gridData.map((rowData, idx)=>{
            const resultRow = rowData.map((colData)=>{
                return (
                    <Col key={colData.category_id} style={styles.listItemCol}>
                        <TouchableOpacity activeOpacity={1} style={{flex:1, alignItems:"center", justifyContent:"center"}} onPress={()=>{this.onSelect(colData.category_id)}}>
                            <View style={tnContainerStyle}>
                                {
                                    (userSelected.indexOf(colData.category_id)<0)?
                                        <Image
                                            style={tnImageStyle}
                                            source={{uri:colData.imageUnselected}}
                                            resizeMode="contain"
                                        />
                                        :
                                        <Image
                                            style={tnImageStyle}
                                            source={{uri:colData.imageSelected}}
                                            resizeMode="contain"
                                            fadeDuration={0}
                                        />
                                }



                                <Text style={[styles.listItemText,tnFontSize]}>{colData.name}</Text>
                            </View>
                        </TouchableOpacity>
                    </Col>
                )
            });

            return (
                <Row key={idx} style={{}}>
                    { resultRow }
                </Row>
            )
        });


        return resultGrid;
    };

    onSelect = (id)=>{

        let selected;
        if(this.state.userSelected.indexOf(id)<0){
            selected = this.state.userSelected.map((item)=>item);
            selected.push(id);
            this.setState({userSelected:selected});
        } else {
            selected = this.state.userSelected.filter((item)=>(item!==id));
            this.setState({userSelected:selected});
        }


    };



    showModal = ()=>{

        this.setState({
            modalVisible:true,
            isModalModeLoading:true,
        });

    };

    dismissModal = ()=>{

        this.setState({
            modalVisible:false
        });

    };

    nextModalAction = (modal)=>{

        switch(modal.currentModal){

            case modalTypes.apparatusGeneralTutorial:
                if(modal.action==="YES"){

                    this.setState({
                        modalContent:modalTypes.gradesGeneralTutorial,
                    },()=>{
                        this.showTutorialVideo(this.state.tutorialVideos.gradesUpperLimit,this.showModal);
                    });

                } else {
                    this.setState({
                        modalContent:modalTypes.gradesGeneralTutorial,
                    },()=>{
                        this.showModal();
                    });
                }

                this.dismissModal();

                break;
            case modalTypes.gradesGeneralTutorial:

                    if(modal.action==="YES"){
                        this.setState({
                            modalContent:modalTypes.gradeLevelSelect,
                            modalData:this.state.gradesListData,
                        },()=>{
                            this.showTutorialVideo(this.state.tutorialVideos.gradesUpperLimit,this.showModal);
                        });

                    } else {
                        this.setState({
                            modalContent:modalTypes.gradeLevelSelect,
                            modalData:this.state.gradesListData,
                        },()=>{
                            this.showModal();
                        });
                    }

                this.dismissModal();

                break;
            case modalTypes.gradeLevelSelect:

                const selectedUpperGrade = modal.action;
                this.setState({
                    modalContent:modalTypes.gradeLevelUpperLimit,
                    selectedUpperGrade,
                    modalData:this.state.modalData[parseInt(selectedUpperGrade)-1],
                },()=>{
                    this.showTutorialVideo(this.state.tutorialVideos.grades[parseInt(selectedUpperGrade)-1],this.showModal);
                    //this.showModal();
                });

                this.dismissModal();

                break;
            case modalTypes.gradeLevelUpperLimit:
                if(modal.action==="YES"){
                    const {dispatch} = this.props.screenProps;
                    dispatch(setFirstRunParam({deSelectApparatus:false})).then(
                        ()=>{
                            dispatch(setGradeUpperLevel(this.state.selectedUpperGrade)).then(
                                (result)=>{
                                    if(result.success){

                                        const navigateAction = NavigationActions.navigate({
                                            routeName:"MainNav",
                                        });

                                        this.props.navigation.dispatch(navigateAction);

                                    }

                                }
                            );
                        }
                    );

                } else if(modal.action==="NO"){
                    this.setState({
                        modalContent:modalTypes.gradeLevelSelect,
                        modalData:this.state.gradesListData,
                    },()=>{
                        this.showModal();
                    });

                    this.dismissModal();

                } else if(modal.action==="REPEAT"){
                    this.showTutorialVideo(this.state.tutorialVideos.grades[parseInt(this.state.selectedUpperGrade)-1],this.showModal);
                    this.dismissModal();
                }
                break;

            default:
                this.dismissModal();
                break;




        }


    };


    showTutorialVideo = (video:String, closeAction=false)=>{

        const navigateAction = NavigationActions.navigate({
            routeName:"VideoPlayer",
            params:{video,singleVideo:true,closeAction},
        });
        this.props.navigation.dispatch(navigateAction);

    };


    getSelectedItems = (disabled=true)=>{
        return (disabled)?this.state.userSelected:this.state.apparatusListData.map((item)=>(item.category_id)).filter((item)=>(!this.state.userSelected.includes(item)));
    };




    render() {

        const deviceHeight = this.props.screenProps.dimensions.height;
        const apparatusGrid = this.getGridFromData(this.state.apparatusListData,3,this.state.userSelected);
        const headerCaptionFontSize = (deviceHeight<640)? 11:12;


        return (

                    <Container style={styles.homeContainer} >
                     
                        <Content contentContainerStyle={{flex:1}}>
                            <ModalFullScreen
                                modalVisible={this.state.modalVisible}
                                dismissModal={this.dismissModal}
                                nextAction={this.nextModalAction}
                                transparent={false}
                                modalContent={this.state.modalContent}
                                modalData={this.state.modalData}
                            />
                            <View style={{backgroundColor:"#333", paddingLeft:20, paddingRight:20, paddingTop:7, height:75, }}>
                                <Text style={{
                                    fontFamily:"Montserrat-Regular",
                                    color:"#fff",
                                    textAlign:"center",
                                    fontSize:headerCaptionFontSize,
                                }}>Please choose the apparatus you wish to see in the app.
                                    Removing apparatus will effect the output of your Progress Board
                                    <Text style={{ fontFamily:"Montserrat-SemiBold",color:"#fff",fontSize:headerCaptionFontSize+2}}>
                                        {
                                            (this.state.apparatusListData.length>0)&&"\n"+(this.state.apparatusListData.length-this.state.userSelected.length)+" / "+this.state.apparatusListData.length+" apparatus selected"
                                        }
                                    </Text>

                                </Text>
                            </View>

                            {
                                (this.state.isLoading)?
                                    <ActivityIndicator size="large" color={"#5c96f5"} style={{marginTop:10}}/>
                                    :


                                        <Grid>

                                            {apparatusGrid}

                                            <Row style={{height:66, alignItems:"center", justifyContent:"center"}}>
                                                {
                                                    (this.state.sendingApparatusData)?
                                                        <ActivityIndicator  size="small" color="#5c96f5" />
                                                        :
                                                        <Button
                                                            style={[styles.halfButtonNormal,{width:256}]}
                                                            full rounded
                                                            onPress={()=>{

                                                                const isApparatusDeselect = (this.props.navigation.state.routeName==="ProfileApparatusDeSelect");
                                                                const {dispatch} = this.props.screenProps;
                                                                const selectedItems = this.getSelectedItems().map((item)=>parseInt(item));

                                                                if(isApparatusDeselect){
                                                                    this.setState({sendingApparatusData:true},()=>{
                                                                        dispatch(setSelectedApparatus(selectedItems)).then((setSelectResult)=>{
                                                                            dispatch(profileCloseApparatusDeselect(this.props.navigation));
                                                                        });
                                                                    })
                                                                } else {
                                                                    this.setState({sendingApparatusData:true},()=>{
                                                                        dispatch(setSelectedApparatus(selectedItems)).then(()=>{
                                                                            this.showModal();
                                                                            this.setState({sendingApparatusData:false});
                                                                        });
                                                                    })

                                                                }

                                                            }}>
                                                            <Text style={styles.halfButtonNormalText}>Done</Text>
                                                        </Button>
                                                }


                                            </Row>
                                        </Grid>




                            }



                        </Content>
                    </Container>

        );
    }
}


const styles = StyleSheet.create({
    homeContainer: {
        backgroundColor:"#fff",
        flex:1,
    },

    listItemCol: {
        paddingLeft:5,
        paddingRight:5,
        paddingTop:5,
        paddingBottom:0,
        flex:1,

    },

    halfButtonNormal: {
        alignSelf:"center",
        width:140,
        borderRadius:10,
        backgroundColor:"#5c96f5",
        marginRight:20,
        marginLeft:20,
    },

    halfButtonNormalText: {
        color:"#fff",
        fontFamily:"Montserrat-SemiBold",
    },

    listItemText:{
        textAlign:"center",
        fontFamily:"Montserrat-Regular",
        paddingTop:4,
    },
    listRow1:{
        backgroundColor:"#ccc"
    },
    listRow2:{
        backgroundColor:"#ddd",
        alignItems:"center",
        justifyContent:"center",
        flex:1,
    }
});