/*
 * Copyright (C) Pootle contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

'use strict';

import { Store } from 'flummox';
import assign from 'object-assign';


export default class AuthStore extends Store {

  constructor(flux) {
    super();

    let authActions = flux.getActions('auth');

    this.registerAsync(authActions.signUp, this.handleSignUpBegin,
                                           this.handleSignUpSuccess,
                                           this.handleSignUpError);
    this.registerAsync(authActions.requestPasswordReset,
                       this.handleRequestPasswordResetBegin,
                       this.handleRequestPasswordResetSuccess,
                       this.handleRequestPasswordResetError);
    this.registerAsync(authActions.passwordReset, this.handlePasswordResetBegin,
                                                  this.handlePasswordResetSuccess,
                                                  this.handlePasswordResetError);

    this.registerAsync(authActions.verifySocial, this.handleVerifySocialBegin,
                                                 this.handleVerifySocialSuccess,
                                                 this.handleVerifySocialError);

    this.state = {
      screen: 'signIn',

      redirectTo: null,
      resetEmail: null,
      signUpEmail: null,

      // FIXME: check if isLoading is actually needed everywhere
      isLoading: false, // Should be part of some generic 'request' store?
      formErrors: {}, // Should be part of some generic 'error' store?
    };
  }


  /* Sign Up */

  handleSignUpBegin(reqData) {
    this.setState({
      formErrors: {},
      isLoading: true,
      signUpEmail: reqData.email,
    });
  }

  handleSignUpSuccess() {
    this.setState({
      screen: 'activation',
      isLoading: false,
      formErrors: {},
    });
  }

  handleSignUpError(errors) {
    this.setState({
      isLoading: false,
      formErrors: errors,
    });
  }


  /* Request Password Reset */

  handleRequestPasswordResetBegin(reqData) {
    this.setState({
      formErrors: {},
      isLoading: true,
      resetEmail: reqData.email,
    });
  }

  handleRequestPasswordResetSuccess() {
    this.setState({
      screen: 'requestPasswordResetSent',
      formErrors: {},
      isLoading: false,
    });
  }

  handleRequestPasswordResetError(errors) {
    this.setState({
      isLoading: false,
      formErrors: errors,
    });
  }


  /* Password Reset */

  handlePasswordResetBegin(reqData, url) {
    this.setState({
      formErrors: {},
      isLoading: true,
    });
  }

  handlePasswordResetSuccess(response) {
    this.setState({
      formErrors: {},
      isLoading: false,
      // FIXME: hard-coding redirect path because of django-allauth#735
      redirectTo: l('/'),
    });
  }

  handlePasswordResetError(errors) {
    this.setState({
      isLoading: false,
      formErrors: errors,
    });
  }


  /* Social Sign In Verification */

  handleVerifySocialBegin(reqData) {
    this.setState({
      formErrors: {},
      isLoading: true,
    });
  }

  handleVerifySocialSuccess(newLocation) {
    let newState = {
      isLoading: false,
      formErrors: {},
      redirectTo: newLocation,
    };

    this.setState(newState);
  }

  handleVerifySocialError(errors) {
    this.setState({
      isLoading: false,
      formErrors: errors,
    });
  }

}
