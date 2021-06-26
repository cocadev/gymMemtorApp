import React, { Component } from 'react';
import {StyleSheet, TouchableOpacity, View, ScrollView, ActivityIndicator, Dimensions} from 'react-native';
import { Container, Content, Text, Header, Body, Title,
    Right, Left, ListItem, List,Separator} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import Orientation from 'react-native-orientation';
import { loadPerformanceData } from "../../components/Store/actions";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Swiper from 'react-native-swiper';


class SelectedProgressItem extends React.PureComponent {

    render(){

        const {progressSize, progressFontSize, grade } = this.props;
        const required = Math.floor((grade.total/100)*70);

        return <View style={{alignItems:"center", justifyContent:"flex-start", }}>
            <View style={{alignItems:"center", justifyContent:"center", width:progressSize, height:progressSize, backgroundColor:"rgba(0,0,0,0)"}}>
                <Text style={{
                    fontSize:progressFontSize,
                    color:"#f4b350",
                    borderBottomWidth:2,
                    borderBottomColor:"#f4b350",
                    borderStyle:"solid",
                    marginBottom:10,
                    fontFamily:"Montserrat-Regular",
                }}>{grade.grade}</Text>

                <AnimatedCircularProgress
                    style={{position:"absolute", top:0, left:0}}
                    size={progressSize}
                    width={6}
                    fill={75}
                    prefill={74}
                    rotation={225}
                    linecap="round"
                    tintColor="#999"
                    backgroundColor="#fff" />

                <AnimatedCircularProgress
                    style={{position:"absolute", top:0, left:0}}
                    size={progressSize}
                    width={6}
                    fill={grade.rate}
                    prefill={0}
                    rotation={225}
                    linecap="round"
                    tintColor="#f4b350"
                    backgroundColor="rgba(0,0,0,0)" />


            </View>
            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center", flex:1, top:-16}}>
                <Text style={{
                    width:100,
                    fontSize:26,
                    textAlign:"right",
                    color:"#f4b350",
                    fontFamily:"Montserrat-Regular",
                }}>{(grade.completed>9)?"    "+grade.completed:"   "+grade.completed}</Text>
                <Text style={{
                    width:20,
                    fontSize:26,
                    color:"#999",
                    fontFamily:"Montserrat-Regular",
                }}>{ " / "}</Text>
                <Text style={{
                    width:100,
                    fontSize:26,
                    color:"#999",
                    fontFamily:"Montserrat-Regular",
                }}>{required}</Text>
            </View>
            <View style={{flexDirection:"row", alignItems:"flex-start", justifyContent:"flex-start", flex:1, top:-12}}>
                <Text style={{
                    fontSize:14,
                    color:"#f4b350",
                    fontFamily:"Montserrat-Regular",
                    textAlign:"right",
                    paddingRight:25,
                    flexDirection:"column"
                }}>Ticks Completed</Text>
                <Text style={{
                    fontSize:14,
                    color:"#999",
                    fontFamily:"Montserrat-Regular",
                    textAlign:"left",
                    paddingRight:15,
                }}>
                    {"Ticks Required"+"\n"+
                      "of "+grade.total+" videos"}
                </Text>
            </View>

        </View>
    }

}


class ProgressSwiperItem extends React.PureComponent {

    render(){

        const {grade} = this.props;
        const {percent} = this.props;
        const {progressSize} = this.props;
        const {progressFontSize} = this.props;
        const {onGradeItemPress} = this.props;
        const {isSelected} = this.props;
        const borderBottomWidth = (isSelected)?2:0;

        return <Col style={{alignItems:"center", justifyContent:"flex-start"}}>
            <TouchableOpacity activeOpacity={0.7} onPress={()=>{
               onGradeItemPress(grade);
            }}>
            <View style={{alignItems:"center", justifyContent:"center", width:progressSize, height:progressSize, backgroundColor:"rgba(0,0,0,0)"}}>


                <Text style={{
                    fontSize:progressFontSize,
                    color:(percent>80)?"#f4b350":"#999",
                    borderBottomWidth,
                    borderBottomColor:(percent>80)?"#f4b350":"#999",
                    borderStyle:"solid",
                    marginBottom:10,
                    fontFamily:"Montserrat-Regular",
                }}>{grade}</Text>
                <AnimatedCircularProgress
                    style={{position:"absolute", top:0, left:0}}
                    size={progressSize}
                    width={2}
                    fill={75}
                    prefill={74}
                    rotation={225}
                    linecap="round"
                    tintColor="#999"
                    //onAnimationComplete={() => console.log('onAnimationComplete')}
                    backgroundColor="#fff" />
                {
                    (percent>80)&&
                    <AnimatedCircularProgress
                        style={{position:"absolute", top:0, left:0}}
                        size={progressSize}
                        width={2}
                        fill={percent}
                        prefill={0}
                        rotation={225}
                        linecap="round"
                        tintColor="#f4b350"
                        //onAnimationComplete={() => console.log('onAnimationComplete')}
                        backgroundColor="rgba(0,0,0,0)" />

                }

            </View>

            </TouchableOpacity>
        </Col>

    }

}

class ProgressSwiperPage extends React.PureComponent {

    render(){

        const {pageData} = this.props;
        const {progressSize} = this.props;
        const {progressFontSize} = this.props;
        const {onGradeItemPress} = this.props;
        const {selectedItem} = this.props;

        return <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection:"row"
        }}>
            {
                pageData.map((itemData,idx)=><ProgressSwiperItem
                    key={idx+"-"+itemData.grade}
                    grade={itemData.grade}
                    percent={itemData.rate}
                    progressFontSize={progressFontSize}
                    progressSize={progressSize}
                    onGradeItemPress={onGradeItemPress}
                    isSelected={selectedItem.grade===itemData.grade}
                />)
            }
        </View>

    }

}

class ProgressSwiper extends React.PureComponent {

    render(){

        const {swiperData} = this.props;
        const {progressSize} = this.props;
        const {progressFontSize} = this.props;
        const {onGradeItemPress} = this.props;
        const {selectedItem} = this.props;

        return <Swiper
            style={{  }}
            showsButtons={false}
            showsPagination={false}

        >
            {
                swiperData.map((pageData,idx)=>{
                    return <ProgressSwiperPage
                        pageData={pageData}
                        idx={idx}
                        key={idx}
                        progressSize={progressSize}
                        progressFontSize={progressFontSize}
                        onGradeItemPress={onGradeItemPress}
                        selectedItem={selectedItem}
                    />
                })

            }

        </Swiper>
    }
}



export default class Profile extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            pushNotifications:true,
            wifi:true,
            isLoading:true,
            performanceData:false,
            selectedGrade:{
                grade:"1",
                completed:0,
                total:0,
                rate:0,
                category:[]
            },
            swiperData:[],

        };
    }

    componentDidMount(){

        this.loadPerformanceData();

    }


    componentWillReceiveProps(nextProps){

        if(nextProps.screenProps.apparatusSelectionChanged!==this.props.screenProps.apparatusSelectionChanged){

            setTimeout(
                ()=>this.loadPerformanceData(true),
                2000
            )

        }
/*
        if(nextProps.screenProps.PerformanceData){
            if(this.state.selectedGrade){
                const performanceData = this.getPerformanceData(nextProps.screenProps.PerformanceData);
                    this.setState((state)=>{
                        const selectedGrade = performanceData.filter((item)=>{
                            return item.grade===state.selectedGrade.grade
                        })[0];
                        return {
                            performanceData,
                            selectedGrade
                        }
                    });


            }

        }*/

    }


    loadPerformanceData = (isUpdate=false)=>{
        console.log("loadPerformanceData");
        const {dispatch} = this.props.screenProps;

        this.setState({isLoading:true},()=>{

            dispatch(loadPerformanceData()).then(
                (data)=>{

                    if((!data.error) && !(data instanceof Array)){

                            const performanceData = this.getPerformanceData(data);
                            const swiperData = this.getSwiperListData(performanceData);
                            const selectedGrade = this.getInitialGrade(performanceData);

                            this.setState({
                                performanceData,
                                swiperData,
                                selectedGrade,
                                isLoading:false,
                            });

                    }
                }
            ).catch((e)=>console.log(e));

        });

    };


    getPerformanceData = (data)=>{
        let performanceData = [];
        Object.keys(data).forEach((key,idx)=> {
            performanceData[parseInt(key.replace("Grade ",""))-1] = {...data[key],grade:key.replace("Grade ","")};
        });
        return performanceData;
    };

    getInitialGrade = (performanceData,grade="1")=>{

        let initialGrade = performanceData.filter((item)=>{
            return item.grade===grade;
        }).map((item)=>{
            return {
                grade:item.grade,
                completed:item.completed,
                total:item.total,
                rate:item.rate,
                category:item.category,
            }
        })[0];
        performanceData.forEach((item)=>{
            if(item.rate>0){
                initialGrade={
                    grade:item.grade,
                    completed:item.completed,
                    total:item.total,
                    rate:item.rate,
                    category:item.category,
                }
            }
        });

        return initialGrade;
    };


    getSwiperListData = (performanceData)=>{

        let gradeProgressListData = [];
        const pageSize = 4;
        const pageTotal = Math.ceil(performanceData.length/4);

        for(let pageNumber=0; pageNumber < pageTotal; pageNumber++){
            gradeProgressListData.push(performanceData.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize));
        }

        return gradeProgressListData;
    };

    onGradeItemPress = (grade)=>{

        const selectedGrade = this.state.performanceData.filter((item)=>{
            return item.grade===grade
        })[0];

        this.setState({selectedGrade});


    };

    render() {

        const deviceHeight = this.props.screenProps.dimensions.height;
        const largeProgressSize = (deviceHeight<640)?100:160;
        const smallProgressSize = (deviceHeight<640)?50:60;
        const largeProgressFontSize = (deviceHeight<640)?40:80;
        const smallProgressFontSize = (deviceHeight<640)?12:18;

        return (

                <Container>
                    <Header style={{ paddingTop:0}}>

                        <Left style={{ flex: 1 }}>
                        </Left>

                        <Body style={{ flex: 2,  justifyContent: 'center', alignItems: 'center' }}>
                        <Title>Progress Board</Title>
                        </Body>

                        <Right style={{ flex: 1 }}>
                            <TouchableOpacity activeOpacity={0.7} onPress={()=>{
                                this.props.navigation.navigate("ProfileSettings");
                            }}>
                                <Text style={{color:"#fff", fontFamily:"Montserrat-SemiBold", fontSize:13}}>
                                    Settings
                                </Text>
                            </TouchableOpacity>
                        </Right>
                    </Header>


                        <Content style={{backgroundColor:"#fff"}} contentContainerStyle={{flex:1}}>

                            {
                                (this.state.isLoading)?
                                    <ActivityIndicator style={{marginTop:20}}  size="large" color="#5c96f5" />
                                    :
                                    <Grid>
                                        <Row size={8}>
                                            <Col>
                                                <Row style={{height:36, alignItems:"center", justifyContent:"center",}}>
                                                    <Col style={{alignItems:"center", justifyContent:"center"}}>
                                                        <Text style={{
                                                            fontSize:18,
                                                            color:"#999",
                                                            fontFamily:"Montserrat-Regular",
                                                        }}>Grades</Text>
                                                    </Col>
                                                </Row>
                                                <Row size={2} style={{paddingRight:10, paddingLeft:10, }}>

                                                    {
                                                        (this.state.swiperData.length>0)&&
                                                        <ProgressSwiper
                                                            swiperData={this.state.swiperData}
                                                            progressSize={smallProgressSize}
                                                            progressFontSize={smallProgressFontSize}
                                                            onGradeItemPress={this.onGradeItemPress}
                                                            selectedItem={this.state.selectedGrade}
                                                        />
                                                    }

                                                </Row>

{/*
                                                <Row>
                                                    <Col style={{alignItems:"center", justifyContent:"flex-start", top:-6}}>
                                                        <Text style={{
                                                            fontSize:18,
                                                            color:"#999",
                                                            fontFamily:"Montserrat-Regular",

                                                        }}>Grade</Text>
                                                    </Col>
                                                </Row>
*/}



                                                <Row size={6}>
                                                    <Col style={{alignItems:"center", justifyContent:"flex-start"}}>
                                                       <SelectedProgressItem
                                                           progressSize={largeProgressSize}
                                                           progressFontSize={largeProgressFontSize}
                                                           grade={this.state.selectedGrade}
                                                       />
                                                    </Col>
                                                </Row>

                                            </Col>

                                        </Row>
                                        <Row size={5}>
                                            <Col>
{/*                                                <Row style={{height:36, alignItems:"center", justifyContent:"center",}}>
                                                    <Col style={{alignItems:"center", justifyContent:"center"}}>
                                                        <Text style={{
                                                            fontSize:18,
                                                            color:"#999",
                                                            fontFamily:"Montserrat-Regular",
                                                        }}>Grades</Text>
                                                    </Col>
                                                </Row>*/}
                                                <Row style={{height:36}}>
                                                    <Separator>
                                                        <View style={{flexDirection:"row", paddingLeft:10}}>
                                                            <Text style={styles.listItemHeaderBlue}>{"Grade "+this.state.selectedGrade.grade+" Videos"}</Text>
                                                            <Text style={styles.listItemHeader}>{"   -   "+this.state.selectedGrade.total+" videos"}</Text>
                                                        </View>
                                                    </Separator>
                                                </Row>
                                                <Row style={{backgroundColor:"#fff"}}>
                                                    <ScrollView style={{flex:1}}>

                                                        <List style={{flex:1}}>

                                                            {
                                                                (this.state.selectedGrade.category.length>0)&&
                                                                this.state.selectedGrade.category.map((item,idx)=>{
                                                                    return <ListItem key={idx+"-"+item.category_id} style={{flex:1, backgroundColor:"#fff"}}>
                                                                        <Left>
                                                                            <Text style={styles.listItemLeft}>{item.name}</Text>
                                                                        </Left>

                                                                        <Body>
                                                                        <Text style={styles.listItemRight}>{item.performance+" videos"}</Text>
                                                                        </Body>

                                                                        <Right/>
                                                                    </ListItem>
                                                                })
                                                            }

                                                        </List>
                                                    </ScrollView>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Grid>
                            }


                        </Content>

                </Container>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    listItemLeft:{
        color:"#000",
        fontSize:16,
    },
    listItemRight:{
        fontSize:14,
        color:"#666",
    },
    listItemHeader:{
        fontSize:16,
        color:"#666",
        fontFamily:"Montserrat-Regular"
    },
    listItemHeaderBlue:{
        fontSize:16,
        color:"#5c96f5",
        fontFamily:"Montserrat-Regular"
    },

});