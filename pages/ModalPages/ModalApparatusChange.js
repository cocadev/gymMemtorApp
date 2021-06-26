import React, { Component } from 'react';
import {  View, Text, StyleSheet, Image } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import {   CheckBox, Button} from 'native-base';
import {modalStyles} from "./modalStyles";

export default class ModalApparatusChange extends Component{


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
                                <Image style={styles.modalIcon} source={require('../../assets/exclam-icon.png')}/>

                                <Text style = {styles.modalCaptionText}>
                                    You are about to
                                    {"\n"}
                                    make changes on your
                                    {"\n"}
                                    selected apparatus
                                </Text>
                                <Text style = {styles.modalSubText}>
                                    Your existing Grade progress will be
                                    {"\n"}
                                    effected with these changes.
                                    {"\n"}
                                    Are you sure to proceed?
                                </Text>
                                <Button
                                    style={styles.halfButtonNormal}
                                    full rounded
                                    onPress={()=>{
                                        this.props.nextAction({currentModal:"APPARATUS_CHANGE",action:"YES"})

                                    }}>
                                    <Text style={styles.halfButtonNormalText}>Yes</Text>
                                </Button>
                                <Button
                                    style={styles.halfButtonReverse}
                                    full rounded
                                    onPress={()=>{
                                        this.props.dismissModal()

                                    }}>
                                    <Text style={styles.halfButtonReverseText}>No</Text>
                                </Button>

                            </Row>


                            <Row size={2} style={{alignItems:"center", justifyContent:"center"}}>


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
