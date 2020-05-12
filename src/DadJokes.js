import React from 'react';
import Joke from "./Joke";
import axios from "axios";
import uuid from "uuid/dist/v4";
import "./DadJokes.css";

class DadJokes extends React.Component{

    // Default number of jokes to generate
    static defaultProps = {
        n: 1
    }

    constructor(props){
        super(props);
        this.state = {
            // Either set jokes to localStorage or, if none have been generated, to an empty array
            jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
            isLoaded: true
        }
        this.seenJokes = new Set(this.state.jokes.map(joke => joke.text));
        this._changeVote = this._changeVote.bind(this);
        this._genJokes = this._genJokes.bind(this);
        this._renderJokes = this._renderJokes.bind(this);
        this._removeJoke = this._removeJoke.bind(this);
    }

    // If there are no jokes, generate some on page load
    componentDidMount(){
        if(this.state.jokes.length === 0){
            this._genJokes();
        }
    }

    async _genJokes(){
        this.setState({isLoaded: false});
        let newJokes = [];

        // Request random jokes from ICanHazDadJoke API
        while(newJokes.length < this.props.n){
            let data = await axios.get("https://icanhazdadjoke.com/slack");
            let joke = data.data.attachments[0].text;
            if(!this.seenJokes.has(joke)){
                
                // Add new joke to new array of jokes
                newJokes.push(
                    {
                        text: joke,
                        upvotes: 0, 
                        uuid: uuid()
                    }
                );

                // Add new joke to current list of jokes
                this.seenJokes.add(joke);
            }
        }

        // Updates joke state with new jokes
        this.setState(st => (
            {
                jokes: st.jokes.concat(newJokes),
                isLoaded: true
            }
        )); 

        // Update localStorage with new jokes
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes));
    }

    _changeVote(n, uuid){
        this.setState(st => ({
            jokes: st.jokes.map(
                // Map current jokes
                joke => {
                    // Update upvotes based on UUID
                    if(joke.uuid === uuid){
                        return{...joke, upvotes: joke.upvotes + n}
                    }
                return joke;
                }
            )
            // Update localStorage with the changes
        }), () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        );
    }

    _removeJoke(uuid){
        this.setState(st => (
            {
                // Filter jokes based on UUID
                jokes: st.jokes.filter(joke => joke.uuid !== uuid)
            }
            // Update localStorage with the changes
        ), () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes)));
    }

    _renderJokes(){
        
        // Sort jokes based on the number of upvotes it has
        let jokes = this.state.jokes.sort((a,b) => (b.upvotes - a.upvotes));
            return(
                    <div>
                        {jokes.map(joke =>
                        <Joke 
                            text={joke.text}
                            upvotes={joke.upvotes}
                            changeVote={this._changeVote}
                            removeJoke={this._removeJoke}
                            key={joke.uuid}
                            uuid={joke.uuid}
                        />)
                        }
                    </div>
            );
    }

    render(){
        return(
            <div className="DadJokes px-4">
                <div className="row d-flex justify-content-center">
                    <div className="DadJokes-Body col-md-8 col-lg-8 px-3 py-2">
                        {this._renderJokes()}
                        <div className="w-100 text-center">
                            <button className="DadJokes-Btn px-4 py-3" onClick={this._genJokes}>{(this.state.isLoaded ? <i className="fas fa-plus"></i> : "Loading...")}</button>
                            <p className="mt-5 DadJokes-Footer">Made by: <a href="https://paulboldyrev.me/" rel="noopener noreferrer" target="_blank" className="DadJokes-Link">Paul Boldyrev</a></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DadJokes;