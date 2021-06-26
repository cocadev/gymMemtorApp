/**
 * ACTION TYPES
 */
export const NAVIGATE = 'NAVIGATE';

export const APP_LOGIN_COMPLETE = 'APP_LOGIN_COMPLETE';
export const APP_LOGOUT_COMPLETE = 'APP_LOGOUT_COMPLETE';
export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_REGISTER = 'USER_REGISTER';

export const RESET_VALIDATE_FORM = 'RESET_VALIDATE_FORM';
export const VALIDATE_FORM = 'VALIDATE_FORM';
export const VERIFY_USER = 'VERIFY_USER';
export const GET_USER_PROFILE = 'GET_USER_PROFILE';
export const GET_MEMBERSHIP_STATUS = 'GET_MEMBERSHIP_STATUS';

export const LOAD_CATEGORY_DATA = 'LOAD_CATEGORY_DATA';
export const GET_CATEGORY_DATA = 'GET_CATEGORY_DATA';
export const GET_APPARATUS_DATA = 'GET_APPARATUS_DATA';
export const LOAD_TUTORIAL_DATA = 'LOAD_TUTORIAL_DATA';
export const LOAD_PERFORMANCE_DATA = 'LOAD_PERFORMANCE_DATA';
export const GET_TUTORIAL_COUNTS = 'GET_TUTORIAL_COUNTS';
export const GET_GRADES = 'GET_GRADES';
export const SET_FIRST_RUN_PARAM = 'SET_FIRST_RUN_PARAM';
export const GET_FIRST_RUN_PARAM = 'GET_FIRST_RUN_PARAM';
export const SET_GRADE_UPPER_LEVEL = 'SET_GRADE_UPPER_LEVEL';
export const SET_SELECTED_APPARATUS = 'SET_SELECTED_APPARATUS';
export const PROFILE_OPEN_APPARATUS_DESELECT = 'PROFILE_OPEN_APPARATUS_DESELECT';
export const PROFILE_CLOSE_APPARATUS_DESELECT = 'PROFILE_CLOSE_APPARATUS_DESELECT';
export const PROFILE_OPEN_GRADES_SELECT = 'PROFILE_OPEN_GRADES_SELECT';
export const PROFILE_CLOSE_GRADES_SELECT = 'PROFILE_CLOSE_GRADES_SELECT';

export const LOAD_PLAYLIST_DATA = 'LOAD_PLAYLIST_DATA';
export const LOAD_PLAYLIST_TUTORIAL_DATA = 'LOAD_PLAYLIST_TUTORIAL_DATA';

export const GET_PLAYLIST_BY_TYPE = 'GET_PLAYLIST_BY_TYPE';
export const GET_PLAYLIST_BY_ID = 'GET_PLAYLIST_BY_ID';

export const UPDATE_PLAYLIST = 'UPDATE_PLAYLIST';
export const CREATE_PLAYLIST = 'CREATE_PLAYLIST';
export const DUPLICATE_PLAYLIST = 'DUPLICATE_PLAYLIST';
export const DELETE_PLAYLIST = 'DELETE_PLAYLIST';
export const ADD_TO_PLAYLIST_SELECT = 'ADD_TO_PLAYLIST_SELECT';
export const ADD_TO_PLAYLIST = 'ADD_TO_PLAYLIST';

export const TOGGLE_SELECT_MODE = 'TOGGLE_SELECT_MODE';
export const TOGGLE_TUTORIAL_COMPLETE_STATUS = 'TOGGLE_TUTORIAL_COMPLETE_STATUS';
export const TOGGLE_TUTORIAL_COMPLETE_STATUS_SINGLE = 'TOGGLE_TUTORIAL_COMPLETE_STATUS_SINGLE';

export const VIDEO_VIEW_COUNT = 'VIDEO_VIEW_COUNT';
export const ADD_RECENT_VIEWED_VIDEO = 'ADD_RECENT_VIEWED_VIDEO';
export const GET_RECENT_VIEWED_VIDEOS = 'GET_RECENT_VIEWED_VIDEOS';

export const DO_SEARCH = 'DO_SEARCH';
export const SHOW_FOOTER = 'SHOW_FOOTER';
export const HIDE_FOOTER = 'HIDE_FOOTER';
export const SET_CURRENT_NAVIGATION_TAB = 'SET_CURRENT_NAVIGATION_TAB';
export const SET_SEARCH_VIEW = 'SET_SEARCH_VIEW';

export const GET_DOWNLOADED_TUTORIALS = 'GET_DOWNLOADED_TUTORIALS';
export const DOWNLOAD_TUTORIALS = 'DOWNLOAD_TUTORIALS';
export const DOWNLOAD_TUTORIALS_COMPLETED = 'DOWNLOAD_TUTORIALS_COMPLETED';
export const DOWNLOAD_TUTORIALS_STATUS_RESET = 'DOWNLOAD_TUTORIALS_STATUS_RESET';
export const UPDATE_DOWNLOADED_TUTORIALS = 'UPDATE_DOWNLOADED_TUTORIALS';

export const TOGGLE_ALLOW_NOTIFICATIONS = 'TOGGLE_ALLOW_NOTIFICATIONS';
export const TOGGLE_COMMENTARY_ON_DEFAULT = 'TOGGLE_COMMENTARY_ON_DEFAULT';
export const NOTIFICATION_RECEIVED = 'NOTIFICATION_RECEIVED';
export const UPDATE_NOTIFICATIONS = 'UPDATE_NOTIFICATIONS';
export const GET_NOTIFICATIONS = 'GET_NOTIFICATIONS';
export const LOAD_NOTIFICATIONS = 'LOAD_NOTIFICATIONS';
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';

export const TOGGLE_DOWNLOAD_WIFI_ONLY = 'TOGGLE_DOWNLOAD_WIFI_ONLY';
export const SET_STORAGE_LIMIT = 'SET_STORAGE_LIMIT';
export const GET_STORAGE_LIMIT_USE = 'GET_STORAGE_LIMIT_USE';
export const DELETE_DOWNLOADED_VIDEOS = 'DELETE_DOWNLOADED_VIDEOS';

export const SEND_REPORT = 'SEND_REPORT';




/**
 * ACTION CREATORS
 */
export function navigate(navigation,routeName) {
    return { type: NAVIGATE, navigation, routeName }
}

export function appLoginComplete() {
    return { type: APP_LOGIN_COMPLETE }
}

export function appLogOutComplete() {
    return { type: APP_LOGOUT_COMPLETE }
}

export function userLogin(userData) {
    return { type: USER_LOGIN, userData }
}

export function userLogout() {
    return { type: USER_LOGOUT }
}

export function userRegister(userData) {
    return { type: USER_REGISTER, userData }
}

export function resetValidateForm(formName) {
    return { type: RESET_VALIDATE_FORM, formName }
}

export function validateForm(formData) {
    return { type: VALIDATE_FORM, formData }
}

export function verifyUser(verifyData) {
    return { type: VERIFY_USER, verifyData }
}

export function getUserProfile() {
    return {type: GET_USER_PROFILE}
}

export function getMembershipStatus() {
    return {type: GET_MEMBERSHIP_STATUS}
}



export function loadCategoryData() {
    return { type: LOAD_CATEGORY_DATA }
}

export function getCategoryData(categoryId) {
    return {type: GET_CATEGORY_DATA, categoryId}
}

export function getApparatusData() {
    return { type: GET_APPARATUS_DATA }
}

export function loadTutorialData(categoryId) {
    return { type: LOAD_TUTORIAL_DATA, categoryId }
}

export function loadPerformanceData() {
    return { type: LOAD_PERFORMANCE_DATA }
}

export function getTutorialCounts() {
    return { type: GET_TUTORIAL_COUNTS }
}

export function getGrades(categoryId) {
    return { type: GET_GRADES, categoryId }
}

export function setGradeUpperLevel(param) {
    return { type: SET_GRADE_UPPER_LEVEL, param }
}

export function setSelectedApparatus(selectedApparatus) {
    return { type: SET_SELECTED_APPARATUS, selectedApparatus }
}

export function profileOpenApparatusDeselect(navigation) {
    return { type: PROFILE_OPEN_APPARATUS_DESELECT, navigation }
}

export function profileCloseApparatusDeselect(navigation) {
    return { type: PROFILE_CLOSE_APPARATUS_DESELECT, navigation }
}


export function profileOpenGradesSelect(navigation) {
    return { type: PROFILE_OPEN_GRADES_SELECT, navigation }
}

export function profileCloseGradesSelect(navigation) {
    return { type: PROFILE_CLOSE_GRADES_SELECT, navigation }
}

export function setFirstRunParam(param) {
    return { type: SET_FIRST_RUN_PARAM, param }
}

export function getFirstRunParam(param) {
    return { type: GET_FIRST_RUN_PARAM, param }
}

export function loadPlayListData(playListId,fields,caller) {
    return { type: LOAD_PLAYLIST_DATA, playListId, fields, caller }
}

export function loadPlayListTutorialData(playListId) {
    return { type: LOAD_PLAYLIST_TUTORIAL_DATA, playListId }
}

export function getPlayListById(playListId,playListType) {
    return { type: GET_PLAYLIST_BY_ID, playListId, playListType }
}

export function getPlayListByType(playListType) {
    return { type: GET_PLAYLIST_BY_TYPE, playListType }
}

export function createPlayList() {
    return {type: CREATE_PLAYLIST, }
}

export function updatePlayList(playListData) {
    return {type: UPDATE_PLAYLIST, playListData}
}

export function duplicatePlayList(playListId) {
    return {type: DUPLICATE_PLAYLIST, playListId}
}

export function deletePlayList(playListId) {
    return {type: DELETE_PLAYLIST, playListId}
}

export function addToPlayListSelect(playListId) {
    return {type: ADD_TO_PLAYLIST_SELECT, playListId}
}

export function addToPlayList(playListId,tutorials) {
    return {type: ADD_TO_PLAYLIST, playListId, tutorials}
}

export function toggleSelectMode() {
    return {type: TOGGLE_SELECT_MODE}
}

export function toggleTutorialCompleteStatus(selectedTutorials,categoryId) {
    return {type: TOGGLE_TUTORIAL_COMPLETE_STATUS,selectedTutorials,categoryId}
}

export function toggleTutorialCompleteStatusSingle(selectedTutorials,categoryId) {
    return {type: TOGGLE_TUTORIAL_COMPLETE_STATUS_SINGLE,selectedTutorials,categoryId}
}

export function videoViewCount(videoId) {
    return {type: VIDEO_VIEW_COUNT,videoId}
}

export function doSearch(searchText, offset, poffset) {
    return {type: DO_SEARCH,searchText, offset, poffset}
}


export function showFooter() {
    return {type: SHOW_FOOTER}
}

export function hideFooter() {
    return {type: HIDE_FOOTER}
}


export function addRecentViewedVideo(video) {
    return {type: ADD_RECENT_VIEWED_VIDEO, video}
}



export function getRecentViewedVideos() {
    return {type: GET_RECENT_VIEWED_VIDEOS }
}


export function setCurrentNavigationTab(index) {
    return {type: SET_CURRENT_NAVIGATION_TAB, index }
}



export function setSearchView(screen,value) {
    return {type: SET_SEARCH_VIEW, screen, value }
}


export function getDownloadedTutorials() {
    return {type: GET_DOWNLOADED_TUTORIALS }
}


export function downloadTutorials(tutorials) {
    return {type: DOWNLOAD_TUTORIALS,tutorials }
}


export function updateDownloadedTutorials(tutorial) {
    return {type: UPDATE_DOWNLOADED_TUTORIALS,tutorial }
}


export function downloadTutorialsCompleted(count) {
    return {type: DOWNLOAD_TUTORIALS_COMPLETED, count }
}


export function downloadTutorialsStatusReset() {
    return {type: DOWNLOAD_TUTORIALS_STATUS_RESET }
}

export function toggleAllowNotifications() {
    return {type: TOGGLE_ALLOW_NOTIFICATIONS}
}

export function toggleCommentaryOnDefault() {
    return {type: TOGGLE_COMMENTARY_ON_DEFAULT}
}

export function notificationReceived(notificationData) {
    return {type: NOTIFICATION_RECEIVED, notificationData}
}

export function updateNotifications(notificationData) {
    return {type: UPDATE_NOTIFICATIONS, notificationData}
}

export function getNotifications() {
    return {type: GET_NOTIFICATIONS}
}

export function loadNotifications() {
    return {type: LOAD_NOTIFICATIONS}
}


export function deleteNotification(notificationId) {
    return {type: DELETE_NOTIFICATION, notificationId}
}

export function toggleDownloadWifiOnly() {
    return {type: TOGGLE_DOWNLOAD_WIFI_ONLY}
}

export function setStorageLimit(limitSize) {
    return {type: SET_STORAGE_LIMIT, limitSize}
}


export function getStorageLimitUse() {
    return {type: GET_STORAGE_LIMIT_USE}
}



export function deleteDownloadedVideos(ids) {
    return {type: DELETE_DOWNLOADED_VIDEOS, ids}
}




export function sendReport(report) {
    return {type: SEND_REPORT, report}
}

