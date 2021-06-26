import React, { Component } from 'react';
import {
    Platform,
    Dimensions,
    Text,
    StyleSheet,
    Image,
    View,
    TouchableOpacity,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { Row, Grid, Col } from "react-native-easy-grid";
import {modalStyles} from "../ModalPages/modalStyles";
import {getGrades, profileCloseGradesSelect, setGradeUpperLevel} from "../../components/Store/actions";
import {Button} from "native-base";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const isIphoneX =
    platform === "ios" &&
    (deviceHeight >= 812) && (deviceWidth >= 375);

export default class GradesLevelSelect extends Component{


    constructor(props) {
        super(props);
        this.state = {
            dismissTutorial:false,
            sendingGradesData:false,
            isGradeSelected:false,
            gradeLevel:null,
            selectedGrade:null,
            gradesListData:[],
        };



    }

    componentDidMount(): void {
        const {dispatch} = this.props.screenProps;
        dispatch(getGrades()).then(
            (gradesListDataAll)=>{
                const gradesListData = gradesListDataAll.filter((grade)=>{return grade.name!=="Grade 11"});
                this.setState({gradesListData});
            }
        );
    }


    _onGradeClick = (index)=>{

        const gradeLevel = (index+1).toString();
        const selectedGrade = this.state.gradesListData[index];
        this.setState({isGradeSelected:true,gradeLevel,selectedGrade});

    };

    _keyExtractor = (item, index) => item.category_id;


    _renderItem = ({item, index}) => {

        return (
            <TouchableOpacity activeOpacity={0.7} style={{flex:1,}} onPress={()=>{
                this._onGradeClick(index);

            }}>
                <Grid style={{ paddingTop:10 }}>

                   <Row style={{ alignItems:"center",  justifyContent:"center"}}>

                        <Col style={{flex:1, alignItems:"center",  justifyContent:"center"}}>
                            <Image resizeMode="contain" style={{flex:1, height: 80, width: 80,}} source={ {uri:item.imageUnselected}}/>



                            <Text style = {styles.modalGradeLevelCaption}>
                                {item.name}
                            </Text>
                        </Col>
                    </Row>
                </Grid>
            </TouchableOpacity>

        )

    } ;

    render() {

        const {dispatch} = this.props.screenProps;

        return (

            <View  style={
                [styles.modalGradesListContainer,{
                    backgroundColor:"#5c96f5"
                }]
            }>

                {
                    (this.state.isGradeSelected)?


                        <View style={{
                            flex:1,
                            flexDirection: "row"
                        }}>

                            <View style={{
                                flex:1,
                                flexDirection: "column",
                                justifyContent:"center",
                                alignItems:"center"
                            }}>

                                {
                                    (this.state.selectedGrade)&&
                                    <Image style={styles.modalApparatusIcon} source={{uri:this.state.selectedGrade.imageUnselected}}/>
                                }

                                <Text style = {[styles.modalApparatusIconCaption,{marginBottom:15}]}>
                                    {this.state.selectedGrade.name}
                                </Text>

                                <Text style = {styles.modalCaptionText}>
                                    Is this the level you want to set
                                    {"\n"}
                                    for your "Progress Cap"?
                                </Text>

                                {
                                    (this.state.sendingGradesData) ?
                                        <ActivityIndicator size="small" color="#fff"/>
                                        :

                                        <View>

                                            <Button
                                                style={styles.halfButtonNormal}
                                                full rounded
                                                onPress={()=>{
                                                    this.setState({sendingGradesData:true},()=>{
                                                        dispatch(setGradeUpperLevel(this.state.gradeLevel)).then(()=>{
                                                            dispatch(profileCloseGradesSelect(this.props.navigation));
                                                        });
                                                    })

                                                }}>
                                                <Text style={styles.halfButtonNormalText}>Yes</Text>
                                            </Button>
                                            <Button
                                                style={styles.halfButtonReverse}
                                                full rounded
                                                onPress={()=>{
                                                    this.setState({isGradeSelected:false})
                                                }}>
                                                <Text style={styles.halfButtonReverseText}>No</Text>
                                            </Button>

                                        </View>

                                }



                            </View>

                        </View>

                        :

                        <View style={{
                            flex:1,
                            flexDirection: "row"
                        }}>
                            <View style={{
                                flex:1,
                                flexDirection: "column"
                            }}>

                                <FlatList
                                    style={[styles.modalGradesList,{marginTop:10, flex:1}]}
                                    data={this.state.gradesListData}
                                    extraData={this.state}
                                    keyExtractor={this._keyExtractor}
                                    renderItem={this._renderItem}
                                    ItemSeparatorComponent={this._renderSeparator}
                                    numColumns={3}
                                />


                                <Button
                                    style={[styles.halfButtonNormal,{width:256, marginBottom: 20}]}
                                    full rounded
                                    onPress={()=>{
                                        dispatch(profileCloseGradesSelect(this.props.navigation));
                                    }}>
                                    <Text style={styles.halfButtonNormalText}>Cancel</Text>
                                </Button>


                            </View>



                            </View>

                }




            </View>


        );
    }


}

const styles = StyleSheet.create (modalStyles);
