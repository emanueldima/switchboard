import React from 'react';
import PropTypes from 'prop-types';
import {HashLink as Link} from 'react-router-hash-link';
import {Dropzone} from './Dropzone';
import {Dropdown} from './Dropdown';
import {clientPath} from '../constants';
import {isUrl} from '../actions/utils';

export class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            link: "",
            text: "",
        };
        this.handleFiles = this.handleFiles.bind(this);
        this.handleChangeLink = this.handleChangeLink.bind(this);
        this.handleSubmitLink = this.handleSubmitLink.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.handleSubmitText = this.handleSubmitText.bind(this);
    }
    static propTypes = {
        onFile: PropTypes.func.isRequired,
        onLink: PropTypes.func.isRequired,
    };


    handleFiles(files) {
        if (!files.length) {
            alert('No file selected');
            return;
        }

        this.props.onFile(files[0]);
        this.props.history.push(clientPath.root);
    }

    handleChangeLink(e) {
        this.setState({link: event.target.value});
    }

    handleSubmitLink(e) {
        e.preventDefault();
        e.stopPropagation();

        this.props.onLink(this.state.link);

        this.props.history.push(clientPath.root);
    }

    handleChangeText(e) {
        this.setState({text: event.target.value});
    }

    handleSubmitText(e, option) {
        e.preventDefault();
        e.stopPropagation();

        const blob = new Blob([this.state.text], {type: "text/plain"});
        blob.name = "submitted_text.txt";
        this.props.onFile(blob);

        this.props.history.push(clientPath.root);
    }

    render() {
        return (
            <div className="input">
                <h3>Add your data</h3>

                <Tabs titles={['Upload File', 'Submit URL', 'Submit Text']}>

                    <Dropzone onFiles={this.handleFiles}/>

                    <form className="input-group link" onSubmit={this.handleSubmitLink}>
                        <textarea className="form-control inputzone"
                            style={{resize: 'vertical'}}
                            onChange={this.handleChangeLink}
                            rows="2"
                            placeholder="Enter an URL or a DOI or a handle"
                            value={this.state.link} />
                        <div className="input-group-addon" style={{minWidth:'1em'}}>
                            <button type="submit" className="btn-primary btn"
                                disabled={!this.state.link.trim()}
                                onClick={this.handleSubmitLink}>
                                Submit URL
                            </button>
                        </div>
                    </form>

                    <form className="input-group textinput" onSubmit={this.handleSubmitText}>
                        <textarea className="form-control inputzone"
                            style={{resize: 'vertical'}}
                            onChange={this.handleChangeText}
                            rows="5"
                            placeholder="Enter text here"
                            value={this.state.text} />
                        <div className="input-group-addon">
                            <button type="submit" className="btn-primary btn"
                                disabled={!this.state.text.trim()}
                                onClick={this.handleSubmitText}>
                                Submit Text
                            </button>
                        </div>
                    </form>

                </Tabs>

                <p style={{marginTop:20}}>
                    Please be advised that the data will be shared with the tools via public links.
                    For more details, see the <Link to={clientPath.faq}>FAQ</Link>.
                </p>
            </div>
        );
    }
}

class Tabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 1,
        };
        this.renderTitle = this.renderTitle.bind(this);
    }
    static propTypes = {
        titles: PropTypes.array.isRequired,
        children: PropTypes.array.isRequired,
    };

    renderTitle(title, index) {
        if (index == this.state.active) {
            return (
                <li role="presentation" className="active" key={index}>
                    <a>{title}</a>
                </li>
            );
        }
        return (
            <li role="presentation" key={index}>
                <a href="" onClick={e => this.setState({active:index})}>{title}</a>
            </li>
        );
    }

    render() {
        return (
            <div>
                <ul className="nav nav-tabs">
                    {this.props.titles.map(this.renderTitle)}
                </ul>
                <div className="tab-child">
                    {this.props.children[this.state.active]}
                </div>
            </div>
        );
    }
}
