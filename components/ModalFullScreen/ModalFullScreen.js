import React, { Component } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Image, Platform} from 'react-native';
import ModalApparatusChange from '../../pages/ModalPages/ModalApparatusChange';
import ModalApparatusGeneralTutorial from '../../pages/ModalPages/ModalApparatusGeneralTutorial';
import ModalGradesGeneralTutorial from "../../pages/ModalPages/ModalGradesGeneralTutorial";
import ModalGradesLevelSelect from "../../pages/ModalPages/ModalGradesLevelSelect";
import ModalGradesUpperLevel from "../../pages/ModalPages/ModalGradesUpperLevel";
import ModalApparatusTutorial from "../../pages/ModalPages/ModalApparatusTutorial";
import ModalGradeTutorial from "../../pages/ModalPages/ModalGradeTutorial";
import ModalWarmUpTutorial from "../../pages/ModalPages/ModalWarmUpTutorial";
import ModalGeneralWarning from "../../pages/ModalPages/ModalGeneralWarning";
export const isiOS = (Platform.OS === "ios");

export const modalTypes = {

    apparatusChange:"APPARATUS_CHANGE",
    apparatusGeneralTutorial:"APPARATUS_GENERAL_TUTORIAL",
    apparatusTutorial:"APPARATUS_TUTORIAL",
    gradesGeneralTutorial:"GRADES_GENERAL_TUTORIAL",
    gradeTutorial:"GRADE_TUTORIAL",
    gradeLevelSelect:"GRADE_LEVEL_SELECT",
    gradeLevelUpperLimit:"GRADE_LEVEL_UPPER_LIMIT",
    warmUpTutorial:"WARM_UP_TUTORIAL",
    generalWarning:"GENERAL_WARNING",

};

export default class ModalFullScreen extends Component{



    render() {

        const transparencyValue = (this.props.transparent)?'0.9':'1';
        const backgroundColor = 'rgba(92, 150, 245, '+transparencyValue+')';
        const {modalContent} = this.props;

        let modalComponent;

        switch(modalContent){
            case modalTypes.apparatusChange:
                modalComponent = <ModalApparatusChange
                     dismissModal={this.props.dismissModal}
                     nextAction={this.props.nextAction}
                 />;
                break;
            case modalTypes.apparatusGeneralTutorial:
                modalComponent = <ModalApparatusGeneralTutorial
                    dismissModal={this.props.dismissModal}
                    nextAction={this.props.nextAction}
                />;
                break;
            case modalTypes.gradesGeneralTutorial:
                modalComponent = <ModalGradesGeneralTutorial
                    dismissModal={this.props.dismissModal}
                    nextAction={this.props.nextAction}
                />;
                break;
            case modalTypes.gradeLevelSelect:
                modalComponent = <ModalGradesLevelSelect
                    dismissModal={this.props.dismissModal}
                    nextAction={this.props.nextAction}
                    modalData={this.props.modalData}
                />;
                break;
            case modalTypes.gradeLevelUpperLimit:
                modalComponent = <ModalGradesUpperLevel
                    dismissModal={this.props.dismissModal}
                    nextAction={this.props.nextAction}
                    modalData={this.props.modalData}
                />;
                break;
            case modalTypes.apparatusTutorial:
                modalComponent = <ModalApparatusTutorial
                    dismissModal={this.props.dismissModal}
                    nextAction={this.props.nextAction}
                    modalData={this.props.modalData}
                />;
                break;
            case modalTypes.gradeTutorial:
                modalComponent = <ModalGradeTutorial
                    dismissModal={this.props.dismissModal}
                    nextAction={this.props.nextAction}
                    modalData={this.props.modalData}
                />;
                break;
            case modalTypes.warmUpTutorial:
                modalComponent = <ModalWarmUpTutorial
                    dismissModal={this.props.dismissModal}
                    nextAction={this.props.nextAction}
                    modalData={this.props.modalData}
                />;
                break;
            case modalTypes.generalWarning:
                modalComponent = <ModalGeneralWarning
                    dismissModal={this.props.dismissModal}
                    nextAction={this.props.nextAction}
                    modalData={this.props.modalData}
                />;
                break;
            default:
                modalComponent =  <TouchableOpacity onPress = {() => { this.props.dismissModal() }} >
                                    <Text style = {styles.text}>Close</Text>
                                </TouchableOpacity>;
                break;


        }

        return (


                <Modal
                    supportedOrientations={['portrait', 'landscape']}
                    animationType = {"slide"} transparent = {this.props.transparent}
                    visible = {this.props.modalVisible}
                    onRequestClose = {() => {
                        //this.props.dismissModal()
                        } }>
                    <View style = {[styles.modal, {backgroundColor:backgroundColor}]}>

                        {modalComponent}

                        {
/*                            (modalContent!==modalTypes.generalWarning)&&
                            <TouchableOpacity style={styles.modalCloseIcon} onPress = {() => { this.props.dismissModal() }} >
                                <Image style={{width:36,height:36}} source={require('../../assets/icon-x.png')} />
                            </TouchableOpacity>*/
                        }


                    </View>
                </Modal>




        );
    }


}

const styles = StyleSheet.create ({
    modal: {
        flex: 1,
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor:"#666",
        paddingTop:isiOS?22:0,
    },
    text: {
        color: '#fff',
        marginTop: 10
    },
    modalCloseIcon:{
        height:36,
        width:36,
        position:"absolute",
        right:10,
        top:isiOS?32:10,

    },
});
