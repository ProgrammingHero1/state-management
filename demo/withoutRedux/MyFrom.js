// MyForm.js
import React, { Component } from 'react';
import { some, values } from 'lodash';
import api from 'api';

// Expose `setError` to parent of the input field
import { Input, onChangeInput, setError } from './Form';

MyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: {
        value: '',
        errors: { required: true },
        isValid: false
      }
    };
  }

  onChangeInput(prop) {
    return e => {
      const value = e.target.value;

      // onChangeInput must also set errors
      this.setState(prevState => onChangeInput(prop, value, prevState));
    }
  }

  submitForm() {
    const { name } = this.state;
    api.submitData({ name })
      .catch(() => {
        this.setState(prevState =>
          // And we need to have control of those errors,
          // which isn't tied only to changing the input
          setError('name', { serverError: true }, prevState)
        );
      });
  }

  render() {
    const { value, errors } = this.state.name;
    return (
      <div>
        <input
          value={value}
          onChange={e => this.onChangeInput('name')}/>
        <ul>
          {mapValues(errors, err =>
            (<li key={err}>{err}</li>)
          )}
        </ul>
        <button onClick={this.submitForm}>
          Submit
        </button>
      </div>
    );
  }
}