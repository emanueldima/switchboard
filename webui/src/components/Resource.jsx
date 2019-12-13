import React from 'react';
import Select from 'react-select';
import { processMediatype } from '../actions/utils';
import SortableTree from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-full-node-drag';
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app
import ReactTooltip from 'react-tooltip';

const SelectLanguage = (props) => {
    const value = props.languages.find(x => x.value == props.res.profile.language);
    return <Select
        value={value}
        options={props.languages.asMutable()}
        onChange={props.onLanguage}
        placeholder="Select the language of the resource"
    />;
}

const SelectMediatype = (props) => {
    const options = props.mediatypes.asMutable();
    let value = props.mediatypes.find(x => x.value == props.res.profile.mediaType);
    if (props.res.profile.mediaType && !value) {
        value = processMediatype(props.res.profile.mediaType);
        value.label = value.label + " [unsupported]";
        if (value) {
            options.unshift(value);
        }
    }

    return <Select value={value} options={options} onChange={props.onMediatype}
            placeholder="Select the mediatype of the resource"/>;
}

export class Resource extends React.Component {
    constructor(props) {
        super(props);
    }

    onChange(type, sel) {
        const newresource = this.props.resource.setIn(['profile', type], sel.value);
        this.props.updateResource(newresource);
    }

    renderTextContents() {
        return (
            <pre style={{whiteSpace: 'pre-wrap'}}>
            ADVENTURES OF SHERLOCK HOLMES
            Adventure I
            A SCANDAL IN BOHEMIA
            I
            To Sherlock Holmes she is always _the_ woman. I have seldom heard
            him mention her under any other name. In his eyes she eclipses and
            predominates the whole of her sex. It was not that he felt any emotion
            akin to love for Irene Adler. All emotions, and that one particularly,
            were abhorrent to his cold, precise, but admirably balanced mind. He
            was, I take it, the most perfect reasoning and observing machine that
            the world has seen; but, as a lover, he would have placed himself in a
            false position. He never spoke of the softer passions, save with a gibe
            and a sneer.
            </pre>
        );
    }

    renderZipContents() {
        return (
            <Tree/>
        );
    }

    renderContents() {
        return (
            <div className="row" style={{marginTop:10}}>
                <div className="col-md-4">
                    <a href="#">Convert</a>
                </div>
                <div className="col-md-8">
                    <div className="welll">
                        <div className="resource-header">
                            <span className="glyphicon glyphicon-chevron-down" aria-hidden="true" style={{fontSize:'75%'}}/>Contents
                        </div>
                    </div>
                    {
                        // this.renderTextContents()
                        this.renderZipContents()
                    }

                </div>
            </div>
        );
    }

    renderBubble() {
        const style={
            width: 400,
            height: 300,
        }
        return (
            <div style={{marginTop:200, marginBottom: 200}}>
                <a data-tip data-for='mytooltip'>Resource</a>
                <ReactTooltip id='mytooltip' place='bottom' type='dark' effect='solid' clickable={true}>
                    <iframe src={window.location} style={style}/>
                </ReactTooltip>
            </div>
        );
    }

    render() {
        const res = this.props.resource;
        return <React.Fragment>
            <div className="resource">
                <div className="row">
                    <div className="col-md-4">
                        <div className="resource-header">Resource</div>
                        <div>
                            <a href={res.originalLink || res.localLink}> {res.filename} </a>
                            <a className="btn btn-default btn-sm" href="#" style={{marginLeft: 10}}>Extract text</a>
                        </div>                        
                    </div>
                    <div className="col-md-4">
                        <div className="resource-header">Mediatype</div>
                        <div>
                            <SelectMediatype res={res} mediatypes={this.props.mediatypes}
                                onMediatype={v => this.onChange('mediaType', v)}/>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="resource-header">Language</div>
                        <div>
                            <SelectLanguage res={res} languages={this.props.languages}
                                onLanguage={v => this.onChange('language', v)}/>
                        </div>
                    </div>
                    {
                        // this.renderContents()
                    }
                </div>
                <div className="row"> {
                    // this.renderBubble()
                } </div>
            </div>
        </React.Fragment>;
    }
}


/////////////////////////////


export default class Tree extends React.Component {
    constructor(props) {
        super(props);

        const some=[{title: '', children: []}];

        this.state = {
            treeData: [
                { title: 'copyright.txt', children: []},
                { title: 'doc', children: [
                    { title: 'Revalidation_SK.html', children:[]},
                    { title: 'dtd', children:some},
                    { title: 'german-sampa.txt', children:[]},
                    { title: 'papers', children:some},
                    { title: 'pardoc', children:[
                        { title: 'BasBPFDokuPRO.pdf', children: []},
                        { title: 'BasBPFDokuSYNENG.pdf', children: []},
                        { title: 'BasBPFDokuSYNGER.pdf', children: []},
                        { title: 'BasBPFDokuSYNJAP.pdf', children: []},
                        { title: 'BasBPFDokuSYNOverview.pdf', children: []},
                        { title: 'BasFormatsPHOeng.html', children: []},
                        { title: 'BasFormatsSAPdeu.html', children: []},
                        { title: 'BasFormatsSAPeng.html', children: []},
                        { title: 'BasFormatsdeu.html', children: []},
                        { title: 'BasFormatseng.html', children: []},
                        { title: 'BasProsodie.html', children: []},
                        { title: 'BasSAMPA', children: []},
                        { title: 'BasSKGESDoc.pdf', children: []},
                        { title: 'BasSKUSHDoc.pdf', children: []},
                        { title: 'BasSKUSPDoc.pdf', children: []},
                        { title: 'DialogactReport-226-98.ps', children: []},
                    ]},
                    { title: 'quicktime', children:some},
                    { title: 'readme.doc', children:[]},
                    { title: 'readme.ges', children:[]},
                    { title: 'readme.mar', children:[]},
                    { title: 'readme.par', children:[]},
                    { title: 'readme.trl', children:[]},
                    { title: 'readme.trp', children:[]},
                    { title: 'readme.ush', children:[]},
                    { title: 'readme.usm', children:[]},
                    { title: 'readme.woz.german', children:[]},
                    { title: 'session-statistics', children:[]},
                    { title: 'sk_ger.lex', children:[]},
                    { title: 'techdocs', children:some},
                    { title: 'trl-coding', children:some},
                    { title: 'webpages.zip', children:[]},
                ]},
                { title: 'readme.annot', children: []},
                { title: 'readme.main', children: []},
                { title: 'readme.main.german', children: []},
                { title: 'readme.meta', children: []},
                { title: 'readme.skm', children: []},
                { title: 'readme.skm.german', children: []},
            ],
        }
    }

    render() {
        return (
          <div style={{ height: 400, overflow:'auto'}}>
            <SortableTree
              treeData={this.state.treeData}
              onChange={treeData => this.setState({ treeData })}
              theme={FileExplorerTheme}
              rowHeight={30}
              slideRegionSize={0}
            />
          </div>
        );
    }
}
