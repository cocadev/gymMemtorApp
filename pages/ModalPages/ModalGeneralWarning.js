import React, { Component } from 'react';
import {  View, Text, StyleSheet } from 'react-native';
import { Row, Grid } from "react-native-easy-grid";
import {modalStyles} from "./modalStyles";

export default class ModalGeneralWarning extends Component{


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
                                    WARNING
                                </Text>
                                <Text style = {styles.modalSubText}>
                                    These videos may potentially trigger
                                    seizures for people with photosensitive epilepsy.
                                    Viewer discretion is advised.
                                    {"\n"}
                                    {"\n"}
                                    Some of the skills demonstrated within this
                                    app could be dangerous for those who do not
                                    understand the correct execution
                                    and techniques.
                                    {"\n"}
                                    {"\n"}
                                    Please do not attempt to copy the skills
                                    without the appropriate supervision.
                                    {"\n"}
                                    {"\n"}
                                    Please ensure you complete the Warm-up
                                    video to proceed with viewing the videos.
                                </Text>


                            </Row>


                            <Row size={2} style={{alignItems:"center", justifyContent:"center"}}>
                                <Text style = {[styles.modalSubText, {paddingLeft:10,paddingRight:10, fontSize:12}]}>
                                    The videos within the app are subject
                                    to be changed, updated or deleted without prior warning.
                                </Text>

                            </Row>




                    </Grid>








                </View>




        );
    }


}

const styles = StyleSheet.create (modalStyles);
