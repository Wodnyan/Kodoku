import React from "react";

const Members = React.memo(() => {
  return (
    <>
      <h1>Members</h1>
      <ul>
        {[...Array(100)].map((_, i) => (
          <h1>Username</h1>
        ))}
      </ul>
    </>
  );
});

export default Members;
