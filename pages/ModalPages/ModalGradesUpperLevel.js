import React, { Component } from 'react';
import {  View, Text, StyleSheet, Image, TouchableOpacity, } from 'react-native';
import { Row, Grid } from "react-native-easy-grid";
import {  CheckBox, Button } from 'native-base';
import {modalStyles} from "./modalStyles";

export default class ModalGradesUpperLevel extends Component{


    constructor(props) {
        super(props);
        this.state = {
            dismissTutorial:false,
        };

    }


    render() {


        return (


                <View style={{flex:1}}>


                    <Grid >


                            <Row size={1} style={{alignItems:"center", justifyContent:"center", flexDirection:"column", paddingTop:100}}>
                                <Image style={styles.modalApparatusIcon} source={{uri:this.props.modalData.imageUnselected}}/>
                                <Text style = {styles.modalApparatusIconCaption}>
                                    {this.props.modalData.name}
                                </Text>

                            </Row>

                            <Row size={6} style={{alignItems:"center", justifyContent:"center", flexDirection:"column" }}>



                                <Text style = {styles.modalCaptionText}>
                                    Is this the level you want to set
                                    {"\n"}
                                    for your "Progress Cap"?
                                </Text>

                                <Button
                                    style={styles.halfButtonNormal}
                                    full rounded
                                    onPress={()=>{
                                        this.props.nextAction({currentModal:"GRADE_LEVEL_UPPER_LIMIT",action:"YES"})

                                    }}>
                                    <Text style={styles.halfButtonNormalText}>Yes</Text>
                                </Button>
                                <Button
                                    style={styles.halfButtonReverse}
                                    full rounded
                                    onPress={()=>{
                                        this.props.nextAction({currentModal:"GRADE_LEVEL_UPPER_LIMIT",action:"NO"})

                                    }}>
                                    <Text style={styles.halfButtonReverseText}>No</Text>
                                </Button>



                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={{alignItems:"center", justifyContent:"center", flexDirection:"row",marginTop:20}}
                                    onPress={()=>{
                                    this.props.nextAction({currentModal:"GRADE_LEVEL_UPPER_LIMIT",action:"REPEAT"})

                                }}>
                                <Image style={{width:36, height:36}} source={require('../../assets/watch-again-icon.png')}/>
                                <Text style = {[styles.modalSubText,{marginLeft:10, paddingTop:20}]}>
                                    Watch video again
                                </Text>
                                </TouchableOpacity>


                            </Row>



                        <Row size={1} style={{alignItems:"center", justifyContent:"center"}}>
                            <Text style = {[styles.modalSubText, {paddingLeft:10,paddingRight:10, fontSize:12}]}>
                                Videos that feature in the grades above your upper level skill set will not be visible, unless you change these later on in settings
                            </Text>

                        </Row>



                    </Grid>








                </View>




        );
    }


}

const styles = StyleSheet.create (modalStyles);
