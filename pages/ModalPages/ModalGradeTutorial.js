import React, { Component } from 'react';
import {  View, Text, StyleSheet, Image } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import {   CheckBox, Button, Icon} from 'native-base';
import {modalStyles} from "./modalStyles";

export default class ModalGradeTutorial extends Component{


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




                            <Row size={1} style={{alignItems:"center", justifyContent:"center"}}>


                            </Row>

                            <Row size={8} style={{alignItems:"center", justifyContent:"center", flexDirection:"column" }}>

                                <Text style = {styles.modalCaptionText}>
                                    It’s highly recommended
                                    {"\n"}
                                    to watch the tutorial of the
                                    {"\n"}
                                    grade you’ve selected
                                    {"\n"}
                                    before proceeding
                                </Text>
                                <Image style={styles.modalApparatusIcon} source={{uri:this.props.modalData.image}}/>
                                <Text style = {styles.modalApparatusIconCaption}>
                                    {this.props.modalData.title}
                                </Text>
                                <Button
                                    iconLeft
                                    style={[styles.halfButtonNormal,{width:256}]}
                                    full rounded
                                    onPress={()=>{
                                        this.props.nextAction({currentModal:"GRADE_TUTORIAL",action:"WATCH",dismiss:this.state.dismissTutorial})
                                    }}>
                                    <Icon name='play' style={{color: "#5c96f5", marginRight:10}} />
                                    <Text style={styles.halfButtonNormalText}>Watch tutorial</Text>
                                </Button>
                                <Button
                                    style={[styles.halfButtonReverse,{width:256}]}
                                    full rounded
                                    onPress={()=>{
                                        this.props.nextAction({currentModal:"GRADE_TUTORIAL",action:"SKIP",dismiss:this.state.dismissTutorial})
                                    }}>

                                    <Text style={styles.halfButtonReverseText}>Skip tutorial</Text>
                                </Button>

                                <Text style={styles.modalSubText}>
                                    {"\n"}
                                    You can access this tutorial video from the settings menu
                                </Text>

                            </Row>




                        <Row size={1} style={{alignItems:"center", justifyContent:"center", flexDirection:"row"}}>

                            <CheckBox checked={this.state.dismissTutorial} onPress={()=>{
                                this.setState((state)=>{ return {dismissTutorial:!state.dismissTutorial}} );
                            }} color={"#5c96f5"} style={{borderColor:"#fff", }} />


                            <Text style={styles.modalDontShowText}>
                                Don't show this message again
                            </Text>


                        </Row>



                    </Grid>








                </View>




        );
    }


}

const styles = StyleSheet.create (modalStyles);
