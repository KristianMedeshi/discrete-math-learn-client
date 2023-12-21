import React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react';
import customRender, { getById } from '../../utils/test';
import SignUp from './SignUp';
import translation from '../../translations/en/global.json';

describe('SignUp', () => {
  it('submits the form with valid data', async () => {
    const { queryByText, container } = customRender(<SignUp />);

    const email = `${Math.random().toString(36).substring(7)}@test.com`;

    await act(async () => {
      fireEvent.change(getById(container, 'firstName'), { target: { value: 'Vanessa' } });
      fireEvent.change(getById(container, 'lastName'), { target: { value: 'Washington' } });
      fireEvent.change(getById(container, 'email'), { target: { value: email } });
      fireEvent.change(getById(container, 'password'), { target: { value: "'T9ZR>d&RvkJU~J" } });
      fireEvent.click(getById(container, 'signUpSubmit'));
    });

    await waitFor(() => {
      expect(queryByText(translation.lettersError)).toBeNull();
      expect(queryByText(translation.invalidFormatError)).toBeNull();
      expect(queryByText(translation.passwordError)).toBeNull();
    });
  });

  it('displays an error message with invalid data', async () => {
    const { queryAllByText, queryByText, container } = customRender(<SignUp />);

    await act(async () => {
      fireEvent.change(getById(container, 'firstName'), { target: { value: '1234' } });
      fireEvent.change(getById(container, 'lastName'), { target: { value: '1234' } });
      fireEvent.change(getById(container, 'email'), { target: { value: 'invalid-email' } });
      fireEvent.change(getById(container, 'password'), { target: { value: 'short' } });
      fireEvent.click(getById(container, 'signUpSubmit'));
    });

    await waitFor(() => {
      expect(queryAllByText(translation.lettersError)).toHaveLength(2);
      expect(queryByText(translation.invalidFormatError)).toBeInTheDocument();
      expect(queryByText(translation.passwordError)).toBeInTheDocument();
    });
  });
});
