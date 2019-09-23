import axios from 'axios';
import { apiPath, actionType, resourceMatchSettings } from '../constants';
import { processLanguage, processMediatype } from './utils';


export function updateResource(resource) {
    return function (dispatch, getState) {
        dispatch({
            type: actionType.RESOURCE_UPDATE,
            data: resource,
        });

        if ( (resource.mediatype == "application/zip") ||
             (resource.mediatype == "application/x-gzip") ) {
            // todo: acknowledge that a zip file has been received, but that a manual identification
            //        of its parts wrt. language should be made by the user.
            // todo: ?
            // this.setState({isLoaded: true, showAlertMissingInfo: true});
        } else if ( (resource.mediatype == "audio/vnd.wave") ||
                    (resource.mediatype == "audio/x-wav")    ||
                    (resource.mediatype == "audio/wav")      ||
                    (resource.mediatype == "audio/mp3")      ||
                    (resource.mediatype == "audio/mp4")      ||
                    (resource.mediatype == "audio/x-mpeg")) {
            // todo: ?
            // this.setState({showAlertMissingInfo: true});
        } else {
            // todo: ?
            // this.setState({isLoaded: true});
        }

        if (resource.localLink) {
            dispatch(fetchMatchingTools(
                resource.mediatype,
                resource.language,
                resourceMatchSettings.deploymentStatus,
                resourceMatchSettings.includeWS));
        }
    }
}

export function uploadLink(link, origin) {
    var formData = new FormData();
    formData.append("link", link);
    formData.append("origin", origin);
    return uploadData(formData);
}

export function uploadFile(file) {
    var formData = new FormData();
    formData.append("file", file, file.name);
    return uploadData(formData);
}

function uploadData(formData) {
    return function (dispatch, getState) {
        dispatch({
            type: actionType.RESOURCE_INIT,
            data: {state: 'uploading'},
        });
        axios
            .post(apiPath.storage, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            })
            .then((response) => {
                const resource = response.data;

                const lang = processLanguage(response.data.language)
                resource.language = lang && lang.value;

                if (resource.localLink && resource.localLink.startsWith(apiPath.api)) {
                    resource.localLink = window.origin + resource.localLink;
                }
                resource.state = 'stored';

                dispatch(updateResource(resource));
            })
            .catch(errHandler(dispatch));
    }
}

export function fetchApiInfo() {
    return function (dispatch, getState) {
        axios.get(apiPath.apiinfo)
            .then(response => {
                dispatch({
                    type: actionType.APIINFO_FETCH_SUCCESS,
                    data: response.data
                });
            }).catch(errHandler(dispatch, "Cannot fetch API info."));
    }
}

export function fetchMediatypes() {
    return function (dispatch, getState) {
        axios.get(apiPath.mediatypes)
            .then(response => {
                dispatch({
                    type: actionType.MEDIATYPES_FETCH_SUCCESS,
                    data: response.data.map(processMediatype).filter(x => x),
                });
            }).catch(errHandler(dispatch, "Cannot fetch mediatypes."));
    }
}

export function fetchLanguages() {
    return function (dispatch, getState) {
        axios.get(apiPath.languages)
            .then(response => {
                dispatch({
                    type: actionType.LANGUAGES_FETCH_SUCCESS,
                    data: response.data.map(processLanguage).filter(x => x),
                });
            }).catch(errHandler(dispatch, "Cannot fetch languages."));
    }
}

export function fetchAllTools(deploymentStatus) {
    return function (dispatch, getState) {
        const params = {
            deployment: (deploymentStatus === "production") ? "production" : "development",
            sortBy: 'tools',
        }

        axios.get(apiPath.tools, {params})
            .then(response => {
                response.data.forEach(normalizeTool);
                dispatch({
                    type: actionType.ALL_TOOLS_FETCH_SUCCESS,
                    data: response.data,
                });
            }).catch(errHandler(dispatch, "Cannot fetch all tools data."));
    }
}

export function fetchMatchingTools(mediatype, language, deploymentStatus, includeWS) {
    return function (dispatch, getState) {
        const params = {
            mediatype: mediatype,
            language: language,
            deployment: (deploymentStatus === "production") ? "production" : "development",
            includeWS: includeWS ? "yes" : "no",
            sortBy: 'tools',
        }

        dispatch({
            type: actionType.MATCHING_TOOLS_FETCH_START,
        })

        axios.get(apiPath.tools, {params})
            .then(response => {
                response.data.forEach(normalizeTool);
                dispatch({
                    type: actionType.MATCHING_TOOLS_FETCH_SUCCESS,
                    data: response.data,
                });
            }).catch(errHandler(dispatch, "Cannot fetch tools data."));
    }
}

function normalizeTool(tool) {
    let searchString = "";
    for (const key of ['task', 'name', 'description']) {
        searchString += tool[key].toLowerCase();
    }
    tool.searchString = searchString;
}

export function errHandler(dispatch, msg) {
    return function(err) {
        const alert = (message) => {
            console.warn(message);
            dispatch({
                type: actionType.ERROR,
                message: message,
            });
        };
        const response = err.response || {};
        if (response.status == 401) {
            alert("Please login");
        } else if (response.status == 403) {
            alert("Access denied. "+(response.data || ""));
        } else {
            if (!msg && err.response) {
                msg ="An error occurred while contacting the server.";
            }
            if (response.data && response.data.message) {
                msg += " " + response.data.message;
            }
            if (msg) {
                alert(msg);
            } else {
                console.error(err);
            }
        }
    }
}
