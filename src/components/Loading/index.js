import React from 'react';
import PropTypes from 'prop-types';

import { Container } from './styled';

export default function Loading({ isLoading }) {
  if (!isLoading) return <div></div>;

  return (
    <Container>
      <div />
      <span>Loading...</span>
    </Container>
  )
}


Loading.defaultProps = {
  isLoading: false
}

Loading.propTypes = {
  isLoading: PropTypes.bool,
}
