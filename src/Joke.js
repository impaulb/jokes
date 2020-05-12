import React from 'react';
import "./Joke.css";

class Joke extends React.Component{

    // Handle arrow button click
    _handleChangeVote(n){
        this.props.changeVote(n, this.props.uuid);
    }

    // Handle X button click
    _handleRemoveJoke(){
        this.props.removeJoke(this.props.uuid);
    }

    render(){
        const tweetLink = `https://twitter.com/intent/tweet?text=${this.props.text.split(' ').join('%20')}`;
        return(
            <div className="Joke my-3 py-3 row">
                <div className="d-inline col-2 Joke-BtnWrapper row">
                    <button className="Joke-Btn col-12" onClick={() => this._handleChangeVote(1)}><i className="fas fa-angle-up"></i></button>
                    <p className="d-inline col-12">{this.props.upvotes}</p>
                    <button className="Joke-Btn col-12" onClick={() => this._handleChangeVote(-1)}><i className="fas fa-angle-down"></i></button>
                    <a className="Joke-Btn col-12" target="_blank" rel="noopener noreferrer" href={tweetLink}><i className="fab fa-twitter"></i></a>
                    <button className="Joke-Btn col-12" onClick={() => this._handleRemoveJoke()}><i className="far fa-trash-alt"></i></button>
                </div>
                <div className="col-10 mt-2">
                    <p className={((this.props.upvotes < 0) ? "Joke-Dimmed" : "")}>{this.props.text}</p>
                </div>
            </div>
        )
    }
}

export default Joke;