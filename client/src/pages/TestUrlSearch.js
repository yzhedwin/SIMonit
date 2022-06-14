import React, { Component } from 'react';

class TestUrlSearch extends Component {
    state = {
        stringParam: '',
        numberParam: 0
    }

    componentDidMount() {
        const queryParams = new URLSearchParams(window.location.search);
        this.setState({
            stringParam: queryParams.get('string_param') ?? '',
            numberParam: queryParams.get('number_param') ? parseInt(queryParams.get('number_param')) : 0
        });
    }

    render() {
        return (
            <div className="App">
                <div>String parameter: { this.state.stringParam.length > 0 ? this.state.stringParam : 'empty' }</div>
                <div>Number parameter: { this.state.numberParam }</div>
            </div>
        );
    }
}

export default TestUrlSearch;