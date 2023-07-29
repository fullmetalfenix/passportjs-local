var React = require("react");

function Profile(props) {
  return (
    <>
      <div>Hello {props.name}</div>
      <p>Your Prefered email is {props.email}</p>
      <p>Your username is {props.username}</p>
    </>
  );
}

module.exports = Profile;
