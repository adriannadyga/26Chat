import React, {Component} from 'react';

import styles from './UserForm.css';

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {name: ''};
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onUserSubmit(this.state.name);
  }

  handleChange(e) {
    this.setState({ name : e.target.value });
  }

    render() {
        return(
            //formularz z inputem do wpisania nazwy użytkownika
            //do propsa onSubmit podpięta jest metoda handleSubmit która zatwierdza formularz modyfikując jego stan w komponencie app
            <form className={styles.UserForm} onSubmit={e => this.handleSubmit(e)}>
                <input
                    className={styles.UserInput}
                    placeholder='Write your nickname and press enter'
                    //props onChange z metodą handleChange która odbiera wartość wpisaną w input 
                    onChange={e => this.handleChange(e)}
                    //props value z podpiętym this.state.name daje puste pole jako wartość początkową
                    value={this.state.name}
                />
            </form>
        );
    }
}

export default UserForm;