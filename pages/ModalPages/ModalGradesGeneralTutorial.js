import React, { Component } from 'react';
import {  View, Text, StyleSheet, Image } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import {   CheckBox, Button} from 'native-base';
import {modalStyles} from "./modalStyles";

export default class ModalGradesGeneralTutorial extends Component{


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




                            <Row size={8} style={{alignItems:"center", justifyContent:"center", flexDirection:"column" }}>


                                <Text style = {styles.modalCaptionText}>
                                    Please select the level
                                    of your "Progress Cap".
                                    {"\n"}
                                    Please watch the following
                                    video to choose.
                                </Text>

                                <Button
                                    style={styles.halfButtonNormal}
                                    full rounded
                                    onPress={()=>{
                                        this.props.nextAction({currentModal:"GRADES_GENERAL_TUTORIAL",action:"YES"})

                                    }}>
                                    <Text style={styles.halfButtonNormalText}>Watch Video</Text>
                                </Button>
{/*                                <Button
                                    style={styles.halfButtonReverse}
                                    full rounded
                                    onPress={()=>{
                                        this.props.nextAction({currentModal:"GRADES_GENERAL_TUTORIAL",action:"NO"})

                                    }}>
                                    <Text style={styles.halfButtonReverseText}>No</Text>
                                </Button>*/}

                            </Row>


                            <Row size={2} style={{alignItems:"center", justifyContent:"center"}}>
                                <Text style = {[styles.modalSubText, {paddingLeft:10,paddingRight:10, fontSize:12}]}>
                                    The app and tutorials go some way to
                                    explaining the dangers of participating in
                                    gymnastics without the appropriate instruction.
                                    This app has been designed for coaches and
                                    for general guidance. We are not responsible
                                    for any injuries that may occur whilst
                                    attempting any of the skills. By using the app,
                                    you accept the Terms & Conditions.
                                </Text>

                            </Row>




                    </Grid>








                </View>




        );
    }


}

const styles = StyleSheet.create (modalStyles);
