import React, { Component } from 'react';
import { Platform, Dimensions, Text, StyleSheet, Image,View, TouchableOpacity, FlatList } from 'react-native';
import { Row, Grid, Col } from "react-native-easy-grid";
import {modalStyles} from "./modalStyles";
import Orientation from 'react-native-orientation';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const isIphoneX =
    platform === "ios" &&
    (deviceHeight >= 812) && (deviceWidth >= 375);

export default class ModalGradesLevelSelect extends Component{


    constructor(props) {
        super(props);
        this.state = {
            dismissTutorial:false,
        };



    }

    componentDidMount(): void {
        Orientation.lockToPortrait();
    }


    _onGradeClick = (gradeLevel:String)=>{

        this.props.nextAction({currentModal:"GRADE_LEVEL_SELECT",action:gradeLevel})

    };

    _keyExtractor = (item, index) => item.category_id;


    _renderItem = ({item, index}) => {

        return (
            <TouchableOpacity activeOpacity={0.7} style={{flex:1,}} onPress={()=>{
                this._onGradeClick((index+1).toString());

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

        return (

            <View  style={styles.modalGradesListContainer}>
                <View style={{alignItems:"center", justifyContent:"center"  }}>
                    <Text style = {[styles.modalGradesCaptionText,{paddingBottom:10, marginTop:(isIphoneX)?30:0}]}>
                        Almost there! Now, please select one of the following videos, to help you finalise your choice of upper level skill set.
                    </Text>

                </View>
                <FlatList
                    style={[styles.modalGradesList,{marginTop:10}]}
                    data={this.props.modalData}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={this._renderSeparator}
                    numColumns={3}
                />

            </View>


        );
    }


}

const styles = StyleSheet.create (modalStyles);
