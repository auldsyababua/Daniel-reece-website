import React from 'react';

const styles = {
  Screen: {
    backgroundColor: '#ffffff',
  },
};

const Screen = (props) => {
  return (
    <div style={styles.Screen}>
      {props.children}
    </div>
  );
};

export default Screen;