import React, { Component } from 'react';
import {  View, Text, StyleSheet } from 'react-native';
import { Row, Grid } from "react-native-easy-grid";
import {   Button, Icon } from 'native-base';
import {modalStyles} from "./modalStyles";

export default class ModalWarmUpTutorial extends Component{


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
                                    Have you completed your warm-up session?
                                    {"\n"}
                                    (Highly recommended)
                                </Text>
                                <Text style = {styles.modalSubText}>

                                </Text>
                                <Button
                                    iconLeft
                                    style={[styles.halfButtonNormal,{width:256}]}
                                    full rounded
                                    onPress={()=>{
                                        this.props.nextAction({currentModal:"WARM_UP_TUTORIAL",action:"WATCH",dismiss:this.state.dismissTutorial})
                                    }}>
                                    <Icon name='play' style={{color: "#5c96f5", marginRight:10}} />
                                    <Text style={styles.halfButtonNormalText}>Watch tutorial</Text>
                                </Button>
                                <Button
                                    style={[styles.halfButtonReverse,{width:256}]}
                                    full rounded
                                    onPress={()=>{
                                        this.props.nextAction({currentModal:"WARM_UP_TUTORIAL",action:"SKIP",dismiss:this.state.dismissTutorial})
                                    }}>

                                    <Text style={styles.halfButtonReverseText}>Skip tutorial</Text>
                                </Button>

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
