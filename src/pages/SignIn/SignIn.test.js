import React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react';
import customRender, { getById } from '../../utils/test';
import SignIn from './SignIn';
import translation from '../../translations/en/global.json';

describe('SignIn', () => {
  it('submits the form with valid data', async () => {
    const { queryByText, container } = customRender(<SignIn />);

    await act(async () => {
      fireEvent.change(getById(container, 'email'), { target: { value: 'example@mail.com' } });
      fireEvent.change(getById(container, 'password'), { target: { value: "'T9ZR>d&RvkJU~J" } });
      fireEvent.click(getById(container, 'signInSubmit'));
    });

    await waitFor(() => {
      expect(queryByText(translation.invalidFormatError)).toBeNull();
      expect(queryByText(translation.passwordError)).toBeNull();
    });
  });

  it('displays an error message with invalid data', async () => {
    const { queryByText, container } = customRender(<SignIn />);

    await act(async () => {
      fireEvent.change(getById(container, 'email'), { target: { value: 'invalid-email' } });
      fireEvent.change(getById(container, 'password'), { target: { value: 'short' } });
      fireEvent.click(getById(container, 'signInSubmit'));
    });

    await waitFor(() => {
      expect(queryByText(translation.invalidFormatError)).toBeInTheDocument();
      expect(queryByText(translation.passwordError)).toBeInTheDocument();
    });
  });
});
