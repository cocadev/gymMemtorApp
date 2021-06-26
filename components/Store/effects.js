import {AsyncStorage} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {validateEmail, timeoutPromise} from "./utilities";
import {NavigationActions, StackActions} from 'react-navigation';


export async function detailedFetch(uri, token, method) {
    console.log(method, uri);
    let request = new XMLHttpRequest();
    request.open(method, uri);
    request.setRequestHeader("Accept", 'application/json');
    request.setRequestHeader("Content-Type", 'application/json');
    request.setRequestHeader("Authorization", 'Bearer ' + token);
    request.addEventListener("load", transferComplete);
    request.addEventListener("error", transferFailed);
    request.addEventListener("abort", transferCanceled);

    function transferComplete(evt) {
        console.log("The transfer is complete.", evt);
    }

    function transferFailed(evt) {
        console.log("An error occurred while transferring the file.", evt);
    }

    function transferCanceled(evt) {
        console.log("The transfer has been canceled by the user.", evt);
    }

    request.send();
}

export async function navigate(navigation, routeName: String = "", params: Object = {}, reset: Boolean = false) {

    let navigateAction;
    if (!reset) {
        navigateAction = NavigationActions.navigate({
            routeName,
            params,
            //action: NavigationActions.navigate({ routeName: 'SubProfileRoute'})
        });
    } else {
        navigateAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: routeName})
            ]
        })
    }

    navigation.dispatch(navigateAction);
}

export async function setLocalData(localStorageKey: String, data: Object) {

    if (localStorageKey && data) {
        await timeoutPromise(500, AsyncStorage.setItem(localStorageKey, JSON.stringify(data))).then(response => {
            //console.log("LocalStorageWriteSuccess:",response);
        }).catch(error => {
            //console.log("LocalStorageWriteError:",error);
        });
    } else {
        return {result: false, error: "No storageKey or empty data"}
    }


}

export async function getLocalData(localStorageKey) {

    let localData = undefined;
    await timeoutPromise(500, AsyncStorage.getItem(localStorageKey)).then(response => {
        //console.log("LocalStorageReadSuccess",response);
        localData = JSON.parse(response);
    }).catch(error => {
        //console.log("LocalStorageReadError:",error);
    });

    return localData;

}

export async function getInitialScreen(state) {

    const {FirstRun} = state;
    let initialScreen = "Home";

    if (FirstRun.activationCode === true) {
        initialScreen = "SignUpConfirm";
    } else if (FirstRun.termsConditions === true) {
        initialScreen = "SignUpTerms";
    } else if (FirstRun.appTutorial === true) {
        initialScreen = "SignUpTutorial";
    } else if (FirstRun.deSelectApparatus === true) {
        initialScreen = "ApparatusDeSelect";
    }

    return initialScreen;
}

export async function refreshToken(state, token) {

    let result = {};
    const tokenData = {
        grant_type: "refresh_token",
        client_id: "app",
        client_secret: "secret",
        refresh_token: token.refresh_token
    };
    console.log("TokenRefreshRequest:", tokenData);
    await fetch(state.API.server + state.API.loginPath, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tokenData)
        }
    ).then(async (response) => {
        console.log("TokenRefreshResponse:", response);
        if (response.status === 200) {
            await response.json().then(
                (response) => {
                    result = {
                        status: "REFRESH_TOKEN_VALID",
                        token: {
                            access_token: response.access_token,
                            refresh_token: response.refresh_token
                        }
                    }
                }
            )


        } else {
            result = {status: "REFRESH_TOKEN_INVALID"};
        }
    }).catch((error) => {
        console.log("Error - refreshTokenFetch :", error)
    });

    return result;
}

export async function checkToken(state, token) {

    let result = {};

    await fetch(state.API.server + state.API.userPath, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.access_token,
            }
        }
    ).then(
        async (response) => {

            if (response.status === 200) {

                await response.json().then(
                    async (responseToken) => {
                        await getUser(state, token).then(
                            async (userResult) => {
                                result = {status: "TOKEN_VALID", state: userResult}
                            }
                        );
                    }
                )
            } else {
                result = {status: "TOKEN_INVALID"};
                await this.refreshToken(state, token).then(
                    async (refreshResponse) => {
                        if (refreshResponse.token) {
                            await getUser(state, refreshResponse.token).then(
                                async (userResult) => {
                                    result = {status: "TOKEN_REFRESHED", state: userResult}
                                }
                            );
                        }
                    });

            }
        }).catch(async (error) => {
        console.log("Error - checkTokenFetch:", error);
        result = {status: "TOKEN_INVALID"};
        await this.refreshToken(state, token).then(
            async (refreshResponse) => {
                if (refreshResponse.token) {
                    await getUser(state, refreshResponse.token).then(
                        async (userResult) => {
                            result = {status: "TOKEN_REFRESHED", state: userResult}
                        }
                    );
                }
            });

        /*            detailedFetch(state.API.server+state.API.userPath,token.access_token,"GET").catch((error)=>{
                        console.log("Error - detailedFetch:",error);
                    });*/
    });


    return result;


}

export async function userLogout(state) {

    const result = Object.assign({}, state, {
        token: false,
        isUserLoggedIn: false,
        Login: {
            loginRedirect: false,
            loginError: false
        },
        User: {},
        appInitComplete: false,
/*        FirstRun:{
            activationCode:true,
            termsConditions:true,
            appTutorial:true,
            deSelectApparatus:true,
            apparatusGeneralTutorial:true,
            gradesGeneralTutorial:true,
            gradesUpperLimit:true,
            apparatusTutorial:true,
            gradeTutorial:true,
            warmUpTutorial:true,
        },*/
        changedState: "Login"
    });
    await this.setLocalData(state.localStorageKey, result);

    return result;

}

export async function getUser(state, token) {

    let result = {};
    const oAuthHeader = {
        'Authorization': 'Bearer ' + token.access_token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    await fetch(state.API.server + state.API.userPath, {
            method: 'GET',
            headers: oAuthHeader
        }
    ).then(
        async (response) => {

            setTimeout(() => null, 0);
            return await response.json();
        }).then(
        async (responseJson) => {

            if (responseJson.error) {
                result = Object.assign({}, ...state, {
                    token: false,
                    isUserLoggedIn: false,
                    Login: {
                        loginRedirect: false,
                        loginError: "API Error: user/me"
                    },
                    changedState: "Login"
                });
            }
            else {

                result = Object.assign({}, state, {
                    token: token,
                    isUserLoggedIn: true,
                    changedState: "Login",
                    selectedUpperGrade: state.selectedUpperGrade,
                    Login: {
                        loginRedirect: true,
                        loginRedirectScreen: "Home",
                        loginError: false
                    },
                    FirstRun: {
                        ...state.FirstRun,
                        warmUpTutorial: true,
                        appInitComplete: false,
                        activationCode: false,
                    },
                    User: {
                        id: responseJson.user_id,
                        email: responseJson.email,
                        firstName: responseJson.first_name,
                        lastName: responseJson.last_name,
                        membership: responseJson.membership
                    },
                    Videos: {
                        ...state.Videos,
                        isSelectMode: false,
                        isPlaylistUpdated: false,
                        addToPlayListId: false,
                    },
                    searchView: {
                        home: false,
                        apparatus: false,
                        grade: false,
                        video: false,
                    },
                    hideFooter: false,
                });

            }
        }
    ).catch((error) => {
        console.log("Error - getUserFetch :", error);
        result = Object.assign({}, ...state, {
            token: false,
            isUserLoggedIn: false,
            Login: {
                loginRedirect: false,
                loginError: "API Error: user/me"
            },
            changedState: "Login"
        });
        /*        detailedFetch(state.API.server+state.API.userPath,token.access_token,"GET").catch((error)=>{
                    console.log("Error - detailedFetch:",error);
                });*/
    });

    return result;

}

export async function userLogin(state, userData) {

    let result = {};
    userData.client_id = "app";
    userData.client_secret = "secret";
    userData.grant_type = "password";

    await fetch(state.API.server + state.API.loginPath, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        }
    ).then(
        async (response) => {
            console.log("userLogin - response", response);
            setTimeout(() => null, 0);
            return await response.json();
        }).then(
        async (loginTokenData) => {
            console.log("userLogin - loginTokenData", loginTokenData);
            if (loginTokenData.error) {
                result = Object.assign({}, state, {
                    token: false,
                    isUserLoggedIn: false,
                    Login: {
                        loginRedirect: false,
                        loginError: "Invalid E-mail or password"
                    },
                    changedState: "Login"
                });
            } else {
                if (loginTokenData.scope === "verify") {

                    result = Object.assign({}, state, {
                        token: loginTokenData,
                        isUserLoggedIn: false,
                        Login: {
                            loginRedirect: true,
                            loginRedirectScreen: "SignUpConfirm",
                            loginError: false
                        },
                        User: {
                            email: userData.username,
                            password: userData.password,
                        },
                        changedState: "Login"
                    });
                } else {

                    result = await getUser(state, loginTokenData);

                }

            }


        }
    ).catch((error) => {
        console.log("Error - userLoginFetch :", error)
    });

    return result;

}


export async function userRegister(state, userData) {

    let result = {};

    await fetch(state.API.server + state.API.registerPath, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        }
    ).then(
        (response) => {
            return response.json();

        }).then(
        async (responseJson) => {
            if (responseJson.error) {
                result = Object.assign({}, state, {
                    token: false,
                    isUserLoggedIn: false,
                    Login: {
                        loginRedirect: false,
                        loginError: false
                    },
                    Register: {
                        registerRedirect: false,
                        registerError: responseJson.error.message
                    },
                    changedState: "Register"
                });
            } else {
                result = Object.assign({}, state, {
                    Register: {
                        registerRedirect: true,
                        registerError: false
                    },
                    User: {
                        id: responseJson.user_id,
                        email: responseJson.email,
                        firstName: responseJson.first_name,
                        lastName: responseJson.last_name,
                        password: userData.password,
                    },
                    changedState: "Register"
                });

                /*                await this.userLogin(state,{ username:userData.email,password:userData.password }).then(
                                    (loginResult)=>{
                                        result = Object.assign({}, ...loginResult, {
                                            Register:{
                                                registerRedirect:true,
                                                registerError:false
                                            },
                                            changedState:"Register"
                                        });
                                    }
                                );*/


            }


        }
    ).catch((error) => {
        console.log("Error - userRegisterFetch :", error)
    });

    return result;

}

export async function verifyUser(state, verifyData) {

    let result = {};

    verifyData.client_id = "app";
    verifyData.client_secret = "secret";
    verifyData.grant_type = "password";
    verifyData.scope = "verify";
    verifyData.email = state.User.email;
    verifyData.username = state.User.email;
    verifyData.password = state.User.password;


    await fetch(state.API.server + state.API.loginPath, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(verifyData)
        }
    ).then(
        (response) => response.json()).then(
        async (responseJson) => {

            await fetch(state.API.server + state.API.verifyPath, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + responseJson.access_token,
                    },
                    body: JSON.stringify(verifyData)
                }
            ).then(
                (response) => {
                    return response.json()
                }).then(
                async (responseJson) => {
                    if (responseJson !== true) {
                        result = Object.assign({}, ...state, {
                            Verify: {
                                verifyRedirect: false,
                                verifyError: "Invalid verification code.",
                            },
                            changedState: "Verify"
                        });
                    } else {

                        verifyData.scope = "basic";

                        await fetch(state.API.server + state.API.loginPath, {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(verifyData)
                            }
                        ).then(
                            (response) => response.json()).then(
                            async (responseJson) => {

                                result = Object.assign({}, ...state, {
                                    Verify: {
                                        verifyRedirect: true,
                                        verifyError: false,
                                    },
                                    FirstRun: {
                                        activationCode: false,
                                        termsConditions: true,
                                        appTutorial: true,
                                        deSelectApparatus: true,
                                        apparatusTutorial: true,
                                        gradesTutorial: true,
                                        gradesUpperLimit: true,
                                        warmUpTutorial: true,
                                        appInitComplete: false,
                                    },
                                    token: responseJson,
                                    isUserLoggedIn: true,
                                    changedState: "Verify"
                                });

                                await getUser(state, result.token).then(async (userResult) => {
                                    result = userResult;
                                    await this.setLocalData(state.localStorageKey, userResult);
                                });


                            }
                        );


                    }


                }
            ).catch((error) => {
                console.log("Error - verifyUserFetch :", error)
            });


        });


    return result;
}

export async function resetValidateForm(state, formName) {
    return state;
}

export async function validateForm(state, formData) {

    let result = {};
    let validation = {validationMessage: "", validationStatus: true};

    switch (formData.formName) {

        case "Login":

            if (!formData.password) {
                validation.password = "empty";
                validation.validationMessage = "Please enter your password";
                validation.validationStatus = false;
            }

            // ==========================================

            if (!formData.email) {
                validation.email = "empty";
                validation.validationMessage = "Please enter your email";
                validation.validationStatus = false;
            } else if (!validateEmail(formData.email)) {
                //validation.email = "invalid";
                //validation.validationMessage="Invalid email";
                //validation.validationStatus=false;
            }
            // ==========================================

            result = Object.assign({}, ...state, {
                Login: {
                    loginRedirect: false,
                    loginError: false,
                    validation
                },
                changedState: "Login"
            });

            break;

        case "Register":

            if (!formData.confirmPassword) {
                validation.confirmPassword = "empty";
                validation.validationMessage = "Please confirm your password";
                validation.validationStatus = false;
            }

            // ==========================================

            if (!formData.password) {
                validation.password = "empty";
                validation.validationMessage = "Please enter your password";
                validation.validationStatus = false;
            }

            // ==========================================

            if (!formData.email) {
                validation.email = "empty";
                validation.validationMessage = "Please enter your email";
                validation.validationStatus = false;
            } else if (!validateEmail(formData.email)) {
                //validation.email = "invalid";
                //validation.validationMessage="Invalid email";
                //validation.validationStatus=false;
            }

            // ==========================================

            if (!formData.lastName) {
                validation.lastName = "empty";
                validation.validationMessage = "Please enter your last name";
                validation.validationStatus = false;
            }

            // ==========================================

            if (!formData.firstName) {
                validation.firstName = "empty";
                validation.validationMessage = "Please enter your first name";
                validation.validationStatus = false;
            }

            // ==========================================

            result = Object.assign({}, ...state, {
                Register: {
                    registerRedirect: false,
                    registerError: false,
                    validation
                },
                changedState: "Register"
            });

            break;
        case "Report":

            if (!formData.feedback && !formData.bug) {
                validation.password = "empty";
                validation.validationMessage = "Please fill in feedback or/and bug report fields";
                validation.validationStatus = false;
            }


            result = Object.assign({}, ...state, {
                Settings: {
                    ...state.Settings,
                    validation
                },
                changedState: "Settings"
            });

            break;
        case "Redeem":

            if (!formData.redeem) {
                validation.password = "empty";
                validation.validationMessage = "Please fill in the fields";
                validation.validationStatus = false;
            }

            result = Object.assign({}, ...state, {
                Settings: {
                    ...state.Settings,
                    validation
                },
                changedState: "Settings"
            });

            break;
        case "SendCode":

            if (!formData.sendCode) {
                validation.password = "empty";
                validation.validationMessage = "Please fill in the fields";
                validation.validationStatus = false;
            }

            result = Object.assign({}, ...state, {
                Settings: {
                    ...state.Settings,
                    validation
                },
                changedState: "Settings"
            });

            break;


        default:
            break;


    }


    return result;
}

export async function getUserProfile(state) {
    return state.User;
}


export async function getMembershipStatus(state) {
    return (state.User.membership)?state.User.membership:false;
}

export async function loadCategoryData(state) {

    let result = {};
    if (state.token.access_token) {
        await fetch(state.API.server + state.API.userCategoryPath, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + state.token.access_token,
                }
            }
        ).then((response) => response.json()).then(
            async (resultData) => {

                const tutorialCounts = await loadTutorialCounts(state);
                const selectedImagePath = state.API.iconImagePath + state.API.iconSelectedPath + "/";
                const unselectedImagePath = state.API.iconImagePath + state.API.iconUnselectedPath + "/";
                const categoryData = resultData.items.map((category) => {

                    const hasChildren = this.hasChildren(resultData.items, category.category_id);
                    return {
                        ...category,
                        category_id: parseInt(category.category_id),
                        parent_id: parseInt(category.parent_id),
                        imageSelected: selectedImagePath + category.icon,
                        imageUnselected: unselectedImagePath + category.icon,
                        hasChildren

                    }
                });


                const selectedApparatusData = categoryData
                    .filter((category) => {
                        return category.parent_id === 0;
                    })
                    .map((category) => {
                        return parseInt(category.category_id);
                    });

                const allApparatusData = resultData.select.map((category) => {
                    const hasChildren = this.hasChildren(resultData.items, category.category_id);
                    return {
                        ...category,
                        category_id: parseInt(category.category_id),
                        parent_id: parseInt(category.parent_id),
                        imageSelected: selectedImagePath + category.icon,
                        imageUnselected: unselectedImagePath + category.icon,
                        hasChildren,
                        selected:(selectedApparatusData.indexOf(parseInt(category.category_id))>-1)
                    }
                });

                result = Object.assign({}, state, {
                    categoryData,
                    tutorialCounts,
                    ApparatusSelect: {
                        allApparatus: allApparatusData,
                        selectedApparatus: selectedApparatusData,
                    }
                });

            }
        ).catch((error) => {
            console.log("Error - loadCategoryDataFetch :", error)
        });
    }


    return result;

}

export function hasChildren(categoryData, categoryId) {

    let result = false;
    const children = categoryData.filter((category) => {
        return category.parent_id === categoryId;
    });

    if (children.length > 0) {
        children.forEach((child) => {
            if (categoryData.filter((category) => {
                return category.parent_id === child.category_id;
            }).length > 0) {
                result = true;
            }
        })
    }

    return result;
}

export async function getCategoryData(state, categoryId = 0) {

    return state.categoryData.filter((category) => {
        return category.parent_id === categoryId;
    })

}

export async function getApparatusData(state) {

    return state.ApparatusSelect;

}

export async function getTutorialCounts(state) {
    return state.tutorialCounts;
}

export async function loadTutorialData(state, categoryId) {

    let result = {};
    if (state.token.access_token) {
        await fetch(state.API.server + state.API.categoryPath + "/" + categoryId + state.API.tutorialPath, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + state.token.access_token,
                }
            }
        ).then((response) => response.json()).then(
            async (resultData) => {
                //console.log("loadTutorialData", resultData);
                if (!resultData.error) {
                    result = resultData.items.filter(item => item.video.length > 0).map((item) => {
                        return {
                            ...item,
                            downloaded: this.tutorialIsDownloaded(state.downloadedTutorials, item.video[0])
                        }
                    });
                } else {
                    result = {error: resultData.error};
                }
            }
        ).catch(async (error) => {
            result = {error: "loadTutorialData - FetchError"};
            console.log("Error - loadTutorialData - Fetch :", error);
        });
    }

    return result;
}

export async function loadPerformanceData(state) {

    let result = {};
    if (state.token.access_token) {
        await fetch(state.API.server + state.API.performancePath, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + state.token.access_token,
                }
            }
        ).then((response) => {console.log(response);return response.json()}).then(
            async (PerformanceData) => {
                //console.log("Fetch loadPerformanceData", PerformanceData);
                result = {PerformanceData};
            }
        ).catch(async (error) => {
            //result = {error:"loadPerformanceData - FetchError"};
            console.log("Error - loadPerformanceData - Fetch :", error);
        });
    }

    return result;
}

export async function videoViewCount(state, videoId) {

    let result = {status: "success"};
    const videoCountData = {videoId, userId: state.User.id};

    if (state.token.access_token) {
        await fetch(state.API.server + state.API.viewCountPath, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + state.token.access_token,
                },
                body: JSON.stringify(videoCountData)
            }
        ).then((response) => response.json()).then(
            (responseJson) => {
                //console.log("videoViewCount", responseJson);
                result = {
                    videoViewCountChanged: {
                        id: videoId,
                        count: parseInt(responseJson)
                    }
                };
            }
        ).catch(async (error) => {
            result = {error: "videoViewCount - FetchError"};
            console.log("Error - videoViewCount - Fetch :", error);
        });
    }

    return result;
}

export async function loadTutorialCounts(state) {

    let result = {};
    if (state.token.access_token) {
        await fetch(state.API.server + state.API.tutorialCountsPath, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + state.token.access_token,
                }
            }
        ).then((response) => response.json()).then(
            async (tutorialCounts) => {
                result = tutorialCounts;
            }
        ).catch(async (error) => {
            result = {error: "loadTutorialCountFetchError"};
            console.log("Error - loadTutorialCountFetch :", error);
        });
    }

    return result;
}

export async function getGrades(state, categoryId = false) {

    let gradeData = [];

    if(categoryId){
        const parentId = (categoryId) ? categoryId : state.categoryData[1].parent_id;
        gradeData = state.categoryData.filter((category) => {
            return category.parent_id === parentId;
        })
    } else {
        for(let i=0;i<state.categoryData.length;i++){
            if(state.categoryData[i].name.indexOf("Grade ")>=0){
                gradeData = state.categoryData.filter((item)=>(item.parent_id===state.categoryData[i].parent_id));
                break;
            }
        }
    }


    return gradeData;

}

export async function setSelectedApparatus(state, selectedApparatus) {

    if (state.token.access_token) {

        await fetch(state.API.server + state.API.userCategoryPath, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + state.token.access_token,
                },
                body: JSON.stringify(selectedApparatus)
            }
        ).then((response) => {
            //console.log("Response - saveApparatusData :", response,selectedApparatus);
        }).catch((error) => {
            console.log("Error - saveApparatusData :", error,selectedApparatus);
        });
    }

    const updatedApparatus = state.ApparatusSelect.allApparatus.map((item)=>{
        item.selected = (selectedApparatus.indexOf(parseInt(item.category_id))===-1);
        return item;
    });

    const updatedSelectedApparatus = updatedApparatus.filter((item)=>item.selected );
    const updatedCategoryData = [...updatedSelectedApparatus,...state.categoryData.filter((item)=>(item.parent_id!==0))];

    return Object.assign({}, state, {
        categoryData:updatedCategoryData,
        ApparatusSelect: {
            allApparatus: updatedApparatus,
            selectedApparatus: updatedSelectedApparatus,
        },
        FirstRun: {
            ...state.FirstRun,
            deSelectApparatus: false,
        }
    });

}

export async function setGradeUpperLevel(state, param) {
    //console.log(param);
    return Object.assign({}, state, {
        selectedUpperGrade:parseInt(param),
        FirstRun: {
            ...state.FirstRun,
            gradesUpperLimit: false,
        }
    });
}

export async function setFirstRunParam(state, param) {

    return Object.assign({}, state, {
        FirstRun: {
            ...state.FirstRun,
            ...param
        }
    });
}

export async function getFirstRunParam(state, param) {
    if (typeof state.FirstRun[param] === undefined) return true;
    return state.FirstRun[param];
}

function getGradeForPlaylistItem(itemCategory,categories){
    let grade="";
    categories.forEach(({category_id,name})=>{
        if(category_id===itemCategory){grade=name}
    });
    return grade;
}


export async function loadPlayListData(state, playListId, fields: string = "", caller: string = "") {

    let result = {};
    const fieldNames = (fields) ? "?fields=" + fields : "";
    const apiPath = (playListId) ?
        state.API.server + state.API.playListPath + "/" + playListId + fieldNames :
        state.API.server + state.API.playListPath + fieldNames;

    if (state.token.access_token) {
        await fetch(apiPath, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + state.token.access_token,
                }
            }
        ).then((response) => response.json()).then(
            async (fetchedData) => {


                let resultData = {};

                if (playListId) {
                    resultData = {
                        ...fetchedData,
                        tutorials:{
                            ...fetchedData.tutorials,
                            items: fetchedData.tutorials.items.map((tutorial)=>{
                                return {
                                    ...tutorial,
                                    grade:getGradeForPlaylistItem(parseInt(tutorial.category),state.categoryData)
                                }
                            })
                        }
                    };
                } else {
                    resultData = {
                        ...fetchedData,
                        items:fetchedData.items.map((playlist)=>{
                            return {
                                ...playlist,
                                tutorials:{
                                    ...playlist.tutorials,
                                    items: playlist.tutorials.items.map((tutorial)=>{
                                        return {
                                            ...tutorial,
                                            grade:getGradeForPlaylistItem(parseInt(tutorial.category),state.categoryData)
                                        }
                                    })
                                },

                            }

                        })
                    };
                }



                if (playListId) {
                    result = Object.assign({}, resultData, {
                        ...resultData,
                        auto_download: parseInt(resultData.auto_download),
                        Videos: {
                            ...state.Videos,
                            isPlaylistUpdated: false,
                        }

                    });
                } else {
                    result = Object.assign({}, {
                        PlayLists: {
                            ...state.PlayLists,
                            user: {
                                items: resultData.items.map((playlist) => ({
                                    id: playlist.playlist_id,
                                    name: playlist.name,
                                    image: (playlist.image) ? playlist.image : false,
                                    videoCount: (playlist.tutorials) ? playlist.tutorials.length : 0,
                                    auto_download: (playlist.auto_download) ? parseInt(playlist.auto_download) : false,
                                })),
                                pagination: resultData.pagination
                            },
                            isPlaylistUpdated: false,
                        },
                        Videos: {
                            ...state.Videos,
                            isPlaylistUpdated: false,
                        },
                    });
                }


            }
        ).catch((error) => {
            console.log("Error - loadPlayListDataFetch :", error)
        });


    }

    return result;
}


export async function savePlayListData(state, playListData) {

    let result = {success: true};
    if (state.token.access_token) {

        await fetch(state.API.server + state.API.playListPath + "/" + playListData.playlist_id, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + state.token.access_token,
                },
                body: JSON.stringify({playListData})
            }
        ).then((response) => {
            console.log("Response - savePlayListData :", response, playListData);
        }).catch((error) => {
            console.log("Error - savePlayListDataFetch :", error, playListData)
        });
    }

    return result;

}

export async function loadPlayListTutorialData(state, playListId) {

    let result = {};
    const apiPath = (playListId) ?
        state.API.server + state.API.playListTutorialPath + "/" + playListId :
        state.API.server + state.API.playListTutorialPath;

    if (state.token.access_token) {
        await fetch(apiPath, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + state.token.access_token,
                }
            }
        ).then((response) => response.json()).then(
            async (fetchedData) => {

                let resultData = {};

                if (playListId) {
                    resultData = {
                        ...fetchedData,
                        tutorials:{
                            ...fetchedData.tutorials,
                            items: fetchedData.tutorials.items.map((tutorial)=>{
                                return {
                                    ...tutorial,
                                    grade:getGradeForPlaylistItem(parseInt(tutorial.category),state.categoryData)
                                }
                            })
                        }
                    };
                } else {
                    resultData = {
                        ...fetchedData,
                        items:fetchedData.items.map((playlist)=>{
                            return {
                                ...playlist,
                                tutorials:{
                                    ...playlist.tutorials,
                                    items: playlist.tutorials.items.map((tutorial)=>{
                                        return {
                                            ...tutorial,
                                            grade:getGradeForPlaylistItem(parseInt(tutorial.category),state.categoryData)
                                        }
                                    })
                                },

                            }

                        })
                    };
                }


                if (playListId) {
                    if (resultData.tutorials) {
                        result = Object.assign({}, {
                            items: (resultData.tutorials) ? resultData.tutorials.items : [],
                            pagination: (resultData.tutorials.pagination) ? resultData.tutorials.pagination : {}
                        });
                    }

                } else {
                    result = Object.assign({}, {
                        PlayLists: {
                            ...state.PlayLists,
                            mentor: {
                                items: resultData.items.map((playlist) => ({
                                    id: playlist.playlist_id,
                                    name: playlist.name,
                                    image: (playlist.image) ? playlist.image : false,
                                    videoCount: playlist.tutorials.length
                                })),
                                pagination: resultData.pagination
                            },
                            isPlaylistUpdated: false,
                        },
                        Videos: {
                            ...state.Videos,
                            isPlaylistUpdated: false,
                        },
                    });
                }


            }
        ).catch((error) => {
            console.log("Error - loadPlayListTutorialDataFetch :", error)
        });


    }


    return result;

}


export async function getPlayListById(state, playListId, playListType = "user") {

    let result = {};

    if (state.PlayLists[playListType].items.length > 0) {

        result = {
            items: state.PlayLists[playListType].items.find((playlist) => {
                return parseInt(playlist.playlist_id) === parseInt(playListId);
            }),
            pagination: state.PlayLists[playListType].pagination
        }

    }
    return result;

}


export async function getPlayListByType(state, playListType) {

    let result = [];

    if (state.PlayLists[playListType].items.length > 0) {

        result = state.PlayLists[playListType].items.map((playlist) => ({
            id: playlist.playlist_id,
            name: playlist.name,
            image: (playlist.image) ? playlist.image : false,
            videoCount: (playlist.tutorials) ? playlist.tutorials.length : 0
        }));


    }


    return result;


}


export async function createPlayList(state, name: String = "Untitled Playlist") {

    let result = {};
    if (state.token.access_token) {
        await fetch(state.API.server + state.API.playListPath, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + state.token.access_token,
                },
                body: JSON.stringify({name})
            }
        ).then((response) => response.json()).then(
            async (resultData) => {
                resultData.tutorials = {items: [], length: 0};
                resultData.videoCount = 0;
                resultData.auto_download = 0;
                resultData.id = resultData.playlist_id;
                resultData.image = false;
                result = Object.assign({}, {
                    PlayLists: {
                        ...state.PlayLists,
                        user: {
                            ...state.PlayLists.user,
                            items: [resultData, ...state.PlayLists.user.items]
                        },
                        isPlaylistUpdated: true,

                    },
                    changedState: "PlayLists",
                });
            }
        ).catch((error) => {
            console.log("Error - createPlayListFetch :", error)
        });


    }

    return result;
}


export async function duplicatePlayList(state, playListId) {

    let result = {};
    const apiPath = state.API.server + state.API.playListTutorialPath + "/" + playListId + "/" + state.API.playListDuplicatePath;

    if (state.token.access_token) {
        await fetch(apiPath, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + state.token.access_token,
                }
            }
        ).then((response) => response.json()).then(
            async (resultData) => {

                resultData.tutorials = {items: [], length: 0};
                resultData.videoCount = 0;
                resultData.auto_download = 0;
                resultData.id = resultData.playlist_id;
                const resultDuplicate = Object.assign({}, state, {
                    PlayLists: {
                        ...state.PlayLists,
                        user: {
                            ...state.PlayLists.user,
                            items: [resultData, ...state.PlayLists.user.items]
                        },
                        isPlaylistUpdated: true,

                    },
                    changedState: "PlayLists",
                });

                const loadResult = await this.loadPlayListData(resultDuplicate, resultDuplicate.PlayLists.user.items[0].playlist_id);

                result = {state: resultDuplicate, playlist: loadResult};

            }
        ).catch((error) => {
            console.log("Error - duplicatePlayList :", error)
        });


    }


    return result;

}


export async function deletePlayList(state, playListId) {

    const updatedPlayLists = state.PlayLists.user.items.filter((playlist) => {
        return playlist.playlist_id !== playListId
    });


    if (state.token.access_token) {
        await fetch(state.API.server + state.API.playListPath + "/" + playListId, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + state.token.access_token,
                }
            }
        ).then((response) => {
            console.log("Response - deletePlayList :", response)
        }).catch((error) => {
            console.log("Error - deletePlayList :", error)
        });
    }

    return Object.assign({}, {
        PlayLists: {
            ...state.PlayLists,
            user: {
                ...state.PlayLists.user,
                items: updatedPlayLists
            }
        },
        changedState: "PlayLists"
    });

}


export async function addToPlayListSelect(state, playListId) {


    return Object.assign({}, state, {
        Videos: {
            ...state.Videos,
            addToPlayListId: playListId,
        },
        changedState: "Videos",
    });


}


export async function addToPlayList(state, playListId, tutorials) {


    const playListData = await loadPlayListData(state, playListId, "", "caller2");
    const tutorialIds = playListData.tutorials.items.map(item => item.tutorial_id);

    playListData.tutorials.items = [
        ...tutorials.filter((tutorial) => tutorialIds.indexOf(tutorial.tutorial_id) === -1),
        ...playListData.tutorials.items
    ].map((tutorial, index) => {
        tutorial.sort_order = (index + 1).toString();
        return tutorial
    });
    playListData.tutorials.length = playListData.tutorials.items.length;

    await savePlayListData(state, playListData).catch(e => console.log(e));

    return Object.assign({}, state, {
        changedState: "PlayLists"
    });

}


export async function updatePlaylist(state, playListData) {

    let updatedPlaylistData = {};
    const updatedPlayLists = state.PlayLists.user.items.map((playList) => {
        if (playList.id === playListData.playlist_id) {
            playList = {
                ...playList,
                name: playListData.name,
                videoCount: playListData.tutorials.length,
                auto_download: (playListData.auto_download) ? playListData.auto_download : false,
                image: (playListData.image) ? playListData.image : false,
            };
            updatedPlaylistData = playListData;

        }
        return playList;
    });

    await savePlayListData(state, updatedPlaylistData).catch(e => console.log(e));

    return Object.assign({}, state, {
        PlayLists: {
            ...state.PlayLists,
            user: {
                ...state.PlayLists.user,
                items: updatedPlayLists
            },
            isPlaylistUpdated: true,
        },
        changedState: "PlayLists"
    });
}


export async function toggleSelectMode(state) {

    return Object.assign({}, {
        Videos: {
            isSelectMode: !state.Videos.isSelectMode,
            isPlaylistUpdated: false,
            addToPlayListId: state.Videos.addToPlayListId,
        },
        changedState: "Videos"
    });

}


export async function toggleTutorialCompleteStatus(state, selectedTutorials, categoryId) {

    const tutorials = selectedTutorials.map((tutorial) => {
        return {tutorial_id: tutorial.tutorial_id, completed: tutorial.completed}
    });

    const userData = {
        category_id: categoryId,
        tutorials
    };

    if (state.token.access_token) {
        await fetch(state.API.server + state.API.tutorialCompletedPath, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + state.token.access_token,
                },
                body: JSON.stringify(userData)
            }
        ).then(
            (response) => {
                //console.log("Response - tutorialCompleteStatusPost :",response)
            }
        ).catch((error) => {
            console.log("Error - tutorialCompleteStatusPost :", error)
        });


    }


    return userData;

}

export async function doSearch(state, searchText, offset = 0, poffset = 0) {

    let result = {};
    const limit = 10;
    const searchQuery = "'" + searchText + "'&limit=" + limit + "&offset=" + offset + "&poffset=" + poffset;
    if (state.token.access_token) {
        await fetch(state.API.server + state.API.searchPath + searchQuery, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + state.token.access_token,
                }
            }
        ).then((response) => response.json()).then(
            async (searchData) => {
                result = searchData;
            }
        ).catch(async (error) => {
            result = {error: "doSearchError"};
            console.log("Error - doSearch :", error);
        });
    }

    console.log(searchQuery,result);

    return result;

}

export async function hideFooter(state) {

    return Object.assign({}, state, {
        hideFooter: true,
    });

}

export async function showFooter(state) {

    return Object.assign({}, state, {
        hideFooter: false,
    });

}

export async function addRecentViewedVideo(state, video) {

    const recentVideos = state.RecentVideos.filter((item, idx) => {
        return (video.tutorial_id !== item.tutorial_id)
    }).filter((item, idx) => {
        return (idx < 9)
    });

    const result = Object.assign({}, state, {
        RecentVideos: [
            video,
            ...recentVideos
        ],
    });

    await this.setLocalData(state.localStorageKey, result);

    return result;


}

export async function getRecentViewedVideos(state) {

    return state.RecentVideos;

}


export async function setCurrentNavigationTab(state, index) {

    return Object.assign({}, state, {
        currentNavigationTab: index,
    });

}


export async function setSearchView(state, screen, value) {

    return Object.assign({}, state, {
        searchView: {
            ...state.searchView,
            [screen]: value
        },
    });

}

export async function checkDownloadedTutorialsDirectory(tutorialsDir) {

    let result = false;
    await RNFetchBlob.fs.isDir(tutorialsDir)
        .then(async (isDir) => {
            if (!isDir) {
                await RNFetchBlob.fs.mkdir(tutorialsDir)
                    .then(() => {
                        console.log("Download Directory Created");
                        result = true;
                    })
                    .catch((err) => {
                        console.log("create Download Directory Error:", err);
                    })
            } else {
                result = true;
            }

        });

    return result
}


export async function getDownloadedTutorials(state) {

    let result = [];
    let totalSize = 0;
    const {dirs} = RNFetchBlob.fs;
    const tutorialsDir = dirs.DocumentDir + "/tutorials";
    const hasDir = await this.checkDownloadedTutorialsDirectory(tutorialsDir);


    if (hasDir) {

        await RNFetchBlob.fs.lstat(tutorialsDir).then((stats) => {
            if (stats.length > 0) {
                totalSize = stats.map((file) => (parseInt(file.size))).reduce((total, current) => (total + current));
                totalSize = parseFloat((totalSize / Math.pow(1024, 2)).toFixed(0));
                result = stats.map((file) => (file.filename));
            }
        });

    }

    return Object.assign({}, state, {
        downloadedTutorials: result,
        downloadedTutorialsSize: totalSize
    });

}

export function tutorialIsDownloaded(downloadedTutorials, video) {

    const fileName = video.video_id + "-" + video.code;
    return downloadedTutorials.filter((item) => {
        return item === fileName
    }).length > 0;

}

export async function deleteDownloadedVideos(state, ids) {

    const {dirs} = RNFetchBlob.fs;
    const tutorialsDir = dirs.DocumentDir + "/tutorials";

    state.downloadedTutorials.forEach((tutorial)=>{
        if(ids==="all"){
            RNFetchBlob.fs.unlink(tutorialsDir+"/"+tutorial).catch((err)=>{console.log(err)});
        }
    });

    return {
        downloadedTutorials:[],
        downloadedTutorialsSize:0
    };


}


export async function toggleAllowNotifications(state) {

    return Object.assign({}, {allowNotifications: !state.allowNotifications});

}


export async function toggleCommentaryOnDefault(state) {

    return Object.assign({}, {commentaryOnDefault: !state.commentaryOnDefault});

}


export async function notificationReceived(state, notificationData) {

    const currentNotifications = state.Notifications.filter((item) => {
        return item.id !== notificationData.id
    });

    return Object.assign({}, {
        Notifications: [
            notificationData,
            ...currentNotifications,
        ],
    });

}


export function checkDuplicateNotification(notificationId, notificationData) {

    let result = false;
    notificationData.forEach((item) => {
        if (item.id === notificationId) result = true;
    });

    return result;

}

export async function getNotifications(state) {

    let filteredNotifications = [];

    state.Notifications.forEach((item) => {
        if (!checkDuplicateNotification(item.id, filteredNotifications)) {
            filteredNotifications.push(item);
        }
    });

    return filteredNotifications;

}

export async function loadNotifications(state) {


    let result = {};

    if (state.token.access_token) {
        await fetch(state.API.server + state.API.notificationsPath, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + state.token.access_token,
                }
            }
        ).then((response) => response.json()).then(
            async (resultData) => {
                result = resultData.map((notification) => ({
                    ...notification,
                    id: notification.notification_id,
                }));

            }
        ).catch((error) => {
            console.log("Error - loadNotificationsDataFetch :", error)
        });
    }


    return result;

}


export async function updateNotifications(state, notificationData) {

    const mergedNotifications = [...notificationData, ...state.Notifications];

    //console.log("state:", state.Notifications);
    //console.log("new:", notificationData);
    //console.log("merged:", mergedNotifications);

    return Object.assign({}, state, {
        Notifications: [...mergedNotifications]
    });

}


export async function deleteNotification(state, notificationData) {

    return Object.assign({}, {Notifications: notificationData});

}


export async function toggleDownloadWifiOnly(state) {

    return Object.assign({}, {downloadWifiOnly: !state.downloadWifiOnly});

}


export async function setStorageLimit(state, limitSize) {

    return Object.assign({}, {storageLimit: limitSize});

}


export async function getStorageLimitUse(state) {

    return Object.assign({}, {});

}



export async function sendReport(state, report) {

    await fetch(state.API.server + state.API.reportPath, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + state.token.access_token,
            },
            body: JSON.stringify(report)
        }
    ).then(
        (response) => {
            //console.log("Response - sendReport :",response,report)
        }
    ).catch((error) => {
        console.log("Error - tutorialCompleteStatusPost :", error)
    });

    return {status: "success"};

}
