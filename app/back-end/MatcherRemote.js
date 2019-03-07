// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: MatcherRemote.js
// Time-stamp: <2019-03-06 21:08:25 (zinn)>
// -------------------------------------------

import Request from 'superagent';
import binaryParser from 'superagent-binary-parser';
import {matcherURL, deploymentStatus} from './util';

export default class MatcherRemote {

    constructor( includeWebServices ) {
	this.includeWebServices = includeWebServices;
	this.windowAppContextPath = window.APP_CONTEXT_PATH;
    }

    getAllTools() {
	const includeWS = (this.includeWebServices ? "yes" : "no");
	const includeBetaSoftware = ((deploymentStatus == "development") ? "yes" : "no");
	const that = this;
	return new Promise(function(resolve, reject) {
	    Request
		.get(that.windowAppContextPath+matcherURL
		     + '/api/tools?includeWS='+includeWS
		     + '&includeBetaSoftware='+includeBetaSoftware
		     + '&sortBy=tools')
		.set('Accept', 'application/json')
                .end((err, res) => {
		if (err) {
		    console.log('MatcherRemote/getAllTools failed: ', err);
		    reject(err);
		} else {
		    resolve(res.body);
		}
		})});
    }

    getSupportedMimetypes() {
	const that = this;
	return new Promise(function(resolve, reject) {
	    Request
		.get(that.windowAppContextPath+matcherURL + '/api/mimetypes')
		.set('Accept', 'application/json')
                .end((err, res) => {
		if (err) {
		    console.log('MatcherRemote/getSupportedMimetypes failed: ', err);
		    reject(err);
		} else {
		    resolve(res.body);
		}
		})});
    }

    getSupportedLanguages() {
	const that = this;
	return new Promise(function(resolve, reject) {
	    Request
		.get(that.windowAppContextPath+matcherURL + '/api/languages')
		.set('Accept', 'application/json')
                .end((err, res) => {
		if (err) {
		    console.log('MatcherRemote/getSupportedLanguages failed: ', err);
		    reject(err);
		} else {
		    resolve(res.body);
		}
		})});
    }    

    getApplicableTools(mimetype, language) {
	const includeWS = (this.includeWebServices ? "yes" : "no");
	const includeBetaSoftware = ((deploymentStatus == "development") ? "yes" : "no");	
	const that = this;	
	return new Promise(function(resolve, reject) {
	    Request
		.get(that.windowAppContextPath+matcherURL
		     + '/api/tools?includeWS='+includeWS
		     + '/api/tools?includeBetaSoftware='+includeBetaSoftware		     
		     + '&language=' + language
		     + '&mimetype=' + mimetype
		     + '&sortBy=tools')
		.set('Accept', 'application/json')	    
                .end((err, res) => {
		if (err) {
		    console.log('MatcherRemote/getApplicableTools failed: ', err);
		    reject(err);
		} else {
		    resolve(res.body);
		}
		})});
    }
}


