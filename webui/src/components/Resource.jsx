import React from 'react';
import Select from 'react-select';
import { processMediatype } from '../actions/utils';

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

    render() {
        const res = this.props.resource;
        return <React.Fragment>
            <div className="resource">
                <div className="row">
                    <div className="col-md-4">
                        <div className="resource-header">Resource</div>
                        <div>
                            <a href={res.originalLink || res.localLink}> {res.filename} </a>
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
                </div>
                <div className="row" style={{marginTop:10}}>
                    <div className="col-md-4">
                    </div>
                    <div className="col-md-8">
                        <div className="welll">
                        <div className="resource-header">
                            <span className="glyphicon glyphicon-chevron-down" aria-hidden="true" style={{fontSize:'75%'}}/>Contents
                        </div>

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
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>;
    }
}
